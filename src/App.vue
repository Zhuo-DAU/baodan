<template>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover, user-scalable=0">
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
<!--  <project-list></project-list>-->
    <router-view v-if="isRouterAlive"></router-view>

</template>


<script>
// import HelloWorld from './components/HelloWorld.vue'
// import ProjectList from './components/ProjectList.vue'

  window.onload = function() {
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  document.addEventListener('gesturestart', function(event) {
  event.preventDefault()
})
}

export default {
  name: 'App',
  provide() {
    return {
      reload : this.reload,
    }
  },
  data() {
    return {
      isRouterAlive:true,
    };
  },
  created(){},
  methods: {
    // 通过声明reload方法，控制router-view的显示或隐藏，从而控制页面的再次加载
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      })
    },
  }
}
</script>

<style>

* {
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
}

 ul,
 h1,
 h3,
 h4,
 p,
 dl,
 dd {
   padding: 0;
   margin: 0;
 }
/* 清除列表样式 */

ol,ul {list-style: none;}

i{
  font-style: normal;
}


button {
    /* 当我们鼠标经过button 按钮的时候，鼠标变成小手 */
    cursor: pointer
}


/* 清除浮动 */

.clearfix:after {
    visibility: hidden;
    clear: both;
    display: block;
    content: ".";
    height: 0

}
a{
  /* color: #ffffff; */
  text-decoration: none;
}
.router-link-active{
  color: #ffffff;
  text-decoration: none;
}
html,body{
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  list-style: none;
}
.el-scrollbar > .el-scrollbar__bar {
  opacity: 1 !important;
}
</style>
