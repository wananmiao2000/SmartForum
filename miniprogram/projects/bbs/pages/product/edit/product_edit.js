const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');
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
		if (!pageHelper.getOptions(this, options)) return;
		ProjectBiz.initPage(this);

		let cateIdOptions = await CateBiz.getAllCateOptions();

		this.setData({
			cateIdOptions,
		});

		this._loadDetail();

	},

	_loadDetail: async function () {

		let id = this.data.id;
		if (!id) return;

		if (!this.data.isLoad) this.setData(await AdminProductBiz.initFormData(id, false)); // 初始化表单数据

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let product = await cloudHelper.callCloudData('product/detail', params, opt);
		if (!product) {
			this.setData({
				isLoad: null
			})
			return;
		};

		this.setData({
			isLoad: true,


			// 表单数据  
			formCateId: product.PRODUCT_CATE_ID,
			cateName: CateBiz.getCateNameArr(this.data.cateIdOptions, product.PRODUCT_CATE_ID),

			formOrder: product.PRODUCT_ORDER,

			formTitle: product.PRODUCT_TITLE,
			formForms: product.PRODUCT_FORMS,

		}, () => {


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

		// 数据校验
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
				let productId = this.data.id;
				data.id = productId;

				// 先修改，再上传 
				await cloudHelper.callCloudSumbit('product/edit', data);

				await cloudHelper.transFormsTempPics(forms, 'product/', productId, 'product/update_forms');

				let callback = async () => {

					// 更新列表页面数据
					let node = {
						'PRODUCT_TITLE': data.title,
						'PRODUCT_STATUS': data.status,
					}
					pageHelper.modifyPrevPageListNodeObject(productId, node);

					wx.navigateBack();

				}
				if (check)
					pageHelper.showModal('修改成功，请耐心等待后台审核', '温馨提示', callback);
				else
					pageHelper.showNoneToast('修改成功', 2000, callback);

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