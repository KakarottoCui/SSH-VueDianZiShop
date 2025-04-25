 <template>
 	<div id="app mainDiv" style="width: 100%;">

 		<div class="top-bar bg-white">
 			<div class="top-logo" style="padding-left: calc( 50% - 590px );">
 				<img width="50px" height="50px" src="../../public/img/nuoMi.png" />
 				<div style="padding-left: 10px;">
 					<span style="color:#ff9c0a;">糯 </span><span class="text-blue">米 </span><span
 						style="color: white;text-stroke: 1px black;">电 子 交 易</span>
 				</div>
 				<div class="v-flex v-c-center" style="padding-left: 50px;line-height: 60px;">

 				</div>
 			</div>
 			<div class="v-flex v-c-center" style="padding-right: calc( 50% - 590px );">
 				<!-- <el-avatar size="medium" :src="(user?'../../public/img/nuoMi.png':'unknow.png')"></el-avatar> -->
 				<div class=" text-shadow text-blue" style="padding-left: 15px;">
 					{{ user? (user.nickName +"["+userType[user.type]+"]"):"游客" }}</div>
 				<div class=" text-shadow text-blue" style="padding-left: 15px;" v-if="user.type" @click="toManager">
 					个人中心</div>
 				<i class="text-blue el-icon-shopping-cart-2 padding-l" @click="toCert" v-if="user.type">购物车</i>
 			</div>
 		</div>


 		<!-- 主体内容，产品列表 -->
 		<el-main class="main-content" v-if="product.title">

 			<div class="product-container">
 				<img class="product-image" :src="picPath+product.pic" alt="商品主图">
 				<div class="product-info">
 					<h2>{{ product.title }}</h2>
 					<p><strong>价格:¥</strong> {{ product.price }}</p>
 					<p><strong>品牌:</strong> {{ product.brand }}</p>
 					<p><strong>型号:</strong> {{ product.model }}</p>
 					<p><strong>成色:</strong> {{ product.quality }}</p>
 					<p><strong>保修年限:</strong> {{ product.warranty }} </p>
 					<p><strong>商家:</strong> {{ product.user.nickName }}</p>
 					<p><strong>商家信用:</strong> {{ product.user.score }}</p>
 					<div class="button-container">
 						<el-button type="primary" @click="placeOrder">下单</el-button>
 						<el-button type="success" @click="addToCart(product)">加入购物车</el-button>
 						<el-button type="warning" @click="chat">联系卖家</el-button>
 					</div>
 				</div>
 			</div>
 			<div class="product-description">
 				<h3>商品简介</h3>
 				<p>{{ product.content }}</p>
 				<div class="description-images">
 					<img :src="picPath+product.pic2" alt="简介图片1">
 					<img :src="picPath+product.pic3" alt="简介图片2">
 				</div>
 			</div>

 		</el-main>

 		<el-dialog title="下单" :visible.sync="show" :close-on-click-modal="false" :close-on-press-escape="false"
 			:show-close="false">
 			<div class="payment-container2" v-if="product.title">
 				<div class="product-info2">
 					<img class="product-image2" :src="picPath+product.pic" alt="商品主图">
 					<div>
 						<h2>{{ product.title }}</h2>
 						<p><strong>价格:</strong> {{ product.price }}</p>
 						<p><strong>商家:</strong> {{ product.user.nickName }}</p>
 						<p><strong>商家信用:</strong> {{ product.user.score }}</p>
 					</div>
 				</div>
 				<div class="form-item">
 					<el-form>
 						<el-form-item label="验机平台">
 							<el-select v-model="order.checkId" placeholder="请选择验机平台" clearable filterable>
 								<el-option v-for="item in allCheckUser" :key="item.uid" :label="item.nickName"
 									:value="item.uid">
 								</el-option>
 							</el-select>
 						</el-form-item>
 					</el-form>
 				</div>

 				<div class="form-item" v-if="addressList.length > 0">
 					<el-form>
 						<el-form-item label="地址">
 							<el-select @change="resetPrice()" v-model="order.address" placeholder="请选择地址" clearable
 								filterable>
 								<el-option v-for="item in addressList" :key="item.id" :label="item.address"
 									:value="item.address">
 								</el-option>
 							</el-select>
 						</el-form-item>
 					</el-form>
 				</div>
 				<div class="form-item" v-if="addressList.length == 0">
 					<div class="text-blue" @click="toAddress">未添加地址，点击去添加</div>
 				</div>

 				<div class="form-item">
 					<el-form>
 						<el-form-item label="物流方式">
 							<el-select @change="resetPrice()" v-model="order.express" placeholder="请选择物流方式">
 								<el-option label="申通" value="申通"></el-option>
 								<el-option label="圆通" value="圆通"></el-option>
 								<el-option label="中通" value="中通"></el-option>
 								<el-option label="韵达" value="韵达"></el-option>
 								<el-option label="顺丰" value="顺丰"></el-option>
 								<el-option label="京东" value="京东"></el-option>
 							</el-select>
 						</el-form-item>
 					</el-form>
 				</div>

 				<div class="form-item">
 					<el-form>
 						<el-form-item label="预估运费">
 							<span>{{ order.expressPrice }} 元</span>
 						</el-form-item>
 					</el-form>
 				</div>

 				<div class="form-item" v-if="couponList.length > 0">
 					<el-form>
 						<el-form-item label="优惠券">
 							<el-select v-model="order.coupon.id" placeholder="请选择优惠券" clearable filterable>
 								<el-option v-for="item in couponList" :key="item.id" :label="item.price"
 									:value="item.id">
 								</el-option>
 							</el-select>
 						</el-form-item>
 					</el-form>
 				</div>
 				<div class="form-item">
 					<el-form>
 						<el-form-item label="支付方式">
 							<el-select v-model="order.payType" placeholder="请选择物流方式">
 								<el-option label="微信" value="微信"></el-option>
 								<el-option label="支付宝" value="支付宝"></el-option>
 								<el-option label="云闪付" value="云闪付"></el-option>
 							</el-select>
 						</el-form-item>
 					</el-form>
 				</div>
 				<div class="button-container">
 					<el-button @click="cancelOrder">取消</el-button>
 					<el-button type="primary" @click="sendOrder">下单</el-button>
 				</div>
 			</div>
 		</el-dialog>

 	</div>
 </template>

 <script>
 	import common from '@/common/commonRequest.js'
 	export default {
 		data() {
 			return {
 				id: null,
 				certId: null,
 				order: {
 					priceSum: 0,
 					state: 0,
 					address: "",
 					payType: "",
 					coupon: {
 						id: null,
 						price: 10
 					},
 					checkId: "",
 					express: "",
 					nmEshopCartList: [],
 					expressPrice: 0
 				},
 				show: false,
 				searchQuery: '',
 				user: {
 					type: 0
 				},
 				product: {},
 				userType: ["游客", "管理员", "用户", "验货机构"],
 				priceList: [""],
 				allCheckUser: [],
 				picPath: common.urlMap.getFile,
 				couponList: [],
 				addressList: []
 			};
 		},
 		created() {

 			this.user = common.getUserInfo();

 			if (!this.user) {
 				this.$router.push("/login");
 			}
 			this.id = this.getInfo("id");
 			this.certId = this.getInfo("certId");
 			if (this.certId) {
 				this.show = true;
 				this.getCert();
 			}
 			this.getData(this.id);
 			this.getCheckData();
 			this.getCoupon();
 			this.getAddress();
 		},
 		computed: {

 		},
 		methods: {
 			cancelOrder() {
 				this.$router.push("/mainPage");
 			},
 			resetPrice() {
 				this.order.expressPrice = Math.floor(Math.random() * (35 - 10 + 1)) + 10
 			},
 			toAddress() {
 				this.$router.push("/slides/addressManager");
 			},
 			getCert() {
 				let _this = this;
 				common.request({
 					data: {
 						validFlag: 1,
 						id: this.certId,
 					},
 					url: common.urlMap.findNmEshopCartList,
 					success: function(res) {
 						if (res.data.code == 200) {
 							_this.order.nmEshopCartList = res.data.data;
 						} else {
 							common.err(res.data.msg);
 						}
 					},
 					fail: function(res) {
 						common.err("网络异常");
 					}
 				});
 			},
 			getAddress() {
 				let _this = this;
 				common.request({
 					data: {
 						validFlag: 1,
 						creater: this.user.uid
 					},
 					url: common.urlMap.findNmEshopAddressList,
 					success: function(res) {
 						if (res.data.code == 200) {
 							_this.addressList = res.data.data;

 						} else {
 							common.err(res.data.msg);
 						}
 					},
 					fail: function(res) {
 						common.err("网络异常");
 					}
 				});
 			},
 			getCheckData() {
 				let _this = this;
 				common.request({
 					data: {
 						validFlag: 1,
 						type: 3
 					},
 					url: common.urlMap.findSysUserList,
 					success: function(res) {
 						if (res.data.code == 200) {
 							_this.allCheckUser = res.data.data;
 							_this.allCheckUser.unshift({
 								uid: "",
 								nickName: "无需验机"
 							})
 						} else {
 							common.err(res.data.msg);
 						}
 					},
 					fail: function(res) {
 						common.err("网络异常");
 					}
 				});
 			},
 			getCoupon() {
 				let _this = this;
 				common.request({
 					data: {
 						validFlag: 1,
 						state: 1,
 						uid: this.user.uid
 					},
 					url: common.urlMap.findNmEshopCouponList,
 					success: function(res) {
 						if (res.data.code == 200) {
 							_this.couponList = res.data.data;
 						} else {
 							common.err(res.data.msg);
 						}
 					},
 					fail: function(res) {
 						common.err("网络异常");
 					}
 				});
 			},
 			toCert() {
 				this.$router.push("/slides/certManager");
 			},
 			toManager() {
 				this.$router.push("/");
 			},
 			getInfo: function getUrlParams(data) {
 				const urlParams = new URLSearchParams(window.location.search);
 				const params = {};
 				urlParams.forEach((value, key) => {
 					params[key] = value;
 				});
 				return params[data];
 			},
 			sendOrder() {
 				let _this = this;

 				if (!this.order.address || !this.order.payType || !this.order.express) {
 					common.msg("请填写完整")
 					return;
 				}

				this.order.sid = this.product.creater;
 				this.order.priceSum = this.product.price;

 				common.request({
 					data: this.order,
 					url: common.urlMap.createNmOrder,
 					success: function(res) {
 						if (res.data.code == 200) {
 							common.msg(res.data.msg);
 							_this.show = false;
 							_this.$router.push("/slides/orderManager");
 						} else {
 							common.err("异常:" + res.data.msg);
 						}
 					},
 					fail: function(res) {
 						common.err("网络异常");
 					}
 				});

 			},
 			placeOrder() {
 				if (this.product.creater == this.user.uid) {
 					common.msg("这是你自己的上架的物品");
 					return;
 				}
 				this.order.nmEshopCartList = [{
 					goodsId: this.product.id,
 					validFlag: 1,
 					goodsName: this.product.title,
 					num: 1,
 					creater: this.user.uid
 				}]
 				this.show = true;

 			},
 			chat() {

 				if (this.product.creater == this.user.uid) {
 					common.msg("别和自己聊天成不？");
 					return;
 				}
				window.open("/chat?id="+this.product.creater,"_blank");
 			},
 			addToCart(item) {
 				if (this.product.creater == this.user.uid) {
 					common.msg("这是你自己的上架的物品");
 					return;
 				}
 				let _this = this;
 				var param = {
 					goodsId: item.id,
 					validFlag: 1,
 					goodsName: item.title,
 					num: 1,
 					creater: this.user.uid
 				}
 				common.request({
 					data: param,
 					url: common.urlMap.addNmEshopCart,
 					success: function(res) {

 						if (res.data.code == 200) {
 							common.msg(res.data.msg);
 						} else {
 							common.err("异常:" + res.data.msg);
 						}
 					},
 					fail: function(res) {
 						common.err("网络异常");
 					}
 				});
 			},
 			getData(id) {
 				let _this = this;
 				var param = {
 					id: id,
 					validFlag: 1,
 				}
 				common.request({
 					data: param,
 					url: common.urlMap.findNmGoods,
 					success: function(res) {
 						if (res.data.code == 200) {
 							_this.product = res.data.data;
 							_this.$forceUpdate()
 						} else {
 							common.err(res.data.msg);
 						}
 					},
 					fail: function(res) {
 						common.err("网络异常");
 					}
 				});
 			}
 		}
 	};
 </script>

 <style scoped>
 	#app {
 		font-family: Avenir, Helvetica, Arial, sans-serif;
 		-webkit-font-smoothing: antialiased;
 		-moz-osx-font-smoothing: grayscale;
 		color: #2c3e50;
 	}

 	.header {
 		background-color: #3498db;
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		padding: 0 20px;
 		color: white;
 	}

 	.header-left {
 		width: 300px;
 	}

 	.header-right {
 		display: flex;
 		align-items: center;
 	}

 	.product-container {
 		display: flex;
 		gap: 20px;
 	}

 	.product-image {
 		width: 300px;
 		height: 300px;
 		object-fit: cover;
 	}

 	.product-info {
 		flex: 1;
 	}

 	.product-description {
 		margin-top: 20px;
 	}

 	.description-images {
 		display: flex;
 		gap: 10px;
 		margin-top: 10px;
 	}

 	.description-images img {
 		width: 200px;
 		height: 200px;
 		object-fit: cover;
 	}


 	.payment-container2 {
 		max-width: 600px;
 		margin: 0 auto;
 		border: 1px solid #ccc;
 		padding: 20px;
 		border-radius: 5px;
 	}

 	.product-info2 {
 		display: flex;
 		align-items: center;
 		gap: 20px;
 		margin-bottom: 20px;
 	}

 	.product-image2 {
 		width: 150px;
 		height: 150px;
 		object-fit: cover;
 	}

 	.form-item2 {
 		margin-bottom: 15px;
 	}

 	.button-container2 {
 		margin-top: 20px;
 		display: flex;
 		justify-content: space-between;
 	}

 	.form-item {
 		margin-bottom: 15px;
 	}

 	body {
 		background-color: #f3f3f3;
 	}

 	.tab-item:hover {
 		background-color: #3f80de;
 	}

 	.tab-item {
 		padding: 15px;
 		color: white;
 	}

 	.tab-sel {
 		background-color: #3f80de;
 	}

 	.tab-list {
 		display: flex;
 		justify-content: flex-start;
 		align-items: center;
 		background-color: #409EFF;
 	}

 	.top-bar {
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		height: 60px;
 	}

 	.top-logo {
 		display: flex;
 		align-items: center;
 		font-size: 30px;
 		color: #E6A23C;
 		font-weight: bold;
 		text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
 	}

 	.bookItem {
 		width: 140px;
 		height: 138px;
 		padding-left: 5px;
 		display: flex;
 		flex-direction: column;
 		justify-content: space-between;
 		align-items: flex-start;
 	}

 	.list-item {
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		padding: 5px 0;
 		height: 24px;
 	}

 	.el-carousel__item div {
 		color: #475669;
 		font-size: 14px;
 		opacity: 0.75;
 		line-height: 200px;
 		margin: 0;
 	}

 	.el-carousel__item:nth-child(2n) {
 		background-color: #99a9bf;
 	}

 	.el-carousel__item:nth-child(2n+1) {
 		background-color: #d3dce6;
 	}

 	.el-form-item--mini {
 		margin-bottom: 10px !important;
 	}





 	/* .product-container {
 		display: flex;
 		gap: 20px;
 	}

 	.product-image {
 		width: 300px;
 		height: 300px;
 		object-fit: cover;
 	}

 	.product-info {
 		flex: 1;
 	}

 	.product-description {
 		margin-top: 20px;
 	}

 	.description-images {
 		display: flex;
 		gap: 10px;
 		margin-top: 10px;
 	}

 	.description-images img {
 		width: 200px;
 		height: 200px;
 		object-fit: cover;
 	}

 	.button-container {
 		margin-top: 20px;
 	}
	
	.payment-container {
	            max-width: 600px;
	            margin: 0 auto;
	            border: 1px solid #ccc;
	            padding: 20px;
	            border-radius: 5px;
	        }
	
	        .product-info {
	            display: flex;
	            align-items: center;
	            gap: 20px;
	            margin-bottom: 20px;
	        }
	
	        .product-image {
	            width: 150px;
	            height: 150px;
	            object-fit: cover;
	        }
	
	       
	
	        .button-container {
	            margin-top: 20px;
	            display: flex;
	            justify-content: space-between;
	        } */
 </style>