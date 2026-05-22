// 北京首都机场 → 东南方向沿海航线
// 模拟航班: CCA1234 北京 → 上海 (巡航阶段出现故障)

// 巡航阶段飞行路径 (lon, lat, alt 米, time 秒)
export const flightPath = [
  { lon: 116.598, lat: 40.073, alt: 0, time: 0 },        // 北京首都机场起飞
  { lon: 116.620, lat: 40.050, alt: 1200, time: 1 },
  { lon: 116.650, lat: 40.010, alt: 3000, time: 2 },
  { lon: 116.720, lat: 39.940, alt: 5000, time: 3 },
  { lon: 116.810, lat: 39.850, alt: 8000, time: 4 },
  { lon: 116.900, lat: 39.770, alt: 10000, time: 5 },    // 达到巡航高度
  { lon: 117.000, lat: 39.680, alt: 10500, time: 6 },
  { lon: 117.120, lat: 39.600, alt: 10500, time: 7 },
  { lon: 117.240, lat: 39.520, alt: 10500, time: 8 },
  { lon: 117.350, lat: 39.440, alt: 10500, time: 9 },
  { lon: 117.460, lat: 39.360, alt: 10500, time: 10 },   // 故障发生点 - 开始偏离航线
];

// 坠落轨迹 - 飞机失控后急速下降 (开始偏离航线)
export const crashPath = [
  { lon: 117.480, lat: 39.340, alt: 10200, time: 10.5 },  // 开始出现异常
  { lon: 117.510, lat: 39.310, alt: 9000, time: 11 },
  { lon: 117.540, lat: 39.280, alt: 7500, time: 11.5 },
  { lon: 117.560, lat: 39.260, alt: 6000, time: 12 },
  { lon: 117.580, lat: 39.240, alt: 4500, time: 12.5 },
  { lon: 117.590, lat: 39.225, alt: 3500, time: 13 },
  { lon: 117.600, lat: 39.210, alt: 2500, time: 13.5 },
  { lon: 117.610, lat: 39.195, alt: 1500, time: 14 },
  { lon: 117.615, lat: 39.185, alt: 800, time: 14.6 },
  { lon: 117.618, lat: 39.180, alt: 400, time: 15 },
  { lon: 117.620, lat: 39.178, alt: 200, time: 15.2 },
  { lon: 117.622, lat: 39.177, alt: 0, time: 15.5 },     // 坠毁点
];

// 坠毁地点
export const crashSite = {
  longitude: 117.622,
  latitude: 39.177,
};

// 完整轨迹 = 飞行路径 + 坠落路径
export const fullPath = [...flightPath, ...crashPath.filter(
  p => p.time > flightPath[flightPath.length - 1].time
)];
