<template>
	<div class="page_root" id="root_index">
		<div class="warp">
			<div class="container-fluid">
				<el-row>
					<el-col :span="8">
						<div class="card chart2 text-big v-flex v-r-center v-c-center"><i class="el-icon-user-solid text-blue margin-r"></i>用户数：{{data.allUser.length}}</div>
					</el-col>
					<el-col :span="8">
						<div class="card chart2 text-big v-flex v-r-center v-c-center"><i class="el-icon-s-home text-blue margin-r"></i>停车场数：{{data.allPark.length}}</div>
					</el-col>
					<el-col :span="8">
						<div class="card chart2 text-big v-flex v-r-center v-c-center"><i class="el-icon-s-grid text-blue margin-r"></i>车位数：{{data.allItem.length}}</div>
					</el-col>
				</el-row>
						
				<el-row>
					<el-col :span="24">
						<div class="v-flex v-r-between">
							<el-form :inline="true" class="demo-form-inline">
							  <el-form-item label="停车场名称">
							   <el-select @change="onSubmit" v-model="selParkId" placeholder="请选择停车场">
							       <el-option
							         v-for="item in allPark"
							         :key="item.id"
							         :label="item.name"
							         :value="item.id">
							       </el-option>
							     </el-select>
							  </el-form-item>
							  
							</el-form>
						</div>	
						<div class="v-flex v-r-between">
							<div class="card chart">
								<newLineChart ref="reSend" :selParkId="selParkId"  id="line_obj_ticket_reservation" type="day" :title="'近一月每日收入'">
								</newLineChart>
							</div>
							<div class="card chart">
								<newLineChart2 ref="reSend2" type="month" :selParkId="selParkId" id="line_obj_ticket_reservation2" :title="'近6月收入'">
								</newLineChart2>
							</div>
							<div class="card chart">
								<newLineChart3 ref="reSend3" type="people" :selParkId="selParkId" id="line_obj_ticket_reservation3" :title="'近6月人流量'">
								</newLineChart3>
							</div>
						</div>
						
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>
<script>
	import common from '@/common/commonRequest.js'
	import mixin from "@/mixins/page.js";
	import pieChart from "@/components/charts/pie_chart";
	import barChart from "@/components/charts/bar_chart";
	import newBarChart from "@/components/charts/new_bar_chart";
	import lineChart from "@/components/charts/line_chart";
	import newLineChart from "@/components/charts/new_line_chart";
	import newLineChart2 from "@/components/charts/new_line_chart2";
	import newLineChart3 from "@/components/charts/new_line_chart3";
	import mm_label from "@/components/mm_label.vue";
	export default {
		mixins: [mixin],
		name: "Home",
		components: {
			pieChart,
			barChart,
			newBarChart,
			lineChart,
			newLineChart,
			newLineChart2,
			newLineChart3,
			mm_label
		},
		data() {
			return {
				allPark:[],
				isAdmin: false,
				recognitionType: "",
				activeName: "third",
				line_obj_ticket_reservation:{
					// names:[1,2,3],
					// xAxis: [3,4,5],
					// values:[106,206,360]
				},
				line_obj_hotel_reservation:{
					names:[],
					xAxis: [],
					values:[]
				},
				url_user_count: "~/api/user/count?",
				data:{allUser:[]},
				selParkId:0
			};
		},
		created() {
			
			this.getData();
			this.getParkData();
		},
		mounted() {},
		methods: {
			onSubmit(val){
				this.selParkId = val;
				window.localStorage.setItem("pageChartsItem",val);
				window.location.reload();
			},
			getParkData() {
			  let _this = this;
			  common.request({
			    data: {
			      validFlag: 1
			    },
			    url: common.urlMap.findNmCarParkList,
			    success: function(res) {
			      if (res.data.code == 200) {
					  _this.allPark = res.data.data;
					  let val = window.localStorage.getItem("pageChartsItem");
					  if(val){
						  val = Number(val);
						  _this.selParkId = val;
					  }else{
						  _this.selParkId = _this.allPark[0].id
					  }
					
			      } else {
			        common.err(res.data.msg);
			      }
			    },
			    fail: function(res) {
			      common.err("网络异常");
			    }
			  });
			},
			getData(){
				let _this = this;
				common.request({
				  url: common.urlMap.countData,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.data = res.data.data;
					  //:vm="line_obj_ticket_reservation"
				    } else {
				      common.err(res.data.msg);
				    }
				  },
				  fail: function(res) {
					  console.log(res)
				    common.err("网络异常");
				  }
				});
			},
			async get_nickname(list,flag){
				if (flag) {
					for (let i=0;i<list.length;i++){
						await this.$get(
								"~/api/user/get_obj?user_id="+list[i],
								null,
								(json) => {
									if (json.result) {
										list[i] = json.result.obj.nickname;
									}
								});
					}
				}else {
					for (let i=0;i<list.length;i++){
						await this.$get(
								"~/api/user/get_obj?user_id="+list[i].name,
								null,
								(json) => {
									if (json.result) {
										list[i].name = json.result.obj.nickname;
									}
								});
					}
				}
			},
			// 获取门票预定统计折线图
			async get_list_ticket_reservation() {
				let group_by_value = "name_of_scenic_spot";
				let data = {};
				let flag = false;
				let user_group = this.$store.state.user.user_group;
				let user_id = this.$store.state.user.user_id;
				if (user_group!='管理员'){
					if (user_group=="普通用户"){
						data.user = user_id;
					}
				}
				await this.$get(
					"~/api/ticket_reservation/get_list?groupby="+group_by_value,data,
					(json) => {
						if (json.result) {
							let list = json.result.list;
							let name_list = [];
							for (let i=0;i<list.length;i++){
								name_list.push(list[i].name_of_scenic_spot);
							}
							this.line_obj_ticket_reservation.names = name_list;
							this.get_list_ticket_reservation_sub("name_of_scenic_spot",flag);
						}
				});
			},
			async get_list_ticket_reservation_sub(v1,names_flag) {
				let data = {};
				let flag = false;
				let user_group = this.$store.state.user.user_group;
				let user_id = this.$store.state.user.user_id;
				if (user_group!='管理员'){
					if (user_group=="普通用户"){
						data.user = user_id;
					}
				}
				await this.$get(
					"~/api/ticket_reservation/get_list?groupby=scheduled_time",data,
					(json) => {
						if (json.result) {
							let list = json.result.list;
							let xAxis_list = [];
							for (let i=0;i<list.length;i++){
								xAxis_list.push(this.$toTime(list[i].scheduled_time ,"yyyy-MM-dd"));
							}
							this.line_obj_ticket_reservation.xAxis = xAxis_list;
							this.get_list_ticket_reservation_sub_sub(v1,"scheduled_time",names_flag,flag);
						}
				});
			},
			async get_list_ticket_reservation_sub_sub(v1,v2,names_flag,xAxis_flag) {
				let data_str = "{\""+v1+"\":\"\",\""+v2+"\":\"\"}";
				let data = JSON.parse(data_str);
				let user_group = this.$store.state.user.user_group;
				let user_id = this.$store.state.user.user_id;
				if (user_group!='管理员'){
					if (user_group=="普通用户"){
						data.user = user_id;
					}
				}
				for (let i=0;i<this.line_obj_ticket_reservation.xAxis.length;i++){
					let list = []
					for (let j=0;j<this.line_obj_ticket_reservation.names.length;j++){
						data[v2] = this.line_obj_ticket_reservation.xAxis[i];
						data[v1] = this.line_obj_ticket_reservation.names[j];
						await this.$get(
								"~/api/ticket_reservation/sum?field=scheduled_number",
								data,
								(json) => {
									if (json.result) {
										list[j] = json.result;
									}else {
										list[j] = 0;
									}
								});
					}
					this.line_obj_ticket_reservation.values.push(list)
				}
				if (names_flag){
					this.get_nickname(this.line_obj_ticket_reservation.names,true);
				}
				if (xAxis_flag){
					this.get_nickname(this.line_obj_ticket_reservation.xAxis,true);
				}
			},
			// 获取酒店预定统计折线图
			async get_list_hotel_reservation() {
				let group_by_value = "hotel_name";
				let data = {};
				let flag = false;
				let user_group = this.$store.state.user.user_group;
				let user_id = this.$store.state.user.user_id;
				if (user_group!='管理员'){
					if (user_group=="普通用户"){
						data.user = user_id;
					}
				}
				await this.$get(
					"~/api/hotel_reservation/get_list?groupby="+group_by_value,data,
					(json) => {
						if (json.result) {
							let list = json.result.list;
							let name_list = [];
							for (let i=0;i<list.length;i++){
								name_list.push(list[i].hotel_name);
							}
							this.line_obj_hotel_reservation.names = name_list;
							this.get_list_hotel_reservation_sub("hotel_name",flag);
						}
				});
			},
			async get_list_hotel_reservation_sub(v1,names_flag) {
				let data = {};
				let flag = false;
				let user_group = this.$store.state.user.user_group;
				let user_id = this.$store.state.user.user_id;
				if (user_group!='管理员'){
					if (user_group=="普通用户"){
						data.user = user_id;
					}
				}
				await this.$get(
					"~/api/hotel_reservation/get_list?groupby=scheduled_time",data,
					(json) => {
						if (json.result) {
							let list = json.result.list;
							let xAxis_list = [];
							for (let i=0;i<list.length;i++){
								xAxis_list.push(this.$toTime(list[i].scheduled_time ,"yyyy-MM-dd"));
							}
							this.line_obj_hotel_reservation.xAxis = xAxis_list;
							this.get_list_hotel_reservation_sub_sub(v1,"scheduled_time",names_flag,flag);
						}
				});
			},
			async get_list_hotel_reservation_sub_sub(v1,v2,names_flag,xAxis_flag) {
				let data_str = "{\""+v1+"\":\"\",\""+v2+"\":\"\"}";
				let data = JSON.parse(data_str);
				let user_group = this.$store.state.user.user_group;
				let user_id = this.$store.state.user.user_id;
				if (user_group!='管理员'){
					if (user_group=="普通用户"){
						data.user = user_id;
					}
				}
				for (let i=0;i<this.line_obj_hotel_reservation.xAxis.length;i++){
					let list = []
					for (let j=0;j<this.line_obj_hotel_reservation.names.length;j++){
						data[v2] = this.line_obj_hotel_reservation.xAxis[i];
						data[v1] = this.line_obj_hotel_reservation.names[j];
						await this.$get(
								"~/api/hotel_reservation/sum?field=scheduled_number",
								data,
								(json) => {
									if (json.result) {
										list[j] = json.result;
									}else {
										list[j] = 0;
									}
								});
					}
					this.line_obj_hotel_reservation.values.push(list)
				}
				if (names_flag){
					this.get_nickname(this.line_obj_hotel_reservation.names,true);
				}
				if (xAxis_flag){
					this.get_nickname(this.line_obj_hotel_reservation.xAxis,true);
				}
			},
				getUserInfo(){
					// let userGroup = window.localStorage.getItem('user_group');
					// 	if(userGroup){
					// 	let _userGroup =JSON.parse(userGroup);
					// 	let _info = JSON.parse(_userGroup.value);
					// 	this.isAdmin = _info["user_group"] == "管理员" ? true : false;
					// }
			}

		},
		computed:{
			recognitionHeight(){
				if(this.recognitionType === "face"){
					return "1070px"
				}else{
					return "1180px"
				}
			},
			recognitionUrl(){
					if(this.recognitionType === "face"){
					return "https://www.sk-ai.com/Experience/face-compare"
				}else{
					return "https://www.sk-ai.com/Experience/recognition?type="
				}
			}
		}
	};
</script>

<style scoped="scoped">
	.chart {
		display: block;
		width: 32%;
		height: 400px;
		padding: 1rem;
		position: relative;
	}
	.chart2 {
		display: block;
		width: 100%;
		height: 100px;
		padding: 1rem;
		position: relative;
	}

	.el-col {
		padding: 0.5rem;
	}

	.card {
		overflow: hidden;
	}
	
	.iframe_box ,.iframe_box_change{
		width: 100%;
		height: 1180px;
		position: relative;
		margin-top: 25px;
	}
	.iframe_box_change{
		height: 580px;
		padding-top: 50px;
	}
.iframe_box	.iframe_box_content, .iframe_box_change .iframe_box_content{
	width: 100%;
	height: 100%;
}
.iframe_box_top{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100px;
	font-size: 25px;
	line-height: 100px;
	background: #fff;
	z-index: 99999999;
	padding-left: 50px;
}
</style>
