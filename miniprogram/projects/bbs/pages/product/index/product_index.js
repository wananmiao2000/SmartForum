const ProjectBiz = require('../../../biz/project_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const CateBiz = require('../../../biz/cate_biz.js')

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

		if (options && options.search) {
			// 单一搜索
			wx.setNavigationBarTitle({
				title: '搜索结果',
			});
			this.setData({
				search: options.search,
				isLoad: true,
			})

			return;
		}

		if (!pageHelper.getOptions(this, options, 'cateId')) return;

		if (options && options.cateId) {
			this.setData({
				_params: { cateId: options.cateId }
			});
		};

		if (options && options.title) {
			wx.setNavigationBarTitle({
				title: decodeURIComponent(options.title),
			});
		}

		this._getSearchMenu();

	},

	bindSearchTap: function (e) {
		let search = pageHelper.dataset(e, 'search');
		this.setData({
			search
		})
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

	_getSearchMenu: async function () {

		let cateList = await CateBiz.getAllCateOptions();
		let sortItem1 = [];

		let cate2List = [];
		for (let k = 0; k < cateList.length; k++) {
			if (cateList[k].val === this.data.cateId && cateList[k].obj.haslevel) {
				for (let j = 0; j < cateList[k].children.length; j++) {
					cate2List.push(cateList[k].children[j].label)
				}
				break;
			}
		}



		let sortItems = [];
		//	let sortMenus = sortItem1.length == 1 ? [] : sortItem1;

		let sortMenus = [
			{ label: '全部', type: 'all', value: '' },
			{ label: '最新', type: 'sort', value: 'PRODUCT_ADD_TIME|desc' },
			{ label: '最热ˇ', type: 'sort', value: 'PRODUCT_VIEW_CNT|desc' },
			{ label: '精华贴', type: 'good', value: 'good' },
			{ label: '评论ˇ', type: 'sort', value: 'PRODUCT_COMMENT_CNT|desc' },
			{ label: '收藏ˇ', type: 'sort', value: 'PRODUCT_FAV_CNT|desc' },
			{ label: '点赞ˇ', type: 'sort', value: 'PRODUCT_LIKE_CNT|desc' },

		];
		this.setData({
			cate2List,
			sortItems,
			sortMenus,
			isLoad: true
		})

	}

})