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
        phone: '13800138000',
        email: 'admin@example.com',
        bio: 'I am the administrator',
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
    phone: '13800138000',
    email: 'admin@example.com',
    bio: 'I am the administrator',
    avatar: Random.image('80x80', Random.color(), '#fff', Random.first()),
  },
}))

Mock.mock('/api/auth/change-password', 'put', (options) => {
  const { currentPassword, newPassword } = JSON.parse(options.body)
  if (currentPassword !== 'asd123') {
    return { code: 400, message: 'Current password is incorrect' }
  }
  return {
    code: 200,
    message: 'Password changed successfully',
  }
})

Mock.mock('/api/auth/profile', 'put', (options) => {
  const body = JSON.parse(options.body)
  return {
    code: 200,
    message: 'Profile updated successfully',
    data: {
      id: Random.guid(),
      username: 'admin',
      name: body.name || 'Admin',
      phone: body.phone || '',
      email: body.email || '',
      bio: body.bio || '',
      avatar: body.avatar || Random.image('80x80', Random.color(), '#fff', 'A'),
    },
  }
})
