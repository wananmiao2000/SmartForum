const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showCateModal: false,
		curCate1Id: '',
		curCate2Id: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		pageHelper.getOptions(this, options, 'swiper');

		if (options && options.search) {
			this.setData({ search: options.search });
		}

		wx.setNavigationBarTitle({
			title: projectSetting.PRODUCT_NAME + '-管理',
		});
		this.setData({
			PRODUCT_NAME: projectSetting.PRODUCT_NAME
		});

		//设置搜索菜单
		this._getSearchMenu();
	},

	bindSwiperTap: function (e) {
		let swiper = this.data.swiper;
		let id = pageHelper.dataset(e, 'id');
		let title = pageHelper.dataset(e, 'title');
		let img = pageHelper.dataset(e, 'img');
		if (img.length > 0) img = [img[0]];

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		let cb = () => {
			let formItem = parent.data.formItem;
			formItem[swiper].url = '../../product/detail/product_detail?id=' + id;
			formItem[swiper].img = img;
			formItem[swiper].desc = title;
			parent.setData({ formItem });
			wx.navigateBack();
		}
		pageHelper.showConfirm('确认选为轮播图？', cb);

	},

	bindCate1Tap: function (e) {
		this.setData({
			curCate1Id: pageHelper.dataset(e, 'id')
		});
	},

	bindCate2Tap: function (e) {
		this.setData({
			search: pageHelper.dataset(e, 'title'),
			curCate2Id: pageHelper.dataset(e, 'id'),
			showCateModal: false
		});
	},

	bindHideCateModalTap: function (e) {
		this.setData({
			showCateModal: false
		});
	},

	bindShowCateModalTap: function (e) {
		let curCate1Id = this.data.curCate1Id;
		if (this.data.dataList.cateList.length == 0) return pageHelper.showModal('暂无分类，请先添加分类~!');

		if (!curCate1Id) curCate1Id = this.data.dataList.cateList[0].val;

		this.setData({
			curCate1Id,
			showCateModal: true
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

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

	_setSort: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = e.currentTarget.dataset.id;
		let sort = e.currentTarget.dataset.sort;
		if (!id) return;

		let params = {
			id,
			sort
		}

		try {
			await cloudHelper.callCloudSumbit('admin/product_sort', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'PRODUCT_ORDER', sort);
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_setVouch: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let id = pageHelper.dataset(e, 'id');
		let vouch = pageHelper.dataset(e, 'vouch');
		if (!id) return;

		let params = {
			id,
			vouch
		}

		try {
			await cloudHelper.callCloudSumbit('admin/product_vouch', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'PRODUCT_VOUCH', vouch);
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (err) {
			console.log(err);
		}
	},

	_setGood: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let id = pageHelper.dataset(e, 'id');
		let good = pageHelper.dataset(e, 'good');
		if (!id) return;

		let params = {
			id,
			good
		}

		try {
			await cloudHelper.callCloudSumbit('admin/product_good', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'PRODUCT_GOOD', good);
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (err) {
			console.log(err);
		}
	},

	_del: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/product_del', params, opts).then(res => {
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

	bindMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let idx = pageHelper.dataset(e, 'idx');

		let order = this.data.dataList.list[idx].PRODUCT_ORDER;
		let orderDesc = (order == 0) ? '取消置顶' : '置顶';

		let vouch = this.data.dataList.list[idx].PRODUCT_VOUCH;
		let vouchDesc = (vouch == 0) ? '推荐到首页' : '取消首页推荐';

		let good = this.data.dataList.list[idx].PRODUCT_GOOD;
		let goodDesc = (good == 0) ? '设为精华贴' : '取消精华贴';

		let itemList = ['预览', orderDesc, vouchDesc, goodDesc, '生成专属二维码'];

		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //预览
						let id = pageHelper.dataset(e, 'id');
						wx.navigateTo({
							url: '../../../product/detail/product_detail?isAdmin=isAdmin&&id=' + id,
						});
						break;
					}
					case 1: { //置顶 
						let sort = (order == 0) ? 9999 : 0;
						e.currentTarget.dataset['sort'] = sort;
						await this._setSort(e);
						break;
					}
					case 2: { //上首页 
						vouch = (vouch == 0) ? 1 : 0;
						e.currentTarget.dataset['vouch'] = vouch;
						await this._setVouch(e);
						break;
					}
					case 3: { //精华贴 
						good = (good == 0) ? 1 : 0;
						e.currentTarget.dataset['good'] = good;
						await this._setGood(e);
						break;
					}
					case 4: { //二维码 
						let title = encodeURIComponent(pageHelper.dataset(e, 'title'));
						let qr = encodeURIComponent(pageHelper.dataset(e, 'qr'));
						wx.navigateTo({
							url: `../../setup/qr/admin_setup_qr?title=${title}&qr=${qr}`,
						})
						break;
					}
				}


			},
			fail: function (res) { }
		})
	},

	bindStatusMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let itemList = ['审核通过，设为正常', '审核未过，通知修改', '停用 (不可见)', '设为待审核', '删除'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //审核通过
						e.currentTarget.dataset['status'] = 1;
						await this._setStatus(e);
						break;
					}
					case 1: { //审核未过
						e.currentTarget.dataset['status'] = 98;
						await this._setStatus(e);
						break;
					}
					case 2: { //停止 
						e.currentTarget.dataset['status'] = 0;
						await this._setStatus(e);
						break;
					}
					case 3: { //设为待审核 
						e.currentTarget.dataset['status'] = 99;
						await this._setStatus(e);
						break;
					}
					case 4: { //删除
						await this._del(e);
						break;
					}

				}


			},
			fail: function (res) { }
		})
	},


	_setStatus: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = Number(pageHelper.dataset(e, 'status'));
		let params = {
			id,
			status
		}

		try {
			await cloudHelper.callCloudSumbit('admin/product_status', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'PRODUCT_STATUS', status, '_id');
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: function () {

		let sortItems1 = [
			{ label: '排序', type: 'all', value: '' },
			{ label: '评论↓', type: 'sort', value: 'PRODUCT_COMMENT_CNT|desc' },
			{ label: '收藏↓', type: 'sort', value: 'PRODUCT_FAV_CNT|desc' },
			{ label: '点赞↓', type: 'sort', value: 'PRODUCT_LIKE_CNT|desc' },
			{ label: '浏览↓', type: 'sort', value: 'PRODUCT_VIEW_CNT|desc' },
		];

		let sortItems2 = [
			{ label: '发布者', type: 'all', value: '' },
			{ label: '平台发布', type: 'method', value: 0 },
			{ label: '用户发布', type: 'method', value: 1 },

		];

		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '正常', type: 'status', value: 1 },
			{ label: '待审核', type: 'status', value: 99 },
			{ label: '待修改', type: 'status', value: 98 },
			{ label: '停用', type: 'status', value: 0 },
			{ label: '最新', type: 'sort', value: 'new' },
			{ label: '首页推荐', type: 'vouch', value: 'vouch' },
			{ label: '置顶', type: 'top', value: 'top' },
			{ label: '精华贴', type: 'good', value: 'good' },
		];

		this.setData({
			sortItems: [sortItems1, sortItems2],
			sortMenus,
			isLoad: true
		})


	},

})