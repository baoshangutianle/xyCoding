<template>
  <div class="login">
    <Head :ismanage="ismanage" :headTitle="headTitle"></Head>
     <img src="@/assets/img/xylogo.png" alt="" class="xylogo">
    <div class="top">
     
      <img src="@/assets/img/dlxylogo.png" alt="" class="bannerlogo">
        <h3 class="switchLoginModel">
          <span class="toLogin" @click="loginModel" :class="{isActived:!isLogin}">登录<i class="line" v-show="isLogin"></i></span>
          <span class="toReg" @click="regModel" :class="{isActived:isLogin}">注册<i class="line" v-show='!isLogin'></i></span>
        </h3>
      <div class="outcircle">
        <div id="qrcode" ref="qrcode">
          <i class="qrcode qrcode1" v-show="isLogin"></i>
          <i class="qrcode qrcode2" v-show="!isLogin"></i>
        </div>
        <div style="position:absolute;top:0;left:0;width:100%;height:100%"></div>
      </div>
      <h3 class="wxsm">微信扫描二维码{{switchModel}}</h3>
      <div class="inputContent" v-if="false">
        <div class="user">
          <i class="iconuser"></i><input type="text" :placeholder="userTips" v-model="user" @focus="()=>{this.userTips=''}" @blur="()=>{if(this.user===''){this.userTips='USERNAME'}}">
        </div>
        <div class="user">
          <i class="iconuser iconpwd"></i><input type="password" :placeholder="pwdTips" v-model="pwd" class="inputpwd" @focus="()=>{this.pwdTips=''}" @blur="()=>{if(this.pwd===''){this.pwdTips='PASSWORD'}}">
        </div>
        <button class="btuser" @click="login">SIGN IN</button>
      </div>
    </div>
  </div>
</template>
<script>
import Head from "@/components/commonHead";
import { Resource } from "../fetch/resource.js";
import QRCode from "qrcodejs2";
let qrContent;

export default {
  components: {
    Head
  },
  data() {
    return {
      ismanage: '',
      headTitle: '',
      user: "",
      pwd: "",
      switchModel:'登录',
      userTips: "USERNAME",
      pwdTips: "PASSWORD",
      qr2: "", // 二维码字符串
      token: "",
      getLang: {}, // 轮询事件对象
      isLogin:true,
      ismanage:'',
      headTitle:''
    };
  },
  mounted() {
    this.getLoginQr2Url();
  },
  methods: {
    regModel(){
      this.isLogin = false;
      this.switchModel = '注册';
      this.getRegQr2Url();
    },
    loginModel(){
      this.isLogin = true;
      this.switchModel = '登录';

      this.getLoginQr2Url();
       
    },
    //获取二维码字符，并更新
    getLoginQr2Url: function() {
      let _this = this;
      clearTimeout(_this.getLang);
      Resource.GetQRCodeLogin.post("", {user_type: "customer"}, "")
        .then(data => {
          console.log("登陆二维码", data);
          _this.outTime = false;
          _this.qr2 = data.url;
          _this.token = data.token;
         if (
            !localStorage.getItem("logininfo") ||
            !localStorage.getItem("customerUser")
          ) {
            _this.getLoginMsg();
          }
        })
        .catch(err => {
          console.log(err)
        });
    },
     getRegQr2Url: function() {
      let _this = this;
      clearTimeout(_this.getLang);
      _this.qr2 = Resource.WxAuthLogin;
      // Resource.GetQRCodeLogin.post("", {user_type: "customer"}, "")
      //   .then(data => {
      //     console.log("注册二维码", data);
      //     _this.outTime = false;
      //     _this.qr2 = data.url;
      //     _this.token = data.token;
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   });
    },
    // 轮询获取登录返回
    getLoginMsg: function() {
      let _this = this;
      Resource.QueryLoginResult.post("", {token: _this.token}, "")
        .then(data => {
          console.log("查询扫描结果", data);
          if (data.op.code === "Y") {
            if (data.loginbean.status === "0") {
              _this.getLang = setTimeout(function() {
                _this.getLoginMsg();
              }, 3000);
            } else if (data.loginbean.status === "1") {
              clearTimeout(_this.getLang);
              _this.userid = data.loginbean.userId;
              Resource.ESBServlet.post("", {command: "xycoding.p_login",userid: _this.userid}, "")
                .then(data => {
                  console.log("登陆", data);
                  if(data.op.code === 'Y'){
                    if(data.data.f_valid =='1'){
                      // localStorage.setItem('userinfo',JSON.stringify(data))
                      let storage = window.localStorage;
                        storage["usertype"] = data.data.f_type;
                        storage["id"] = data.data.f_id;
                        _this.$router.push({ name: "Module" });
                    }else{
                      this.getLoginQr2Url();
                      _this.$message({
                        type:'warning',
                        message:'需管理员审核之后才能登录'
                      })
                    }
                  }else{
                      this.$message.error(data.op.info);
                      clearTimeout(_this.getLang);
                      this.getLoginQr2Url();
                  }
                  
                })
                .catch(err => {});
            }
          } else if (data.op.code === "N" && data.op.errorcode === "WXSERVER_1") {
            console.log('二维码已经过期')
            this.getLoginQr2Url();
          }
        })
        .catch(err => {});
    },
    winMin: function() {
      winMinAndRestore();
    },
    sizeSwitch: function() {
      windowSizeSwitch();
    },
    closeWindow: function() {
      closeWin();
    }
  },
  watch: {
    // q2数据监听,动态刷新二维码
    qr2(newvalue, oldValue) {
      // 如果旧值为空则新建二维码
      if (oldValue === "" || oldValue === null) {
        qrContent = new QRCode("qrcode", {
          width: 184, // 设置宽度
          height: 184, // 设置高度
          text: newvalue
        });
      } else {
        // 否则修改二维码
        qrContent.makeCode(newvalue);
      }
    }
  },
   destroyed(){
     clearInterval(this.getLang);
  }
};
</script>
<style lang="less">
@import "../assets/css/reset.css";
@import '../assets/css/common.less';

.login {
  height: 100%;
  background: url("../assets/img/bg1.jpg") no-repeat center;
  background-size: 100% 100%;
    .xylogo {
      display: block;
      width: 108px;
      height: 34px;
      margin-left: 17px;
      margin-top: -10px;
    //   position: absolute;
    // left: 0.132813rem;
    // top: 0.164063rem;
    // display: block;
    // width: 0.84375rem;
    // height: 0.265625rem;
    }
  .top {
    overflow: hidden;
    .positionR;
    .txtc;

    .bannerlogo {
      display: inline-block;
      width: 671px;
      height: 279px;
      // margin-top: 34px;
      // margin-left: 333px;
    }
    .switchLoginModel{
    margin-top: 60px;
      span{
        cursor: pointer;
        display: inline-block;
        line-height: 35px;
        font-size: 18px;
        margin:0 40px;
        color: #fff;
        position: relative;
        .line{
          width: 34px;
          height: 2px;
          background: #fff;
          position: absolute;
          bottom: 0;
          left:0;
        }
      }
      .isActived{
        color: rgba(188,200,208,1);
      }
    }
  }
  .bottom {
    background: #fff;
  }
  .outcircle {
    position: relative;
    background: #fff;
    margin: 0 auto;
    margin-top: 15px;
    width: 204px;/*no*/
    height: 204px;/*no*/
    #qrcode {
      
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .qrcode {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 42px;/*no*/
        height: 42px;/*no*/
      }
      .qrcode1{
        background: url("../assets/img/icon.png") no-repeat center;

      }
      .qrcode2{
        background: url("../assets/img/icon.png") no-repeat center;        
      }
    }
  }
  .wxsm {
    text-align: center;
    margin-top: 20px;
    color: #fff;
  }
  .inputContent {
    margin-top: 76px;
    margin-left: 524px;
    display: flex;
    flex-direction: column;
    input {
      background: transparent;
      border: none;
      outline: none;
      line-height: 34px;
      vertical-align: top;
      color: rgba(167, 187, 206, 1);
    }
    .user {
      outline: none;
      width: 297px;
      height: 34px;
      background: rgba(0, 0, 0, 0.3);

      border-radius: 3px;
      margin-bottom: 10px;
      .inputpwd::-webkit-input-placeholder {
        /* WebKit browsers */
        color: rgba(167, 187, 206, 1);
        // font-size:    .14px;
      }

      .iconuser {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin: 10px 19px 10px 14px;
        background: url("../assets/img/user.png");
      }
      .iconpwd {
        background: url("../assets/img/pwd.png");
      }
    }
    button {
      border: none;
      outline: none;
      cursor: pointer;
    }
    .btuser {
      width: 297px;
      height: 40px;
      background: rgba(33, 118, 249, 1);
      opacity: 1;
      border-radius: 3px;
      
      font-weight: 400;
      color: #fff;
      margin-top: 9px;
      .fs14
    }
  }
}
.el-input--mini .el-input__inner {
  height: 34px !important;
}
</style>


