import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login'
import Module from '@/pages/module'
import customapp from '@/pages/customApp'
import microapp from '@/pages/microApp'
import microservice from '@/pages/microSer'
import userManage from '@/pages/userManage'
import devNorms from '@/pages/devNorms'

import urlDetail from '@/pages/urlDetail'
import micappDetail from '@/pages/microAppDetail'
// import micappDetail from '@/components/commonAppDetail'
import examineMs from '@/components/commonExamineMs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/module',
      name: 'Module',
      component: Module,
    },
    {
      path: '/customapp',
      name: 'customapp',
      component: customapp,
    },
    {
      path: '/microapp',
      name: 'microapp',
      component: microapp,
    },
    {
      path: '/microservice',
      name: 'microservice',
      component: microservice,
    },
    {
      path: '/usermanage',
      name: 'usermanage',
      component: userManage
    },
    {
      path: '/devNorms/:type',
      name: 'devNorms',
      component: devNorms
    },
    {
      path: '/examineMs',
      name: 'examineMs',
      component: examineMs
    },
    {
      path: '/micappDetail/:id',
      name: 'micappDetail',
      component: micappDetail
    },
    {
      path: '/urlDetail/:url',
      name: 'urlDetail',
      component: urlDetail
    },
  ]
})
