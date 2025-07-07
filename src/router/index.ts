import { createRouter, createWebHistory } from 'vue-router'
// import index from '@/views/index.vue'
import ClockView from '@/views/ClockView.vue'
import CalendarView from '@/views/CalendarView.vue'
import StatsView from '@/views/StatsView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/clockView'
    },
    {
      path: '/clockView',
      name: 'ClockView',
      component: ClockView
    },
    {
      path: '/calendarView',
      name: 'CalendarView',
      component: CalendarView
    },
    {
      path: '/statsView',
      name: 'StatsView',
      component: StatsView
    },
    {
      path: '/settnigsView',
      name: 'SettingsView',
      component: SettingsView
    },
  ],
})

export default router
