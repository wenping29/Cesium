import Mock from 'mockjs'

const { Random } = Mock

Mock.mock('/api/auth/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  if (username !== 'admin' || password !== 'asd123') {
    return { code: 401, message: 'Invalid username or password' }
  }
  return {
    code: 200,
    message: 'Login successful',
    data: {
      token: Random.guid(),
      user: {
        id: Random.guid(),
        username,
        name: 'Admin',
        avatar: Random.image('80x80', Random.color(), '#fff', 'A'),
      },
    },
  }
})

Mock.mock('/api/auth/logout', 'post', () => ({
  code: 200,
  message: 'Logout successful',
}))

Mock.mock('/api/auth/me', 'get', () => ({
  code: 200,
  message: 'success',
  data: {
    id: Random.guid(),
    username: Random.string(4, 10),
    name: Random.cname(),
    avatar: Random.image('80x80', Random.color(), '#fff', Random.first()),
  },
}))
