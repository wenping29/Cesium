import Mock from 'mockjs'

const REGIONS = [
  '日本本州东岸近海', '印尼苏门答腊', '智利中部', '墨西哥沿岸',
  '中国四川', '中国云南', '中国台湾', '中国新疆',
  '菲律宾群岛', '阿拉斯加', '伊朗', '土耳其',
  '新西兰', '秘鲁', '巴基斯坦', '阿富汗',
]

const eqData = []
for (let i = 1; i <= 80; i++) {
  const mag = Mock.Random.float(2.0, 9.0, 1, 1)
  eqData.push({
    id: `eq_${String(i).padStart(3, '0')}`,
    magnitude: mag,
    depth: Mock.Random.float(1.0, 50.0, 1, 1),
    time: Mock.Random.datetime('2020-01-01 00:00:00', '2024-12-31 23:59:59'),
    region: Mock.Random.pick(REGIONS),
    lat: Mock.Random.float(-60, 60, 2, 2),
    lng: Mock.Random.float(60, 150, 2, 2),
    description: `M${mag} 地震，震源深度 ${Mock.Random.float(1, 50, 1, 1)}km`,
  })
}
eqData.sort((a, b) => new Date(b.time) - new Date(a.time))

Mock.mock(/\/api\/earthquake\/historical/, 'get', () => ({
  code: 200,
  message: 'success',
  data: eqData,
}))
