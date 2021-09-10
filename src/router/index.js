import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/user/Users.vue';
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login,meta:{title:'登录页面'} },
  {
    path: '/home', component: Home, redirect: '/home/welcome', children: [
      { path: 'welcome', component: Welcome,meta:{title:'欢迎您！'} },
      { path: 'users', component: Users ,meta:{title:'用户列表'}},
      { path: 'rights', component: Rights,meta:{title:'角色列表'}},
      { path: 'roles', component: Roles,meta:{title:'权限列表'} },
      { path: 'goods', component: Welcome,meta:{title:'商品列表'}},
      { path: 'params', component: Welcome,meta:{title:'分类参数'} },
      { path: 'categories', component: Welcome ,meta:{title:'商品分类'}},
      { path: 'orders', component: Welcome,meta:{title:'订单列表'} },
      { path: 'reports', component: Welcome,meta:{title:'数据报表'} },

    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to,from,next)=>{
  document.title =`${to.meta.title} | 电商后台系统`;
  next();
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // from 从哪个页面而来 
  // to 将要访问的路径
  // next() 放行 next('/login') 强制跳转

  // 如果用户去登录页面，直接放行
  if (to.path === '/login') next();
  // 如果用户去其他页面，则判断他是否登录 (是否存在token)
  else {
    const tokenStr = window.sessionStorage.getItem('token');
    if (tokenStr) next(); //存在token 放行
    else {
      // 否则跳转到登录页面
      next('/login');
    }
  }
});

export default router;
