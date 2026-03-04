import { createRouter, createWebHistory } from 'vue-router'
import ListScreen from './screens/ListScreen.vue'

const routes = [
  { path: '/', component: ListScreen },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
