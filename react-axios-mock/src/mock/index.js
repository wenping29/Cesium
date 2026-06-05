import Mock from 'mockjs'

// MockJS fails to propagate xhr.responseType to the native XHR when proxying
// non-matching requests. This breaks Cesium terrain tiles (ArrayBuffer responses).
(function patchMockXHR() {
  const MockXHR = window.XMLHttpRequest
  if (!MockXHR?.prototype) return

  delete MockXHR.prototype.responseType

  Object.defineProperty(MockXHR.prototype, 'responseType', {
    get() {
      return this._mockResponseType ?? ''
    },
    set(v) {
      this._mockResponseType = v
      if (this.custom?.xhr) {
        try { this.custom.xhr.responseType = v } catch { /* native XHR may reject invalid responseType */ }
      }
    },
    configurable: true,
  })

  const origOpen = MockXHR.prototype.open
  if (origOpen) {
    MockXHR.prototype.open = function (...args) {
      origOpen.apply(this, args)
      if (this._mockResponseType && this.custom?.xhr) {
        try { this.custom.xhr.responseType = this._mockResponseType } catch { /* native XHR may reject invalid responseType */ }
      }
    }
  }
})()

import './cesium'
import './auth'
import './bim'
import './hexgrid'
import './layers'
import './earthquake'
import './airquality'
import './typhoon'
import './wind'
import './imageToBim'

const { Random } = Mock

Random.extend({
  fruit: () => ['apple', 'banana', 'orange', 'grape', 'watermelon'][Random.natural(0, 4)],
})

Mock.mock('/api/users', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: Array.from({ length: 10 }, (_, i) => ({
      id: Random.guid(),
      name: Random.cname(),
      age: Random.natural(18, 60),
      email: Random.email(),
      fruit: Random.fruit(),
      avatar: Random.image('100x100', Random.color(), '#fff', Random.first()),
      created_at: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    })),
  }
})

Mock.mock('/api/users', 'post', (options) => {
  const body = JSON.parse(options.body)
  return {
    code: 200,
    message: '创建成功',
    data: { id: Random.guid(), ...body, created_at: Random.datetime('yyyy-MM-dd HH:mm:ss') },
  }
})

Mock.mock(/\/api\/users\/\w+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  return {
    code: 200,
    message: 'success',
    data: {
      id,
      name: Random.cname(),
      age: Random.natural(18, 60),
      email: Random.email(),
      avatar: Random.image('100x100', Random.color(), '#fff', Random.first()),
      created_at: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    },
  }
})
