import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/user/Users.vue';
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/home/welcome', children: [
      { path: 'welcome', component: Welcome },
      { path: 'users', component: Users },
      {path:'rights',component:Rights},
      {path:'roles',component:Roles},
      {path:'goods',component:Welcome},
      {path:'params',component:Welcome},
      {path:'categories',component:Welcome},
      {path:'orders',component:Welcome},
      {path:'reports',component:Welcome},
      
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

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
