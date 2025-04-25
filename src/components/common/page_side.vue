<template>
	<el-menu class="side el-menu-vertical-demo" default-active="/" @open="handleOpen" @close="handleClose"
		 text-color="#369dfb" active-text-color="#369dfb" :collapse="isCollapse" :router="true">
		<el-menu-item v-if="user.type==1" index="/slides/goodsManager">
			<i class="el-icon-s-home"></i>
			<span slot="title">电子产品</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==1" index="/slides/orderManager">
			<span>订单管理</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==1" index="/slides/activityManager">
			<span>活动管理</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==1" index="/slides/userManager2">
			<span>平台管理</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==1" index="/slides/userManager">
			<span>用户管理</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==1" index="/slides/complaintManager">
			<span>投诉管理</span>
		</el-menu-item>
		
		<el-menu-item v-if="user.type==3" index="/slides/goodsManager2">
			<span>验货管理</span>
		</el-menu-item>
		
		<el-menu-item v-if="user.type==2" index="/slides/orderManager">
			<span>我的订单</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==2" index="/slides/goodsManager">
			<span>电子产品</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==2" index="/slides/certManager">
			<span>我的购物车</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==2" index="/slides/addressManager">
			<span>我的地址</span>
		</el-menu-item>
		<el-menu-item v-if="user.type==2" index="/slides/complaintManager">
			<span>我的投诉</span>
		</el-menu-item>
		
		
	</el-menu>
</template>

<script>
	import common from '@/common/commonRequest.js'
	export default {
		props: {
			isCollapse: {
				trye: Boolean,
				default: false
			},
			user:{type:0}
		},
		data: function() {
			return {
				user_group: this.$store.state.user.user_group
			}
		},
		created() {
		  this.user = common.getUserInfo();
		  // if (!this.user || this.user.type != 1) {
		  //   this.$router.push("/login");
		  // }
		},
		methods: {
			handleOpen(key, keyPath) {
				// console.log(key, keyPath);
			},

			handleClose(key, keyPath) {
				// console.log(key, keyPath);
			},

		},
		computed: {
			auth() {
				var tables = this.$store.state.web.auth;
				var lt = [];
				for (var i = 0; i < tables.length; i++) {
					var o = tables[i];
					if (o.path.indexOf("/table") !== -1) {
						let list = ["exam","article", "article_type",,"comment","forum","forum_type"];
						list.push("ordinary_users");
						if (list.indexOf(o.table_name) === -1) {
							lt.push(o);
						}
					}
				}
				return lt;
			}
		}
	}
</script>


<style scoped="scoped">
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 16rem;
	}

	.el-submenu__title i {
		color: #369dfb !important;
	}
	
	.el-menu-item i {
	    color: #369dfb !important;
	}
	
	.side {
		float: left;
		background: white;
		color: #369dfb;
		overflow-y: scroll;
		height: 100vh;
	}
	.side::-webkit-scrollbar{
		display: none;
	}
</style>
