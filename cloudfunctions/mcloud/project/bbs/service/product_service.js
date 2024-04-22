/**
 * Notes: 论坛模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-10-29 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const ProductModel = require('../model/product_model.js');
const UserModel = require('../model/user_model.js');

class ProductService extends BaseProjectService {

	/** 个人主页 */
	async getUserDetail(nowUserId, {
		userId,
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'PRODUCT_ORDER': 'asc',
			'PRODUCT_ADD_TIME': 'desc'
		};
		let fields = 'PRODUCT_GOOD,PRODUCT_PIC,PRODUCT_METHOD,PRODUCT_LIKE_CNT,PRODUCT_FAV_CNT,PRODUCT_COMMENT_CNT,PRODUCT_VIEW_CNT,PRODUCT_TITLE,PRODUCT_CATE_ID,PRODUCT_ADD_TIME,PRODUCT_ORDER,PRODUCT_STATUS,PRODUCT_CATE_NAME';

		let where = {};
		where.and = {
			PRODUCT_STATUS: 1,
			PRODUCT_USER_ID: userId,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};



		let ret = await ProductModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		if (ret && page == 1) {
			// 首页计入PV
			let user = await UserModel.getOne({ USER_MINI_OPENID: userId, USER_STATUS: 1 }, 'USER_MY_FAV_CNT,USER_FAV_LIST,USER_OBJ.desc,USER_OBJ.sex,USER_PIC,USER_NAME,USER_FAV_CNT,USER_VIEW_CNT,USER_PRODUCT_CNT');
			if (!user) return this.AppError('该用户不存在');

			ret.user = user;

			UserModel.inc({ USER_MINI_OPENID: userId }, 'USER_VIEW_CNT', 1);

			user.fav = user.USER_FAV_LIST.includes(nowUserId) ? true : false;

		}

		return ret;
	}

	/** 用户排行 */
	async getUserOrderList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'USER_PRODUCT_CNT': 'desc',
			'USER_ADD_TIME': 'desc'
		};
		let fields = 'USER_PRODUCT_TIME,USER_MY_FAV_CNT,USER_FAV_CNT,USER_MINI_OPENID,USER_OBJ.sex,USER_PIC,USER_NAME,USER_PRODUCT_CNT,USER_VIEW_CNT';

		let where = {};
		where.and = {
			USER_STATUS: 1,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'USER_ADD_TIME');

					if (sortVal.includes('USER_PRODUCT_TIME')) {
						// 最近发贴
						where.and.USER_PRODUCT_CNT = ['>', 0];
					}
					break;
				}
			}
		}

		return await UserModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/** 我的关注的人 */
	async getMyFavUserList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'USER_PRODUCT_CNT': 'desc',
			'USER_ADD_TIME': 'desc'
		};
		let fields = 'USER_PRODUCT_TIME,USER_MY_FAV_CNT,USER_FAV_CNT,USER_MINI_OPENID,USER_OBJ.sex,USER_PIC,USER_NAME,USER_PRODUCT_CNT,USER_VIEW_CNT';

		let where = {};
		where.and = {
			USER_FAV_LIST: userId,
			USER_STATUS: 1,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'USER_ADD_TIME');
					break;
				}
			}
		}

		return await UserModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}



	// 关注用户
	async favUser(nowUserId, toUserId) {
		if (nowUserId === toUserId) this.AppError('不能关注自己');

		// 是否关注
		let user = await UserModel.getOne({ USER_MINI_OPENID: toUserId }, 'USER_FAV_LIST');
		if (!user) this.AppError('用户不存在');

		let arr = user.USER_FAV_LIST;
		let flag = false;
		if (arr.includes(nowUserId)) {
			arr = arr.filter(item => item != nowUserId);
			flag = false;
		}
		else {
			arr.push(nowUserId);
			flag = true;
		}

		// 被关注者
		await UserModel.edit({ USER_MINI_OPENID: toUserId }, {
			USER_FAV_LIST: arr,
			USER_FAV_CNT: arr.length
		});

		// 本人
		let cnt = await UserModel.count({ USER_FAV_LIST: nowUserId });
		await UserModel.edit({ USER_MINI_OPENID: nowUserId }, {
			USER_MY_FAV_CNT: cnt,
		});

		return flag;
	}

	async likeProduct(userId, id) {
		// 是否点赞
		let product = await ProductModel.getOne(id, 'PRODUCT_LIKE_LIST');
		if (!product) this.AppError('记录不存在');

		let arr = product.PRODUCT_LIKE_LIST;
		let flag = false;
		if (arr.includes(userId)) {
			arr = arr.filter(item => item != userId);
			flag = false;
		}
		else {
			arr.push(userId);
			flag = true;
		}
		await ProductModel.edit(id, {
			PRODUCT_LIKE_LIST: arr,
			PRODUCT_LIKE_CNT: arr.length
		});

		return flag;
	}

	/** 浏览论坛信息 */
	async viewProduct(userId, id, isAdmin = false) {

		let fields = '*';

		let where = {
			_id: id,
		}
		let product = await ProductModel.getOne(where, fields);
		if (!product) return null;

		if (!isAdmin && product.PRODUCT_STATUS != 1 && userId != product.PRODUCT_USER_ID) return null;

		product.like = product.PRODUCT_LIKE_LIST.includes(userId) ? true : false;

		delete product.PRODUCT_LIKE_LIST;

		if (product.PRODUCT_METHOD == 1) {
			product.user = await UserModel.getOne({ USER_MINI_OPENID: product.PRODUCT_USER_ID });
		}

		ProductModel.inc(id, 'PRODUCT_VIEW_CNT', 1);

		// 评论
		const CommentService = require('./comment_service.js');
		let commentService = new CommentService();
		let commentList = await commentService.getCommentList(userId, { oid: id, search: '', sortType: '', sortVal: '', sortVal: '', orderBy: null, whereEx: null, page: 1, size: 10 });
		commentList = commentList.list;
		if (commentList) {
			for (let k = 0; k < commentList.length; k++) {
				commentList[k].COMMENT_ADD_TIME = timeUtil.timestamp2Time(commentList[k].COMMENT_ADD_TIME, 'Y-M-D h:m');

				// 本人是否点赞 
				if (commentList[k].COMMENT_LIKE_LIST
					&& Array.isArray(commentList[k].COMMENT_LIKE_LIST)
					&& commentList[k].COMMENT_LIKE_LIST.includes(userId))
					commentList[k].like = true;
				else
					commentList[k].like = false;

				// 删除冗余 
				if (commentList[k].COMMENT_LIKE_LIST) delete commentList[k].COMMENT_LIKE_LIST;
			}
		}
		if (commentList) product.commentList = commentList;

		return product;
	}


	/** 取得分页列表 */
	async getProductList({
		cateId,
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'PRODUCT_ORDER': 'asc',
			'PRODUCT_ADD_TIME': 'desc'
		};
		let fields = 'PRODUCT_GOOD,PRODUCT_PIC,PRODUCT_METHOD,PRODUCT_LIKE_CNT,PRODUCT_FAV_CNT,PRODUCT_COMMENT_CNT,PRODUCT_VIEW_CNT,PRODUCT_TITLE,PRODUCT_CATE_ID,PRODUCT_ADD_TIME,PRODUCT_ORDER,PRODUCT_STATUS,PRODUCT_CATE_NAME,user.USER_NAME,user.USER_PIC';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};
		where.and.PRODUCT_STATUS = 1; // 状态 

		if (cateId && cateId !== '0') where.and.PRODUCT_CATE_ID = cateId;

		if (util.isDefined(search) && search) {
			where.or = [
				{ PRODUCT_TITLE: ['like', search] },
				{ PRODUCT_CATE_NAME: ['like', search] },
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'PRODUCT_ADD_TIME');
					break;
				}
				case 'good': {
					where.and.PRODUCT_GOOD = 1;
					break;
				}
				case 'cateId': {
					if (sortVal) where.and.PRODUCT_CATE_ID = String(sortVal);
					break;
				}
			}
		}

		let UserModel = require('../model/user_model.js');
		let joinParams = {
			from: UserModel.CL,
			localField: 'PRODUCT_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await ProductModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async getMyProductList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'PRODUCT_ORDER': 'asc',
			'PRODUCT_ADD_TIME': 'desc'
		};
		let fields = 'PRODUCT_LIKE_CNT,PRODUCT_FAV_CNT,PRODUCT_COMMENT_CNT,PRODUCT_VIEW_CNT,PRODUCT_TITLE,PRODUCT_CATE_ID,PRODUCT_ADD_TIME,PRODUCT_ORDER,PRODUCT_STATUS,PRODUCT_CATE_NAME,PRODUCT_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};
		where.and.PRODUCT_USER_ID = userId;


		if (util.isDefined(search) && search) {
			where.or = [
				{ PRODUCT_TITLE: ['like', search] },
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'PRODUCT_ADD_TIME');
					break;
				}
				case 'cateId': {
					if (sortVal) where.and.PRODUCT_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.PRODUCT_STATUS = Number(sortVal);
					break;
				}
			}
		}

		return await ProductModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async getMyLikeProductList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'PRODUCT_ORDER': 'asc',
			'PRODUCT_ADD_TIME': 'desc'
		};
		let fields = 'PRODUCT_LIKE_CNT,PRODUCT_FAV_CNT,PRODUCT_COMMENT_CNT,PRODUCT_VIEW_CNT,PRODUCT_TITLE,PRODUCT_CATE_ID,PRODUCT_ADD_TIME,PRODUCT_ORDER,PRODUCT_STATUS,PRODUCT_CATE_NAME,PRODUCT_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};
		where.and.PRODUCT_LIKE_LIST = userId;


		if (util.isDefined(search) && search) {
			where.or = [
				{ PRODUCT_TITLE: ['like', search] },
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'PRODUCT_ADD_TIME');
					break;
				}
			}
		}

		return await ProductModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = ProductService;