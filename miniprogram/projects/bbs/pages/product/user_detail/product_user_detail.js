const ProjectBiz = require('../../../biz/project_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js'); 
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({

	data: {
		showSearch: true,
		isLoad: false,
		_params: null,

		sortMenus: [],
		sortItems: [],

		search: '',
		cate2List: []
	},

	/**
		* 生命周期函数--监听页面加载
		*/
	onLoad: function (options) {
		ProjectBiz.initPage(this);

		if (!pageHelper.getOptions(this, options, 'id')) return;

		if (options && options.id) {
			this.setData({
				_params: { userId: options.id }
			});
		};

		this._getSearchMenu();

	},

	bindSearchTap: function (e) {
		let search = pageHelper.dataset(e, 'search');
		this.setData({
			search
		})
	},

	bindFavTap: async function (e) {
		if (!await PassportBiz.loginMustCancelWin(this)) return;

		try {

			let params = {
				id: this.data.id
			}
			let options = {
				title: this.data.user.fav ? '取消中' : '关注中'
			}
			await cloudHelper.callCloudSumbit('product/user_fav', params, options).then(res => {
				let user = this.data.user;
				if (res.data === true) {
					user.fav = true;
					user.USER_FAV_CNT++;
					this.setData({ user });
					pageHelper.showSuccToast('关注成功');
				}
				else {
					user.fav = false;
					user.USER_FAV_CNT--;
					if (user.USER_FAV_CNT < 0) user.USER_FAV_CNT = 0;
					this.setData({ user });
					pageHelper.showSuccToast('已取消');
				}

			});
		}
		catch (err) {
			console.error(err);
		}
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
		if (e.detail.dataList && e.detail.dataList.user) {
			this.setData({ user: e.detail.dataList.user });
		}
		pageHelper.commListListener(this, e);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	_getSearchMenu: async function () {
		this.setData({
			isLoad: true
		})

	}

})