<script lang="ts">
import { Table as ATable } from 'antdv-next';
import { computed, defineComponent, h, onBeforeMount, onBeforeUnmount, provide } from 'vue';
import type { PropType } from 'vue';
import type {
  TablePaginationConfig,
  TableProps,
  TableRowSelection,
  TableSorterResult
} from 'antdv-next';
import type { ProTableApi, ProTableBatchSlotProps } from './create-pro-table';

type RowKey = string | number;

/**
 * <ProTable>：组件式表格容器（与 <ProForm> 对齐）。
 * - 绑定 :table（createProTable 的返回值），渲染 a-table 并接管分页 / 多选 / 远程拉取
 * - 组件本身只负责「长什么样」，数据来源与行为全部由外部 controller 决定
 */
export default defineComponent({
  name: 'ProTable',
  inheritAttrs: false,
  props: {
    /** 表格控制器（createProTable 返回，必传） */
    table: {
      type: Object as PropType<ProTableApi<any, any>>,
      required: true
    },
    /* ---- 纯 UI 透传 ---- */
    columns: {
      type: Array as PropType<TableProps['columns']>,
      default: undefined
    },
    pagination: {
      type: [Boolean, Object] as PropType<false | Partial<TablePaginationConfig>>,
      default: undefined
    },
    rowSelection: {
      type: [Boolean, Object] as PropType<boolean | TableRowSelection<any>>,
      default: undefined
    },
    loading: {
      type: Boolean,
      default: undefined
    },
    showHeader: {
      type: Boolean,
      default: undefined
    },
    bordered: {
      type: Boolean,
      default: undefined
    },
    size: {
      type: String as PropType<'large' | 'middle' | 'small'>,
      default: undefined
    },
    scroll: {
      type: Object as PropType<TableProps['scroll']>,
      default: undefined
    },
    expandable: {
      type: Object as PropType<TableProps['expandable']>,
      default: undefined
    },
    sticky: {
      type: [Boolean, Object] as PropType<TableProps['sticky']>,
      default: undefined
    },
    summary: {
      type: Function as PropType<TableProps['summary']>,
      default: undefined
    },
    /* ---- UI 开关 ---- */
    showPagination: {
      type: Boolean,
      default: true
    },
    hideOnSinglePage: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:pagination', 'update:rowSelection', 'change'],
  setup(props, { attrs, slots, emit }) {
    const table = props.table;

    provide('pro-table', table);

    const innerRowSelection = computed<TableRowSelection<any> | undefined>(() => {
      if (props.rowSelection === false) return undefined;

      const base: TableRowSelection<any> = {
        ...(typeof props.rowSelection === 'object' ? props.rowSelection : {}),
        selectedRowKeys: table.state.selectedRowKeys,
        onChange: (selectedRowKeys: RowKey[], selectedRows: any[]) => {
          table.setSelectedRowKeys(selectedRowKeys, selectedRows);
          emit('update:rowSelection', selectedRowKeys);
        }
      };

      return base;
    });

    const showBatchBar = computed(
      () => props.rowSelection !== false && table.state.selectedRows.length > 0
    );

    const innerPagination = computed<TablePaginationConfig | false>(() => {
      if (props.showPagination === false) return false;

      const pagination = props.pagination === false ? false : (props.pagination ?? {});
      if (pagination === false) return false;

      return {
        current: table.state.pagination.current,
        pageSize: table.state.pagination.pageSize,
        total: table.state.pagination.total,
        showSizeChanger: true,
        hideOnSinglePage: props.hideOnSinglePage,
        ...pagination
      };
    });

    const handleTableChange = async (
      pagination: TablePaginationConfig,
      filters: Record<string, any>,
      sorter: TableSorterResult<any> | TableSorterResult<any>[],
      extra: any
    ) => {
      table.setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      });
      table.setFilters(filters);
      table.setSorter(sorter);
      table.clearSelection();
      emit('update:pagination', pagination);
      emit('change', pagination, filters, sorter, extra);
      await table.reload();
    };

    onBeforeMount(() => {
      // 默认自动拉取；controller 配置 manual=true 时不拉
      if (!table.options.manual) {
        table.reload();
      }
    });

    onBeforeUnmount(() => {
      table.clearSelection();
    });

    const renderToolbar = () => {
      if (!slots.action && !slots.extra) return null;
      if (showBatchBar.value && slots.batch) return null;

      const leftNode = slots.action?.();
      const rightNode = slots.extra?.();

      return h('div', { class: 'pro-table__toolbar' }, [
        h('div', { class: 'pro-table__toolbar-left' }, leftNode),
        h('div', { class: 'pro-table__toolbar-right' }, rightNode)
      ]);
    };

    const renderBatchBar = () => {
      if (!showBatchBar.value) return null;

      const batchSlot = slots.batch?.({
        selectedRowKeys: table.state.selectedRowKeys,
        selectedRows: table.state.selectedRows,
        clearSelection: table.clearSelection
      } as ProTableBatchSlotProps);

      if (!batchSlot) return null;

      return h('div', { class: 'pro-table__batch' }, batchSlot);
    };

    return () => {
      const tableProps: Record<string, any> = {
        ...attrs,
        columns: props.columns ?? attrs.columns,
        dataSource: table.state.dataSource,
        loading: props.loading ?? table.state.loading,
        rowKey: table.rowKey,
        rowSelection: innerRowSelection.value,
        pagination: innerPagination.value,
        showHeader: props.showHeader,
        bordered: props.bordered,
        size: props.size,
        scroll: props.scroll,
        expandable: props.expandable,
        sticky: props.sticky,
        summary: props.summary,
        onChange: handleTableChange
      };

      return h('div', { class: 'pro-table' }, [
        h('div', { class: 'pro-table__panel' }, [
          renderToolbar(),
          renderBatchBar(),
          h(ATable, tableProps, {
            title: slots.title,
            footer: slots.footer,
            emptyText: slots.emptyText,
            expandIcon: slots.expandIcon,
            expandedRowRender: slots.expandedRowRender,
            headerCell: slots.headerCell,
            bodyCell: slots.bodyCell,
            filterDropdown: slots.filterDropdown,
            filterIcon: slots.filterIcon,
            summary: slots.summary
          })
        ])
      ]);
    };
  }
});
</script>

<style scoped lang="less">
.pro-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pro-table__panel {
  overflow: hidden;
  border-radius: 12px;
}

.pro-table__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 12px 0px;
}

.pro-table__toolbar-left,
.pro-table__toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.pro-table__batch {
  display: flex;
  align-items: center;
  min-height: 56px;
  padding: 12px 0px;
}

.pro-table__toolbar-right {
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>
