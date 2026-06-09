/**
 * 示例用的「假接口」：模拟后端返回，用于演示 ProForm 的异步 options / 依赖联动请求。
 * 真实项目里替换成 axios 请求即可。
 */

function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/** 省份：返回的字段是 name/code，演示「字段替换」(labelField/valueField) */
export function fetchProvinces() {
  return delay({
    code: 0,
    data: {
      list: [
        { name: '浙江省', code: 'zj' },
        { name: '江苏省', code: 'js' },
        { name: '广东省', code: 'gd' }
      ]
    }
  });
}

const CITY_MAP: Record<string, Array<{ name: string; code: string }>> = {
  zj: [
    { name: '杭州市', code: 'hz' },
    { name: '宁波市', code: 'nb' },
    { name: '温州市', code: 'wz' }
  ],
  js: [
    { name: '南京市', code: 'nj' },
    { name: '苏州市', code: 'sz' },
    { name: '无锡市', code: 'wx' }
  ],
  gd: [
    { name: '广州市', code: 'gz' },
    { name: '深圳市', code: 'sztn' },
    { name: '珠海市', code: 'zh' }
  ]
};

/** 城市：依赖省份 province，演示「依赖字段请求」 */
export function fetchCities(province?: string) {
  const list = province ? (CITY_MAP[province] ?? []) : [];
  return delay({ code: 0, data: { list } });
}

/** 角色：直接返回 label/value 数组，演示无需字段替换的常规用法 */
export function fetchRoles() {
  return delay([
    { label: '管理员', value: 'admin' },
    { label: '运营', value: 'operator' },
    { label: '访客', value: 'guest' }
  ]);
}

/** 部门树：直接返回 label/value 树数据 */
export function fetchDeptTree() {
  return delay({
    data: [
      {
        label: '技术中心',
        value: 'tech',
        children: [
          { label: '前端组', value: 'fe' },
          { label: '后端组', value: 'be' }
        ]
      },
      {
        label: '运营中心',
        value: 'ops',
        children: [{ label: '内容组', value: 'content' }]
      }
    ]
  });
}
