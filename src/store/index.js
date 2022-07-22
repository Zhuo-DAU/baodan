import {createStore} from "vuex";

export default createStore({
    state:{
        wechatName: ''
    },
    mutations:{
        setWechatName(state,value){
            state.wechatName = value;
        }
    },
    actions:{

    },
    modules:{

    }
})