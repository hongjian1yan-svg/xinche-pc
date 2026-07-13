export const companies = [
  { id: 1, market: '泸州汽车交易市场', name: '泸州银行', owner: '张伟', ownerPhone: '13800001111', idNumber: '510106199001011234', remark: '标准质押合作银行', image: null, createdAt: '2026-01-10 09:00:00', creator: '王晓明' },
  { id: 2, market: '泸州汽车交易市场', name: '工商银行', owner: '李娜', ownerPhone: '13800002222', idNumber: '', remark: '', image: null, createdAt: '2026-02-15 10:30:00', creator: '王晓明' },
  { id: 3, market: '银地汽车出口', name: '招商银行', owner: '王芳', ownerPhone: '13800003333', idNumber: '510106198505056789', remark: '灵活质押产品合作方', image: null, createdAt: '2026-03-05 14:20:00', creator: '李芳' },
  { id: 4, market: '银地汽车出口', name: '平安银行', owner: '赵明', ownerPhone: '13800004444', idNumber: '', remark: '暂未开通自动放款', image: null, createdAt: '2026-04-22 11:10:00', creator: '王晓明' },
  { id: 5, market: '文昌利星二手车市场', name: '建设银行', owner: '刘洋', ownerPhone: '13800005555', idNumber: '510106199203038888', remark: '', image: null, createdAt: '2026-05-30 16:45:00', creator: '李芳' }
]

export const channels = [
  { id: 1, market: '泸州汽车交易市场', company: '泸州银行', channelName: '泸州银行-标准质押产品', loanRatio: 80, evalType: 'auto', platforms: ['精真估', '车300'], createdAt: '2026-01-12 10:23:05', hasOrders: true, logs: [{ time: '2026-01-12 10:23:05', user: '王晓明', type: '新增', detail: '创建资金渠道：泸州银行-标准质押产品' }] },
  { id: 2, market: '泸州汽车交易市场', company: '泸州银行', channelName: '泸州银行-灵活质押产品', loanRatio: 70, evalType: 'manual', platforms: [], createdAt: '2026-02-01 14:08:32', hasOrders: false, logs: [{ time: '2026-02-03 09:15:00', user: '李芳', type: '编辑', detail: '放款比例：65% → 70%' }, { time: '2026-02-01 14:08:32', user: '王晓明', type: '新增', detail: '创建资金渠道：泸州银行-灵活质押产品' }] },
  { id: 3, market: '泸州汽车交易市场', company: '工商银行', channelName: '工商银行-车贷产品A', loanRatio: 85, evalType: 'auto', platforms: ['大圣检测'], createdAt: '2026-02-18 09:40:11', hasOrders: false, logs: [{ time: '2026-02-18 09:40:11', user: '王晓明', type: '新增', detail: '创建资金渠道：工商银行-车贷产品A' }] },
  { id: 4, market: '泸州汽车交易市场', company: '招商银行', channelName: '招商银行-标准产品', loanRatio: 75, evalType: 'auto', platforms: ['精真估', '大圣检测', '车300'], createdAt: '2026-03-05 16:55:47', hasOrders: false, logs: [] },
  { id: 5, market: '泸州汽车交易市场', company: '平安银行', channelName: '平安银行-极速放款', loanRatio: 90, evalType: 'manual', platforms: [], createdAt: '2026-04-22 11:30:00', hasOrders: false, logs: [{ time: '2026-04-22 11:30:00', user: '王晓明', type: '新增', detail: '创建资金渠道：平安银行-极速放款' }] }
]

export const markets = [
  { id: '52a', name: '泸州汽车交易市场', phone: '0830-8888888', address: '四川省泸州市江阳区国窖大道88号泸州汽车交易市场', type: '场内市场', owner: '王晓明', ownerPhone: '0830-8888888', status: '正常', created: '2026-05-26' },
  { id: 'c48', name: '银地汽车出口', phone: '15852386068', address: '江苏省徐州市贾汪区金龙湖街道城东快速路88号银地二手车交易市场', type: '场外市场', owner: '刘总', ownerPhone: '15852386068', status: '正常', created: '2026-05-19' },
  { id: '6c4', name: '文昌利星二手车市场', phone: '0898-63265288', address: '海南省文昌市文城镇城南村委会下田村文昌日之星丰田汽车销售服务有限公司一层', type: '场内市场', owner: '纪总', ownerPhone: '0898-63265288', status: '正常', created: '2026-04-30' },
  { id: 'e5b', name: '中国(广州琶洲)汽车出口基地', phone: '13308350550', address: '广东省广州市海珠区琶洲街道新港东路30号琶洲岛', type: '场外市场', owner: '侯云', ownerPhone: '13308350550', status: '正常', created: '2026-04-23' },
  { id: '4a8', name: '广东中山鸿源二手车市场', phone: '13822727392', address: '广东省中山市西区街道中山市公安局交警支队车管所鸿源机动车登记服务壹加壹彩虹里', type: '场外市场', owner: '甘总', ownerPhone: '13822727392', status: '正常', created: '2026-04-14' },
  { id: '239', name: '上海车王二手车市场', phone: '13661868888', address: '上海市浦东新区惠南镇五角兴农城', type: '场内市场', owner: '许征', ownerPhone: '13661868888', status: '正常', created: '2026-04-09' },
  { id: 'd3b', name: '陕西车坛二弟汽车销售有限公司', phone: '18192892136', address: '陕西省西安市未央区三桥街道天台三路车坛老王品牌二手车', type: '场外市场', owner: '车坛二弟汽车', ownerPhone: '18192892136', status: '正常', created: '2026-03-25' }
]

export const marketOptions = [
  '泸州汽车交易市场',
  '银地汽车出口',
  '文昌利星二手车市场',
  '中国(广州琶洲)汽车出口基地',
  '广东中山鸿源二手车市场',
  '上海车王二手车市场',
  '陕西车坛二弟汽车销售有限公司'
]

export const platformOptions = ['精真估', '车300', '大圣检测']
