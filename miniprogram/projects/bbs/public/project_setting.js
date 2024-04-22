module.exports = { //BBS
	PROJECT_COLOR: '#4C589A',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#4C589A',


	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' }
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [ 
		{ mark: 'sex', title: '性别', type: 'select', selectOptions: ['男', '女'], must: true },
		{ mark: 'desc', title: '签名档', type: 'text', must: true }, 
	],
	USER_CHECK_FORM: {
		name: 'formName|must|string|min:1|max:30|name=昵称',
		mobile: 'formMobile|must|mobile|name=手机',
		forms: 'formForms|array'
	},


	PRODUCT_NAME: '论坛',
	PRODUCT_CHECK: false, //贴子发布后是否要审核
	PRODUCT_CATE: [
		{ id: 1, title: '论坛', style: 'leftbig1' },

	],
	PRODUCT_FIELDS: [
		{ mark: 'content', title: '贴子内容', type: 'content', must: true }, 
	],

	CATE_NAME: '分类',
	CATE1_FIELDS: [  // 一级分类
		{ mark: 'cover', title: '封面图', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'haslevel', title: '是否有二级分类', type: 'switch', must: true },
		{ mark: 'desc', title: '简介', max: 35, type: 'textarea', must: true },
	],

	CATE2_FIELDS: [ // 二级分类

	],
 

	COMMENT_NAME: '评论',
	COMMENT_FIELDS: [
		{ mark: 'content', title: '评论内容', type: 'textarea', must: true },
		{ mark: 'img', title: '图片', type: 'image', min: 0, max: 8, must: false },

	],


}