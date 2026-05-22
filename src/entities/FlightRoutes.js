import * as Cesium from 'cesium';

// 航线颜色
const ROUTE_COLORS = [
  Cesium.Color.DODGERBLUE.withAlpha(0.6),
  Cesium.Color.LIMEGREEN.withAlpha(0.5),
  Cesium.Color.GOLD.withAlpha(0.5),
  Cesium.Color.MAGENTA.withAlpha(0.4),
];

/**
 * 创建航线实体 (空中走廊可视化)
 * @param {Cesium.Viewer} viewer
 * @param {Array} routesData - 航线数据
 */
export function createFlightRoutes(viewer, routesData) {
  const entities = [];

  for (let i = 0; i < routesData.length; i++) {
    const route = routesData[i];
    const positions = route.waypoints.map(
      wp => Cesium.Cartesian3.fromDegrees(wp.lon, wp.lat, route.altitude)
    );

    const routeEntity = viewer.entities.add({
      name: route.name,
      polyline: {
        positions: positions,
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: ROUTE_COLORS[i % ROUTE_COLORS.length],
          dashLength: 16,
        }),
        clampToGround: false,
      },
    });
    entities.push(routeEntity);

    // 航线标签
    const midIdx = Math.floor(route.waypoints.length / 2);
    const midWp = route.waypoints[midIdx];
    const label = viewer.entities.add({
      name: `${route.name} 标签`,
      position: Cesium.Cartesian3.fromDegrees(midWp.lon, midWp.lat, route.altitude + 500),
      label: {
        text: `${route.id} ${route.name}`,
        font: '13px Microsoft YaHei',
        fillColor: ROUTE_COLORS[i % ROUTE_COLORS.length],
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        scale: 0.8,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    entities.push(label);
  }

  return entities;
}
