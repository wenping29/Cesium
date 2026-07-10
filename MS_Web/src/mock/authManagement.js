import Mock from 'mockjs'

const { Random } = Mock

// 模拟角色数据
let roleData = [
  {
    id: 'role-1',
    name: '超级管理员',
    description: '拥有所有权限',
    menuIds: ['1', '1-1', '1-2', '1-3', '1-4', '2', '3', '4', '4-1', '4-2', '4-3', '5', '5-1', '5-2', '5-3', '5-4', '6', '6-1', '6-2', '6-3', '6-4', '7', '7-1', '7-2', '7-3', '7-4', '8', '8-1', '8-2', '8-3', '10', '10-1', '10-2', '10-3', '10-4', '11', '11-1', '11-2', '11-3', '11-4', '11-5', '11-6', '11-7', '11-8', '11-9', '11-10'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role-2',
    name: '管理员',
    description: '拥有大部分管理权限',
    menuIds: ['1', '1-1', '1-2', '2', '3', '4', '4-1', '4-2', '5', '5-1', '5-2', '6', '6-1', '6-2', '7', '7-1', '7-2', '8', '8-1', '8-2'],
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'role-3',
    name: '普通用户',
    description: '普通用户权限',
    menuIds: ['1', '1-1', '1-2', '1-3', '2', '3', '4', '4-1', '5', '5-1', '5-2'],
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'role-4',
    name: '访客',
    description: '只读权限',
    menuIds: ['1', '1-1', '2', '3'],
    createdAt: '2024-02-01T00:00:00Z'
  }
]

// 模拟部门数据
let departmentData = [
  {
    id: 'dept-1',
    name: '总公司',
    code: 'HQ',
    parentId: null,
    sortOrder: 1,
    leader: '张总',
    phone: '13800138001',
    email: 'zhangzong@company.com',
    address: '北京市朝阳区',
    isActive: true,
    userCount: 50,
    children: [
      {
        id: 'dept-1-1',
        name: '技术部',
        code: 'TECH',
        parentId: 'dept-1',
        sortOrder: 1,
        leader: '李经理',
        phone: '13800138002',
        email: 'limanager@company.com',
        address: '北京市朝阳区',
        isActive: true,
        userCount: 20,
        children: []
      },
      {
        id: 'dept-1-2',
        name: '产品部',
        code: 'PROD',
        parentId: 'dept-1',
        sortOrder: 2,
        leader: '王经理',
        phone: '13800138003',
        email: 'wangmanager@company.com',
        address: '北京市朝阳区',
        isActive: true,
        userCount: 10,
        children: []
      },
      {
        id: 'dept-1-3',
        name: '运营部',
        code: 'OPS',
        parentId: 'dept-1',
        sortOrder: 3,
        leader: '赵经理',
        phone: '13800138004',
        email: 'zhaomanager@company.com',
        address: '北京市朝阳区',
        isActive: true,
        userCount: 15,
        children: []
      }
    ]
  },
  {
    id: 'dept-2',
    name: '上海分公司',
    code: 'SH',
    parentId: null,
    sortOrder: 2,
    leader: '陈总',
    phone: '13800138005',
    email: 'chenzong@company.com',
    address: '上海市浦东新区',
    isActive: true,
    userCount: 30,
    children: [
      {
        id: 'dept-2-1',
        name: '销售部',
        code: 'SALES',
        parentId: 'dept-2',
        sortOrder: 1,
        leader: '刘经理',
        phone: '13800138006',
        email: 'liumanager@company.com',
        address: '上海市浦东新区',
        isActive: true,
        userCount: 20,
        children: []
      }
    ]
  }
]

// 模拟用户数据
let userData = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@company.com',
    phone: '13800138000',
    departmentId: 'dept-1',
    departmentName: '总公司',
    roles: ['超级管理员'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    username: 'zhangsan',
    email: 'zhangsan@company.com',
    phone: '13800138007',
    departmentId: 'dept-1-1',
    departmentName: '技术部',
    roles: ['管理员'],
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'user-3',
    username: 'lisi',
    email: 'lisi@company.com',
    phone: '13800138008',
    departmentId: 'dept-1-2',
    departmentName: '产品部',
    roles: ['普通用户'],
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'user-4',
    username: 'wangwu',
    email: 'wangwu@company.com',
    phone: '13800138009',
    departmentId: 'dept-2-1',
    departmentName: '销售部',
    roles: ['普通用户', '访客'],
    isActive: false,
    createdAt: '2024-02-01T00:00:00Z'
  }
]

// 递归构建部门树
const buildDepartmentTree = (depts, parentId = null) => {
  return depts
    .filter(d => d.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(d => ({
      ...d,
      children: buildDepartmentTree(depts, d.id)
    }))
}

// 递归扁平化菜单/部门
const flattenData = (data, result = []) => {
  if (Array.isArray(data)) {
    data.forEach(item => {
      result.push({ ...item, children: undefined })
      if (item.children && item.children.length > 0) {
        flattenData(item.children, result)
      }
    })
  }
  return result
}

// 角色 API
Mock.mock('/api/role', 'get', () => {
  return roleData
})

Mock.mock('/api/role', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newRole = {
    id: Random.guid(),
    name: body.name,
    description: body.description || '',
    menuIds: body.menuIds || [],
    createdAt: new Date().toISOString()
  }
  roleData.push(newRole)
  return newRole
})

Mock.mock(/\/api\/role\/[\w-]+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  const role = roleData.find(r => r.id === id)
  if (role) {
    return role
  }
  return { code: 404, message: 'Role not found' }
})

Mock.mock(/\/api\/role\/[\w-]+/, 'put', (options) => {
  const id = options.url.split('/').pop()
  const body = JSON.parse(options.body)
  const role = roleData.find(r => r.id === id)
  if (role) {
    role.name = body.name
    role.description = body.description || ''
    role.menuIds = body.menuIds || []
    return role
  }
  return { code: 404, message: 'Role not found' }
})

Mock.mock(/\/api\/role\/[\w-]+/, 'delete', (options) => {
  const id = options.url.split('/').pop()
  const index = roleData.findIndex(r => r.id === id)
  if (index !== -1) {
    roleData.splice(index, 1)
  }
  return { message: '删除成功' }
})

// 部门 API
const getAllFlatDepartments = () => flattenData(departmentData)

Mock.mock('/api/department', 'get', () => {
  return departmentData
})

Mock.mock('/api/department/all', 'get', () => {
  return departmentData
})

Mock.mock('/api/department', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newDept = {
    id: Random.guid(),
    name: body.name,
    code: body.code || '',
    parentId: body.parentId || null,
    sortOrder: body.sortOrder || 0,
    leader: body.leader || '',
    phone: body.phone || '',
    email: body.email || '',
    address: body.address || '',
    isActive: body.isActive !== false,
    userCount: 0,
    children: []
  }
  if (newDept.parentId) {
    const flatDepts = getAllFlatDepartments()
    const parent = flatDepts.find(d => d.id === newDept.parentId)
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newDept)
    }
  } else {
    departmentData.push(newDept)
  }
  return newDept
})

Mock.mock(/\/api\/department\/[\w-]+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  const flatDepts = getAllFlatDepartments()
  const dept = flatDepts.find(d => d.id === id)
  if (dept) {
    return dept
  }
  return { code: 404, message: 'Department not found' }
})

Mock.mock(/\/api\/department\/[\w-]+/, 'put', (options) => {
  const id = options.url.split('/').pop()
  const body = JSON.parse(options.body)
  const flatDepts = getAllFlatDepartments()
  const dept = flatDepts.find(d => d.id === id)
  if (dept) {
    dept.name = body.name
    dept.code = body.code || ''
    dept.sortOrder = body.sortOrder || 0
    dept.leader = body.leader || ''
    dept.phone = body.phone || ''
    dept.email = body.email || ''
    dept.address = body.address || ''
    if (body.isActive !== undefined) {
      dept.isActive = body.isActive
    }
    // 处理父部门变更
    if (body.parentId !== dept.parentId) {
      // 从旧位置移除
      const removeFromTree = (items, targetId) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === targetId) {
            items.splice(i, 1)
            return true
          }
          if (items[i].children && removeFromTree(items[i].children, targetId)) {
            return true
          }
        }
        return false
      }
      if (dept.parentId) {
        removeFromTree(departmentData, id)
      } else {
        const idx = departmentData.findIndex(d => d.id === id)
        if (idx !== -1) departmentData.splice(idx, 1)
      }
      // 添加到新位置
      dept.parentId = body.parentId || null
      if (dept.parentId) {
        const newParent = getAllFlatDepartments().find(d => d.id === dept.parentId)
        if (newParent) {
          newParent.children = newParent.children || []
          newParent.children.push(dept)
        }
      } else {
        departmentData.push(dept)
      }
    }
    return dept
  }
  return { code: 404, message: 'Department not found' }
})

Mock.mock(/\/api\/department\/[\w-]+/, 'delete', (options) => {
  const id = options.url.split('/').pop()
  const removeFromTree = (items, targetId) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === targetId) {
        items.splice(i, 1)
        return true
      }
      if (items[i].children && removeFromTree(items[i].children, targetId)) {
        return true
      }
    }
    return false
  }
  removeFromTree(departmentData, id)
  return { message: '删除成功' }
})

// 用户 API
Mock.mock('/api/user', 'get', () => {
  return userData
})

Mock.mock('/api/user', 'post', (options) => {
  const body = JSON.parse(options.body)
  const flatDepts = getAllFlatDepartments()
  const dept = flatDepts.find(d => d.id === body.departmentId)
  const newUser = {
    id: Random.guid(),
    username: body.username,
    email: body.email,
    phone: body.phone || '',
    departmentId: body.departmentId || '',
    departmentName: dept?.name || '',
    roles: body.roles || [],
    isActive: true,
    createdAt: new Date().toISOString()
  }
  userData.push(newUser)
  return newUser
})

Mock.mock(/\/api\/user\/[\w-]+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  const user = userData.find(u => u.id === id)
  if (user) {
    return user
  }
  return { code: 404, message: 'User not found' }
})

Mock.mock(/\/api\/user\/[\w-]+/, 'put', (options) => {
  const id = options.url.split('/').pop()
  const body = JSON.parse(options.body)
  const user = userData.find(u => u.id === id)
  if (user) {
    user.username = body.username
    user.email = body.email
    if (body.phone !== undefined) user.phone = body.phone
    if (body.departmentId !== undefined) {
      user.departmentId = body.departmentId
      const flatDepts = getAllFlatDepartments()
      const dept = flatDepts.find(d => d.id === body.departmentId)
      user.departmentName = dept?.name || ''
    }
    if (body.roles !== undefined) user.roles = body.roles
    if (body.isActive !== undefined) user.isActive = body.isActive
    return user
  }
  return { code: 404, message: 'User not found' }
})

Mock.mock(/\/api\/user\/[\w-]+/, 'delete', (options) => {
  const id = options.url.split('/').pop()
  const index = userData.findIndex(u => u.id === id)
  if (index !== -1) {
    userData.splice(index, 1)
  }
  return { message: '删除成功' }
})

Mock.mock(/\/api\/user\/[\w-]+\/roles\/[\w-]+/, 'post', (options) => {
  const parts = options.url.split('/')
  const userId = parts[parts.length - 3]
  const roleName = decodeURIComponent(parts[parts.length - 1])
  const user = userData.find(u => u.id === userId)
  if (user) {
    if (!user.roles.includes(roleName)) {
      user.roles.push(roleName)
    }
    return user
  }
  return { code: 404, message: 'User not found' }
})

Mock.mock(/\/api\/user\/[\w-]+\/roles\/[\w-]+/, 'delete', (options) => {
  const parts = options.url.split('/')
  const userId = parts[parts.length - 3]
  const roleName = decodeURIComponent(parts[parts.length - 1])
  const user = userData.find(u => u.id === userId)
  if (user) {
    user.roles = user.roles.filter(r => r !== roleName)
    return user
  }
  return { code: 404, message: 'User not found' }
})
