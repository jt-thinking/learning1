export default [
  {
    path: 'index',
    name: 'index',
    meta: {
      icon: 'fa-tachometer',
      label: '主页',
    },
  },
  {
    path: 'cert',
    name: 'cert',
    meta: {
      icon: 'fa-check-square-o',
      label: '审核',
    }
  },
  {
    name: 'doctor',
    meta: {
      icon: 'fa-user-md',
      label: '医生',
      expanded: false
    },
    children: [
      {
        name: 'doctor-list',
        path: '/doctor-list',
        meta: {
          label: '名医录',
        },
      },
      {
        name: 'doctor-top',
        path: '/doctor-top',
        meta: {
          label: '济世榜',
        },
      },
    ]
  },
  {
    path: '/sick',
    name: 'sick',
    meta: {
      icon: 'fa-heartbeat',
      label: '患者',
    }
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      icon: 'fa-credit-card',
      label: '订单',
    }
  },
  {
    path: '/jiesuan',
    name: 'jiesuan',
    meta: {
      icon: 'fa-jpy',
      label: '结算',
    }
  },
  {
    name: 'set',
    meta: {
      icon: 'fa-cog',
      label: '设置',
      expanded: false
    },
    children: [
      {
        name: 'set-spread',
        path: '/set-spread',
        meta: {
          label: '推广管理',
        },
      },
      {
        name: 'set-refund',
        path: '/set-refund',
        meta: {
          label: '扣款管理',
        },
      },
      {
        name: 'set-balance',
        path: '/set-balance',
        meta: {
          label: '结算管理',
        },
      },
      {
        name: 'set-royalty',
        path: '/set-royalty',
        meta: {
          label: '分成设置',
        },
      },

      {
        name: 'depart',
        path: '/depart',
        meta: {
          label: '科室设置',
        },
      },
      {
        name: 'hospital',
        path: '/set-hospital',
        meta: {
            label: '医院管理',
        },
      }
    ]
  },
  // {
  //   label: '设置',
  //   icon: 'fa-cog',
  //   expanded: true,
  //   subMenu: [
  //     {
  //       link: 'spread',
  //       label: '推广管理'
  //     },
  //     {
  //       link: 'refund',
  //       label: '退款管理'
  //     }
  //   ]
  // },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      icon: 'fa-sign-out',
      label: '退出',
    }

  }

]


// {
//   label: '审核',
//   icon: 'fa-check-square-o',
//   expanded: false,
//   subMenu: [
//     {
//       link: 'CertList',
//       label: '医生认证'
//     },
//     // {
//     //   link: 'Handsontable',
//     //   label: 'Handsontable'
//     // }
//   ]
// },