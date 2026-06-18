<template>
  <AppProLayout title="角色管理">
    <ProPage :body-card="false">
      <template #search>
        <ProForm :form="searchApi" grid :cols="4" label-width="80" submit-text="查询">
          <ProInput path="keyword" label="关键词" placeholder="名称 / 编码 / 描述" allow-clear />
          <ProSelect
            path="status"
            label="状态"
            placeholder="全部"
            allow-clear
            :options="statusOptions"
          />
        </ProForm>
      </template>

      <template #main>
        <ProTable
          :table="tableApi"
          :columns="columns"
          :hide-on-single-page="false"
          :row-selection="{ type: 'checkbox' }"
        >
          <template #action>
            <a-space wrap>
              <a-button v-access="'system:role:add'" type="primary">新增角色</a-button>
              <a-button v-access="'system:role:export'" ghost type="primary">
                导出权限矩阵
              </a-button>
            </a-space>
          </template>

          <template #extra>
            <a-tag color="processing">共 {{ filteredRoles.length }} 个角色</a-tag>
          </template>

          <template #batch="{ selectedRows, clearSelection }">
            <a-space wrap>
              <a-tag color="blue">已选 {{ selectedRows.length }} 个角色</a-tag>
              <a-button ghost type="primary" @click="onBatchExport(selectedRows, clearSelection)">
                批量导出
              </a-button>
              <a-button @click="clearSelection">取消选择</a-button>
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div>
                <strong class="block text-app-text-primary">{{ record.name }}</strong>
                <span class="text-xs text-app-text-tertiary">{{ record.code }}</span>
              </div>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-tag :color="record.status === 'enabled' ? 'success' : 'default'">
                {{ record.status === 'enabled' ? '启用中' : '已停用' }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'permissionTags'">
              <a-space wrap :size="[4, 4]">
                <a-tag v-for="permission in record.permissionTags" :key="permission" color="blue">
                  {{ permission }}
                </a-tag>
              </a-space>
            </template>

            <template v-else-if="column.key === 'action'">
              <a-space :size="8">
                <a-button size="small" type="link">编辑权限</a-button>
                <a-button size="small" type="link">查看成员</a-button>
              </a-space>
            </template>
          </template>
        </ProTable>
      </template>
    </ProPage>
  </AppProLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { message } from 'antdv-next';
import {
  createProForm,
  createProTable,
  ProForm,
  ProInput,
  ProPage,
  ProSelect,
  ProTable
} from '@owl/components';
import AppProLayout from '@/components/app-pro-layout/index.vue';
import { fetchSystemRolesApi } from '@/api/system';
import type { SystemRoleRecord } from '@/types/system';

interface RoleSearchForm {
  keyword?: string;
  status?: SystemRoleRecord['status'];
}

const roles = ref<SystemRoleRecord[]>([]);
const searchState = ref<RoleSearchForm>({});

const statusOptions = [
  { label: '启用中', value: 'enabled' },
  { label: '已停用', value: 'disabled' }
];

const columns = [
  { key: 'name', title: '角色' },
  { dataIndex: 'description', key: 'description', title: '描述' },
  { dataIndex: 'dataScope', key: 'dataScope', title: '数据范围' },
  { dataIndex: 'userCount', key: 'userCount', title: '成员数量' },
  { key: 'permissionTags', title: '权限标签' },
  { key: 'status', title: '状态' },
  { key: 'action', title: '操作', width: 160 }
];

const [, searchApi] = createProForm<RoleSearchForm>({
  onSubmit: (formData) => {
    searchState.value = formData;
  },
  onReset: () => {
    searchState.value = {};
  }
});

const filteredRoles = computed(() => {
  const keyword = searchState.value.keyword?.trim().toLowerCase();
  const status = searchState.value.status;

  return roles.value.filter((item) => {
    const keywordMatched =
      !keyword ||
      [item.code, item.description, item.name].some((field) =>
        field.toLowerCase().includes(keyword)
      );
    const statusMatched = !status || item.status === status;

    return keywordMatched && statusMatched;
  });
});

const [, tableApi] = createProTable<SystemRoleRecord>({
  rowKey: 'id',
  manual: true
});

watch(filteredRoles, (next) => tableApi.setData(next));

function onBatchExport(selectedRows: SystemRoleRecord[], clearSelection: () => void) {
  message.success(`已导出 ${selectedRows.length} 个角色`);
  clearSelection();
}

onMounted(async () => {
  roles.value = await fetchSystemRolesApi();
});
</script>
