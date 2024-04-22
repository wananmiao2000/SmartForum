/**
 * Notes: 论坛模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-09-29 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const ProductService = require('../service/product_service.js');
const AdminProductService = require('../service/admin/admin_product_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class ProductController extends BaseProjectController {

	async getUserOrderList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		let result = await service.getUserOrderList(input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			if (list[k].USER_PRODUCT_TIME)
				list[k].last = '最近发贴：' + timeUtil.timestamp2Time(list[k].USER_PRODUCT_TIME, 'Y-M-D h:m');
			else
				list[k].last = '未发贴';
		}

		return result;

	}

	async getMyFavUserList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		let result = await service.getMyFavUserList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			if (list[k].USER_PRODUCT_TIME)
				list[k].last = '最近发贴：' + timeUtil.timestamp2Time(list[k].USER_PRODUCT_TIME, 'Y-M-D h:m');
			else
				list[k].last = '未发贴';
		}

		return result;

	}

	async getUserDetail() {

		// 数据校验
		let rules = {
			userId: 'string|must',
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		let result = await service.getUserDetail(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].t1 = timeUtil.timestamp2Time(list[k].PRODUCT_ADD_TIME, 'D');
			list[k].t2 = timeUtil.timestamp2Time(list[k].PRODUCT_ADD_TIME, 'M月');
			list[k].cateName = list[k].PRODUCT_CATE_NAME.join('-');
		}

		return result;

	}

	async favUser() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		return await service.favUser(this._userId, input.id);
	}

	async likeProduct() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		return await service.likeProduct(this._userId, input.id);
	}

	/** 列表 */
	async getProductList() {

		// 数据校验
		let rules = {
			cateId: 'string',
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		let result = await service.getProductList(input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].PRODUCT_ADD_TIME = timeUtil.timestame2Ago(list[k].PRODUCT_ADD_TIME, 'Y-M-D');
			list[k].cateName = list[k].PRODUCT_CATE_NAME.join('-');
			list[k].cateName2 = list[k].PRODUCT_CATE_NAME.length == 2 ? list[k].PRODUCT_CATE_NAME[1] : '';

			if (input.search) {
				list[k].searchTitle = dataUtil.splitTextByKey(list[k].PRODUCT_TITLE, input.search);
			}
		}

		return result;

	}

	/** 删除 */
	async delProduct() {

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminProductService();
		await service.delProduct(input.id);

	}


	async getProductDetail() {

		// 数据校验
		let rules = {
			id: 'must|id'
		};

		// 取得数据
		let input = this.validateData(rules);


		let service = new AdminProductService();
		return await service.getProductDetail(input.id);

	}

	async getMyProductList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		let result = await service.getMyProductList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].PRODUCT_ADD_TIME = timeUtil.timestamp2Time(list[k].PRODUCT_ADD_TIME, 'Y-M-D h:m');
			list[k].PRODUCT_CATE_NAME = list[k].PRODUCT_CATE_NAME.join('-');
			if (list[k].PRODUCT_OBJ.content)
				delete list[k].PRODUCT_OBJ.content;


		}

		return result;

	}

	async getMyLikeProductList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		let result = await service.getMyLikeProductList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].PRODUCT_ADD_TIME = timeUtil.timestamp2Time(list[k].PRODUCT_ADD_TIME, 'Y-M-D');
			list[k].PRODUCT_CATE_NAME = list[k].PRODUCT_CATE_NAME.join('-');
			if (list[k].PRODUCT_OBJ.content)
				delete list[k].PRODUCT_OBJ.content;


		}

		return result;

	}


	/** 浏览信息 */
	async viewProduct() {
		// 数据校验
		let rules = {
			id: 'must|id',
			isAdmin: 'must|bool|default=false'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ProductService();
		let product = await service.viewProduct(this._userId, input.id, input.isAdmin);

		if (product) {
			// 显示转换 
			product.PRODUCT_ADD_TIME = timeUtil.timestamp2Time(product.PRODUCT_ADD_TIME, 'Y-M-D');
			product.PRODUCT_CATE_NAME = product.PRODUCT_CATE_NAME.join(' - ');


		}

		return product;
	}

	async editProduct() {

		let rules = {
			id: 'must|id',
			title: 'must|string|min:2|max:50|name=标题',
			cateId: 'must|array|name=分类',
			cateName: 'must|array|name=分类',
			order: 'must|int|min:0|max:9999|name=排序号',
			status: 'int|default=1',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMulti(input);

		let service = new AdminProductService();
		let result = service.editProduct(this._userId, input);


		return result;
	}

	/** 发布 */
	async insertProduct() {

		// 数据校验 
		let rules = {
			title: 'must|string|min:2|max:50|name=标题',
			cateId: 'must|array|name=分类',
			cateName: 'must|array|name=分类',
			order: 'must|int|min:0|max:9999|name=排序号',
			status: 'int|default=1',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMulti(input);

		let service = new AdminProductService();
		let result = await service.insertProduct(this._userId, input);


		return result;

	}

	/** 更新图片信息 */
	async updateProductForms() {

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);


		let service = new AdminProductService();
		return await service.updateProductForms(input);
	}



}

module.exports = ProductController;