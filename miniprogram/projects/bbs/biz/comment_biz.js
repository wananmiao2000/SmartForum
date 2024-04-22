/**
 * Notes: 评论模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-06-24 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const projectSetting = require('../public/project_setting.js');
const pageHelper = require('../../../helper/page_helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');

class CommentBiz extends BaseBiz {
	static initFormData() {

		return {
			fields: projectSetting.COMMENT_FIELDS,
			formForms: [],
		}

	}

	static async delComment(that, commentId, listName) {
		let cb = async () => {
			try {
				let params = {
					id: commentId,
					isAdmin: that.data.isAdmin
				}
				let opts = {
					title: '删除中'
				}

				await cloudHelper.callCloudSumbit('comment/del', params, opts).then(res => {
					let callback = () => {
						if (listName == 'dataList.list') {
							pageHelper.delListNode(commentId, that.data.dataList.list, '_id');
							that.data.dataList.total--;
							that.setData({
								dataList: that.data.dataList
							});
						}
						else {
							pageHelper.delListNode(commentId, that.data.product.commentList, '_id'); 
							that.data.product.PRODUCT_COMMENT_CNT--;
							that.setData({
								product: that.data.product
							});
						}
						
					}
					pageHelper.showSuccToast('删除成功', 1500, callback);
				});
			} catch (err) {
				console.log(err);
			}
		}

		pageHelper.showConfirm('确认删除该评论?', cb);
	}

	static async likeComment(that, list, id, idx, listName) {
		try {

			let params = {
				id
			}
			let options = {
				title: list[idx].like ? '点赞取消中' : '点赞中'
			}
			await cloudHelper.callCloudSumbit('comment/like', params, options).then(res => {
				if (res.data === true) {
					list[idx].like = true;
					list[idx]['COMMENT_LIKE_CNT']++;
					that.setData({ 'dataList.list': list });
					pageHelper.showSuccToast('点赞成功');
				}
				else {
					list[idx].like = false;
					list[idx]['COMMENT_LIKE_CNT']--;
					if (list[idx]['COMMENT_LIKE_CNT'] < 0) list[idx]['COMMENT_LIKE_CNT'] = 0;
					that.setData({ [listName]: list });
					pageHelper.showSuccToast('已取消');
				}

			});
		}
		catch (err) {
			console.error(err);
		}
	}


}

CommentBiz.CHECK_FORM = {
	forms: 'formForms|array',
};

module.exports = CommentBiz;