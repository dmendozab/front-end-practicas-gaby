import Vue from 'vue'
import VueRouter from 'vue-router'

// Importar componentes principales
import WelcomePage from './components/WelcomePage.vue'
import SecurityModule from './components/SecurityModule.vue'
import ConfigurationModule from './components/ConfigurationModule.vue'

// Importar secciones de seguridad
import Users from './components/security/Users.vue'
import Roles from './components/security/Roles.vue'
import Permissions from './components/security/Permissions.vue'
import Configuration from './components/security/Configuration.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: WelcomePage
  },
  {
    path: '/seguridad',
    component: SecurityModule,
    children: [
      {
        path: '',
        redirect: 'usuarios'
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: Users
      },
      {
        path: 'roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: 'permisos',
        name: 'Permisos',
        component: Permissions
      },
      {
        path: 'configuracion',
        name: 'ConfiguracionSeguridad',
        component: Configuration
      }
    ]
  },
  {
    path: '/configuracion',
    name: 'Configuracion',
    component: ConfigurationModule
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router