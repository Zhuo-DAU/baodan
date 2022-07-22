<template>
  <div class="login">
    <el-form
        ref="loginForm"
        :model="loginForm"
        status-icon
        :rules="rules"
        label-width="100px"
        style="width: 80vw"
    >
      <el-form-item label="用户" prop="username" required>
        <el-input v-model="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" required>
        <el-input
            v-model="loginForm.password"
            type="password"
            autocomplete="off"
            show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            @click="submitForm('loginForm')"
            style="margin-right: 17vw"
        >登陆</el-button>
        <router-link to="/register">
          <el-button>
            注册
          </el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import axios from "axios";



export default {
  name: "myLogin",
  data(){
    return{
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      userList:[],
      flag: 0
    }
  },
  methods:{
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.flag = 0;
          for(const i in this.userList){
            if (this.userList[i].username == this.loginForm.username && this.userList[i].password == this.loginForm.password){
              ElMessage({
                showClose: true,
                message: `用户 ${this.loginForm.username} 登陆成功!`,
                type: 'success',
              })
              this.flag = 1;
              axios.get('/user',{
                params:{
                  username: this.loginForm.username
                }
              }).then(res => {
                // this.$store.commit('setWechatName', res.data.wechatName)
                localStorage.setItem("wechatName", res.data.wechatName)
                localStorage.setItem("username",res.data.username)
                localStorage.setItem("password",res.data.password)
              })
              this.$router.replace({ name: 'ProjectList' })
              break
            }
          }
          if(!this.flag){
            ElMessage({
              showClose: true,
              message: `账号或密码错误！`,
              type: 'error',
            })
          }
        } else {
          return false
        }
      })
    }
  },
  created() {
    axios.get("/users")
        .then(res=>{
          this.userList = res.data
        });
    if(localStorage.getItem("username") != null && localStorage.getItem("password") != null){
      this.$router.replace({ name: 'ProjectList' })
    }
  }
}
</script>

<style scoped>
.login{
  margin-top: 40vh;
}
</style>
