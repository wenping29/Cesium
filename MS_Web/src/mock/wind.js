import Mock from 'mockjs'

const REGIONS = [
  { name: '东海海域', lat: 28.5, lng: 124.0 },
  { name: '南海海域', lat: 18.0, lng: 114.0 },
  { name: '黄海海域', lat: 35.0, lng: 123.0 },
  { name: '渤海海域', lat: 38.5, lng: 119.5 },
  { name: '台湾海峡', lat: 24.5, lng: 119.0 },
  { name: '太平洋远海', lat: 22.0, lng: 130.0 },
  { name: '日本海', lat: 38.0, lng: 135.0 },
  { name: '菲律宾以东', lat: 15.0, lng: 128.0 },
]

const windData = REGIONS.map((r, i) => ({
  id: `wd_${String(i + 1).padStart(3, '0')}`,
  region: r.name,
  lat: r.lat,
  lng: r.lng,
  direction: Mock.Random.natural(0, 359),
  speed: Mock.Random.float(2.0, 15.0, 1, 1),
  gust: Mock.Random.float(3.0, 22.0, 1, 1),
  time: Mock.Random.now('HH:mm:ss'),
}))

Mock.mock(/\/api\/wind\/current/, 'get', () => ({
  code: 200,
  message: 'success',
  data: windData,
}))
