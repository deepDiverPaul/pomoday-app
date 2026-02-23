import { createRouter, createWebHistory } from 'vue-router'
import ListScreen from './screens/ListScreen.vue'
import SettingsScreen from './screens/SettingsScreen.vue'

const routes = [
  { path: '/', component: ListScreen },
  { path: '/settings', component: SettingsScreen },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
