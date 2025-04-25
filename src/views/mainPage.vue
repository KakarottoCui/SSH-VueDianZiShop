 <template>
  <div id="app">
	  <div id='mainDiv' style="width: 100%;">
	  <div class="top-bar bg-white">
	      <div class="top-logo" style="padding-left: calc( 50% - 590px );">
	          <img width="50px" height="50px" src="../../public/img/nuoMi.png" />
	          <div style="padding-left: 10px;">
	              <span style="color:#ff9c0a;">糯 </span><span class="text-blue">米 </span><span style="color: white;text-stroke: 1px black;">电 子 交 易</span>
	          </div>
	          <div class="v-flex v-c-center" style="padding-left: 50px;line-height: 60px;">
	              <el-input
	                      placeholder="请输入名称搜索"
	                      prefix-icon="el-icon-search"
	                      v-model="title"
	                      @keyup.enter.native="getData()">
	              </el-input>
	          </div>
	      </div>
	      <div class="v-flex v-c-center" style="padding-right: calc( 50% - 590px );">
	          <!-- <el-avatar size="medium" :src="(user?'../../public/img/nuoMi.png':'unknow.png')"></el-avatar> -->
	          <div class=" text-shadow text-blue" style="padding-left: 15px;">{{ user? (user.nickName +"["+userType[user.type]+"]"):"游客" }}</div>
				<div class=" text-shadow text-blue" style="padding-left: 15px;" v-if="user.type" @click="toManager">个人中心</div>
				<i @click="toCert" class="text-blue el-icon-shopping-cart-2 padding-l"  v-if="user.type" >购物车</i>
		  </div>
	  </div>
	  
	  <el-carousel :interval="4000" arrow="always">
	        <el-carousel-item v-for="(item, index) in tableData" :key="index">
	          <img v-if="index<4" :src="picPath+item.pic" alt="carousel image" style="width: 100%; height: 400px; object-fit: cover;">
	        </el-carousel-item>
	      </el-carousel>

    <!-- 主体内容，产品列表 -->
    <el-main class="main-content" style="width: calc( 100% - 300px );">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(product, index) in tableData" :key="index">
          <el-card :body-style="{ padding: '15px' }" class="product-card">
            <img @click="toItem(product.id)" :src="picPath+product.pic" alt="产品图片" class="product-image">
            <div @click="toItem(product.id)" class="product-info">
              <h3 class="product-name ">{{ product.title }}</h3>
              <p class="product-intro text-ellipsis-2">{{ product.content }}</p>
              <div class="product-details">
                <span class="product-price">¥{{ product.price }}</span>
                <span class="product-merchant">{{ product.type }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
	</div>
  </div>
</template>

<script>
	import common from '@/common/commonRequest'
export default {
  data() {
    return {
      searchQuery: '',
      userType:["游客","管理员","用户","验货机构"],
	  user:{
		  type:0
	  },
	  picPath: common.urlMap.getFile,
      tableData: [
        
      ]
    };
  },
  created() {
    this.user = common.getUserInfo();
    if (!this.user) {
      this.$router.push("/login");
    }
	this.getData();
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) {
        return this.products;
      }
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
	  toCert(){
			this.$router.push("/slides/certManager");
		},
	  toItem(id){
		  this.$router.push("/goodsItem?id="+id);
	  },
	  toManager(){
		  this.$router.push("/");
	  },
    searchProducts() {
      // 这里可以添加实际的搜索逻辑，比如发送请求到后端
      console.log('搜索关键词:', this.searchQuery);
    },
	getData() {
	  let _this = this;
		var param = {
			title: _this.title,
			validFlag: 1,
			state:1
			}
	  common.request({
	    data:param,
	    url: common.urlMap.findNmGoodsList,
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

.main-content {
  background-color: #ecf0f1;
  padding: 20px;
  
}

.product-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin-bottom: 15px;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.product-info {
  padding: 10px;
}

.product-name {
  color: #3498db;
  margin-bottom: 5px;
}

.product-intro {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 10px;
}

.product-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  color: #e74c3c;
  font-size: 18px;
  font-weight: bold;
}

.product-merchant {
  color: #95a5a6;
  font-size: 14px;
}

body{
            background-color: #f3f3f3;
        }
        .tab-item:hover{
            background-color: #3f80de;
        }
        .tab-item{
            padding: 15px;
            color: white;
        }
        .tab-sel{
            background-color: #3f80de;
        }
        .tab-list{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: #409EFF;
        }

        .top-bar{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
        }
        .top-logo{
            display: flex;
            align-items: center;
            font-size: 30px;
            color: #E6A23C;
            font-weight: bold;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        }

        .bookItem{
            width: 140px;
            height: 138px;
            padding-left: 5px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
        }

        .list-item{
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

        .el-form-item--mini{
            margin-bottom: 10px !important;
        }
</style>    