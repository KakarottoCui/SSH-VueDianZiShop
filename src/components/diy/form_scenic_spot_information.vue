<template>
	<div>
		<el-form-item v-if="$check_register_field('add','attraction_number','/scenic_spot_information/view')" label="景点编号" prop="attraction_number">
		<el-input id="attraction_number" v-model="form['attraction_number']" placeholder="请输入景点编号"></el-input>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','name_of_scenic_spot','/scenic_spot_information/view')" label="景点名称" prop="name_of_scenic_spot">
		<el-input id="name_of_scenic_spot" v-model="form['name_of_scenic_spot']" placeholder="请输入景点名称"></el-input>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','scenic_spot_cover','/scenic_spot_information/view')" label="景点封面" prop="scenic_spot_cover">
		<el-upload id="scenic_spot_cover" class="avatar-uploader" drag
			accept="image/gif, image/jpeg, image/png, image/jpg" action="" :http-request="uploadimg"
			:show-file-list="false" >
			<img v-if="form['scenic_spot_cover']" :src="$fullUrl(form['scenic_spot_cover'])" class="avatar">
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','business_hours','/scenic_spot_information/view')" label="营业时间" prop="business_hours">
		<el-input id="business_hours" v-model="form['business_hours']" placeholder="请输入营业时间"></el-input>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','scenic_spot_address','/scenic_spot_information/view')" label="景点地址" prop="scenic_spot_address">
		<el-input id="scenic_spot_address" v-model="form['scenic_spot_address']" placeholder="请输入景点地址"></el-input>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','region','/scenic_spot_information/view')" label="地区" prop="region">
		<el-select id="region" v-model="form['region']">
			<el-option v-for="o in list_region" :key="o.region" :label="o.region"
				:value="o.region">
			</el-option>
		</el-select>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','ticket_price','/scenic_spot_information/view')" label="门票价格" prop="ticket_price">
		<el-input id="ticket_price" v-model="form['ticket_price']" placeholder="请输入门票价格"></el-input>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','number_of_tickets','/scenic_spot_information/view')" label="门票数" prop="number_of_tickets">
		<el-input-number id="number_of_tickets" v-model.number="form['number_of_tickets']"></el-input-number>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','score','/scenic_spot_information/view')" label="评分" prop="score">
		<el-input-number id="score" v-model.number="form['score']"></el-input-number>
		</el-form-item>
		<el-form-item v-if="$check_register_field('add','scenic_spot_details','/scenic_spot_information/view')" label="景点详情" prop="scenic_spot_details">
			<quill-editor v-model.number="form['scenic_spot_details']">
			</quill-editor>
		</el-form-item>

	</div>
</template>

<script>
	import mixin from "@/mixins/component.js";

	export default {
		mixins: [mixin],
		props:{

			form:{
				type: Object,
				default: function(){
					return {
						"attraction_number":'',
						"name_of_scenic_spot":'',
						"scenic_spot_cover":'',
						"business_hours":'',
						"scenic_spot_address":'',
						"region":'',
						"ticket_price":'',
						"number_of_tickets":0,
						"score":0,
						"scenic_spot_details":'',
					}
				}
			},

		},
		data() {
			return {
				field: "scenic_spot_information_id",
				url_add: "~/api/scenic_spot_information/add?",
				url_set: "~/api/scenic_spot_information/set?",
				url_upload: "~/api/scenic_spot_information/upload?",
				list_region: [],

				rules: {
					"attraction_number": [ {required: true,message: '景点编号不能为空'}, ],
					"name_of_scenic_spot": [ ],
					"scenic_spot_cover": [ ],
					"business_hours": [ ],
					"scenic_spot_address": [ ],
					"region": [ ],
					"ticket_price": [ ],
					"number_of_tickets": [ ],
					"score": [ ],
					"scenic_spot_details": [ ],
				}

			}
		},
		methods: {
			/**
			 * 上传景点封面
			 * @param {Object} param 图片参数
			 */
			uploadimg(param) {
				this.uploadFile(param.file, "scenic_spot_cover");
			},
			/**
			 * 获取地区列表
			 */
			async get_list_region() {
				var list = await this.$get("~/api/regional_management/get_list?");
				this.list_region = list.result.list;
			},

		},
		created() {
			this.get_list_region();
		}
	}
</script>
