import Mock from 'mockjs'

Mock.mock('/api/auth/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)

  if (username === 'admin' && password === '123456') {
    return {
      code: 0,
      message: 'success',
      data: {
        token: Mock.Random.guid(),
        user: {
          id: 1,
          name: 'Admin',
          email: 'admin@example.com',
        },
      },
    }
  }

  return {
    code: 10001,
    message: '用户名或密码错误',
  }
})

Mock.mock('/api/auth/register', 'post', {
  code: 0,
  message: 'success',
  data: {
    token: '@guid',
    user: {
      id: '@integer(100, 999)',
      name: '@cname',
      email: '@email',
    },
  },
})
