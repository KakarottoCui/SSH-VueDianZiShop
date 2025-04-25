<template>
	<div class="line_chart" :id="id">折线图</div>
</template>

<script>
	import echarts from "@/assets/js/echarts.min.js";
	import common from '@/common/commonRequest.js'
	
	export default {
		name: "Home",
		components: {},
		props: {
			id: {
				type: String,
				default: "lineChart"
			},
			selParkId: {
				type: Number,
				default: 0
			},
			type: {
				type: String,
				default: 'people'
			},
			title: {
				type: String,
				default: "XXX折线图"
			},
			vm: {
				type: Object,
				default: function() {
					return {
						xAxis: "xAxis",
						names: "names",
						values: "values",
					};
				},
			}
		},
		data() {
			return {
				url:"",
				option: {
					title: {
						text: "7日个类商品销售额",
						left: "center",
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						bottom: '5%',
						left: "center",
					},
					grid: {
						left: "3%",
						right: "10%",
						bottom: "14%",
						containLabel: true,
					},
					toolbox: {
						feature: {
							saveAsImage: {},
						},
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: []
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [
						// {
						// 	name: 'Forest',
						// 	type: 'bar',
						// 	barGap: 0,
						// 	emphasis: {
						// 		focus: 'series'
						// 	},
						// 	data: [320, 332, 301, 334, 390]
						// },
					]
				}
			};
		},
		created() {
			this.url = common.urlMap.countDataPeopleMonthPark;
			if(this.selParkId != 0){
				this.getData(this.url)
			}
			
		},
		mounted() {
			let that=this;
			setTimeout(function(){
				
			},600)
			
		},
		watch: {
			
			selParkId(newVal, oldVal) {  
			      alert(1);
			      this.getData(this.url)
			    }
		  },
		methods: {
			reSend(id,type){
				
				this.getData(this.url,id)
				
			},
			getData(url,id){
				let _this = this;
				common.request({
					method:'get',
				  url: url+"?parkFk="+ (id||this.selParkId)  ,
				  headers:{
					  'content-type': 'application/x-www-form-urlencoded'
					},
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.init_chart(res.data.data.price);
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
			init_chart(data) {
				var option = this.option;

				var title = this.title;
				if (title) {
					option.title.text = title;
				}
				var x =[];
				var y = [];
				for(var i = 0;i<data.length;i++){
					x.push(data[i].carNo);
					y.push(data[i].price);
				}
				
				// var series = this.series;
				option.series = {
				  data: y,
				  type: 'line'
				};
				
				option.xAxis[0].data = x;
				

				let myChart = echarts.init(document.getElementById(this.id));
				myChart.setOption(option);
			},
		},
		computed: {
			series() {
				var vm = this.vm;
				var list = this.vm.names;
				var values = vm.values;
				var series = [];
				for (let i=0;i<list.length;i++){
					let data = []
					for (let j=0;j<values.length;j++){
						data.push(values[j][i]);
					}
					let dict_type = {
							name: list[i],
							type: 'line',
						 	data: data
					}
					series.push(dict_type);
				}

				return series;
			}
		},
		watch: {
			list() {
				this.init_chart();
			},
		},
	};
</script>
