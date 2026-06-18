<script lang="ts">
import { Table as ATable } from 'antdv-next';
import { computed, defineComponent, h, onBeforeMount, onBeforeUnmount, provide, watch } from 'vue';
import type { PropType } from 'vue';
import type {
  TablePaginationConfig,
  TableProps,
  TableRowSelection,
  TableSorterResult
} from 'antdv-next';
import type {
  ProTableApi,
  ProTablePaginationState,
  ProTableRowKey,
  ProTableState
} from './create-pro-table';
import { createProTable } from './create-pro-table';

type RowKey = string | number;

type RequestResult<Row> = {
  data: Row[];
  total?: number;
};

export interface ProTableRequestQuery<Params extends Record<string, any> = Record<string, any>> {
  params: Params;
  pagination: ProTablePaginationState;
  sorter?: TableSorterResult<any> | TableSorterResult<any>[];
  filters?: Record<string, any>;
}

export type ProTableRequest<Row, Params extends Record<string, any> = Record<string, any>> = (
  query: ProTableRequestQuery<Params>
) => Promise<RequestResult<Row> | Row[]>;

export interface ProTableBatchSlotProps<Row = any> {
  selectedRowKeys: RowKey[];
  selectedRows: Row[];
  clearSelection: () => void;
}

export default defineComponent({
  name: 'ProTable',
  inheritAttrs: false,
  props: {
    form: {
      type: Object as PropType<ProTableApi<any, any>>,
      default: undefined
    },
    request: Function as PropType<ProTableRequest<any, any>>,
    dataSource: {
      type: Array as PropType<any[]>,
      default: undefined
    },
    params: {
      type: Object as PropType<Record<string, any>>,
      default: undefined
    },
    pagination: {
      type: [Boolean, Object] as PropType<false | Partial<TablePaginationConfig>>,
      default: undefined
    },
    rowKey: {
      type: [String, Function] as PropType<ProTableRowKey<any>>,
      default: 'key'
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
    columns: {
      type: Array as PropType<TableProps['columns']>,
      default: undefined
    },

    showPagination: {
      type: Boolean,
      default: true
    },
    manual: {
      type: Boolean,
      default: false
    },
    defaultPageSize: {
      type: Number,
      default: 10
    },
    hideOnSinglePage: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    'update:loading',
    'update:pagination',
    'update:rowSelection',
    'update:rowKey',
    'change',
    'reload',
    'reset',
    'request-success',
    'request-error'
  ],
  setup(props, { attrs, slots, emit }) {
    const table =
      props.form ??
      createProTable({
        request: props.request,
        initialData: props.dataSource ?? [],
        initialParams: props.params ?? {},
        initialPagination: {
          current: 1,
          pageSize: props.defaultPageSize
        },
        pageSize: props.defaultPageSize,
        rowKey: props.rowKey,
        manual: props.manual
      })[1];

    const tableState = computed<ProTableState<any, any>>(() => table.state);

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
        current: tableState.value.pagination.current,
        pageSize: tableState.value.pagination.pageSize,
        total: tableState.value.pagination.total,
        showSizeChanger: true,
        hideOnSinglePage: props.hideOnSinglePage,
        ...pagination
      };
    });

    const triggerRequest = async () => {
      if (props.request || table.options.request) {
        emit('update:loading', true);
        try {
          const rows = await table.reload();
          emit('request-success', rows);
          return rows;
        } catch (error) {
          emit('request-error', error);
          return [];
        } finally {
          emit('update:loading', false);
        }
      }
      return table.state.dataSource;
    };

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
      await triggerRequest();
    };

    watch(
      () => props.dataSource,
      (next) => {
        if (!props.request && next) {
          table.setData(next);
        }
      },
      { deep: true }
    );

    watch(
      () => props.params,
      (next) => {
        if (next) table.setParams(next, false);
      },
      { deep: true }
    );

    onBeforeMount(async () => {
      if (!props.manual) {
        await triggerRequest();
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
        rowKey: props.rowKey ?? table.rowKey,
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
