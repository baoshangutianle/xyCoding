<template>
    <div class="module">

        <Head :ismanage="ismanage" :headTitle="headTitle"></Head>
        <img src="@/assets/img/xylogo.png" alt="" class="xylogo">
        <div class="bannerlogo">
        </div>
        <ul class="total">
            <li class="each each1" @click="toDetail('microservice')">
                <div class="img img1">
                </div>
                <h2>微服务</h2>
                <!-- <h3><span>重用</span><span>异构</span><span>去中心化</span><span>自动部署</span></h3> -->
            </li>
            <li class="each each2" @click="toDetail('microapp')">
                <div class="img img2">
                </div>
                <h2>微应用</h2>

                <!-- <h3><span>重用</span><span>异构</span><span>去中心化</span><span>自动部署</span></h3> -->

            </li>
            <li class="each each3" @click="toDetail('customapp')">
                <div class="img img3">
                </div>
                <h2>定制应用</h2>

                <!-- <h3><span>重用</span><span>异构</span><span>去中心化</span><span>自动部署</span></h3> -->

            </li>
            <li class="each each4">
                <div class="img img4">
                </div>
                <h2>生产环境与运行监控</h2>

                <!-- <h3><span>重用</span><span>异构</span><span>去中心化</span><span>自动部署</span></h3> -->

            </li>
        </ul>
        <ul class="document">
         <li class="each each1" @click="toDetail('devNorms','0')">
           <img src="@/assets/img/kfgf.png" alt="">
           <h3>开发规范</h3>
           <i></i>
         </li>
         <li class="each" @click="toDetail('devNorms','1')">
           <img src="@/assets/img/jswd.png" alt="">
           <h3>技术文档</h3>
           <i></i>
         </li>
         <li class="each">
           <img src="@/assets/img/lcpzgj.png" alt="">
           <h3>流程配置工具</h3>
           <i></i>
         </li>
         <li class="each">
           <img src="@/assets/img/yxjkgj.png" alt="">
           <h3>运行监控工具</h3>
           <i></i>
         </li>
         <li class="each">
           <img src="@/assets/img/jcgj.png" alt="">
           <h3>集成工具</h3>
           <i></i>
         </li>
         <li class="each">
           <img src="@/assets/img/bbfbgj.png" alt="">
           <h3>版本发布工具</h3>
          <i></i>
         </li>
         <li class="each">
           <img src="@/assets/img/sjap.png" alt="">
           <h3>设计工作安排工具</h3>
         </li>
        </ul>
    </div>
</template>
<script>
import Head from "@/components/commonHead";
import axios from "axios";
import { apiUrl } from "../assets/js/apiRegular.js";
export default {
  components: {
    Head
  },
  data() {
    return {
      usertype: "",
      ismanage: "",
      headTitle:"",
      id: ""
    };
  },
  methods: {
    toDevNorm(){
          this.$router.push({ name: type });
    },
    toDetail(type,flag) {
      if(localStorage.getItem('id')){
        if(type == 'devNorms'){
           try {
            createSpecialWindow({url:`index.html#/${type}/${flag}`,id: type}, 'xycoding');
          } catch (error) {
            this.$router.push({path: `/devNorms/${flag}`});
          }
        }else{
          try {
            createSpecialWindow({url:'index.html#/'+type,id: type}, 'xycoding');
          } catch (error) {
            this.$router.push({ name: type });
          }
        }
        
      }else{
        this.$message({
          type:"warning",
          message:'还未登陆，跳转登录页'
        })
        setTimeout(() => {
          this.$router.push({ name: 'Login' });
        }, 1000);

      }
    },
    logout() {},
    getStorage() {
      if (window.localStorage) {
        let storage = window.localStorage;
        this.usertype = storage.getItem("usertype")
          ? storage.getItem("usertype")
          : "";
        this.id = storage.getItem("id") ? storage.getItem("id") : "";
        console.log( this.usertype);
        if (this.usertype === "0") {
          this.ismanage = 0;
        }else if (this.usertype === "9") {
          this.ismanage = 9;
        }
      }
    }
  },
  mounted() {
    this.getStorage();
  }
};
</script>
<style lang="less">

      .module {
        overflow: hidden;
        height: 100%;
        .xylogo {
          display: block;
          width: 108px;
          height: 34px;
          margin-left: 17px;
          margin-top: -10px;
        }
        .bannerlogo {
          margin: 0 auto;
          margin-top: -20px;
          background: url("../assets/img/zyxylogo.png") no-repeat;
          background-size: 100%;
          width: 401px;
          height: 191px;
        }

        .total {
          margin: 28px 0 0 41px;
          overflow: hidden;
          display: flex;
          .each {
            flex: 1;
            // float: left;
            width: 300px;
            height: 293px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            margin-right: 40px;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.3);

            &:hover {
              background: rgba(21, 131, 250, 1);
            }
            .img {
              display: block;
              width: 44px;
              height: 44px;
              
            }
            .img1 {
              background: url("../assets/img/wfw_mr.png") no-repeat center;
              background-size:100%; 
            }
            .img2 {
              background: url("../assets/img/wyy_mr.png") no-repeat center;
              background-size:100%; 
            }
            .img3 {
              background: url("../assets/img/dz_mr.png") no-repeat center;
              background-size:100%; 
            }
            .img4 {
              background: url("../assets/img/XWeb_mr.png") no-repeat center;
              background-size:100%; 
            }
            h2 {
              font-size: 20px;
              font-family: SourceHanSansCN-Normal;
              font-weight: 400;
              color: rgba(224, 224, 224, 1);
              line-height: 45px;
              margin: 17px 0 8px 0;
            }
            h3 {
              span {
                color: #ffffff;
                font-family: "Microsoft YaHei" !important;
                font-weight: 400;
                font-size: 12px;
                display: inline-block;
                margin: 0 0px;
                margin-right: 10px;
              }
            }
          }
          .each1 {
            &:hover .img {
              background: url("../assets/img/wfw_xf.png") no-repeat center;
              background-size:100%; 
            }
          }
          .each2 {
            &:hover .img {
              background: url("../assets/img/wyy_xf.png") no-repeat center;
              background-size:100%; 
            }
          }
          .each3 {
            &:hover .img {
              background: url("../assets/img/dz_xf.png") no-repeat center;
              background-size:100%; 
            }
          }
          .each4 {
            &:hover .img {
              background: url("../assets/img/XWeb_xf.png") no-repeat center;
              background-size:100%; 
            }
          }
        }
        .document {
          margin-top: 72px;
          overflow: hidden;
          color: #fff;
          font-size: 14px;
          display: flex;
          .each {
            // float: left;
            width: 179px;
            text-align: center;
            position: relative;
            flex: 1;
            img {
              cursor: pointer;
              margin-bottom: 7px;
            }
            i {
              display: inline-block;
              width: 1px;
              height: 32px;
              background: rgba(255, 255, 255, 1);
              opacity: 0.2;
              position: absolute;
              right: 0;
              top: 30%;
            }
          }
          .each1 {
            margin-left: 50px;
          }
        }
      }

</style>

