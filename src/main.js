import * as Cesium from 'cesium';
import { CESIUM_ION_TOKEN, TIANDITU_KEY, DEFAULT_VIEW, TERRAIN } from './config.js';
import { App } from './App.js';

// 配置 Ion Token
Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;

// 限制并发请求数, 避免天地图 429 限流
Cesium.RequestScheduler.maximumRequestsPerServer = 4;

// 创建 Viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  scene3DOnly: true,
  // 使用 Cesium World Terrain (全球 DEM, 最高 30m 精度)
  terrain: Cesium.Terrain.fromWorldTerrain(),
  // 天地图影像底图
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    new Cesium.UrlTemplateImageryProvider({
      url: `https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${TIANDITU_KEY}`,
      subdomains: ['0', '1', '2', '3'],
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      maximumLevel: 15,
    })
  ),
});

// 叠加天地图中文标注层
viewer.imageryLayers.addImageryProvider(
  new Cesium.UrlTemplateImageryProvider({
    url: `https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${TIANDITU_KEY}`,
    subdomains: ['0', '1', '2', '3'],
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 15,
  })
);

// === 地形增强设置 ===

// 1. 垂直夸张: 将地形高度放大, 让起伏更明显 (1.0=真实, 3.0=3倍)
viewer.scene.verticalExaggeration = TERRAIN.EXAGGERATION;
viewer.scene.verticalExaggerationRelativeHeight = TERRAIN.EXAGGERATION_RELATIVE_HEIGHT;

// 2. 开启地表光照 (阴影让起伏更立体)
viewer.scene.globe.enableLighting = true;

// 3. 大气散射效果 (远处蓝色雾化, 增强景深)
viewer.scene.globe.showGroundAtmosphere = true;

// 4. 模拟清晨/黄昏的低角度光照, 地形阴影更长, 起伏更明显
viewer.scene.light = new Cesium.SunLight({
  color: Cesium.Color.WHITE,
  intensity: 0.7,
});

// 5. 设置地球底色为深色调, 让光照阴影对比更强
viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#2a2a2a');

// 设置默认视角 (较低俯角有利于观察地形起伏)
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    DEFAULT_VIEW.longitude,
    DEFAULT_VIEW.latitude,
    DEFAULT_VIEW.height
  ),
  orientation: {
    heading: Cesium.Math.toRadians(15),
    pitch: Cesium.Math.toRadians(-35),
    roll: 0
  }
});

// 地形加载进度监控
viewer.scene.globe.tileLoadProgressEvent.addEventListener((remaining) => {
  if (remaining === 0) {
    console.log('✅ DEM 地形数据加载完成, 地表起伏已就绪');
  }
});

// 主面板折叠切换
const panelToggle = document.getElementById('panelToggle');
const controlPanel = document.getElementById('controlPanel');
panelToggle.addEventListener('click', () => {
  const collapsed = controlPanel.classList.toggle('collapsed');
  panelToggle.textContent = collapsed ? '▶' : '◀';
  panelToggle.title = collapsed ? '展开面板' : '折叠面板';
});

// 雷达面板折叠切换
const radarPanelToggle = document.getElementById('radarPanelToggle');
const radarPanel = document.getElementById('radarPanel');
radarPanelToggle.addEventListener('click', () => {
  const collapsed = radarPanel.classList.toggle('collapsed');
  radarPanelToggle.textContent = collapsed ? '◀' : '▶';
  radarPanelToggle.title = collapsed ? '展开雷达面板' : '折叠雷达面板';
});

// 启动应用
const app = new App(viewer);
window.app = app;

// 暴露地形控制方法到全局
window.terrainControl = {
  // 动态调整地形夸张
  setExaggeration(value) {
    viewer.scene.verticalExaggeration = value;
    console.log(`地形夸张系数: ${value}x`);
  },
  // 切换光照方向 (模拟不同时间日照)
  setSunAngle(degreesFromHorizon) {
    viewer.scene.light = new Cesium.SunLight({
      color: Cesium.Color.WHITE,
      intensity: 0.7,
    });
  },
  getExaggeration() {
    return viewer.scene.verticalExaggeration;
  },
};
