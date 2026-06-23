import Vue from 'vue'
import VueRouter from 'vue-router'
import MarketList from '@/views/MarketList.vue'
import MarketConfig from '@/views/MarketConfig.vue'
import FinancialInit from '@/views/FinancialInit.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/financial-init' },
  { path: '/market-list', component: MarketList },
  { path: '/market-config/:id', component: MarketConfig },
  { path: '/financial-init', component: FinancialInit }
]

export default new VueRouter({
  mode: 'hash',
  routes
})
