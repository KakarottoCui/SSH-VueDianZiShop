<template>
	<div class="layui-card " id="app">
		<div id="mainDiv">
		<el-container class="margin-t">
			<el-header class="main-view" height="10vh">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="订单ID">
						<el-input v-model="title" placeholder="输入订单ID"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">查询</el-button>
					</el-form-item>
					<!-- <el-form-item>
            <el-button type="success" @click="addBook">新增</el-button>
          </el-form-item> -->
				</el-form>


			</el-header>


			<el-main class="main-view" style="min-height: 87vh;">

				<el-table :stripe="true" :data="tableData" max-height="650" style="width: 100%;">
					<el-table-column prop="id" label="订单ID" width="80">
					</el-table-column>
					<el-table-column prop="" label="状态" width="120">
						<template slot-scope="scope">
							<div class="text-ellipsis-2"
								:class="('text-'+['black','blue','green','red'][scope.row.state])">
								{{getStateName(scope.row.state)}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="" label="类型" width="120">
						<template slot-scope="scope">
							<div class="text-ellipsis-2 ">{{scope.row.nmOrderItemList[0].nmGoods.creater == user.uid ? "售出":"购买" }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="图片" width="120">
						<template slot-scope="scope">
							<img style="width: 100px;height: 100px;" :src="picPath+scope.row.nmOrderItemList[0].nmGoods.pic"/>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="商品" width="120">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.nmOrderItemList[0].nmGoods.title }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="总金额" width="120">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.priceSum + scope.row.expressPrice - scope.row.couponPrice }}元</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="运费" width="120">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.expressPrice }}元</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="快递商家" width="120">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.express }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="地址" width="200">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.address }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="支付方式" width="200">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.payType }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="优惠金额" width="120">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.couponPrice || 0 }}元</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="验机情况" width="120">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.nmOrderItemList[0].nmGoods.goodsType == 1 ?"完成验机":"未验机" }}</div>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" prop="price" label="商品数" width="80">
						<template slot-scope="scope">
							<div class="text-ellipsis-2" style="text-align: center;width: 100%;">
								{{scope.row.nmOrderItemList.length}}</div>
						</template>
					</el-table-column> -->
					<el-table-column align="center" prop="price" label="用户ID" width="80">
						<template slot-scope="scope">
							<div class="text-ellipsis-2" style="text-align: center;width: 100%;">{{scope.row.creater}}
							</div>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="singerFk" label="备注" width="100">
						<template slot-scope="scope">
							<div class="text-ellipsis-2">{{scope.row.memo}}</div>
						</template>
					</el-table-column> -->

					<el-table-column fixed="right" label="操作" width="200" v-if="user.type == 2 ">
						<template slot-scope="scope">
							<!-- <el-button @click="toEdit(scope.row)" type="text" size="small">详情</el-button> -->
							<div v-if="scope.row.nmOrderItemList[0].nmGoods.creater == user.uid">
								<el-button v-if="user.type==2 && scope.row.state == -1" @click="changeSatat(scope.row,0)" type="text" size="small">发货</el-button>
								<el-button v-if="user.type==2 && scope.row.state >0 && scope.row.commentb !=1" @click="setComment(scope.row,2)" type="text" size="small">评价买家</el-button>
								<el-button v-if="user.type==2 && scope.row.state >0" @click="setComment(scope.row,1)" type="text" size="small">投诉买家</el-button>
								<el-button v-if="scope.row.checkId" @click="getCheckReport(scope.row.nmOrderItemList[0].nmGoods)" type="text" size="small">查看验机报告</el-button>
								
							</div>
							<div v-else>
								<el-button v-if="user.type==2 && scope.row.state == 0" @click="cancleOrder(scope.row)" type="text" size="small">退款</el-button>
								<el-button v-if="user.type==2 && scope.row.state == 0" @click="changeSatat(scope.row,1)" type="text" size="small">收货</el-button>
								<el-button v-if="user.type==2 && scope.row.state > 0 && scope.row.comments !=1 " @click="setComment(scope.row,3)" type="text" size="small">评价卖家</el-button>
								<el-button v-if="user.type==2 && scope.row.state > 0" @click="setComment(scope.row,0)" type="text" size="small">投诉卖家</el-button>
								<el-button v-if="scope.row.checkId" @click="getCheckReport(scope.row.nmOrderItemList[0].nmGoods)" type="text" size="small">查看验机报告</el-button>
							</div>
							
							
							
							
							<!-- <el-button @click="delData(scope.row)" type="text" class="text-red"
								size="small">删除</el-button> -->
						</template>
					</el-table-column>
				</el-table>

			</el-main>
		</el-container>
		<el-dialog title="验机报告" :visible.sync="showReport">
			<div class="padding-10" style="text-align: center;">
				<div class="text-lg text-bold text-blue padding-20">验机报告</div>
				<div class="padding-20"><span class="text-bold">验机平台：</span>{{checkEmp.nickName}}</div>
				<div class="padding-20"><span class="text-bold">验机评分：</span>{{checkReport.star}}</div>
				<div class="padding-20"><span class="text-bold">报告内容：</span>{{checkReport.comment}}</div>
			</div>
		</el-dialog>	
		<el-dialog title="订单详情" :visible.sync="show">
			<el-form :model="dataView">
				<el-form-item label="订单ID" label-width="120px">
					<el-input :disabled="true" :value="dataView.id" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="订单状态" label-width="120px">
					<el-input :disabled="true" :value="getStateName(dataView.state) " autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="订单金额" label-width="120px">
					<el-input :disabled="true" :value="dataView.priceSum || '/' " autocomplete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="快递" label-width="120px">
					<el-input :disabled="true" :value="dataView.express || '/' " autocomplete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="订单明细" label-width="120px">
					<div>
						<el-table :data="dataView.nmOrderItemList" style="width: 100%" max-height="250">
							<el-table-column prop="name" label="商品ID" width="80">
								<template slot-scope="scope">
									<div class="text-ellipsis-2">{{scope.row.nmGoods.id}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="商品名" width="80">
								<template slot-scope="scope">
									<div class="text-ellipsis-2">{{scope.row.nmGoods.title}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="商品价格" width="80">
								<template slot-scope="scope">
									<div class="text-ellipsis-2">{{scope.row.nmGoods.price}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="商品数量" width="80">
								<template slot-scope="scope">
									<div class="text-ellipsis-2">{{scope.row.num}}</div>
								</template>
							</el-table-column>
						</el-table>

						<!-- <div style="display: flex;justify-content: flex-start;"
							v-for="(item,index) in dataView.nmOrderItemList" :key="index">
							<div style="padding: 5px;">商品ID:{{itemitem.nmGoods.id}}</div>
							<div style="padding: 5px;">商品名:{{item.nmGoods.title}}</div>
							<div style="padding: 5px;">商品价格:{{item.nmGoods.price}}</div>
							<div style="padding: 5px;">商品数量:{{item.num}}</div>
						</div> -->
					</div>
				</el-form-item>
				<el-form-item label-width="120px" label-position="left" placeholder="" prop="price" label="下单用户ID">
					<el-input :disabled="true" :value="dataView.creater " autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label-width="120px" label-position="left" placeholder="" prop="price" label="下单日期">
					<el-input :disabled="true" :value="dataView.createTime " autocomplete="off"></el-input>
				</el-form-item>


				<el-form-item label-width="120px" label-position="left" placeholder="" prop="price" label="支付日期">
					<el-input :disabled="true" :value="dataView.payTime " autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label-width="120px" label-position="left" placeholder="" prop="price" label="完成日期">
					<el-input :disabled="true" :value="dataView.compTime " autocomplete="off"></el-input>
				</el-form-item>

				<!-- <el-form-item label-width="120px" label-position="left" placeholder="请输入库存" prop="num" label="库存">
		  <el-input type="number" v-model="dataView.num"></el-input>
		</el-form-item> -->

				<el-form-item label="备注" label-width="120px">
					<el-input type="textarea" v-model="dataView.memo" autocomplete="off"></el-input>
				</el-form-item>




			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="show = false">取 消</el-button>
				<el-button type="primary" @click="editData">确 定</el-button>
			</div>
		</el-dialog>
		
		
		<el-dialog :title="commentInfo[commengType]" :visible.sync="showComment">
			<el-form :model="commentObj">
				<el-form-item label="评分(满分10)" label-width="120px">
					<el-input type="number" v-model="commentObj.star" ></el-input>
				</el-form-item>
				<el-form-item label="内容" label-width="120px">
					<el-input type="textarea" v-model="commentObj.comment" autocomplete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="show = false">取 消</el-button>
				<el-button type="primary" @click="subComment">确 定</el-button>
			</div>
		</el-dialog>
		
		
		
		</div>
	</div>
</template>

<script>
	import common from '@/common/commonRequest.js'
	export default {
		name: 'nmCarManager',
		data: function() {
			return {
				showReport:false,
				checkReport:{},
				checkEmp:{},
				title: "",
				user: '',
				show: false,
				typeList: [],
				dataView: {},
				dataStationView: {},
				tableData: [],
				userInfo: {},
				showMapSel: false,
				selObj: {},
				selName: "",
				showStationTable: false,
				showStationEdit: false,
				tableStationData: [],
				setBtn: false,
				picPath: common.urlMap.getFile,
				allPark: [],
				uploadUrl: common.urlMap.uploadFile,
				fileList: [],
				infoType:["已付款","已收货","已退货"],
				showComment:false,
				commentInfo:['投诉卖家','投诉买家', '评价买家','评价卖家'],
				commengType:0,
				commentObj:{
					comment:"",
					uid:0,
					stat:0,
					type:"",
					orderNo:"",
					star:10
				}
			};
		},
		mounted() {

		},
		created() {
			this.user = common.getUserInfo();
			if (!this.user || this.user.type == 3) {
				this.$router.push("/login");
			}
			this.getData();
		},
		methods: {
			subComment(){
				let _this = this;
				common.request({
					data: this.commentObj,
					url: common.urlMap.addNmEshopComplaint,
					success: function(res) {
						if (res.data.code == 200) {
							if(_this.commengType == 2){
								_this.dataView['commentb'] = 1;
								_this.editData();
							}else if(_this.commengType == 3){
								_this.dataView['comments'] = 1;
								_this.editData();
							}else{
								_this.getData();
							}
							
						} else {
							common.err(res.data.msg);
						}
						_this.showComment = false;
						_this.commentObj = {
							comment:"",
							uid:0,
							stat:0,
							type:"",
							orderNo:"",
							star:10
						}
					},
					fail: function(res) {
						common.err("网络异常");
					}
				});
				
			},
			setComment(obj,state){
				this.commengType = state;
				this.dataView = obj;
				if(state == 0||state==3){
					this.commentObj.uid = obj.sid;
				}else{
					this.commentObj.uid = obj.creater;
				}
				this.commentObj.orderNo = obj.id;
				this.commentObj.type = state;
				this.showComment = true;
			},
			changeState(obj) {
				obj.state = obj.state == 1 ? 0 : 1;
				this.dataView = obj;
				this.editData()
			},
			changeHot(obj) {
				obj.hot = obj.hot == 1 ? 0 : 1;
				this.dataView = obj;
				this.editData();
			},
			onSubmit() {
				this.getData();
			},
			getCheckReport(item){
				this.checkReport = item;
				if(item.goodsType == 1){
					this.getCheck(item);
					this.showReport = true;
				}else{
					common.msg("未完成验货，请稍等")
				}
			},
			getCheck(item) {
				let _this = this;
				
				var param = {
					uid: item.checkId,
					validFlag: 1,
				}
				
				common.request({
					data: param,
					url: common.urlMap.findSysUser,
					success: function(res) {
						if (res.data.code == 200) {
							_this.checkEmp = res.data.data;
						} else {
							common.err(res.data.msg);
						}
					},
					fail: function(res) {
						common.err("网络异常");
					}
				});
			},
			getData() {
				let _this = this;
				
				var param = {
					id: _this.title,
					validFlag: 1,
				}
				if(this.user.type != 1){
					param['creater'] = this.user.uid;
					param['sid'] = this.user.uid;
				}
				
				common.request({
					data: param,
					url: common.urlMap.findNmOrderList,
					success: function(res) {
						if (res.data.code == 200) {
							_this.tableData = res.data.data;
						} else {
							common.err(res.data.msg);
						}
					},
					fail: function(res) {
						common.err("网络异常");
					}
				});
			},
			addBook() {
				this.dataView = {
					title: "",
					type: "",
					price: "",
					pic: "",
					pic2: "",
					pic3: "",
					content: "",
					hot: 0,
					state: -1,
					num: 1
				}
				this.fileList = [];
				this.show = true;
			},
			getTypeName(typeId) {
				for (let i = 0; i < this.typeList.length; i++) {
					if (this.typeList[i].id == typeId) {
						return this.typeList[i].groupName;
					}
				}
				return "";
			},
			showData(row) {
				this.dataView = row;
				this.show = true;
			},
			addPush(row) {
				this.dataView = row;
				this.editData();
			},
			toEdit(row) {
				this.fileList = [];
				this.dataView = row;
				this.show = true;
			},
			changeType(row) {
				this.dataView = row;
				switch (row.type) {
					case 0:
						this.dataView.type = 1;
						break;
					case 1:
						this.dataView.type = 2;
						break;
					case 2:
						this.dataView.type = 1;
						break;
				}
				this.editData();
			},
			delData(row) {
				this.dataView = row;
				this.dataView["validFlag"] = 0;
				this.editData();
			},
			cancleOrder(item){
				let _this = this;
				common.request({
				  data: {
					  id:item.id,
					  state:2
				  },
				  url: common.urlMap.cancelNmOrder,
				  success: function(res) {
				    if (res.data.code == 200) {
				      common.msg("已取消");
					  _this.getData();
				    } else {
				      common.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   appRequest.msg("网络异常");
				  }
				});
			},
			dateFormat : function(fmt, date) {
				let ret;
				const opt = {
					"Y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"H+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"S+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				return fmt;
			},
			editData() {
				let _this = this;
				// for (let key in _this.dataView) {
				// 	if (!_this.dataView[key] && _this.dataView[key] != 0) {
				// 		common.err("请填写完整");
				// 		return;
				// 	}
				// }

				let url = _this.dataView.id ? common.urlMap.editNmOrder : common.urlMap.addNmOrder;

				common.request({
					url: url,
					data: _this.dataView,
					success: function(res) {
						if (res.data.code == 200) {
							common.success(res.data.msg)
							_this.show = false;
							_this.getData();
						} else {
							common.err(res.data.msg);
						}
					},
					fail: function(res) {
						common.err("网络异常");
					}
				})

			},
			getPicUrl(pic) {
				if (!pic || pic.length < 100) {
					return this.picPath + pic;
				} else {
					return pic;
				}
			},
			editPic(data, index) {
				this.createInput(index);
			},
			createInput(index) {
				let _this = this;
				var input = document.createElement('input');
				input.type = 'file';
				input.setAttribute("accept", "image/*,.png,.jpg,.jpeg,.bmp"); //仅能选择图片
				input.id = "hidden-input-file";
				input.style.display = "none";
				input.onchange = function() {
					var file = this.files[0];
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function(e) {
						var data = e.target.result;

						function dealImage(base64, w, size, callback, quality) {
							var newImage = new Image();
							var picSize = base64.length / 1024;
							quality = quality || 0.85; //压缩系数0-1之间
							size = size || 512;
							//根据图片大小调整压缩比
							if (picSize < size / 3) {
								callback(base64);
								return;
							} else if (picSize > 6144) {
								quality = 0.7;
							}
							newImage.src = base64;
							newImage.setAttribute("crossOrigin", 'Anonymous'); //url为外域时需要
							var imgWidth, imgHeight;
							newImage.onload = function() {
								imgWidth = this.width;
								imgHeight = this.height;
								var canvas = document.createElement("canvas");
								var ctx = canvas.getContext("2d");
								if (Math.max(imgWidth, imgHeight) > w) {
									if (imgWidth > imgHeight) {
										canvas.width = w;
										canvas.height = w * imgHeight / imgWidth;
									} else {
										canvas.height = w;
										canvas.width = w * imgWidth / imgHeight;
									}
								} else {
									canvas.width = imgWidth;
									canvas.height = imgHeight;
								}
								ctx.clearRect(0, 0, canvas.width, canvas.height);
								ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
								var base64 = canvas.toDataURL("image/jpeg",
								quality); //绘制压缩,修改格式需注意，png格式不能用此方式压缩
								// 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
								while (base64.length / 1024 > size) {
									quality -= 0.05;
									base64 = canvas.toDataURL("image/jpeg", quality);
								}
								callback(base64); //必须通过回调函数返回，否则无法及时拿到该值
							}
						}

						dealImage(data, 1440, 1560, function(base64) {
							_this.dataView['pic' + index] = base64;
							_this.$forceUpdate();
						})

					};
				};
				input.click();
			},
			getTypeList() {
				
			},
			getStateName(state) {
				switch (state) {
					case -1:
						return "买家已付款";
						break;
					case 0:
						return "卖家已发货";
						break;
					case 1:
						return "已收货";
						break;
					case 2:
						return "已退货";
						break;
					default:
						break;
				}
			},changeSatat(row,state){
				this.dataView = row;
				this.dataView["state"] = state;
				this.editData();
			}
		}
	}
</script>

<style>
	@import "/css/nmMain.css";
</style>