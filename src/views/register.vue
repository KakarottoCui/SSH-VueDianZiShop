<template>
	<article class="sign_in register_wrap">
		<div class="warp ">
			
			<el-row>
				<el-col>
					<el-form  :model="form" ref="form" label-width="80px" class="form " style="background-color: rgba(0,0,0,0.5)">
						<h1>注册</h1>

						
						<el-form-item label="账号" prop="nickName">
							<el-input type="text" v-model="form.nickName" placeholder="昵称">
							</el-input>
						</el-form-item>
						
						<el-form-item label="手机号" prop="phone">
							<el-input type="number" v-model="form.phone" placeholder="手机号">
							</el-input>
						</el-form-item>
						
						<el-form-item label="密码" prop="password">
							<el-input type="password" v-model="form.password" placeholder="5 到 16 个字符"
								autocomplete="off">
							</el-input>
						</el-form-item>
						
						<el-form-item label="确认密码" prop="confirm_password">
							<el-input type="password" v-model="confirm_password" placeholder="2 到 16 个字符"
								autocomplete="off">
							</el-input>
						</el-form-item>
						
						<el-form-item label="验证码" prop="phone">
						<div class="padding-10 v-flex">
							<div class="captcha-box" id="captchaBox"></div>
							<div class="text-white text-bold" @click="setCode">刷新</div>
						</div>
						</el-form-item>
						
						<el-form-item label="验证码" prop="">
							<el-input  v-model="codeCheck" placeholder="输入验证码,刷新重载"
								autocomplete="off">
							</el-input>
						</el-form-item>

						<el-button type="primary" @click="submit()" >注册</el-button>
						<router-link class="el-button el-button--primary" to="./login" >返回</router-link>

					</el-form>
				</el-col>
			</el-row>
		</div>
	</article>
</template>

<script>
	import common from '@/common/commonRequest.js'
	export default {
		data: function() {
			return {
				code:"",
				oauth: {
					signIn: false
				},
				codeCheck:"",
				url_submit: "~/api/user/register?",

				web: this.$store.state.web,

				form: {
					phone: "",
					nickName: "",
					password: ""
				},
				form_sub: {},
				confirm_password: "",

				list_user_group: [],
				user_group: []
			}
		},
		created:function(){
			let _this = this;
			setTimeout(function(){
				_this.setCode();
			},2000)
			
		},
		methods: {
			setCode(){
				
				const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去容易混淆的字符
				let code = '';
				for (let i = 0; i < 4; i++) {
					code += chars[Math.floor(Math.random() * chars.length)];
				}
				this.code = code;
				// 清空容器
				const box = document.getElementById('captchaBox');
				box.innerHTML = '';
			
				// 生成扭曲文字
				const text = document.createElement('div');
				text.className = 'captcha-text';
				text.style.left = '20px';
				text.style.top = '15px';
			
				// 对每个字符单独应用扭曲
				code.split('').forEach((char, index) => {
					const span = document.createElement('span');
					span.className = 'char-distort';
					span.textContent = char;
					
					// 随机旋转和倾斜
					span.style.transform = `
						rotate(${Math.random() * 15 - 7}deg)
						skew(${Math.random() * 15 - 7}deg, ${Math.random() * 15 - 7}deg)
					`;
					
					// 随机字符间距
					span.style.marginLeft = `${index === 0 ? 0 : Math.random() * 8}px`;
					text.appendChild(span);
				});
			
				box.appendChild(text);
			
				// 添加干扰线（5条）
				for (let i = 0; i < 5; i++) {
					const line = document.createElement('div');
					line.className = 'noise-line';
					line.style.width = `${Math.random() * 40 + 20}px`;
					line.style.height = '2px';
					line.style.left = `${Math.random() * 180}px`;
					line.style.top = `${Math.random() * 50}px`;
					line.style.transform = `rotate(${Math.random() * 180}deg)`;
					box.appendChild(line);
				}
			
				// 保存生成的验证码（实际使用应发送到后端）
				box.dataset.code = code;
				
			},
			

			/**
			 * 提交事件
			 * @param {Object} param 表单
			 * @param {Object} func 返回函数
			 */
			submit(param, func) {
			     console.log('提交事件', param);
			    if (!param) {
			        param = this.form;
			    }
			    // 提交前验证事件
			    var msg = this.submit_check(param);
			    var ret;
			
				console.log("提交前错误信息msg：" ,msg);
			    // 判断错误
			    if (msg) {
			        this.$toast(msg, 'danger');
			    } else {
			        // 提交表单
			        let _this = this;
			        common.request({
			          data: {
			            nickName: this.form.nickName,
			            passWord: window.btoa(this.form.password),
						phone:this.form.phone
			          },
			          url: common.urlMap.regist,
			          success: function(res) {
			            if (res.data.code == 200) {
			                common.msg(res.data.msg);
							setTimeout(function(){
								_this.$router.push("/");
							},2000)
			        		
			            } else {
			              common.err(res.data.msg);
			            }
			          },
			          fail: function(res) {
			        	alert(res)  
			            common.err("网络异常");
			          }
			        })
					
					
			    }
			    // 返回结果
			    return ret;
			},
			
			
			/**
			 * 提交前校验
			 * @param {Object} param
			 */
			submit_check(param){
				var ret = null;
			
				var email_regular = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				var phone_regular = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
			
				var {nickName ,password ,phone} = param;
			
				var confirm_password = this.confirm_password;
			
				if(!nickName){
					ret = "昵称不能为空";
				}
				else if(nickName.length > 16 || nickName.length < 2){
					ret = "账号长度应为2到16个字符之间！";
				}
				else if(!password){
					ret = "密码不能为空!";
				}
				else if(password.length > 16 || password.length < 5){
					ret = "密码长度应为5到16个字符之间！";
				}
				else if(password != confirm_password){
					ret = "确认密码与密码不一致！";
				}else if(!phone){
					ret = "手机号不能为空！";
				}else if(!this.code || !this.codeCheck || (this.code.toUpperCase() != this.codeCheck.toUpperCase())){
					ret = "验证码错误！";
				}
			
				return ret;
			}
		},
		created() {
			this.get_user_group();
		}
	}
</script>

<style>
	
	/* 验证码容器 */
	        .captcha-box {
	            position: relative;
	            width: 200px;
	            height: 60px;
	            background: #f0f0f0;
	            margin: 20px;
	            overflow: hidden;
	        }
	
	        /* 基础文字样式 */
	        .captcha-text {
	            position: absolute;
	            font-size: 32px;
	            font-weight: bold;
	            color: #333;
	            font-family: Arial;
	            letter-spacing: 5px;
	        }
	
	        /* 单个字符的随机扭曲 */
	        .char-distort {
	            display: inline-block;
	            transform-origin: 50% 50%;
	        }
	
	        /* 干扰线样式 */
	        .noise-line {
	            position: absolute;
	            background: rgba(255, 0, 0, 0.3);
	        }
	
	
	.sign_in {
		box-sizing: border-box;
		height: 100vh;
		padding: .5rem;
		width: 100%;
		background: url(/img/bg2.png) no-repeat;
		background-size: 100% 100%;
		color: #fff;
	}

	.sign_in h1,
	.sign_in .btns {
		text-align: center;
	}

	.sign_in .btns .el-button {
		width: 40%;
	}

	.sign_in .el-form-item__label {
		color: #fff;
	}

	.sign_in .form {
		box-sizing: border-box;
		padding: 1rem 3rem;
		margin: auto;
		margin-top: 13rem;
		width: 100%;
		max-width: 25rem;
		box-shadow: 0 0 0 1px hsla(240, 0%, 100%, .3) inset,
			0 .5em 1em rgba(50, 50, 50, 0.6);
		text-shadow: 0 1px 1px hsla(240, 0%, 100%, .5);
		overflow: hidden;
		/* background-color: rgba(255, 255, 255, .5); */
		border-radius: 0.5rem;
	}

	.sign_in .form:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.8);
		z-index: -1;

		background-image: url(/img/bg.jpg);
		background-position: center top;
		background-size: cover;
		background-attachment: fixed;
		-webkit-filter: blur(20px);
		-moz-filter: blur(20px);
		-ms-filter: blur(20px);
		-o-filter: blur(20px);
		filter: blur(20px);
	}
</style>
