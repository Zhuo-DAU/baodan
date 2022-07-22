<template>
  <div class="register">
    {{message}}
    <el-form
        ref="registerForm"
        :model="registerForm"
        status-icon
        :rules="rules"
        label-width="100px"
        style="width: 80vw"
    >
      <el-form-item label="用户" prop="username" required>
        <el-input v-model="registerForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" required>
        <el-input
            v-model="registerForm.password"
            type="password"
            show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2" required>
        <el-input
            v-model="registerForm.password2"
            type="password"
            show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="微信名" prop="wechatName"  required>
        <el-input v-model="registerForm.wechatName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button style="margin-left: 17vw" @click="register('registerForm')">
            注册
          </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "MyRegister",
  data(){
    var validateCheckPass = (rule,value,callback)=>{
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return{
      registerForm: {
        username: '',
        password: '',
        password2: '',
        wechatName: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        wechatName: [{ required: true, message: '请输入微信名', trigger: 'blur' }],
        password2: [{ required: true, validator: validateCheckPass,message: '两次输入密码不一致', trigger: 'blur' }]
      },
      userList:[],
      flag:1,
      message:''
    }
  },
  methods:{
    register(formName){
      this.$refs[formName].validate((valid) => {
        if (valid){
          this.flag = 1;
          for(const i in this.userList){
            if(this.userList[i].username == this.registerForm.username || this.userList[i].wechatName == this.registerForm.wechatName){
              ElMessage({
                showClose: true,
                message: `账号已存在！`,
                type: 'error',
              })
              this.flag = 0;
              break
            }
          }
          if (this.flag){
            axios.post('/user',{
              username: this.registerForm.username,
              password: this.registerForm.password,
              wechatName: this.registerForm.wechatName
            }).then(res => {
              if(res.status == 200){
                ElMessage({
                  showClose: true,
                  message: `注册成功！`,
                  type: 'success',
                })
                this.$router.replace({name:'Login'})
              } else {
                alert(res)
                ElMessage({
                  showClose: true,
                  message: `注册失败！` + res,
                  type: 'error',
                })
              }
            })

          }
        }
      })
    }
  },
  created() {
    window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj){
      console.log(errorMessage, scriptURI, lineNumber,columnNumber,errorObj)
      this.message(errorMessage)
      return true;
    }
    axios.get("/users")
        .then(res=>{
          this.userList = res.data

        })
  }
}
</script>

<style scoped>
.register{
  margin-top: 40vh;
}
</style>
