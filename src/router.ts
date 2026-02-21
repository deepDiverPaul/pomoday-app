import { createWebHistory, createRouter } from 'vue-router'
import ListScreen from './screens/ListScreen.vue';
import SettingsScreen from './screens/SettingsScreen.vue';
import CreateScreen from './screens/CreateScreen.vue';


const routes = [
  { path: '/', component: ListScreen },
  { path: '/settings', component: SettingsScreen },
  { path: '/create', component: CreateScreen }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
