<template>
  <div class="microSer">
    <div class="serDetailBox" v-if='!dialogVisible'>
      <div class="serFlex">
        <div class="serTitle">
          <h3>{{modelInfo.f_name}} <span v-if="modelInfo.f_appr_state == 0">(未审核)</span> <span v-if="modelInfo.f_appr_state == 9">(被拒绝)</span></h3>
        </div>
      </div>

      <div class="serContent">
        <div class="serInfo">
          <!-- <p><span> 微应用ID：</span><span>{{modelInfo.f_id?modelInfo.f_id:''}}</span></p> -->
          <p>
            <span> 开发人员：</span><span v-if='modelInfo.f_developerArr.length>0' style="margin-right:5px;" v-for="(item,index) in modelInfo.f_developerArr" :key="index">{{item}}</span>
            <span v-if='!modelInfo.f_developerArr'>暂无数据</span>
          </p>
        </div>
        <div class="lange">
          <span v-if="modelInfo.languageImg">
            <img v-bind:src='modelInfo.languageImg' alt="">
          </span>
          <span v-if="!modelInfo.languageImg">
            暂无数据
          </span>
        </div>

        <div class="serBtn" v-if="modelInfo.f_createuser === userId && usertype == 0">
          <div class="bj" @click="modifyHandle"></div>
          <div class="sc" @click="delHandle"></div>
          <!-- <img src="../assets/img/bj.png" alt="">
            <img src="../assets/img/sc.png" alt=""> -->
          <!-- <el-button type="primary" @click="modifyHandle">修改</el-button>
            <el-button type="danger" @click="delHandle">删除</el-button> -->
        </div>
        <div class="serBtn" v-if="modelInfo.f_createuser != userId || usertype == 9">

        </div>
      </div>
      <ul class="boxList">
        <li v-if="headTitle === '微应用'">
          <div class="boxTitleFlex">
            <span class="boxTitle"><img src="../assets/img/concent.png" alt="">关联微服务</span>
            <!-- <div class="borderTop"></div> -->
          </div>
          <div class="boxContent">
            <span>{{modelInfo.f_relate_modelno?modelInfo.f_relate_modelno: '暂无数据'}}</span>
          </div>
        </li>
        <li>
          <div class="boxTitleFlex">
            <span class="boxTitle"><img src="../assets/img/sm.png" alt="">{{headTitle}}说明</span>
            <!-- <div class="borderTop"></div> -->
          </div>
          <div class="boxContent textGap">
            {{modelInfo.f_desc?modelInfo.f_desc:'暂无数据'}}
          </div>
        </li>
        <li>
          <div class="boxTitleFlex">
            <span class="boxTitle"><img src="../assets/img/version.png" alt="">版本号</span>
            <!-- <div class="borderTop"></div> -->
          </div>
          <div class="boxContent">
            <span>{{modelInfo.f_version?modelInfo.f_version: '暂无数据'}}</span>
          </div>
        </li>
        <li>
          <div class="boxTitleFlex">
            <span class="boxTitle"><img src="../assets/img/enterAdd.png" alt="">入口地址</span>
            <!-- <div class="borderTop"></div> -->
          </div>
          <div class="boxContent">
            <a @click="toUrl(modelInfo.f_report_url)" v-if='modelInfo.f_report_url' class="alink">{{modelInfo.f_report_url?modelInfo.f_report_url:''}}</a>
            <span v-if='!modelInfo.f_report_url'>暂无数据</span>
          </div>
        </li>
        <li>
          <div class="boxTitleFlex">
            <span class="boxTitle"><img src="../assets/img/sourceCode.png" alt="">源代码</span>
            <!-- <div class="borderTop"></div> -->
          </div>
          <div class="boxContent">
            <a @click="toUrl(modelInfo.f_code_url)" v-if='modelInfo.f_code_url' class="alink">{{modelInfo.f_code_url?modelInfo.f_code_url:''}}</a>
            <span v-if='!modelInfo.f_code_url'>暂无数据</span>
          </div>
        </li>
        <li>
          <div class="boxTitleFlex">
            <span class="boxTitle"><img src="../assets/img/API.png" alt="">API地址</span>
            <!-- <div class="borderTop"></div> -->
          </div>
          <div class="boxContent">
            <a @click="toUrl(modelInfo.f_api_url)" v-if='modelInfo.f_api_url' class="alink">{{modelInfo.f_api_url?modelInfo.f_api_url:''}}</a>
            <span v-if='!modelInfo.f_api_url'>暂无数据</span>
          </div>
        </li>
        <li>
          <div class="boxTitleFlex">
            <span class="boxTitle"><img src="../assets/img/tp.png" alt="">界面图</span>
            <!-- <div class="borderTop"></div> -->
          </div>

          <div class="boxContent">
            <viewer v-if='modelInfo.imgsArr && modelInfo.imgsArr.length>0' :images="modelInfo.imgsArr">
              <img v-for='(item, index) in modelInfo.imgsArr' v-bind:src="item" :key="index" alt="">
            </viewer>
            <span v-if='!modelInfo.imgsArr || modelInfo.imgsArr.length == 0'>暂无数据</span>
          </div>
        </li>

      </ul>
      <div class="examineBtn" v-if="usertype == '9'&& sign ">
        <el-row>
          <el-button type="text" @click="handleClose('-1')">返回</el-button>
          <el-button v-if="modelInfo.f_appr_state == '0'" type="primary" @click="verifyYesHandle">审核通过</el-button>
          <el-button v-if="modelInfo.f_appr_state == '0'" type="info" style="background:#627581" @click="verifyNoHandle">审核拒绝</el-button>
        </el-row>
      </div>
    </div>
    <Dialog v-if='dialogVisible' :dialogVisible='dialogVisible' :parentData='parentData' @setDialogVisible='setDialogVisible'></Dialog>
  </div>
</template>
<script>
import { Resource } from "../fetch/resource.js";
import Head from "@/components/commonHead";
import Dialog from "@/components/commonDialog";

import Java from "../assets/img/icon_java.png";
import Angularjs from "../assets/img/icon_AngularJS.png";
import Javascript from "../assets/img/icon_Javascript.png";
import Reactjs from "../assets/img/icon_reactjs.png";
import Vuejs from "../assets/img/icon_vuejs.png";

export default {
  data() {
    return {
      modelInfo: {},
      headTitle: "微应用",
      dialogVisible: false,
      userId: localStorage.getItem("id"),
      usertype: localStorage.getItem("usertype"),
      parentData: {
        type: "mod",
        pageFlag: "1"
      },
      modelid: "",
      language: {
        Java: Java,
        Angularjs: Angularjs,
        Javascript: Javascript,
        Reactjs: Reactjs,
        Vuejs: Vuejs
      }
    };
  },
  props: ["chosemodelid", "customApp", "modelId", "sign", "scroll"],
  components: {
    Head,
    // SerDetail,
    Dialog
  },
  methods: {
    toUrl(_url) {
      let _id = encodeURIComponent(encodeURIComponent(_url));
      try {
        createSpecialWindow({
          url: `index.html#/urlDetail/${_id}`,
          id: "urlDetail"
        });
      } catch (error) {
        this.$router.push({
          path: `/urlDetail/${_id}`
        });
      }
    },
    sendMessage() {
      try {
        sendMessage("XYCodingmessage");
      } catch (e) {
        //TODO handle the exception
      }
    },
    handleClose(flag) {
      this.flag = flag;
      this.$emit("getModelList", { dialogVisible: false, flag: this.flag });
    },
    verifyNoHandle() {
      this.$confirm("确定此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.verifyService(9);
      });
    },
    verifyYesHandle() {
      this.$confirm("确定此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.verifyService(1);
      });
    },
    goBack() {
      window.history.go(-1);
    },
    getModelDetail() {
      if (this.$route.params.id) {
        this.modelid = this.$route.params.id;
      } else {
        // if(!this.modelid)return false;
        this.modelid = this.modelId;
      }
      if (this.modelid) {
        Resource.ESBServlet.post(
          "",
          {
            command: "xycoding.p_selectModelInfo",
            id: localStorage.getItem("id"),
            modelid: this.modelid,
            usertype: localStorage.getItem("usertype")
          },
          ""
        )
          .then(data => {
            console.log("模块详情", data);
            this.modelInfo = data.datalist[0];
            console.log(this.modelInfo, "********************************");
            let imgs = this.modelInfo.imgs
              ? Object.values(this.modelInfo.imgs)
              : "";
            this.modelInfo.imgsArr = imgs;
            this.modelInfo.f_developerArr = this.modelInfo.f_developer
              ? this.modelInfo.f_developer.split(";")
              : "";
            this.modelInfo.languageImg = this.modelInfo.f_language
              ? this.language[this.modelInfo.f_language]
              : "";
            console.log(this.modelInfo);
            // this.parentData.modelInfo = data.data;
          })
          .catch(err => {});
      }
    },
    modifyHandle() {
      this.dialogVisible = true;
      this.parentData.modelInfo = this.modelInfo;
    },
    delHandle() {
      this.$confirm("是否确定此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.$route.params.id) {
            this.modelid = this.$route.params.id;
          } else {
            this.modelid = this.modelId;
          }
          Resource.ESBServlet.post(
            "",
            {
              command: "xycoding.p_deleteModelInfo",
              id: localStorage.getItem("id"),
              modelid: this.modelid
            },
            ""
          )
            .then(data => {
              console.log("删除模块", data);

              if (data.op.code === "Y") {
                this.$emit("getModelList", { p_deleteModelInfo: true });
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                try {
                  sendMessage("XYCodingmessage");
                  if(!this.customApp){
                    closeWin();
                  }
                } catch (e) {
                  window.history.go(-1);
                  //TODO handle the exception
                }
              } else {
                this.$message({
                  message: data.op.info,
                  type: "warning"
                });
              }
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    verifyService(type) {
      if (this.$route.params.id) {
        this.modelid = this.$route.params.id;
      } else {
        this.modelid = this.modelId;
      }
      Resource.ESBServlet.post(
        "",
        {
          command: "xycoding.p_auditModelInfo",
          id: localStorage.getItem("id"),
          modelid: this.modelid,
          apprstate: type
        },
        ""
      )
        .then(data => {
          console.log("审核状态", data);
          if (data.op.code === "Y") {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$emit("getModelList", { dialogVisible: false, flag: "1" });
            try {
              sendMessage("XYCodingmessage");
            } catch (e) {
              //TODO handle the exception
            }
            this.getModelDetail();
          } else {
            this.$message({
              message: data.op.info,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // verifyNoHandle(){
    //   this.$confirm('确定拒绝此应用吗?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //      this.verifyService(9)
    //     })
    // },
    // verifyYesHandle(){
    //   this.$confirm('确定通过此应用吗?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //      this.verifyService(1)
    //     })
    // },
    setDialogVisible(emitData) {
      console.log(emitData);
      this.dialogVisible = emitData.dialogVisible;
      this.$emit("getModelList", { dialogVisible: false, flag: "1" });
      this.getModelDetail();
    }
  },
  watch: {
    modelId: "getModelDetail"
  },
  mounted() {
    console.log(this.modelId, "$$$$$$$$$$$$$$$$$$$$");
    this.getModelDetail();
    if (this.$route.params.id) {
      this.parentData.pageFlag = "1";
      this.headTitle = "微应用";
    } else {
      this.parentData.pageFlag = "2";
      this.headTitle = "定制应用";
    }
  }
};
</script>
<style lang="less" scoped>
.microSer {
  width: 100%;

  .backTitle {
    border-bottom: 1px solid #3e89ae; /*no*/
    border-top: 1px solid #3e89ae; /*no*/
    background: rgba(0, 0, 0, 0.2);

    .back {
      display: inline-block;
      vertical-align: top;
      width: 80px;
      height: 40px;
      overflow: hidden;
      border-right: 1px solid #3e89ae; /*no*/

      .backIndex {
        background: url("../assets/img/back.png") no-repeat center;
        width: 60px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        margin: 5px 10px 5px 10px;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .msicon {
      // margin: 14px 6px 0 22px;
      vertical-align: top;
    }
    .mstitle {
      display: inline-block;
      color: #fff;
      line-height: 40px;
      margin-left: 10px;
    }
  }

  .serDetailBox {
    color: #fff;
    padding: 20px;
    padding-top: 20px;
    //  width: 100%;
    .serFlex {
      display: flex;
      height: 40px;
      line-height: 40px;
      .serTitle {
        flex: 1;
        font-size: 20px;
      }
      // .serBtn {
      //   display: flex;
      //   text-align: center;
      //   .verifyIs{
      //     color: #67c23a;
      //     border: 0;
      //     background: #f0f9eb;
      //   }
      //   .verifyNo{
      //     color: #f56c6c;
      //     border: 0;
      //     background: #fef0f0;
      //   }
      //   button {
      //     margin-right: 10px;
      //   }
      //   // position: absolute;
      // }
    }

    .serContent {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      > div {
        height: 100%;
      }
      .serInfo {
        flex: 2;
        > p {
          padding: 5px 0;
          span:first-child {
            color: #bcc8d0;
          }
        }
      }
      .lange {
        flex: 1;
        text-align: right;
        font-size: 20px;
        img {
          height: 56px;
        }
      }
      .serBtn {
        flex: 1;
        text-align: right;
        padding-top: 25px;
        > div {
          width: 20px;
          height: 30px;
          display: inline-block;
          margin-right: 10px;
        }
        .bj {
          background-image: url("../assets/img/bj.png");
          background-repeat: no-repeat;
          background-size: 100%;
        }
        .bj:hover {
          background-image: url("../assets/img/bjx.png");
        }
        .sc {
          background-image: url("../assets/img/sc.png");
          background-repeat: no-repeat;
          background-size: 100%;
        }
        .sc:hover {
          background-image: url("../assets/img/scx.png");
        }
      }
    }
    .boxList {
      border-top: 1px solid rgba(255, 255, 255, 0.2); /*no*/
      li {
        margin-top: 30px;
        padding-top: 10px;
        .boxTitleFlex {
          display: flex;
          .boxTitle {
            display: flex;
            height: 22px;
            line-height: 22px;
            align-items: center;
            overflow: hidden;
            display: block;
            top: -12px;
            padding: 0px 10px;
            // border-left: 2px solid #00c4f2;/*no*/
            background: rgba(0, 0, 0, 0.2);
            color: #bcc8d0;
            font-size: 14px;

            img {
              height: 14px;
              display: inline-block;
              vertical-align: -2px;
              margin-right: 10px;
              //  border-radius: 3px;
            }
          }
          .borderTop {
            flex: 1;
            height: 1px;
            border-top: 1px solid rgba(255, 255, 255, 0.2); /*no*/
            align-self: center;
            margin-left: 10px;
          }
        }

        .boxContent {
          padding-left: 10px;
          margin: 10px 0;
          line-height: 24px;
          img {
            max-width: 100px;
            margin-left: 20px;
          }
        }
        .textGap{
          padding-right: 40px;
        }
        .alink {
          color: #00c4f2;
          text-decoration: underline;
        }
      }
      li:first-child {
        margin-top: 5px;
      }
    }
    .examineBtn {
      border-top: 1px solid rgba(255, 255, 255, 0.2); /*no*/
      padding-top: 20px;
      .el-row {
        text-align: right;
      }
    }
  }
}
.customApp {
  background: url("../assets/img/bg3.png") no-repeat;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>


