const ProjectBiz = require('../../../biz/project_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js'); 

Page({

	data: {
		showSearch: true,
		isLoad: false,
		_params: null,

		sortMenus: [],
		sortItems: [],

		search: '', 
	},

	/**
		* 生命周期函数--监听页面加载
		*/
	onLoad: function (options) {
		ProjectBiz.initPage(this); 
  

		this._getSearchMenu();

	}, 

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	_getSearchMenu:   function () {
 
		let sortItem1 = [];

		sortItem1 = [
			{ label: '发贴数', type: 'sort', value: 'USER_PRODUCT_CNT|desc' },
			{ label: '最近发贴', type: 'sort', value: 'USER_PRODUCT_TIME|desc' }, 
			{ label: '关注数', type: 'sort', value: 'USER_MY_FAV_CNT|desc' },
			{ label: '粉丝数', type: 'sort', value: 'USER_FAV_CNT|desc' }, 
			{ label: '浏览数', type: 'sort', value: 'USER_VIEW_CNT|desc' }, 
		];


		let sortItems = [];
		let sortMenus = sortItem1;
		this.setData({
			sortItems,
			sortMenus,
			isLoad: true
		})

	}

})