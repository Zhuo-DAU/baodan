<template>
  <div id="header">
    <div class="title">我的</div>
    <div class="mt-4">
      <el-input
          v-model="param"
          placeholder="请输入订单号"
          class="input-with-select"
          type="search"
          @keydown="orderSearch2($event)"
      >
        <template #append>
          <el-button @click="orderSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <div class="date-picker">
      <el-date-picker
          v-model="start"
          type="date"
          placeholder="开始时间"
      />&nbsp;
      <el-date-picker
          v-model="end"
          type="date"
          placeholder="结束时间"
      />
    </div>
    <el-select v-model="orderStatus" class="m-2" placeholder="订单状态" clearable style="width: 48vw;"
               @change="orderSearch">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-select v-model="productName" placeholder="请选择项目" filterable clearable style="width: 48vw;"
               @change="orderSearch">
      <el-option
          v-for="item in myProductList"
          :key="item"
          :label="item"
          :value="item"
      />
    </el-select>
    <div style="height: 5vh; display: flex; padding: .5vh 2vw; text-align: left">
      <p style="flex: 1; background-color: white; border: #e0e3e9 solid 1px;padding: .5vh 0 0 2vw; margin-right: 1vw;border-radius: 5px">
        累计报单:{{ accOrderNum }}</p>
      <p style="flex: 1; background-color: white; border: #e0e3e9 solid 1px;padding: .5vh 0 0 2vw; margin-right: 1vw;border-radius: 5px">
        累计金额:{{ accOrderPrice }}</p>
    </div>
  </div>


  <div class="list">
    <ul>
      <li v-for="orderItem in orderItems" :key="orderItem.id" @click="sendObject(orderItem)">
        <div class="project-item">
          <div class="project-title ui-flex ui-flex-align-center ui-flex-pack-justify">
            <p>{{ orderItem.productName }}</p>
            <span>{{ options[orderItem.orderStatus - 1].label }}</span>
          </div>
          <div class="project-orderNum">
            <span class="profile">订单号:<i>{{ orderItem.orderNum }}</i></span>
            <i class="icon-on" @click.stop="copy(orderItem.orderNum)"></i>
            <!-- <button @click.stop="copy(orderItem.orderNum)">复制订单号</button> -->
          </div>
          <div class="ui-flex project-amount ui-flex-align-center ui-flex-pack-justify">
            <div>
              <span class="profile">实付金额: <i>{{ orderItem.amount }}</i></span>
              <span class="profile" style="margin-left:20px;">返款金额: <i>{{ orderItem.refundAmount }}</i></span>
            </div>
            <div class="button-one" @click.stop="deleteOrder(orderItem.id)">删除订单</div>
          </div>

          <span style="font-size:12px;">报单时间:{{ formatDate(orderItem.createTime) }}</span>
          <!--          <el-button type="primary" @click="sendObject(orderItem)">申请返款</el-button>-->

        </div>
      </li>
    </ul>
  </div>
  <div class="bottom">
    <router-link to="/project">首页</router-link>
    <router-link to="/orderList">我的</router-link>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
  name: "orderList",
  inject: ['reload'],
  data() {
    return {
      start: null,
      end: null,
      param: "",
      orderStatus: '',
      options: [
        {
          value: '1',
          label: '未上传确认收货图',
        },
        {
          value: '2',
          label: '未上传尾款图',
        },
        {
          value: '3',
          label: '未评论',
        },
        {
          value: '4',
          label: '返款中',
        },
        {
          value: '5',
          label: '已返款',
        }
      ],
      orderItems: [],
      productName: '',
      myProductList: new Set(),
      accOrderNum: null,
      accOrderPrice: null
    }
  },
  created() {
    axios.get('/orders', {
      params: {
        wechatName: localStorage.getItem("wechatName"),
        sort: "createTime,desc"
      }
    }).then(res => {
      this.orderItems = res.data.content
      for (const i in this.orderItems) {
        this.myProductList.add(this.orderItems[i].productName)
        this.accOrderPrice += this.orderItems[i].amount
      }
      this.accOrderNum = this.orderItems.length;
    })
  },
  methods: {
    sortId(a, b) {
      return b.id - a.id;
    },
    formatDate(dateTime) {
      var source = new Date(dateTime);
      var yy = source.getFullYear().toString();
      var mm = source.getMonth() + 1;
      mm = mm < 10 ? ('0' + mm.toString()) : mm.toString();
      var dd = source.getDate();
      dd = dd < 10 ? ('0' + dd.toString()) : dd.toString();
      var hh = source.getHours();
      hh = hh < 10 ? ('0' + hh.toString()) : hh.toString();
      var MM = source.getMinutes();
      MM = MM < 10 ? ('0' + MM.toString()) : MM.toString();
      var ss = source.getSeconds();
      ss = ss < 10 ? ('0' + ss.toString()) : ss.toString();
      var aa = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + MM + ':' + ss;
      return aa;
    },
    orderSearch: function () {
      console.log(this.start)
      let timeList = [new Date(this.start).pattern("yyyy-MM-dd HH:mm:ss.S"), new Date(new Date(this.end).getTime() + 24 * 60 * 60 * 1000 - 1).pattern("yyyy-MM-dd HH:mm:ss.S")]
      axios.get('/orders', {
        params: {
          orderNum: this.param,
          wechatName: localStorage.getItem("wechatName"),
          orderStatus: this.orderStatus,
          createTime: this.start == null || this.end == null ? [] : timeList,
          productName: this.productName,
          sort: "createTime,desc"
        }, paramsSerializer: params => {
          return qs.stringify(params, {indices: false})
        }
      }).then(res => {
        this.accOrderPrice = 0
        this.orderItems = res.data.content
        this.accOrderNum = res.data.content.length
        for (const i in this.orderItems) {
          this.accOrderPrice += this.orderItems[i].amount
        }
      })
    },
    orderSearch2(ev) {
      if (ev.keyCode == '13') {
        this.orderSearch(this.param);
      }
    },
    sendObject(orderItem) {
      let query = {
        id: orderItem.id,
        productId: orderItem.productId
      }
      let str = JSON.stringify(query);
      this.$router.push({path: "/applyRefund", query: {str}})
    },
    deleteOrder(id) {
      let ids = [id] + '';
      this.$confirm('确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'messageBox'
      }).then(() => {
        axios.delete("/orders", {
          params: {
            ids: ids
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.reload();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    copy(orderNum) {
      const that = this;
      this.$copyText(orderNum).then(
          function (e) {
            console.log("copy arguments e:", e);
            that.$message({
              type: 'success',
              message: '复制成功'
            });
          },
          function (e) {
            console.log("copy arguments e:", e);
            that.$message({
              type: 'error',
              message: '复制失败'
            });
          }
      )
    }
  }
}
</script>

<style scoped lang="less">
a {
  color: #ffffff;
  text-decoration: none;
}

.router-link-active {
  color: #ffffff;
  text-decoration: none;
}

.title {
  padding: 20px 0;
  font-weight: 700;
}

.mt-4 {
  margin: 0 2vw;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

#header {
  width: 100vw;
  position: fixed;
  top: 0;
  height: 28vh;
  background-color: #f8f8f8;
}

.bottom {
  width: 100vw;
  position: fixed;
  bottom: 0;
  background: #fff;
}

.bottom a {
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

.router-link-active {
  background-color: #ecf5ff;
  color: #60aeff !important;
}

.date-picker {
  display: flex;
  padding: 2vw;
}

.list {
  padding-top: 28vh;
  padding-bottom: 10vh;
  height: auto;
  border: #f8f8f8 solid 1px;
  overflow-y: auto;
}

.list span {
  display: inline-block;
  // width: 60vw;
}

.project-item {
  margin: 10px;
  padding: 10px;
  text-align: left;
  background-color: #ffffff;
  border-radius: 5px;

  .project-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #f8f8f8;
    font-weight: bold;

    p {
      font-size: 16px;
      font-weight: 700;
      color: #000;
    }

    span {
      font-size: 14px;
      color: #0f79ef;

    }

  }

  .project-orderNum {
    margin: 5px 0;

    .icon-on {
      margin-left: 10px;
      display: inline-block;
      width: 12px;
      height: 14px;
      background: url(../assets/hei2.png) no-repeat;
      background-size: 100% 100%;
    }
  }

  .project-amount {
    margin-bottom: 5px;

    .button-one {
      width: 70px;
      height: 30px;
      font-size: 12px;
      color: #0f79ef;
      line-height: 30px;
      text-align: center;
      border-radius: 15px;
      border: 1px solid #0f79ef;
    }
  }

  .profile {
    color: #345376;
    font-size: 14px;

    i {
      color: #333;
      font-size: 16px;
    }
  }
}

</style>
<style>
.messageBox {
  width: 80vw;
}

.messageBox .el-message-box__content {
  border-top: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
  height: 50px;
}

.el-message-box__message p {
  line-height: 50px;
}

.messageBox .el-message-box__btns {
  padding: 20px 15px 0;
}


</style>

