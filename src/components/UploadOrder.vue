<template>
  <div class="home">
    <div class="tip-info">
      <p>{{ productName }}</p>
      <div class="list-img">
        <div>
          <span>剩余额度</span>
          <h3>{{ remain }}</h3>
          <i>总额度 {{ amount }}</i>
        </div>
      </div>
    </div>
    <div class="banner-center">
      <p>订单详情</p>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label-width="70px" label="订单号" prop="order">
          <el-input v-model="form.order" placeholder="请输入订单号" parttern="[0-9]"/>
        </el-form-item>
        <el-form-item label-width="70px" label="金   额"  prop="price" type="number">
          <el-input v-model="form.price" placeholder="请输入金额" type="number"/>
        </el-form-item>
      </el-form>
      <p>下单图</p>
      <div class="upload-img" >
        <el-upload
            v-model:file-list="fileList"
            action="http://192.168.1.110:9090/screenshot/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-progress="handleProgress"
            :limit="1"
        >
         <!-- limit：最大上传数量 -->
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%"/>
        </el-dialog>
        <div class="info-text">
          下单截图拼成一张图,图片要看到订单号/金额/下单时间,辛苦各位老铁
        </div>
      </div>
      <div >
        <el-button round type="primary" class="submit" @click="onSubmit()">
          上传
        </el-button>
        <br>
        <el-button round @click="resetForm()">
          重置
        </el-button>
        <div class="ui-flex ui-flex-pack-justify-evenly" style="margin-top: 10px;">
          <router-link to="/orderList">
            <div class="order">我的订单</div>
          </router-link>
          <router-link to="/project">
            <div class="order">所有项目</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {ElMessage} from "element-plus";


export default {
  name: "UploadOrder",
  inject: ['reload'],
  data() {
    const checkOrderNum = (rule,value,callback) => {
      const regNum = /^[0-9]*$/g
      if(regNum.test(value)){
        callback()
      } else {
        callback(new Error('订单号格式错误'))
      }
    }
    return {
      form:{
        order: "",
        price: undefined
      },
      rules: {
        order: [
          {required:true},
          {validator:checkOrderNum}
        ],
        price: [
          {required:true}
        ],
        wechatName: [
          {required:true}
        ]
      },
      productId: "",
      payPic:"",
      productName: "",
      amount: "",
      remain: "",
      dialogVisible: false,
      dialogImageUrl: '',
      fileList:[]
    };
  },
  methods: {
    handleRemove(){
      document.querySelector(".el-upload--picture-card").style.display= "";
    },
    handlePictureCardPreview(file){
      this.dialogImageUrl = file.url;
      this.dialogVisible = true
    },
    handleSuccess(res){
      this.payPic = res
    },
    handleProgress(){
      document.querySelector(".el-upload--picture-card").style.display= "none";
      document.querySelector(".el-icon--close-tip").style.display= "none";
      // document.querySelector("").style.width= "100px";

    },
    onSubmit() {
      this.$refs.formRef.validate((valid) =>{
        if(valid) {
          if(this.payPic != null && this.payPic!= ''){
            if (this.remain >= this.form.price){
              axios.post('/orders',{
                "productId" :this.productId,
                "orderNum": this.form.order,
                "wechatName" : localStorage.getItem("wechatName"),
                "amount": this.form.price,
                "payPic": this.payPic,
                "productName": this.productName

              }).then((res) => {
                if(res.status == 200){
                  ElMessage({
                    showClose: true,
                    message: `上传成功！`,
                    type: 'success',
                  });
                  this.reload();
                }
              }).catch(()=>{
                ElMessage({
                  showClose: true,
                  message: `订单号已存在！`,
                  type: 'error',
                });
              })
            }else {
              ElMessage({
                showClose: true,
                message: `额度不足！`,
                type: 'error',
              });
            }
          }else {
            ElMessage({
              showClose: true,
              message: `请上传图片！`,
              type: 'error',
            });
          }
        } else {
          ElMessage({
            showClose: true,
            message: `格式错误`,
            type: 'error',
          });
        }
      })
    },
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.imageUrl = null;
    }
  },

  mounted() {},
  created() {
    this.productId = this.$route.params.id;
    axios.get("/products",{
      params:{
        id: this.productId
      }
    }).then(res => {
      this.productName = res.data.content[0].productName;
      this.amount = res.data.content[0].amount;
      this.remain = res.data.content[0].remain;
    })
  }
};
</script>
<style lang="less">
.el-dialog{
  height: 80vh;overflow: auto;width: 70vw;
  background-color: rgba(0,0,0,0);
  --el-dialog-box-shadow: 0,0,0,0,rgba(0,0,0,0);
}
.el-dialog__headerbtn .el-dialog__close{
  color: white;
}
.el-form-item__label{
justify-content: normal !important;
}
.el-form-item__label-wrap {
  margin-left: 0px !important;
}


.banner-center .el-button{
  margin-bottom: 1vh;
  width: 70vw;
  height: 5vh;
  font-size: 15px;
}
.upload-img>div:nth-child(1){
  float: left;
  margin-bottom: 2vh;
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


.home {
  width: 100%;
  height: 100%;
  // background: #f7f7f7;
  background: url(../assets/image/upload.png) no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  // background-color: #f7f7f7;
  .tip-info {
    padding: 15px 30px 0;
    width: 100%;
    height: 200px;
    // background: linear-gradient(to bottom, #0678ee, #aacdf8);
    box-sizing: border-box;
    p {
      color: #fff;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      margin: 0 0 10px 0;
    }
    .list-img {
      position: relative;
      width: 325px;
      height: 120px;
      background: url(../assets/image/upload5.png) no-repeat;
      background-size: 100% 100%;

      div {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        padding: 10px 30px 0;
        width: 344px;
        height: 100px;
        background-color: #fff;
        border-radius: 5px;
        box-sizing: border-box;
        text-align: left;
        span {
          font-size: 16px;
          color: #333;
        }
        h3 {
          margin-top: 5px;
          font-size: 26px;
          color: #000;
        }
        i {
          font-size: 12px;
          color: #999;
        }
      }
      div:after {
        position: absolute;
        top: -10px;
        right: 40px;
        content: "";
        display: inline-block;
        width: 65px;
        height: 100px;
        background: url(../assets/image/upload2.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .banner-center {
    // margin:0 15px 15px 0;
    background: #fff;
    border-radius: 5px;
    padding: 0 15px;
    p {
      margin-bottom: 20px;
      position: relative;
      padding: 10px;
      border-bottom: 1px dashed #ccc;
      text-align: left;
      font-weight: 700;
    }
    .ball {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      background: #f7f7f7;
      border-radius: 50%;
    }
    .upload-img {
      margin-top: 1vh;
      .info-text {
        float: right;
        color:#a0bae6;
        padding:5px 10px;
        font-size: 12px;
        width: 235px;
        height: 45px;
        background: #eef9fe;
        border-radius: 5px;
        box-sizing: border-box;
      }
    }
  }

  .order {
    width: 100px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 15px;
    color: #000;
  }
}
</style>
