import Mock from 'mockjs'

const { Random } = Mock

const cities = [
  // { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
  // { name: 'Shanghai', lat: 31.2304, lng: 121.4737 },
  // { name: 'Guangzhou', lat: 23.1291, lng: 113.2644 },
  // { name: 'Shenzhen', lat: 22.5431, lng: 114.0579 },
  // { name: 'Chengdu', lat: 30.5728, lng: 104.0668 },
  // { name: 'Wuhan', lat: 30.5928, lng: 114.3055 },
  // { name: 'Xi\'an', lat: 34.3416, lng: 108.9398 },
  // { name: 'Hangzhou', lat: 30.2741, lng: 120.1551 },
  // { name: 'Nanjing', lat: 32.0603, lng: 118.7969 },
  // { name: 'Chongqing', lat: 29.4316, lng: 106.9123 },
]

const landmarks = [
  // { name: 'Great Wall', lat: 40.4319, lng: 116.5704, desc: 'One of the Seven Wonders of the World' },
  // { name: 'Forbidden City', lat: 39.9163, lng: 116.3972, desc: 'Imperial palace from Ming to Qing dynasty' },
  // { name: 'The Bund', lat: 31.2400, lng: 121.4900, desc: 'Famous waterfront area in Shanghai' },
  // { name: 'Victoria Harbour', lat: 22.2908, lng: 114.1732, desc: 'Natural harbour in Hong Kong' },
  // { name: 'Mount Everest', lat: 27.9881, lng: 86.9250, desc: 'World\'s highest mountain' },
]

Mock.mock('/api/cities', 'get', () => ({
  code: 200,
  message: 'success',
  data: cities,
}))

Mock.mock('/api/landmarks', 'get', () => ({
  code: 200,
  message: 'success',
  data: landmarks,
}))

Mock.mock('/api/cesium/token', 'get', () => ({
  code: 200,
  message: 'success',
  data: { token: null },
}))
