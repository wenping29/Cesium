import Mock from 'mockjs'

const { Random } = Mock

// 模拟菜单数据
let menuData = [
  {
    id: '1',
    name: '首页',
    path: '',
    icon: 'Home',
    parentId: null,
    sortOrder: 1,
    isVisible: true,
    permission: '',
    children: [
      {
        id: '1-1',
        name: '工作台',
        path: '/workbench',
        icon: 'Dashboard',
        parentId: '1',
        sortOrder: 1,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '1-2',
        name: '数据分析',
        path: '/analysis',
        icon: 'Analytics',
        parentId: '1',
        sortOrder: 2,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '1-3',
        name: '通知中心',
        path: '/notifications',
        icon: 'Notifications',
        parentId: '1',
        sortOrder: 3,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '1-4',
        name: '发送消息',
        path: '/send-notification',
        icon: 'Send',
        parentId: '1',
        sortOrder: 4,
        isVisible: true,
        permission: '',
        children: []
      }
    ]
  },
  {
    id: '2',
    name: '仪表盘',
    path: '/dashboard',
    icon: 'Dashboard',
    parentId: null,
    sortOrder: 2,
    isVisible: true,
    permission: '',
    children: []
  },
  {
    id: '3',
    name: '大屏展示',
    path: '/big-screen',
    icon: 'DesktopWindows',
    parentId: null,
    sortOrder: 3,
    isVisible: true,
    permission: '',
    children: []
  },
  {
    id: '4',
    name: '地图相关',
    path: '',
    icon: 'Map',
    parentId: null,
    sortOrder: 4,
    isVisible: true,
    permission: '',
    children: [
      {
        id: '4-1',
        name: 'Cesium地图',
        path: '/map',
        icon: 'Map',
        parentId: '4',
        sortOrder: 1,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '4-2',
        name: 'OpenLayer地图',
        path: '/openlayer-map',
        icon: 'Layers',
        parentId: '4',
        sortOrder: 2,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '4-3',
        name: 'Leaflet地图',
        path: '/leaflet-map',
        icon: 'MapOutlined',
        parentId: '4',
        sortOrder: 3,
        isVisible: true,
        permission: '',
        children: []
      }
    ]
  },
  {
    id: '5',
    name: '数据表格',
    path: '',
    icon: 'TableChart',
    parentId: null,
    sortOrder: 5,
    isVisible: true,
    permission: '',
    children: [
      {
        id: '5-1',
        name: '地震数据',
        path: '/earthquake-table',
        icon: 'Volcano',
        parentId: '5',
        sortOrder: 1,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '5-2',
        name: '台风数据',
        path: '/typhoon-table',
        icon: 'Storm',
        parentId: '5',
        sortOrder: 2,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '5-3',
        name: '风力数据',
        path: '/wind-table',
        icon: 'Waves',
        parentId: '5',
        sortOrder: 3,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '5-4',
        name: '空气质量',
        path: '/airquality-table',
        icon: 'Air',
        parentId: '5',
        sortOrder: 4,
        isVisible: true,
        permission: '',
        children: []
      }
    ]
  },
  {
    id: '6',
    name: '权限管理',
    path: '',
    icon: 'Settings',
    parentId: null,
    sortOrder: 6,
    isVisible: true,
    permission: 'admin',
    children: [
      {
        id: '6-1',
        name: '用户管理',
        path: '/user-management',
        icon: 'People',
        parentId: '6',
        sortOrder: 1,
        isVisible: true,
        permission: 'admin',
        children: []
      },
      {
        id: '6-2',
        name: '角色管理',
        path: '/role-management',
        icon: 'Shield',
        parentId: '6',
        sortOrder: 2,
        isVisible: true,
        permission: 'admin',
        children: []
      },
      {
        id: '6-3',
        name: '菜单管理',
        path: '/menu-management',
        icon: 'Menu',
        parentId: '6',
        sortOrder: 3,
        isVisible: true,
        permission: 'admin',
        children: []
      },
      {
        id: '6-4',
        name: '部门管理',
        path: '/department-management',
        icon: 'Business',
        parentId: '6',
        sortOrder: 4,
        isVisible: true,
        permission: 'admin',
        children: []
      }
    ]
  },
  {
    id: '7',
    name: '考勤管理',
    path: '',
    icon: 'Schedule',
    parentId: null,
    sortOrder: 7,
    isVisible: true,
    permission: '',
    children: [
      {
        id: '7-1',
        name: '打卡报表',
        path: '/attendance-report',
        icon: 'Description',
        parentId: '7',
        sortOrder: 1,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '7-2',
        name: '工时报表',
        path: '/workhour-report',
        icon: 'Timer',
        parentId: '7',
        sortOrder: 2,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '7-3',
        name: '休假报表',
        path: '/leave-report',
        icon: 'HolidayVillage',
        parentId: '7',
        sortOrder: 3,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '7-4',
        name: '年假报表',
        path: '/annual-leave-report',
        icon: 'BeachAccess',
        parentId: '7',
        sortOrder: 4,
        isVisible: true,
        permission: '',
        children: []
      }
    ]
  },
  {
    id: '8',
    name: '日志管理',
    path: '',
    icon: 'History',
    parentId: null,
    sortOrder: 8,
    isVisible: true,
    permission: '',
    children: [
      {
        id: '8-1',
        name: '登录日志',
        path: '/login-log-report',
        icon: 'History',
        parentId: '8',
        sortOrder: 1,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '8-2',
        name: '审计日志',
        path: '/audit-log-report',
        icon: 'FindInPage',
        parentId: '8',
        sortOrder: 2,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '8-3',
        name: '访客日志',
        path: '/visitor-log-report',
        icon: 'Visibility',
        parentId: '8',
        sortOrder: 3,
        isVisible: true,
        permission: '',
        children: []
      }
    ]
  },

  {
    id: '10',
    name: '其他',
    path: '',
    icon: 'Settings',
    parentId: null,
    sortOrder: 10,
    isVisible: true,
    permission: '',
    children: [
      {
        id: '10-1',
        name: '简介',
        path: '/settings/introduction',
        icon: 'Info',
        parentId: '10',
        sortOrder: 1,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '10-9',
        name: '影像转BIM',
        path: '/image-to-bim',
        icon: 'Insights',
        parentId: null,
        sortOrder: 9,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '10-2',
        name: '常见问题',
        path: '/settings/faq',
        icon: 'Help',
        parentId: '10',
        sortOrder: 2,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '10-3',
        name: '聊天',
        path: '/settings/chat',
        icon: 'Send',
        parentId: '10',
        sortOrder: 3,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '10-4',
        name: '文件管理',
        path: '/settings/files',
        icon: 'Storage',
        parentId: '10',
        sortOrder: 4,
        isVisible: true,
        permission: '',
        children: []
      }
    ]
  },
  {
    id: '11',
    name: '设置',
    path: '',
    icon: 'Settings',
    parentId: null,
    sortOrder: 11,
    isVisible: true,
    permission: '',
    children: [
      {
        id: '11-1',
        name: '简介',
        path: '/settings/introduction',
        icon: 'Info',
        parentId: '11',
        sortOrder: 1,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-2',
        name: '设置',
        path: '/settings',
        icon: 'Settings',
        parentId: '11',
        sortOrder: 2,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-3',
        name: '背景设置',
        path: '/settings/background',
        icon: 'Wallpaper',
        parentId: '11',
        sortOrder: 3,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-4',
        name: '看板',
        path: '/settings/dashboard',
        icon: 'DashboardOutlined',
        parentId: '11',
        sortOrder: 4,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-5',
        name: '项目',
        path: '/settings/projects',
        icon: 'Folder',
        parentId: '11',
        sortOrder: 5,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-6',
        name: '常见问题',
        path: '/settings/faq',
        icon: 'Help',
        parentId: '11',
        sortOrder: 6,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-7',
        name: '个人资料',
        path: '/settings/users',
        icon: 'People',
        parentId: '11',
        sortOrder: 7,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-8',
        name: '认证',
        path: '/settings/auth',
        icon: 'Security',
        parentId: '11',
        sortOrder: 8,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-9',
        name: '文件管理',
        path: '/settings/files',
        icon: 'Storage',
        parentId: '11',
        sortOrder: 9,
        isVisible: true,
        permission: '',
        children: []
      },
      {
        id: '11-10',
        name: '聊天',
        path: '/settings/chat',
        icon: 'Send',
        parentId: '11',
        sortOrder: 10,
        isVisible: true,
        permission: '',
        children: []
      }
    ]
  }
]

// 递归构建菜单树
const buildMenuTree = (menus, parentId = null) => {
  return menus
    .filter(m => m.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(m => ({
      ...m,
      children: buildMenuTree(menus, m.id)
    }))
}

// 获取扁平化的菜单列表
const flattenMenus = (menus, result = []) => {
  menus.forEach(m => {
    result.push({ ...m, children: undefined })
    if (m.children && m.children.length > 0) {
      flattenMenus(m.children, result)
    }
  })
  return result
}

// 模拟当前用户权限（这里简化处理）
const checkPermission = (permission) => {
  if (!permission) return true
  // 模拟 admin 用户有权限
  return true
}

// 获取当前用户的菜单（过滤不可见和无权限的）
const getUserMenus = () => {
  const filterMenus = (menus) => {
    return menus
      .filter(m => m.isVisible && checkPermission(m.permission))
      .map(m => ({
        ...m,
        children: filterMenus(m.children || [])
      }))
      .filter(m => m.path || (m.children && m.children.length > 0))
  }
  return filterMenus(menuData)
}

// 获取所有菜单（用于管理页面）
const getAllMenus = () => {
  return menuData
}

// GET /api/menu - 获取当前用户菜单
Mock.mock('/api/menu', 'get', () => {
  return getUserMenus()
})

// GET /api/menu/all - 获取所有菜单
Mock.mock('/api/menu/all', 'get', () => {
  return getAllMenus()
})

// GET /api/menu/:id - 获取单个菜单
Mock.mock(/\/api\/menu\/[\w-]+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  const flatMenus = flattenMenus(menuData)
  const menu = flatMenus.find(m => m.id === id)
  if (menu) {
    return menu
  }
  return { code: 404, message: 'Menu not found' }
})

// POST /api/menu - 创建菜单
Mock.mock('/api/menu', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newMenu = {
    id: Random.guid(),
    name: body.name,
    path: body.path || '',
    icon: body.icon || '',
    parentId: body.parentId || null,
    sortOrder: body.sortOrder || 0,
    isVisible: body.isVisible !== false,
    permission: body.permission || '',
    children: []
  }

  if (newMenu.parentId) {
    // 添加到父菜单的 children
    const flatMenus = flattenMenus(menuData)
    const parent = flatMenus.find(m => m.id === newMenu.parentId)
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newMenu)
    }
  } else {
    // 添加到根菜单
    menuData.push(newMenu)
  }

  return newMenu
})

// PUT /api/menu/:id - 更新菜单
Mock.mock(/\/api\/menu\/[\w-]+/, 'put', (options) => {
  const id = options.url.split('/').pop()
  const body = JSON.parse(options.body)
  const flatMenus = flattenMenus(menuData)
  const menu = flatMenus.find(m => m.id === id)

  if (menu) {
    menu.name = body.name
    menu.path = body.path || ''
    menu.icon = body.icon || ''
    menu.sortOrder = body.sortOrder || 0
    menu.isVisible = body.isVisible !== false
    menu.permission = body.permission || ''

    // 处理父菜单变更
    if (body.parentId !== menu.parentId) {
      // 从旧父菜单移除
      const findAndRemove = (menus, targetId) => {
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].id === targetId) {
            menus.splice(i, 1)
            return true
          }
          if (menus[i].children && findAndRemove(menus[i].children, targetId)) {
            return true
          }
        }
        return false
      }

      if (menu.parentId) {
        findAndRemove(menuData, id)
      } else {
        const idx = menuData.findIndex(m => m.id === id)
        if (idx !== -1) menuData.splice(idx, 1)
      }

      // 添加到新父菜单
      menu.parentId = body.parentId || null
      if (menu.parentId) {
        const newParent = flatMenus.find(m => m.id === menu.parentId)
        if (newParent) {
          newParent.children = newParent.children || []
          newParent.children.push(menu)
        }
      } else {
        menuData.push(menu)
      }
    }

    return menu
  }

  return { code: 404, message: 'Menu not found' }
})

// DELETE /api/menu/:id - 删除菜单
Mock.mock(/\/api\/menu\/[\w-]+/, 'delete', (options) => {
  const id = options.url.split('/').pop()

  const findAndRemove = (menus, targetId) => {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].id === targetId) {
        menus.splice(i, 1)
        return true
      }
      if (menus[i].children && findAndRemove(menus[i].children, targetId)) {
        return true
      }
    }
    return false
  }

  findAndRemove(menuData, id)
  return { message: '删除成功' }
})
