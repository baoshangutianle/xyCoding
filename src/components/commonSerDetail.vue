<template>
  <div class="serDetailTabsBox">
    <el-tabs v-if='!dialogVisible' v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :label="data.f_version?data.f_version+'版本':' V_1.0版本'" :name="index.toString()" v-for="(data,index) in modelInfo" :key="index">
        <div class="serDetailBox">
          <div class="serFlex">
            <div class="serTitle">
              <h3>{{data.f_name}} <span v-if="data.f_appr_state == 0">(未审核)</span> <span v-if="data.f_appr_state == 9">(被拒绝)</span></h3>
            </div>
          </div>
          <div class="serContent">
            <div class="serInfo">
              <p><span> 微服务ID：</span><span>{{data.f_modelno}}</span></p>
              <p>
                <span> 开发人员：</span><span v-if='data.f_developerArr.length>0' style="margin-right:5px;" v-for="(item,index) in data.f_developerArr" :key="index">{{item}}</span>
                <span v-if='!data.f_developerArr'>暂无数据</span>
              </p>
            </div>
            <div class="lange">
              <span v-if="data.languageImg">
                <img v-bind:src='data.languageImg' alt="">
              </span>
              <span v-if="!data.languageImg">
                暂无数据
              </span>
            </div>
            <div class="serBtn" v-if="data.f_createuser === userId && usertype == 0">
              <div class="bj" @click="modifyHandle"></div>
              <div class="sc" @click="delHandle"></div>
              <!-- <img src="../assets/img/bj.png" alt="">
              <img src="../assets/img/sc.png" alt=""> -->
              <!-- <el-button type="primary" @click="modifyHandle">修改</el-button>
              <el-button type="danger" @click="delHandle">删除</el-button> -->
            </div>
            <div class="serBtn" v-if="data.f_createuser != userId || usertype == 9">

            </div>
          </div>
          <ul class="boxList">
            <li>
              <div class="boxTitleFlex">
                <div class="boxTitle"><img src="../assets/img/sm.png" alt="">服务模块说明</div>
                <!-- <div class="borderTop"></div> -->
              </div>
              <div class="boxContent">
                {{data.f_desc?data.f_desc:'暂无数据'}}
              </div>
            </li>
            <li>
              <div class="boxTitleFlex">
                <div class="boxTitle"><img src="../assets/img/tp.png" alt=""><span>拓扑图</span></div>
                <!-- <div class="borderTop"></div> -->
              </div>

              <div class="boxContent">
                <viewer v-if='data.imgsArr && data.imgsArr.length>0' :images="data.imgsArr">
                  <img v-for='(item, index) in data.imgsArr' v-bind:src="item" :key="index" alt="">
                </viewer>
                <span v-if='!data.imgsArr'>暂无数据</span>
              </div>
            </li>
            <li>
              <div class="boxTitleFlex">
                <div class="boxTitle"><img src="../assets/img/dm.png" alt=""><span>源代码</span></div>
                <!-- <div class="borderTop"></div> -->
              </div>
              <div class="boxContent">
                <a @click="toUrl(data.f_code_url)" v-if='data.f_code_url' class="alink">{{data.f_code_url}}</a>
                <span v-if='!data.f_code_url'>暂无数据</span>
              </div>
            </li>
            <li>
              <div class="boxTitleFlex">
                <div class="boxTitle"><img src="../assets/img/API.png" alt="">API接口</div>
                <!-- <div class="borderTop"></div> -->
              </div>
              <div class="boxContent">
                <a @click="toUrl(data.f_api_url)" class="alink" v-if='data.f_api_url'>{{data.f_api_url}}</a>
                <span v-if='!data.f_api_url'>暂无数据</span>
              </div>
            </li>
            <li>
              <div class="boxTitleFlex">
                <div class="boxTitle"><img src="../assets/img/bg.png" alt="">测试报告</div>
                <!-- <div class="borderTop"></div> -->
              </div>
              <div class="boxContent">
                <a ref="testDoc" @click="toUrl(data.f_report_url)" v-if='data.f_report_url' class="alink">{{data.f_report_name}}</a>
                <span v-if='!data.f_report_url'>暂无数据</span>
              </div>
            </li>

          </ul>
          <div class="examineBtn" v-if="usertype == '9'&&sign">
            <el-row>
              <el-button type="text" @click="handleClose('-1')">返回</el-button>
              <el-button v-if="data.f_appr_state == '0'" type="primary" @click="verifyYesHandle">审核通过</el-button>
              <el-button v-if="data.f_appr_state == '0'" type="info" style="background:#627581" @click="verifyNoHandle">审核拒绝</el-button>
            </el-row>
          </div>

        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="V1.11" name="second">

      </el-tab-pane> -->
    </el-tabs>
    <Dialog v-if='dialogVisible' :dialogVisible='dialogVisible' :parentData='parentData' @setDialogVisible='setDialogVisible'></Dialog>

  </div>
</template>
<script>
import { Resource } from "../fetch/resource.js";
import Head from "@/components/commonHead";
import SerDetail from "@/components/commonSerDetail";
import Dialog from "@/components/commonDialog";

import Java from "../assets/img/icon_java.png";
import Angularjs from "../assets/img/icon_AngularJS.png";
import Javascript from "../assets/img/icon_Javascript.png";
import Reactjs from "../assets/img/icon_reactjs.png";
import Vuejs from "../assets/img/icon_vuejs.png";

export default {
  data() {
    return {
      modelInfo: [],
      dialogVisible: false,
      userId: localStorage.getItem("id"),
      usertype: localStorage.getItem("usertype"),
      flag: "1",
      parentData: {
        type: "mod",
        pageFlag: "0"
      },
      language: {
        Java: Java,
        Angularjs: Angularjs,
        Javascript: Javascript,
        Reactjs: Reactjs,
        Vuejs: Vuejs
      },
      newModelNo: ""
    };
  },
  props: ["chosemodelid", "sign", "activeName"],
  components: {
    Head,
    SerDetail,
    Dialog
  },
  methods: {
    toUrl(_url) {
      let regex = /(.*pdf|.*docx|.*xlsx|.*doc|.*xls)/g;
      let result = _url.match(regex);
      if (result == null) {
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
        if (this.$refs.testDoc[0].href) {
          this.$refs.testDoc[0].removeAttribute("href");
        }
      } else if (result.length == 1) {
        this.$refs.testDoc[0].href = _url;
      }
    },
    handleClose(flag) {
      this.flag = flag;
      this.$emit("getModelList", { dialogVisible: false, flag: this.flag });
    },
    handleClick() {},
    getModelDetail() {
      console.log(this.chosemodelid);
      if (this.chosemodelid) {
        let params = {
          command: "xycoding.p_selectModelInfo",
          id: localStorage.getItem("id")
        };

        if (this.sign) {
          params.modelid = this.chosemodelid;
          params.usertype = localStorage.getItem("usertype");
        } else {
          params.modelno = this.chosemodelid;

          //  判断是否修改modelNo
          if (this.newModelNo) {
            params.modelno = this.newModelNo;
          }
        }
        Resource.ESBServlet.post("", params, "")
          .then(data => {
            console.log("模块详情", data);
            if (this.newModelNo) this.newModelNo = "";
            this.modelInfo = data.datalist;
            this.modelInfo.map(item => {
              item.imgsArr = item.f_graph_url ? [item.f_graph_url] : "";
              item.f_developerArr = item.f_developer
                ? item.f_developer.split(";")
                : "";
              item.languageImg = item.f_language
                ? this.language[item.f_language]
                : "";
              console.log(item.imgsArr);
            });
          })
          .catch(err => {});
      }
    },
    modifyHandle() {
      this.dialogVisible = true;
      console.log(this.activeName);
      this.parentData.modelInfo = this.modelInfo[parseInt(this.activeName)];
    },
    delHandle() {
      this.$confirm("是否确定此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Resource.ESBServlet.post(
            "",
            {
              command: "xycoding.p_deleteModelInfo",
              id: localStorage.getItem("id"),
              modelid: this.modelInfo[parseInt(this.activeName)].f_id
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
            message: "已取消删除"
          });
        });
    },
    verifyService(type) {
      Resource.ESBServlet.post(
        "",
        {
          command: "xycoding.p_auditModelInfo",
          id: localStorage.getItem("id"),
          modelid: this.modelInfo[parseInt(this.activeName)].f_id,
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
    setDialogVisible(emitData) {
      console.log(emitData);
      if (emitData.newModelNo) {
        //  判断是否修改modelNo
        this.newModelNo = emitData.newModelNo;
      }
      this.dialogVisible = emitData.dialogVisible;
      this.$emit("getModelList", { dialogVisible: false, flag: "1" });
      this.getModelDetail();
    }
  },
  watch: {
    chosemodelid: "getModelDetail"
  },
  mounted() {
    this.getModelDetail();
  }
};
</script>
<style lang="less">
.serDetailTabsBox {
  // width: 100%;
  height: 100%;
  color: #fff;

  .el-tabs__nav {
    border: 0 !important;
  }
  .el-tabs__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important; /*no*/
  }
  .el-tabs__item {
    border-left: 1px solid rgba(255, 255, 255, 0.2) !important; /*no*/
    color: #bcc8d0;
  }
  .el-tabs__item:first-child {
    border-left: none !important;
  }
  .is-active {
    background-color: #1c7dfa !important;
    color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; /*no*/
  }

  .serDetailBox {
    padding: 20px;
    padding-top: 0;
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
</style>


