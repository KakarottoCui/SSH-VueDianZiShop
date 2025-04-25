<template>
	<header>
		<div class="warp">
			<el-row>
				<el-col :span="24">
					
					<div class="v-flex v-c-center v-r-between v-shadow view-shadow border-b text-shadow">
						<div class="v-flex v-c-center">
							<div style="margin: 5px;">
								<el-avatar
									:src="$fullUrl(user.avatar)">
									<img  src="/img/nuoMi.png" />
								</el-avatar>
							</div>
							
							<div class="">{{siteTitle}}{{userInfo.type == 2 ?'个人主页':'后台管理'}} </div>
							<span class="margin-l text-blue" @click="backToIndex" v-if="userInfo.type == 2">返回首页</span>
							<a class="btn_menu" href="javascript:void(0)" @click="$emit('change', !isCollapse)">
								<i :class="{'el-icon-menu' : !isCollapse,  'el-icon-s-grid': isCollapse }"></i>
							</a>
							
						</div>
						<div class="v-flex v-c-center">欢迎使用{{siteTitle}}</div>
						<div class="v-flex v-c-center">
							<el-dropdown @command="handleCommand">
								<div class="el-dropdown-link v-flex v-c-center" style="margin-right: 2rem;">
									<el-avatar 
										:src="$fullUrl(user.avatar)">
										<img  src="/img/nuoMi.png" />
									</el-avatar>
									<span class="margin-l">{{ userInfo.nickName+"("+ userType[userInfo.type] +")" }}</span>
									<span v-if="userInfo.type==2" class="margin-l" @click="toChat">我的聊天</span>
								</div>
								<el-dropdown-menu slot="dropdown">
									<!-- <el-dropdown-item command="/user/info">个人信息</el-dropdown-item>
									<el-dropdown-item command="/user/password">修改密码</el-dropdown-item> -->
									<!-- <el-dropdown-item command="http://localhost:8081/">网站首页</el-dropdown-item> -->
									<el-dropdown-item command="/quit" divided>退出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</header>
</template>


<script>
	import common from '@/common/commonRequest.js'
	export default {
		model: {
			event: 'change',
			prop: 'isCollapse'
		},
		props: {
			isCollapse: {
				trye: Boolean,
				default: true
			}
		},
		data() {
			return {
				activeIndex: '1',
				activeIndex2: '1',
				user: this.$store.state.user,
				userInfo:"",
				search: "",
				userType:["游客","管理员","用户","验货机构"]
			};
		},
		created:function(){
			this.userInfo = common.getUserInfo();
			// if (!this.userInfo || this.userInfo.type != 1) {
			//   this.$router.push("/login");
			// }
		},
		methods: {
			toChat(){
				window.open("/chat","_blank");
			},
			backToIndex(){
				this.$router.push("/mainPage");
			},
			quit(){
				localStorage.removeItem("userInfo");
				this.$router.push("/login");
			},
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
			},
			handleCommand(command) {
				if (command === "/quit") {
					this.$store.commit("quit");
					localStorage.removeItem("userInfo");
					this.$router.push("/login");
				} else if(command.indexOf("http")!==-1){
					let token = $.db.get("token");
					if (token){
						location.href = command+"?token="+token;
					}
				} else {
					this.$router.push(command);
				}
			}
		}
	}
</script>

<style scoped="scoped">
	
	
	
	header {
		background-color: white;
		border-bottom: var(--color_border);
		/* color: #fff; */
	}
	
  
  
  .action_left {
	display: flex;
	align-items: center;
    width: 30%;
  }

  .action_center {
    float: left;
    line-height: 51px;
    width: 40%;
    text-align: center;
  }

  .action_right {
    text-align: right;
    float: right;
    width: 30%;
  }

	.el-dropdown {
		/* color: #fff; */
	}

	.btn_menu {
		display: inline-block;
		padding: 0.625rem;
	}
</style>
