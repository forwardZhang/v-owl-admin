<template>
  <div
    class="pro-table"
    :class="{
      'is-fullscreen bg-app-surface p-6 fixed inset-0 z-[999] flex flex-col': isFullscreen
    }"
  >
    <div class="pro-table__panel flex-1 flex flex-col min-h-0">
      <!-- 工具栏 -->
      <div
        v-if="$slots.action || $slots.extra || showDefaultTools"
        class="pro-table__toolbar flex items-center justify-between min-h-[56px] py-3 gap-4"
      >
        <!-- 左侧操作区 -->
        <div class="pro-table__toolbar-left flex items-center gap-2 flex-wrap min-w-0">
          <slot name="action"></slot>
        </div>

        <!-- 右侧额外区与高阶工具栏 -->
        <div class="pro-table__toolbar-right flex items-center gap-4 flex-wrap min-w-0">
          <slot name="extra"></slot>

          <!-- 默认工具栏 -->
          <div
            v-if="showDefaultTools"
            class="pro-table__tools flex items-center gap-2.5 border-l border-app-border pl-4"
          >
            <!-- 1. 刷新 -->
            <a-tooltip title="刷新">
              <button
                type="button"
                class="tool-btn flex items-center justify-center text-app-text-secondary hover:text-app-primary hover:bg-app-surface-soft rounded-lg p-1.5 cursor-pointer border-0 bg-transparent transition-all"
                @click="handleReload"
              >
                <reload-outlined class="text-[14px]" :spin="table.state.loading" />
              </button>
            </a-tooltip>

            <!-- 2. 密度 -->
            <a-tooltip title="密度">
              <a-dropdown :trigger="['click']" placement="bottom">
                <button
                  type="button"
                  class="tool-btn flex items-center justify-center text-app-text-secondary hover:text-app-primary hover:bg-app-surface-soft rounded-lg p-1.5 cursor-pointer border-0 bg-transparent transition-all"
                >
                  <column-height-outlined class="text-[14px]" />
                </button>
                <template #popupRender>
                  <a-menu :selected-keys="[tableSize]" @click="handleSizeChange">
                    <a-menu-item key="large">宽松</a-menu-item>
                    <a-menu-item key="middle">中等</a-menu-item>
                    <a-menu-item key="small">紧凑</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-tooltip>

            <!-- 3. 列设置 -->
            <a-tooltip title="列设置">
              <a-popover
                trigger="click"
                placement="bottomRight"
                overlay-class-name="pro-table-col-settings"
              >
                <button
                  type="button"
                  class="tool-btn flex items-center justify-center text-app-text-secondary hover:text-app-primary hover:bg-app-surface-soft rounded-lg p-1.5 cursor-pointer border-0 bg-transparent transition-all"
                >
                  <setting-outlined class="text-[14px]" />
                </button>
                <template #content>
                  <div class="col-settings-panel max-h-72 overflow-y-auto min-w-[160px] py-1">
                    <div
                      class="font-semibold text-xs text-app-text-tertiary mb-2 px-1 border-b border-app-border pb-1.5 flex justify-between items-center"
                    >
                      <span>显示列</span>
                      <a-button
                        type="link"
                        size="small"
                        class="p-0 text-[11px] h-auto"
                        @click="resetColumns"
                        >重置</a-button
                      >
                    </div>
                    <div class="flex flex-col gap-2">
                      <a-checkbox
                        v-for="col in allColumns"
                        :key="getColumnKey({ column: col })"
                        :checked="visibleKeys.includes(getColumnKey({ column: col }))"
                        @change="
                          handleColumnToggle({
                            key: getColumnKey({ column: col }),
                            checked: $event.target.checked
                          })
                        "
                      >
                        <span class="text-xs text-app-text-primary">{{
                          getColumnTitle({ column: col })
                        }}</span>
                      </a-checkbox>
                    </div>
                  </div>
                </template>
              </a-popover>
            </a-tooltip>

            <!-- 4. 全屏 -->
            <a-tooltip title="全屏">
              <button
                type="button"
                class="tool-btn flex items-center justify-center text-app-text-secondary hover:text-app-primary hover:bg-app-surface-soft rounded-lg p-1.5 cursor-pointer border-0 bg-transparent transition-all"
                @click="toggleFullscreen"
              >
                <fullscreen-exit-outlined v-if="isFullscreen" class="text-[14px]" />
                <fullscreen-outlined v-else class="text-[14px]" />
              </button>
            </a-tooltip>
          </div>
        </div>
      </div>

      <!-- 批量操作栏 -->
      <div
        v-if="showBatchBar"
        class="pro-table__batch px-4 py-2.5 mb-3 bg-app-primary-soft rounded-xl flex items-center justify-between border border-app-primary/10 transition-all"
      >
        <slot
          name="batch"
          :selected-row-keys="table.state.selectedRowKeys"
          :selected-rows="table.state.selectedRows"
          :clear-selection="table.clearSelection"
        >
        </slot>
      </div>

      <!-- 表格内容 -->
      <div class="flex-1 min-h-0 overflow-auto">
        <a-table
          v-bind="$attrs"
          :columns="computedColumns"
          :data-source="table.state.dataSource"
          :loading="table.state.loading"
          :row-selection="innerRowSelection"
          :pagination="innerPagination"
          :show-header="showHeader"
          :bordered="bordered"
          :size="tableSize"
          :scroll="scroll"
          :expandable="expandable"
          :sticky="sticky"
          :summary="summary"
          @change="handleTableChange"
        >
          <!-- 动态插槽透载 -->
          <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps || {}"></slot>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, provide } from 'vue';
import type { TablePaginationConfig, TableProps, TableRowSelection } from 'antdv-next';
import {
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@antdv-next/icons';
import type { ProTableApi } from './create-pro-table';

defineOptions({
  name: 'ProTable',
  inheritAttrs: false
});

type RowKey = string | number;

const props = withDefaults(
  defineProps<{
    /** 表格控制器（createProTable 返回，必传） */
    table: ProTableApi<any, any>;
    /* ---- UI 属性 ---- */
    columns?: any[];
    pagination?: false | Partial<TablePaginationConfig>;
    rowSelection?: boolean | TableRowSelection<any>;
    loading?: boolean;
    showHeader?: boolean;
    bordered?: boolean;
    size?: 'large' | 'middle' | 'small';
    scroll?: TableProps['scroll'];
    expandable?: TableProps['expandable'];
    sticky?: TableProps['sticky'];
    summary?: TableProps['summary'];
    /* ---- 工具属性 ---- */
    showPagination?: boolean;
    hideOnSinglePage?: boolean;
    showDefaultTools?: boolean;
  }>(),
  {
    columns: () => [],
    pagination: undefined,
    rowSelection: undefined,
    loading: undefined,
    showHeader: true,
    bordered: false,
    size: 'large',
    scroll: undefined,
    expandable: undefined,
    sticky: undefined,
    summary: undefined,
    showPagination: true,
    hideOnSinglePage: true,
    showDefaultTools: true
  }
);

const emit = defineEmits(['update:pagination', 'update:rowSelection', 'change']);

const table = props.table;

provide('pro-table', table);

// 1. 密度 (Size) 控制
const tableSize = ref<'large' | 'middle' | 'small'>(props.size);

watch(
  () => props.size,
  (newSize) => {
    if (newSize) {
      tableSize.value = newSize;
    }
  }
);

/**
 * 切换表格大小（密度）
 *
 * @param {object} info 菜单选择信息
 * @param {string} info.key 对应的表格大小键值
 */
function handleSizeChange(info: { key: string }) {
  tableSize.value = info.key as 'large' | 'middle' | 'small';
}

// 2. 列设置控制
const allColumns = computed(() => props.columns || []);
const visibleKeys = ref<string[]>([]);

watch(
  allColumns,
  (cols) => {
    if (cols && cols.length) {
      // 每次列改变时，将没有被过滤过的新列全部默认可见
      const keys = cols.map((c) => getColumnKey({ column: c }));
      if (visibleKeys.value.length === 0) {
        visibleKeys.value = keys;
      }
    }
  },
  { immediate: true }
);

/**
 * 获取列在过滤时的唯一 Key
 *
 * @param {object} payload 载荷对象
 * @param {object} payload.column 列对象定义
 */
function getColumnKey(payload: { column: any }) {
  const { column } = payload;
  return column.key || column.dataIndex || column.title || '';
}

/**
 * 获取列名以显示在下拉设置中
 *
 * @param {object} payload 载荷对象
 * @param {object} payload.column 列对象定义
 */
function getColumnTitle(payload: { column: any }) {
  const { column } = payload;
  return column.title || '';
}

/**
 * 切换某一列的显示与隐藏
 *
 * @param {object} payload 载荷对象
 * @param {string} payload.key 这一列的标识键名
 * @param {boolean} payload.checked 当前是否被勾选
 */
function handleColumnToggle(payload: { key: string; checked: boolean }) {
  const { key, checked } = payload;
  if (checked) {
    if (!visibleKeys.value.includes(key)) {
      visibleKeys.value.push(key);
    }
  } else {
    visibleKeys.value = visibleKeys.value.filter((k) => k !== key);
  }
}

/**
 * 重置所有列为完全显示状态
 */
function resetColumns() {
  visibleKeys.value = allColumns.value.map((c) => getColumnKey({ column: c }));
}

// 根据可见 keys 过滤计算出的真正 columns
const computedColumns = computed(() => {
  return allColumns.value.filter((col) => {
    const key = getColumnKey({ column: col });
    return visibleKeys.value.includes(key);
  });
});

// 3. 刷新控制
/**
 * 触发表格重新加载
 */
function handleReload() {
  table.reload();
}

// 4. 全屏控制
const isFullscreen = ref(false);
/**
 * 切换表格容器全屏状态
 */
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

// 5. 原表格的核心多选逻辑适配
const innerRowSelection = computed<TableRowSelection<any> | undefined>(() => {
  if (props.rowSelection === false) return undefined;

  return {
    ...(typeof props.rowSelection === 'object' ? props.rowSelection : {}),
    selectedRowKeys: table.state.selectedRowKeys,
    onChange: (selectedRowKeys: RowKey[], selectedRows: any[]) => {
      table.setSelectedRowKeys(selectedRowKeys, selectedRows);
      emit('update:rowSelection', selectedRowKeys);
    }
  };
});

const showBatchBar = computed(
  () => props.rowSelection !== false && table.state.selectedRows.length > 0
);

// 6. 分页适配
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
    showTotal: (total: number) => `共 ${total} 条数据`,
    ...pagination
  };
});

// 7. 表格底层改变事件
const handleTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
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
  table.reload();
};
</script>

<style scoped lang="less">
.pro-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &.is-fullscreen {
    background-color: var(--app-surface, #ffffff);
    overflow: auto;
  }
}

.pro-table__panel {
  border-radius: 12px;
}

.tool-btn {
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-0.5px);
  }
}
</style>
