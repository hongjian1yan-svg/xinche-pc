import Vue from 'vue'
import Vuex from 'vuex'
import { companies as initCompanies, channels as initChannels, markets as initMarkets } from '@/data/mockData'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    companies: JSON.parse(JSON.stringify(initCompanies)),
    channels: JSON.parse(JSON.stringify(initChannels)),
    markets: JSON.parse(JSON.stringify(initMarkets))
  },
  mutations: {
    // 金融公司
    ADD_COMPANY(state, company) {
      const maxId = state.companies.reduce((max, c) => Math.max(max, c.id), 0)
      company.id = maxId + 1
      company.createdAt = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      company.creator = '王晓明'
      state.companies.push(company)
    },
    UPDATE_COMPANY(state, company) {
      const idx = state.companies.findIndex(c => c.id === company.id)
      if (idx !== -1) Vue.set(state.companies, idx, { ...state.companies[idx], ...company })
    },
    DELETE_COMPANY(state, id) {
      state.companies = state.companies.filter(c => c.id !== id)
    },

    // 资金渠道
    ADD_CHANNEL(state, channel) {
      const maxId = state.channels.reduce((max, c) => Math.max(max, c.id), 0)
      channel.id = maxId + 1
      const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      channel.createdAt = now
      channel.hasOrders = false
      channel.logs = [{ time: now, user: '王晓明', type: '新增', detail: `创建资金渠道：${channel.channelName}` }]
      state.channels.push(channel)
    },
    UPDATE_CHANNEL(state, channel) {
      const idx = state.channels.findIndex(c => c.id === channel.id)
      if (idx !== -1) {
        const old = state.channels[idx]
        const logs = [...(old.logs || [])]
        const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
        if (old.loanRatio !== channel.loanRatio) {
          logs.unshift({ time: now, user: '王晓明', type: '编辑', detail: `放款比例：${old.loanRatio}% → ${channel.loanRatio}%` })
        }
        if (old.evalType !== channel.evalType) {
          const typeMap = { auto: '自动评估', manual: '人工评估' }
          logs.unshift({ time: now, user: '王晓明', type: '编辑', detail: `车辆评估方式：${typeMap[old.evalType]} → ${typeMap[channel.evalType]}` })
        }
        Vue.set(state.channels, idx, { ...old, ...channel, logs })
      }
    },
    DELETE_CHANNEL(state, id) {
      state.channels = state.channels.filter(c => c.id !== id)
    },

    // 市场
    UPDATE_MARKET(state, market) {
      const idx = state.markets.findIndex(m => m.id === market.id)
      if (idx !== -1) Vue.set(state.markets, idx, { ...state.markets[idx], ...market })
    }
  },
  getters: {
    channelCountByCompany: (state) => (market, name) => {
      return state.channels.filter(c => c.market === market && c.company === name).length
    }
  }
})
