module.exports = { //apptwaste
	PROJECT_COLOR: '#06C9A3',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#06C9A3',

	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
	],

	NEWS_NAME: '内容',
	NEWS_CATE: [
		{ id: 1, title: '通知公告', style: 'leftpic' },
		{ id: 2, title: '垃圾分类知识', style: 'leftpic' },
	],
	NEWS_FIELDS: [

	],

	MEET_NAME: '垃圾回收项目',
	MEET_CATE: [
		{ id: 1, title: '大件垃圾' },
		{ id: 2, title: '建筑垃圾' },
		{ id: 3, title: '衣服回收' },
		{ id: 4, title: '可回收物品' },
		{ id: 5, title: '工业固废' },
		{ id: 6, title: '其他垃圾' },
	],
	MEET_CAN_NULL_TIME: false, // 是否允许有无时段的日期保存和展示
	MEET_FIELDS: [
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'desc', title: '简介', type: 'textarea', max: 100, must: true },
		{ mark: 'content', title: '详情', type: 'content', must: true }, 
		 
	],

	MEET_JOIN_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, min: 2, max: 30, edit: false },
		{ mark: 'phone', type: 'text', len: 11, title: '手机号', must: true, edit: false },
		{ mark: 'address', type: 'textarea', max: 500, title: '地址', must: true, edit: false },
	],

	// 时间默认设置
	MEET_NEW_NODE:
	{
		mark: 'mark-no', start: '10:00', end: '10:59', limit: 20, isLimit: true, status: 1,
		stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
	},
	MEET_NEW_NODE_DAY: [
		{
			mark: 'mark-am', start: '09:00', end: '11:59', limit: 20, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		},
		{
			mark: 'mark-pm', start: '14:00', end: '18:59', limit: 20, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		}
		,
		{
			mark: 'mark-pm', start: '19:00', end: '23:59', limit: 20, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		}
	], 


}