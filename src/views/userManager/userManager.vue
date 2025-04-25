<template>
  <div class="layui-card " id="app">
	<div id="mainDiv">
    <el-container class="margin-t">
      <el-header class="main-view" height="10vh">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户昵称">
            <el-input v-model="title" placeholder="输入昵称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
		  <el-form-item>
		    <el-button type="success" @click="add()">新增用户</el-button>
		  </el-form-item>
        </el-form>
      
      
      </el-header>
      <el-main class="main-view" style="min-height: 87vh;">

        <el-table :stripe="true" :data="tableData" style="width: 100%">
          <el-table-column prop="uid" label="ID" width="120">
          </el-table-column>
          <el-table-column prop="nickName" label="用户名" width="200">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.nickName}}</div>
            </template>
          </el-table-column>
		  
		  <!-- <el-table-column prop="pic" label="头像" width="100">
		    <template slot-scope="scope">
		      <div>
		        <div v-if="!scope.row.pic" class="text-ellipsis-2">未上传</div>
		        <el-image v-else :preview-src-list="[picPath+scope.row.pic ]" :src="picPath+scope.row.pic"
		          style="width: 80px; height: 80px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
		          <div slot="error" class="image-slot">
		            <i class="el-icon-picture-outline"></i>
		          </div>
		        </el-image>
		      </div>
		    </template>
		  </el-table-column> -->
		  
          <el-table-column prop="phone" label="手机号" width="200">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.phone}}</div>
            </template>
          </el-table-column>
		  <el-table-column prop="phone" label="信用分" width="200">
		    <template slot-scope="scope">
		      <div class="text-ellipsis-2">{{scope.row.type == 2 ? scope.row.score:"/"}}</div>
		    </template>
		  </el-table-column>
			<el-table-column prop="title" label="类型" width="150">
			  <template slot-scope="scope">
			    <div class="text-ellipsis-2">{{scope.row.type==1?"管理员":(scope.row.type==2?'用户':"验机平台")}}</div>
			  </template>
			</el-table-column>
          <el-table-column prop="createTime" label="添加时间" width="180">
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template slot-scope="scope">
              <el-button @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delData(scope.row)" type="text" class="text-red" size="small">删除</el-button>
			  <el-button @click="resetPass(scope.row)" type="text" class="text-red" size="small">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-main>
    </el-container>

    <el-dialog title="编辑用户" :visible.sync="show">
      <el-form :model="dataView">
        
		<el-form :model="dataView">
			<el-form-item label="昵称" label-width="120px">
				<el-input v-model="dataView.nickName" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="电话" label-width="120px">
				<el-input v-model="dataView.phone" autocomplete="off"></el-input>
			</el-form-item>
			<!-- <el-form-item label="头像" label-width="120px">
			  <div style="display: flex;justify-content: space-between;">
			    <div>
			      <el-image :preview-src-list="[getPicUrl(dataView.pic)]" :src="getPicUrl(dataView.pic)"
			        style="width: 100px; height: 100px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
			        <div slot="error" class="image-slot">
			          <i class="el-icon-picture-outline" style="font-size: 100px;"></i>
			        </div>
			      </el-image>
			      <div style="display: flex;justify-content: space-between;">
			        <div style="text-align: center;">头像</div>
			        <div @click="editPic(dataView,'')" style="text-align: center;color: #63a35c;">修改</div>
			      </div>
			    </div>
			  </div>
			</el-form-item> -->
			<el-form-item label="类型" label-width="120px">
				<el-select v-model="dataView.type" placeholder="请选择">
				  <el-option label="验机平台" :value="3"></el-option>
				   <el-option label="用户" :value="2"></el-option>
				  <el-option label="管理员" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="密码" label-width="120px">
				<div v-if="!dataView.uid">默认123456</div>
			</el-form-item>
			
		</el-form>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </div>
    </el-dialog>
</div>
  </div>
</template>

<script>
  import common from '@/common/commonRequest'
  export default {
    name: 'nmCarManager',
    data: function() {
      return {
        title: "",
        user: '',
        show: false,
        dataView: {},
        tableData: [],
        userInfo: {},
        selObj: {},
        selName: "",
        setBtn: false,
        picPath: common.urlMap.getFile
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
		resetPass(row){
			this.dataView = row;
			row.password = null;
			this.editData();
		},
		onSubmit() {
		  this.getData();
		},
      getData() {
        let _this = this;
        common.request({
          data: {
            validFlag: 1,
			nickName:_this.title
          },
          url: common.urlMap.findSysUserList,
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
      add() {
        this.dataView = {
          pic:"nuoMi.png",
          validFlag:1,
          nickName:"",
		  phone:""
        }
        this.show = true;
      },
      toEdit(row) {
        this.dataView = row;
        this.show = true;
      },
      changeState(row) {
        this.dataView = row;
        this.dataView["state"] = row.state == 1 ? 0 : 1;
        this.editData();
      },
      delData(row) {
        this.dataView = row;
        this.dataView["validFlag"] = 0;
        this.editData();
      },
      editData() {
        let _this = this;
        let url = this.dataView.uid ? common.urlMap.editSysUser : common.urlMap.regist;
        if(this.dataView.score){
			this.dataView["score"] = 10;
		}
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
                var base64 = canvas.toDataURL("image/jpeg", quality); //绘制压缩,修改格式需注意，png格式不能用此方式压缩
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
      }
    }
  }
</script>

<style>
	@import "/css/nmMain.css";
</style>
