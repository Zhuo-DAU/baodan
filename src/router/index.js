import { createRouter,createWebHashHistory} from "vue-router";
const projectList = () => import("../components/ProjectList")
const uploadOrder = () => import("../components/UploadOrder")
const orderList = () => import("../components/OrderList")
const login = () => import("../components/myLogin")
const register = () => import("../components/MyRegister")
const applyRefund = () => import("../components/ApplyRefund")


const  routes = [
    {
        path:'/',
        name:'Login',
        component: login
    },{
        path:'/upload/:id',
        name:'UploadOrder',
        component: uploadOrder
    },{
        path:'/orderList',
        name:'OrderList',
        component: orderList
    },{
        path:'/project',
        name:'ProjectList',
        component: projectList
    },{
        path:'/register',
        name:'Register',
        component: register
    },{
        path:'/applyRefund',
        name:'ApplyRefund',
        component: applyRefund
    }

]


export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
