import Mock from 'mockjs'
import './user'
import './auth'

Mock.setup({
  timeout: '200-600',
})

console.log('Mockjs initialized successfully')
console.log('Mocked routes:', Object.keys((Mock as any)._mocked || {}))

export default Mock
