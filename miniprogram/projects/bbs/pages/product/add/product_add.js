const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const PublicBiz = require('../../../../../comm/biz/public_biz.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const CateBiz = require('../../../biz/cate_biz.js');
const AdminProductBiz = require('../../../biz/admin_product_biz.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const projectSetting = require('../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isClient: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);
		if (!await PassportBiz.loginMustBackWin(this)) return;

		this.setData(await AdminProductBiz.initFormData('', false)); // 初始化表单数据

		let cateIdOptions = await CateBiz.getAllCateOptions();

		this.setData({
			cateIdOptions,
			isLoad: true
		});

	},

	bindCateIdCmpt: function (e) {
		let formCateId = e.detail;
		this.setData({
			formCateId,
			cateName: CateBiz.getCateNameArr(this.data.cateIdOptions, e.detail)
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
	onShow: function () {

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

	model: function (e) {
		pageHelper.model(this, e);
	},


	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!await PassportBiz.loginMustCancelWin(this)) return;

		if (this.data.cateIdOptions.length == 0) return pageHelper.showModal('暂无栏目，请先添加栏目~!');

		let check = projectSetting.PRODUCT_CHECK;

		let data = this.data;
		data = validate.check(data, AdminProductBiz.CHECK_FORM, this);
		if (!data) return;

		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;
		data.cateName = this.data.cateName;
		data.status = check ? 99 : 1;

		let callback = async () => {
			try {


				// 先创建，再上传 
				let result = await cloudHelper.callCloudSumbit('product/insert', data);
				let productId = result.data.id;


				await cloudHelper.transFormsTempPics(forms, 'product/', productId, 'product/update_forms');

				PublicBiz.removeCacheList('admin-product-list');
				PublicBiz.removeCacheList('product-list');
				PublicBiz.removeCacheList('product-my-list');

				if (check) {
					let callback = () => { 
						wx.reLaunch({
							url: '../../my/index/my_index',
						}); 
					}
					pageHelper.showModal('提交成功，请耐心等待后台审核', '温馨提示', callback);
				}
				else {
					let callback = () => { 
						wx.reLaunch({
							url: '../index/product_index?cateId=' + this.data.formCateId[0] + '&title=' + encodeURIComponent(this.data.cateName[0]),
						}); 
					}
					pageHelper.showNoneToast('发贴成功', 2000, callback);
				}


			} catch (err) {
				console.log(err);
			}
		}
		wx.requestSubscribeMessage({
			tmplIds: [projectSetting.NOTICE_TEMP_APPT],
			async complete() {
				callback();
			}
		});

	},


	url: function (e) {
		pageHelper.url(e, this);
	}
})