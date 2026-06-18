import { shallowReactive } from 'vue';
import type { TableSorterResult } from 'antdv-next';
import { cloneDeep } from 'lodash-es';

type TableKey = string | number;

export type ProTableRowKey<Row> = string | ((record: Row, index?: number) => TableKey);

export interface ProTablePaginationState {
  current: number;
  pageSize: number;
  total: number;
}

export interface ProTableQueryState<Params extends Record<string, any> = Record<string, any>> {
  params: Params;
  pagination: ProTablePaginationState;
  sorter?: TableSorterResult<any> | TableSorterResult<any>[];
  filters?: Record<string, any>;
}

export interface ProTableRequestResult<Row> {
  data: Row[];
  total?: number;
}

export type ProTableRequest<Row, Params extends Record<string, any> = Record<string, any>> = (
  query: ProTableQueryState<Params>
) => Promise<ProTableRequestResult<Row> | Row[]>;

export interface CreateProTableOptions<
  Row = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> {
  /** 远程请求 */
  request?: ProTableRequest<Row, Params>;
  /** 初始数据（本地模式 / 回退态） */
  initialData?: Row[];
  /** 初始查询参数 */
  initialParams?: Partial<Params>;
  /** 初始分页 */
  initialPagination?: Partial<ProTablePaginationState>;
  /** 默认每页条数 */
  pageSize?: number;
  /** 表格 rowKey，默认 `key` */
  rowKey?: ProTableRowKey<Row>;
  /** 手动模式：默认不自动拉取 */
  manual?: boolean;
  /** 加载完成回调 */
  onLoad?: (
    dataSource: Row[],
    total: number,
    query: ProTableQueryState<Params>
  ) => void | Promise<void>;
  /** 加载失败回调 */
  onError?: (error: unknown, query: ProTableQueryState<Params>) => void;
  /** 多选变化回调 */
  onSelectionChange?: (selectedRowKeys: TableKey[], selectedRows: Row[]) => void;
}

export interface ProTableState<
  Row = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> {
  dataSource: Row[];
  loading: boolean;
  params: Params;
  pagination: ProTablePaginationState;
  sorter?: TableSorterResult<Row> | TableSorterResult<Row>[];
  filters?: Record<string, any>;
  selectedRowKeys: TableKey[];
  selectedRows: Row[];
}

export interface ProTableApi<
  Row = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> {
  state: ProTableState<Row, Params>;
  options: CreateProTableOptions<Row, Params>;
  rowKey: ProTableRowKey<Row>;
  setRowKey: (rowKey: ProTableRowKey<Row>) => void;
  reload: () => Promise<Row[]>;
  reset: () => Promise<Row[]>;
  setParams: (params: Partial<Params>, merge?: boolean) => void;
  setData: (dataSource: Row[]) => void;
  setLoading: (loading: boolean) => void;
  setPagination: (pagination: Partial<ProTablePaginationState>) => void;
  setSorter: (sorter?: TableSorterResult<Row> | TableSorterResult<Row>[]) => void;
  setFilters: (filters?: Record<string, any>) => void;
  setSelectedRowKeys: (selectedRowKeys: TableKey[], selectedRows?: Row[]) => void;
  clearSelection: () => void;
}

export type CreateProTableReturn<
  Row = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = readonly [state: ProTableState<Row, Params>, tableApi: ProTableApi<Row, Params>];

function normalizePagination(input?: Partial<ProTablePaginationState>, pageSize = 10) {
  return {
    current: Math.max(1, input?.current ?? 1),
    pageSize: Math.max(1, input?.pageSize ?? pageSize),
    total: Math.max(0, input?.total ?? 0)
  };
}

function normalizeKeys(keys: TableKey[]) {
  return Array.from(new Set(keys));
}

function resolveRowKey<Row>(rowKey: ProTableRowKey<Row>, record: Row, index: number): TableKey {
  if (typeof rowKey === 'function') {
    return rowKey(record, index);
  }
  const value = (record as Record<string, any>)[rowKey];
  return (value ?? index) as TableKey;
}

/** 创建一个 ProTable 控制器 */
export function createProTable<
  Row = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
>(options: CreateProTableOptions<Row, Params> = {}): CreateProTableReturn<Row, Params> {
  const state = shallowReactive<ProTableState<Row, Params>>({
    dataSource: cloneDeep(options.initialData ?? []) as Row[],
    loading: false,
    params: cloneDeep((options.initialParams ?? {}) as Params) as Params,
    pagination: normalizePagination(options.initialPagination, options.pageSize),
    sorter: undefined,
    filters: undefined,
    selectedRowKeys: [],
    selectedRows: []
  });

  let currentRowKey: ProTableRowKey<Row> = options.rowKey ?? 'key';
  let requestSeq = 0;

  const query = (): ProTableQueryState<Params> => ({
    params: cloneDeep(state.params) as Params,
    pagination: cloneDeep(state.pagination),
    sorter: cloneDeep(state.sorter) as ProTableQueryState<Params>['sorter'],
    filters: cloneDeep(state.filters) as ProTableQueryState<Params>['filters']
  });

  const syncSelectedRows = (selectedRows?: Row[]) => {
    if (selectedRows) {
      state.selectedRows = selectedRows.slice();
      return;
    }

    if (!state.selectedRowKeys.length || !state.dataSource.length) {
      state.selectedRows = [];
      return;
    }

    const rows: Row[] = [];
    state.selectedRowKeys.forEach((key) => {
      const matched = state.dataSource.find(
        (record, index) => resolveRowKey(currentRowKey, record, index) === key
      );
      if (matched) rows.push(matched);
    });
    state.selectedRows = rows;
  };

  const setRowKey = (rowKey: ProTableRowKey<Row>) => {
    currentRowKey = rowKey;
    syncSelectedRows();
  };

  const setData = (dataSource: Row[]) => {
    state.dataSource = (cloneDeep(dataSource ?? []) as Row[]) ?? [];
    syncSelectedRows();
  };

  const setParams = (params: Partial<Params>, merge = true) => {
    state.params = merge
      ? ({
          ...(cloneDeep(state.params) as Params),
          ...(cloneDeep(params) as Partial<Params>)
        } as Params)
      : ({ ...(cloneDeep(params) as Partial<Params>) } as Params);
  };

  const setPagination = (pagination: Partial<ProTablePaginationState>) => {
    state.pagination = {
      ...state.pagination,
      ...(pagination.current != null ? { current: Math.max(1, pagination.current) } : {}),
      ...(pagination.pageSize != null ? { pageSize: Math.max(1, pagination.pageSize) } : {}),
      ...(pagination.total != null ? { total: Math.max(0, pagination.total) } : {})
    };
  };

  const setSorter = (sorter?: TableSorterResult<Row> | TableSorterResult<Row>[]) => {
    state.sorter = sorter;
  };

  const setFilters = (filters?: Record<string, any>) => {
    state.filters = filters;
  };

  const setLoading = (loading: boolean) => {
    state.loading = loading;
  };

  const setSelectedRowKeys = (selectedRowKeys: TableKey[], selectedRows?: Row[]) => {
    state.selectedRowKeys = normalizeKeys(selectedRowKeys);
    syncSelectedRows(selectedRows);
    options.onSelectionChange?.(state.selectedRowKeys, state.selectedRows);
  };

  const clearSelection = () => {
    state.selectedRowKeys = [];
    state.selectedRows = [];
    options.onSelectionChange?.([], []);
  };

  const load = async (): Promise<Row[]> => {
    if (!options.request) {
      return state.dataSource;
    }

    const seq = ++requestSeq;
    state.loading = true;
    const currentQuery = query();

    try {
      const result = await options.request(currentQuery);
      if (seq !== requestSeq) return state.dataSource;

      const rows = Array.isArray(result) ? result : (result?.data ?? []);
      const total = Array.isArray(result) ? rows.length : (result?.total ?? rows.length);

      setData(rows as Row[]);
      state.pagination.total = total;
      await options.onLoad?.(state.dataSource, total, currentQuery);
      return state.dataSource;
    } catch (error) {
      if (seq === requestSeq) {
        options.onError?.(error, currentQuery);
      }
      return state.dataSource;
    } finally {
      if (seq === requestSeq) {
        state.loading = false;
      }
    }
  };

  const reload = async () => {
    clearSelection();
    return load();
  };

  const reset = async () => {
    state.params = cloneDeep((options.initialParams ?? {}) as Params) as Params;
    state.pagination = normalizePagination(options.initialPagination, options.pageSize);
    state.sorter = undefined;
    state.filters = undefined;
    clearSelection();

    if (!options.request) {
      setData(options.initialData ?? []);
      return state.dataSource;
    }

    return load();
  };

  const tableApi: ProTableApi<Row, Params> = {
    state,
    options,
    get rowKey() {
      return currentRowKey;
    },
    setRowKey,
    reload,
    reset,
    setParams,
    setData,
    setLoading,
    setPagination,
    setSorter,
    setFilters,
    setSelectedRowKeys,
    clearSelection
  };

  return [state, tableApi] as const;
}
