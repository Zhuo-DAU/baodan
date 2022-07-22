<template>
  <div class="apply-refund">
    <h3>更新订单</h3>
    <div class="apply-center">
      <div class="apply-orderitem">

        <p>项目名称: <span>{{ orderItem.productName }}</span></p>
        <p>订单号: <span>{{ orderItem.orderNum }}</span></p>
        <p>折扣: <span>{{ productItem.discount }}</span></p>
        <p>实付金额: <span>{{ orderItem.amount }}</span></p>
        <p>返款金额: <span>{{ orderItem.refundAmount }}</span></p>

      </div>
      <p>下单截图</p>
      <img v-if="orderItem.payPic" :src="minioUrl + orderItem.payPic" class="avatar" @click="show(orderItem.payPic)"/>
      <p>收货截图</p>
      <div class="upload-img confirm-upload" v-if="!orderItem.confirmReceiptPic">
        <el-upload
            v-model:file-list="fileList"
            action="http://192.168.1.110:9090/screenshot/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-progress="handleProgress"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </div>
      <div v-else >
        <img v-if="orderItem.confirmReceiptPic" :src="minioUrl + orderItem.confirmReceiptPic" class="avatar" @click="show(orderItem.confirmReceiptPic)"/>
      </div>
      <div v-if="productItem.isNeedComment">
        <p>评论截图</p>
        <p class="info-text">{{productItem.description}}</p>
      <div class="upload-img commit-upload" v-if="!productItem.commentPic">
        <el-upload
            v-model:file-list="fileList2"
            action="http://192.168.1.110:9090/screenshot/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove2"
            :on-success="handleSuccess2"
            :on-progress="handleProgress2"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </div>
      <div v-else >
        <img v-if="orderItem.commentPic" :src="minioUrl + orderItem.commentPic" class="avatar" @click="show(orderItem.commentPic)"/>
      </div>
      </div>
      <el-button  v-if="!orderItem.confirmReceiptPic" type="primary" class="submit" @click="onSubmit()">
        提交确认收货截图
      </el-button>
      <el-button  v-else round type="primary">返款中</el-button>
    </div>
    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="" style="width: 100%; height: 100%">
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";


export default {
  name: "ApplyRefund",
  data() {
    return {
      params:{},
      orderItem: {},
      productItem:{},
      imageUrl: '',
      dialogImageUrl:'',
      minioUrl: "http://192.168.1.110:9000",
      dialogVisible: false,
      fileList:[],
      fileList2:[]
    }
  },
  methods: {
    handleRemove(){
      document.querySelector(".confirm-upload .el-upload--picture-card").style.display= "";
    },
    handleRemove2(){
      document.querySelector(".commit-upload .el-upload--picture-card").style.display= "";
    },
    handlePictureCardPreview(file){
      this.dialogImageUrl = file.url;
      this.dialogVisible = true
    },
    handleSuccess(res){
      this.confirmReceiptPic = res
    },
    handleProgress(){
      document.querySelector(".confirm-upload .el-upload--picture-card").style.display= "none";
      document.querySelector(".confirm-upload .el-icon--close-tip").style.display= "none";
    },
    handleProgress2(){
      document.querySelector(".commit-upload .el-upload--picture-card").style.display= "none";
      document.querySelector(".commit-upload .el-icon--close-tip").style.display= "none";
    },
    handleSuccess2(res){
      this.commentPic = res
    },
    onSubmit() {
      if (this.confirmReceiptPic != null && this.confirmReceiptPic != '' && (!this.isComment || this.commentPic != '')) {
        console.log(this.commentPic)
        axios.put('/orders', {
          "id": this.orderItem.id,
          "orderStatus": this.orderItem.orderStatus,
          "confirmReceiptPic": this.confirmReceiptPic,
          "commentPic": this.commentPic
        }).then(res => {
              if (res.status == 200) {
                ElMessage({
                  showClose: true,
                  message: `上传成功！`,
                  type: 'success',
                });
                this.$router.replace({ name: 'OrderList'})
              } else {
                ElMessage({
                  showClose: true,
                  message: `上传失败！`,
                  type: 'error',
                });
              }
            }
        )
      }else {
        if(this.isComment){
          ElMessage({
            showClose: true,
            message: `请上传确认收货和评论图！`,
            type: 'error',
          });
        }else {
          ElMessage({
            showClose: true,
            message: `请上传确认收货图！`,
            type: 'error',
          });
        }
      }
    },
    show(imageUrl){
      this.dialogVisible = true;
      this.dialogImageUrl = this.minioUrl+imageUrl
    }
  },
  created() {
    this.params = JSON.parse(this.$route.query.str)
    axios.get("/products",{
      params:{
        id: this.params.productId
      }
    }).then(res => {
      this.productItem = res.data.content[0]
    })
    axios.get("/orders",{
      params:{
        id: this.params.id
      }
    }).then(res =>{
      this.orderItem = res.data.content[0]
    })
  }
}
</script>


<style lang="less">

.apply-refund{
  height: 100%;
  background: #f8f8f8;
  h3{
    padding: 20px 0;
    font-weight: 700;
    font-size: 16px;
    background: #fff;
  }
  .apply-center{
    margin: 10px 20px;
    background: #fff;
    border-radius: 5px;
    padding: 10px;
    .apply-orderitem{

      p{
        margin: 15px 0;
        text-align: left;
        span{
          float: right;
        }
      }
    }
  }
  p{
    margin: 15px 0;
    text-align: left;
  }

  .el-button{
    margin: 30px 0  ;
  }
}

.el-dialog{
  height: 80vh;overflow: auto;width: 70vw;
  background-color: rgba(0,0,0,0);
  --el-dialog-box-shadow: 0,0,0,0,rgba(0,0,0,0);
}
.el-dialog__headerbtn .el-dialog__close{
  color: white;
}
.el-upload {
  width: 100px;
  height: 100px;
}
.el-upload-list--picture-card .el-upload-list__item{
  width: 100px;
  height: 100px;
}
.el-upload-list--picture-card .el-progress{
  width: 100px;
}
.el-upload-list--picture-card .el-progress>.el-progress-circle{
  height: 100px!important;
  width: 100px!important;
}

.upload-img {
  display: flex;
}

.avatar {
  width: 10vh;
  height: 10vh;
  display: block;
}
.info-text{
  float: right;
  color:#a0bae6;
  padding:5px 10px;
  font-size: 12px;
  width: 235px;
  background: #eef9fe;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>
