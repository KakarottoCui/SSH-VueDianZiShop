import Vue from 'vue';
import VueRouter from 'vue-router';
import index from '../views/index.vue';
import login from '../views/login.vue';
import forgot from '../views/forgot.vue';
import register from '../views/register.vue';
import mainPage from '../views/mainPage.vue';
import goodsItem from '../views/goodsItem.vue';
import chat from '../views/chat/chat.vue';
Vue.use(VueRouter)

const routes = [
	// 主页
	{
		path: '/',
		name: 'index',
		component: index,
		meta: {
			index: 0,
			title: '首页'
		}
	},

	// 登录
	{
		path: '/login',
		name: 'login',
		component: login,
		meta: {
			index: 0,
			title: '登录'
		}
	},
	// 注册
	{
		path: '/register',
		name: 'register',
		component: register,
		meta: {
			index: 0,
			title: '注册'
		}
	},
	
	// 忘记密码
	{
		path: '/forgot',
		name: "forgot",
		component: forgot,
		meta: {
			index: 0,
			title: '忘记密码'
		}
	},
	// 主页
	{
		path: '/mainPage',
		name: 'mainPage',
		component: mainPage,
		meta: {
			index: 2,
			title: '商城页面'
		}
	},
	{
		path: '/goodsItem',
		name: 'goodsItem',
		component: goodsItem,
		meta: {
			index: 3,
			title: '商品详情'
		}
	},
	{
		path: '/chat',
		name: 'chat',
		component: chat,
		meta: {
			index: 4,
			title: '聊天'
		}
	},
	// 视频播放页
	{
		path: "/media/video",
		name: "video",
		component: () => import('../views/media/video.vue'),
		meta: {
			index: 0,
			title: "视频"
		}
	},

	// 音频播放页
	{
		path: "/media/audio",
		name: "audio",
		component: () => import('../views/media/audio.vue'),
		meta: {
			index: 0,
			title: "音频"
		}
	},

	{
		path: '/slides/goodsManager',
		name: 'goodsManager',
		component: () => import('../views/goodsManager/goodsManager.vue'),
		meta: {
			index: 0,
			title: '商品管理'
		}
	},
	// 订单管理
	{
		path: '/slides/orderManager',
		name: 'orderManager',
		component: () => import('../views/orderManager/orderManager.vue'),
		meta: {
			index: 1,
			title: '订单管理'
		}
	},
	// 用户管理
	{
		path: '/slides/userManager',
		name: 'userManager',
		component: () => import('../views/userManager/userManager.vue'),
		meta: {
			index: 1,
			title: '用户管理'
		}
	},
	{
		path: '/slides/userManager2',
		name: 'userManager2',
		component: () => import('../views/userManager/userManager2.vue'),
		meta: {
			index: 1,
			title: '平台管理'
		}
	},
	// 投诉管理
	{
		path: '/slides/complaintManager',
		name: 'complaintManager',
		component: () => import('../views/complaintManager/complaintManager.vue'),
		meta: {
			index: 1,
			title: '投诉管理'
		}
	},
	// 活动管理
	{
		path: '/slides/activityManager',
		name: 'activityManager',
		component: () => import('../views/activityManager/activityManager.vue'),
		meta: {
			index: 1,
			title: '活动管理'
		}
	},
	// 验机管理
	{
		path: '/slides/goodsManager2',
		name: 'goodsManager2',
		component: () => import('../views/goodsManager/goodsManager2.vue'),
		meta: {
			index: 1,
			title: '验机管理'
		}
	}
	,{
		path: '/slides/addressManager',
		name: 'addressManager',
		component: () => import('../views/addressManager/addressManager.vue'),
		meta: {
			index: 1,
			title: '地址管理'
		}
	},
	{
		path: '/slides/certManager',
		name: 'certManager',
		component: () => import('../views/certManager/certManager.vue'),
		meta: {
			index: 1,
			title: '购物车管理'
		}
	}

	// {
	// 	path: '/slides/view',
	// 	name: 'slides_view',
	// 	component: () => import('../views/slides/view.vue'),
	// 	meta: {
	// 		index: 0,
	// 		title: '轮播图详情'
	// 	}
	// }
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	let token = to.query.token;
	if (token){
		$.db.set("token",token,120);
	}
	next();
})

router.afterEach((to, from, next) => {
	if(typeof(siteTitle)!='undefined'){
		let title = siteTitle;
		document.title = title;
	}
})

export default router
