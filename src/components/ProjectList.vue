<template>
  <div id="header">
    <div class="project">
      <div class="title">活动列表</div>
      <div class="mt-4">
        <el-input v-model="searchProductName" placeholder="输入活动名称进行查询" suffix-icon="el-icon-search"
                  @keydown="productSearch2"></el-input>
        <!--    <el-select v-model="searchProductName" filterable clearable placeholder="请输入项目名称"-->
        <!--               @change="productSearch(searchProductName)">-->
        <!--      <el-option-->
        <!--          v-for="item in allProjectItems"-->
        <!--          :key="item.id"-->
        <!--          :label="item.productName"-->
        <!--          :value="item.productName"-->
        <!--      />-->
        <!--    </el-select>-->
      </div>
    </div>
  </div>

  <div class="list">
    <ul>
      <li v-for="projectItem in projectItems" :key="projectItem.id">
        <div class="project-item">
          <div class="project-title ui-flex ui-flex-align-center">
            <i></i>
            <p>{{ projectItem.productName }}</p>
          </div>
          <div class="project-remain"><span>剩余额度 </span><i>{{ projectItem.remain }}</i></div>
          <div class="project-button ui-flex ui-flex-align-center">
            <p>折扣：{{ projectItem.discount }}折</p>
            <div class="text">复制链接购买</div>
            <el-button type="primary">
              <router-link :to="'/upload/' + projectItem.id">立即报单</router-link>
            </el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div class="bottom">
    <router-link to="/project">
      首页
    </router-link>
    <router-link to="/orderList">
      我的
    </router-link>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "ProjectList",
  data() {
    return {
      projectItems: [],
      searchProductName: "",
    }
  },
  methods: {
    sortId(a, b) {
      return b.id - a.id;
    },
    productSearch(searchProductName) {
      axios.get("/products", {
        params: {
          productName: searchProductName,
          sort: "createTime,desc"
        }
      }).then(res => {
        this.projectItems = res.data.content
      })
    },
    productSearch2(ev) {
      if (ev.keyCode == '13') {
        this.productSearch(this.searchProductName);
      }
    }
  },
  created() {
    axios.get("/products", {
      params: {
        sort: "createTime,desc"
      }
    }).then((res) => {
      this.projectItems = res.data.content
    })
  }
}
</script>

<style scoped>
.project {
  height: 100%;
  background-color: #f8f8f8;
}

a {
  color: #ffffff;
  text-decoration: none;
}

.router-link-active {
  color: #ffffff;
  text-decoration: none;
}

ul {
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}

.title {
  padding: 20px 0;
  font-weight: 700;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.mt-4 {
  margin: 0 10px 20px 10px;
}

.list {
  padding-top: 15vh;
  padding-bottom: 10vh;
  height: auto;
  border: #f8f8f8 solid 1px;
  overflow-y: auto;
}

.list span {
  display: inline-block;
  /* width: 60vw; */
}

.project-item {
  margin: 10px;
  padding: 10px;
  height: 147px;
  text-align: left;
  background: url(../assets/hei1.png) no-repeat;
  background-size: 100% 100%;
  /* background-color: #ffffff; */
  border-radius: 1vh;
}

.project-title {
  padding-bottom: 10px;
  border-bottom: 1px solid #f8f8f8;
  /* color: #005ad6;
  font-weight: bold; */
}

.project-title i {
  margin-right: 10px;
  display: inline-block;
  width: 12px;
  height: 14px;
  background: url(../assets/hei2.png) no-repeat;
  background-size: 100% 100%;
}

.project-title p {
  font-size: 14px;
  font-weight: 700;
}

.project-remain {
  margin: 15px 0;
}

.project-remain span {
  margin-right: 10px;
  color: #898989;
  font-size: 14px;
}

.project-remain i {
  margin-right: 10px;
  color: #333;
  font-size: 16px;
  font-weight: 700;
}

.project-button {
}

.project-button p {
  font-size: 12px;
  color: #ababab;
}



.project-button .text {
  padding: 0 5px;
  margin: 0 30px;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 15px;
  font-size: 12px;
  border: 1px solid #0f79ef;
  font-size: 12px;
  color: #0f79ef;
}

#header {
  height: 15vh;
  width: 100vw;
  position: fixed;
  top: 0;
}

.bottom {
  width: 100vw;
  position: fixed;
  bottom: 0;
  background: #fff;
}

.bottom a{
  margin: 0;
  border: 0;
  height: 10vh;
  display: inline-block;
  width: 50%;
  color: #333333;
  line-height: 10vh;
  font-size: var(--el-font-size-base);
  border-radius: 20px;
}
.router-link-active{
  background-color: #ecf5ff;
  color: #60aeff !important;

}
</style>
