// Cesium Ion Token - 用于地形服务 (Cesium World Terrain)
export const CESIUM_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjM0OTdiZi0yN2EzLTRkNmItODlkZC1iNGQyZWNjODk1MjkiLCJpZCI6NTc3NjQsInN1YiI6IuaEpOaAkueahOmYv-aWhyIsImlzcyI6Imh0dHBzOi8vaW9uLmNlc2l1bS5jb20iLCJhdWQiOiJhcHAyIiwiaWF0IjoxNzc4ODIxOTk4fQ.HTtyOKV1KT7CNZypQcaqPJYQAYCpaInCh0NwfbctEng';

// 天地图 API Key - 在 https://console.tianditu.gov.cn 注册获取
export const TIANDITU_KEY = 'b4162ac2911ae0392798662d2ad1eda7';

// 默认视角 - 北京首都国际机场附近
export const DEFAULT_VIEW = {
  longitude: 116.4,
  latitude: 39.9,
  height: 50000
};

// 地形增强配置
export const TERRAIN = {
  EXAGGERATION: 3.0,               // 地形垂直夸张倍数
  EXAGGERATION_RELATIVE_HEIGHT: 0, // 夸张基准高度 (0=海平面)
};

// 模拟时间配置 (秒)
export const TIMING = {
  CRUISING: 10,     // 巡航阶段时长
  DESCENDING: 6,    // 坠落阶段时长
  CRASH_MOMENT: 16,  // 坠毁瞬间时间点
  TOTAL: 25         // 总时长
};
