import Mock from 'mockjs'

const STATIONS = [
  { name: '北京奥体中心', lat: 39.99, lng: 116.42 },
  { name: '上海徐家汇', lat: 31.19, lng: 121.44 },
  { name: '广州天河', lat: 23.13, lng: 113.33 },
  { name: '深圳南山', lat: 22.53, lng: 113.93 },
  { name: '成都锦江', lat: 30.65, lng: 104.07 },
  { name: '杭州西湖', lat: 30.27, lng: 120.15 },
  { name: '武汉光谷', lat: 30.50, lng: 114.42 },
  { name: '西安雁塔', lat: 34.22, lng: 108.95 },
  { name: '南京鼓楼', lat: 32.07, lng: 118.78 },
  { name: '重庆解放碑', lat: 29.56, lng: 106.57 },
]

const LEVELS = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染']

function calcLevel(aqi) {
  if (aqi <= 50) return LEVELS[0]
  if (aqi <= 100) return LEVELS[1]
  if (aqi <= 150) return LEVELS[2]
  if (aqi <= 200) return LEVELS[3]
  if (aqi <= 300) return LEVELS[4]
  return LEVELS[5]
}

const aqData = STATIONS.map((s, i) => {
  const aqi = Mock.Random.natural(20, 300)
  return {
    id: `aq_${String(i + 1).padStart(3, '0')}`,
    station: s.name,
    lat: s.lat,
    lng: s.lng,
    aqi,
    level: calcLevel(aqi),
    pm25: Mock.Random.natural(5, 200),
    pm10: Mock.Random.natural(10, 300),
    o3: Mock.Random.natural(10, 200),
    no2: Mock.Random.natural(5, 100),
    time: Mock.Random.now('HH:mm:ss'),
  }
})

Mock.mock(/\/api\/airquality\/current/, 'get', () => ({
  code: 200,
  message: 'success',
  data: aqData,
}))
