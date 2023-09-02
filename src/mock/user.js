/* eslint-disable @typescript-eslint/no-var-requires */

const MockJs = require('mockjs')

module.exports = {
  /**
   * 登录
   */
  'POST /base/api/login/v1.0': (req, res) => {
    setTimeout(() => {
      if (req.body.account === 'admin' && req.body.password === '123456') {
        const data = MockJs.mock({
          code: '10000',
          message: 'ok',
          body: {
            token: '@id'
          }
        })
        return res.json(data)
      } else {
        const data = MockJs.mock({
          code: '10001',
          message: '账号密码错误',
          body: null
        })
        return res.json(data)
      }
    }, 500)
  },
  /**
   * 刷新 token
   */
  'POST /base/api/refreshToken/v1.0': (req, res) => {
    setTimeout(() => {
      const data = MockJs.mock({
        code: '10000',
        message: 'ok',
        body: {
          token: '@id'
        }
      })
      return res.json(data)
    }, 500)
  },
  /**
   * 获取用户信息
   */
  'POST /base/api/getUserInfo/v1.0': (req, res) => {
    setTimeout(() => {
      const data = MockJs.mock({
        code: '10000',
        message: 'ok',
        body: {
          id: '@id',
          name: '@cname',
          avatar: '@image(40x40)',
          routes: [
            {
              name: 'System',
              path: '/system',
              alias: undefined,
              redirect: '/system/role/index',
              component: 'Layout',
              meta: {
                title: 'System',
                menuShow: true,
                menuIcon: 'Setting',
                buttons: []
              },
              children: [
                {
                  name: 'SystemRoleIndex',
                  path: 'role/index',
                  alias: undefined,
                  redirect: undefined,
                  component: '/system/role/index',
                  meta: {
                    title: 'SystemRoleIndex',
                    menuShow: true,
                    menuIcon: 'Lock',
                    buttons: ['add', 'edit', 'delete']
                  },
                  children: []
                },
                {
                  name: 'SystemRoleAdd',
                  path: 'role/add',
                  alias: undefined,
                  redirect: undefined,
                  component: '/system/role/add',
                  meta: {
                    title: 'SystemRoleAdd',
                    menuShow: false,
                    menuIcon: 'Lock',
                    buttons: []
                  },
                  children: []
                },
                {
                  name: 'SystemRoleEdit',
                  path: 'role/edit',
                  alias: undefined,
                  redirect: undefined,
                  component: '/system/role/edit',
                  meta: {
                    title: 'SystemRoleEdit',
                    menuShow: false,
                    menuIcon: 'Lock',
                    buttons: []
                  },
                  children: []
                },
                {
                  name: 'SystemUserIndex',
                  path: 'user/index',
                  alias: undefined,
                  redirect: undefined,
                  component: '/system/user/index',
                  meta: {
                    title: 'SystemUserIndex',
                    menuShow: true,
                    menuIcon: 'User',
                    buttons: ['add', 'edit', 'delete']
                  },
                  children: []
                },
                {
                  name: 'SystemUserAdd',
                  path: 'user/add',
                  alias: undefined,
                  redirect: undefined,
                  component: '/system/user/add',
                  meta: {
                    title: 'SystemUserAdd',
                    menuShow: false,
                    menuIcon: 'User',
                    buttons: []
                  },
                  children: []
                },
                {
                  name: 'SystemUserEdit',
                  path: 'user/edit',
                  alias: undefined,
                  redirect: undefined,
                  component: '/system/user/edit',
                  meta: {
                    title: 'SystemUserEdit',
                    menuShow: false,
                    menuIcon: 'User',
                    buttons: []
                  },
                  children: []
                }
              ]
            },
            {
              name: 'Media',
              path: '/media',
              alias: undefined,
              redirect: '/media/audio/index',
              component: 'Layout',
              meta: {
                title: 'Media',
                menuShow: true,
                menuIcon: 'Film',
                buttons: []
              },
              children: [
                {
                  name: 'MediaAudioIndex',
                  path: 'audio/index',
                  alias: undefined,
                  redirect: undefined,
                  component: '/media/audio/index',
                  meta: {
                    title: 'MediaAudioIndex',
                    menuShow: true,
                    menuIcon: 'Headset',
                    buttons: ['add', 'edit', 'delete']
                  },
                  children: []
                },
                {
                  name: 'MediaAudioAdd',
                  path: 'audio/add',
                  alias: undefined,
                  redirect: undefined,
                  component: '/media/audio/add',
                  meta: {
                    title: 'MediaAudioAdd',
                    menuShow: false,
                    menuIcon: 'Headset',
                    buttons: []
                  },
                  children: []
                },
                {
                  name: 'MediaAudioEdit',
                  path: 'audio/edit',
                  alias: undefined,
                  redirect: undefined,
                  component: '/media/audio/edit',
                  meta: {
                    title: 'MediaAudioEdit',
                    menuShow: false,
                    menuIcon: 'Headset',
                    buttons: []
                  },
                  children: []
                },
                {
                  name: 'MediaVideoIndex',
                  path: 'video/index',
                  alias: undefined,
                  redirect: undefined,
                  component: '/media/video/index',
                  meta: {
                    title: 'MediaVideoIndex',
                    menuShow: true,
                    menuIcon: 'VideoCamera',
                    buttons: ['add', 'edit', 'delete']
                  },
                  children: []
                },
                {
                  name: 'MediaVideoAdd',
                  path: 'video/add',
                  alias: undefined,
                  redirect: undefined,
                  component: '/media/video/add',
                  meta: {
                    title: 'MediaVideoAdd',
                    menuShow: false,
                    menuIcon: 'VideoCamera',
                    buttons: []
                  },
                  children: []
                },
                {
                  name: 'MediaVideoEdit',
                  path: 'video/edit',
                  alias: undefined,
                  redirect: undefined,
                  component: '/media/video/edit',
                  meta: {
                    title: 'MediaVideoEdit',
                    menuShow: false,
                    menuIcon: 'VideoCamera',
                    buttons: []
                  },
                  children: []
                }
              ]
            }
          ]
        }
      })
      return res.json(data)
    }, 500)
  }
}
