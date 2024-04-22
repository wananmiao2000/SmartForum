const ProjectBiz = require('../../../biz/project_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');

Page({

	data: {
		isLoad: true,

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

	bindDelTap: function (e) {
		let id = pageHelper.dataset(e, 'id');
		let callback = async () => {
			try {
				let params = {
					id
				}
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('product/del', params, opts).then(res => {
					pageHelper.delListNode(id, this.data.dataList.list, '_id');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},


	_getSearchMenu: async function () {


		let sortMenus = [
			{ label: '全部', type: 'all', value: '' },
			{ label: '待审核', type: 'status', value: 99 },
			{ label: '正常', type: 'status', value: 1 },
			{ label: '待修改', type: 'status', value: 98 },
		];



		this.setData({
			sortItems: [],
			sortMenus,
			isLoad: true
		})

	}


})