import * as Cesium from 'cesium';

/**
 * 在场景中创建机场实体
 * @param {Cesium.Viewer} viewer
 * @param {Array} airportsData - 机场数据数组
 */
export function createAirports(viewer, airportsData) {
  const entities = [];

  for (const airport of airportsData) {
    // 跑道 - 用矩形表示
    const runwayHalfLength = airport.runwayLength / 2 / 100000; // 粗略换算为经纬度
    const headingRad = Cesium.Math.toRadians(airport.runwayHeading);

    const centerLon = airport.longitude;
    const centerLat = airport.latitude;
    const dLat = runwayHalfLength * Math.cos(headingRad);
    const dLon = runwayHalfLength * Math.sin(headingRad) / Math.cos(Cesium.Math.toRadians(centerLat));

    const runway = viewer.entities.add({
      name: `${airport.name} 跑道`,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          Math.min(centerLon - dLon * 0.02, centerLon + dLon * 0.02),
          Math.min(centerLat - dLat * 0.2, centerLat + dLat * 0.2),
          Math.max(centerLon - dLon * 0.02, centerLon + dLon * 0.02),
          Math.max(centerLat - dLat * 0.2, centerLat + dLat * 0.2),
        ),
        material: Cesium.Color.DARKGRAY.withAlpha(0.8),
        height: 0,
      },
    });
    entities.push(runway);

    // 机场标记点
    const point = viewer.entities.add({
      name: airport.name,
      position: Cesium.Cartesian3.fromDegrees(airport.longitude, airport.latitude, 200),
      billboard: {
        image: createAirportIcon(),
        width: 28,
        height: 28,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
      label: {
        text: `${airport.icao}\n${airport.name}`,
        font: '14px Microsoft YaHei',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, 16),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    entities.push(point);
  }

  return entities;
}

// Canvas 生成机场图标
function createAirportIcon() {
  const canvas = document.createElement('canvas');
  canvas.width = 56;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');

  // 圆形底座
  ctx.beginPath();
  ctx.arc(28, 28, 20, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 120, 255, 0.8)';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 飞机图标
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✈', 28, 28);

  return canvas.toDataURL();
}
