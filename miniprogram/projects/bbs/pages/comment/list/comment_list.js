const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const CommentBiz = require('../../../biz/comment_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		isAdmin: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		ProjectBiz.initPage(this);

		if (!pageHelper.getOptions(this, options)) return;

		this.setData({
			nowUserId: PassportBiz.getUserId(),
			_params: { oid: this.data.id, isLoad: true }
		});

		if (options && options.source && options.source == 'admin') {
			wx.setNavigationBarColor({ //顶部
				backgroundColor: '#2499f2',
				frontColor: '#ffffff',
			});
			wx.setNavigationBarTitle({
				title: '评论管理',
			});
			this.setData({ isAdmin: true });
		}

		this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.setData({
			nowUserId: PassportBiz.getUserId(),
		});
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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindLikeCommentTap: async function (e) {
		let idx = pageHelper.dataset(e, 'idx');
		let id = pageHelper.dataset(e, 'id');
		let list = this.data.dataList.list;

		await CommentBiz.likeComment(this, list, id, idx, 'dataList.list');
	},

	bindDelCommentTap: async function (e) {

		let commentId = pageHelper.dataset(e, 'id');
		await CommentBiz.delComment(this, commentId, 'dataList.list');

	},

	_getSearchMenu: function () {

		let sortItem1 = [

		];

		let sortMenus = [
			{ label: '全部', type: 'all', value: '' },
			{ label: '最早ˇ', type: 'sort', value: 'COMMENT_ADD_TIME|asc' },
			{ label: '点赞数ˇ', type: 'like', value: '' },
			{ label: '我的评论', type: 'mycomment', value: '' },
			{ label: '我的点赞', type: 'mylike', value: '' },
		];

		if (this.data.isAdmin) {
			sortMenus = [
				{ label: '全部', type: 'all', value: '' },
				{ label: '最早ˇ', type: 'sort', value: 'COMMENT_ADD_TIME|asc' },
				{ label: '点赞数ˇ', type: 'like', value: '' }
			];
		}

		this.setData({
			isLoad: true,
			sortItems: [],
			sortMenus
		})

	},
})