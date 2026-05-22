// 机场数据
export const airports = [
  {
    name: '北京首都国际机场',
    icao: 'ZBAA',
    longitude: 116.598,
    latitude: 40.073,
    runwayLength: 3800,
    runwayHeading: 0, // 跑道方向
  },
  {
    name: '北京大兴国际机场',
    icao: 'ZBAD',
    longitude: 116.411,
    latitude: 39.510,
    runwayLength: 3800,
    runwayHeading: 175,
  },
  {
    name: '天津滨海国际机场',
    icao: 'ZBTJ',
    longitude: 117.360,
    latitude: 39.128,
    runwayLength: 3600,
    runwayHeading: 160,
  },
  {
    name: '石家庄正定国际机场',
    icao: 'ZBSJ',
    longitude: 114.697,
    latitude: 38.281,
    runwayLength: 3400,
    runwayHeading: 150,
  },
];

// 雷达站位置 (部署在首都机场)
export const radarStation = {
  longitude: 116.598,
  latitude: 40.073,
  radius: 150000, // 150km 雷达扫描半径
};
