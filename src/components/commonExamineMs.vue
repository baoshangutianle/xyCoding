<template>
    <div class="examineMs">

        <Head></Head>
        <div class="xyc">
            <span class="mstitle"> DIGG微服务审核</span></div>
        <div class="serDetailBox">
            <div class="serFlex">
                <div class="serTitle">
                    <h3>{{modelInfo.f_name}} </h3>
                </div>
            </div>

            <div class="serContent">
                <div class="serInfo">
                    <p><span> 微服务ID：</span><span>{{modelInfo.f_id}}</span></p>
                    <p><span> 版本号：</span><span>{{modelInfo.f_language}}</span></p>
                    <p><span> 开发人员：</span><span>{{modelInfo.f_developer}}</span></p>
                    <div class="cutLine">
                    </div>
                </div>
                <div class="lange">

                    <span>
                        <span>{{modelInfo.f_language}}</span>
                        <!-- <img src="../assets/img/icon_java.png" alt=""> -->
                    </span>
                </div>
                <div class="serBtn" v-if="modelInfo.f_createuser === userId && usertype == 0">
                    <div class="bj" @click="modifyHandle"></div>
                    <div class="sc" @click="delHandle"></div>
                </div>
                <div class="serBtn" v-if="modelInfo.f_createuser != userId || usertype == 9">

                </div>
            </div>
            <ul class="boxList">
                <li>
                    <div class="boxTitleFlex">
                        <div class="boxTitle"><img src="../assets/img/sm.png" alt="">微服务模块说明</div>
                    </div>
                    <div class="boxContent">
                        {{modelInfo.f_desc}}
                    </div>
                </li>
                <li>
                    <div class="boxTitleFlex">
                        <div class="boxTitle"><img src="../assets/img/tp.png" alt=""><span>拓扑图</span></div>
                    </div>

                    <div class="boxContent">
                        <img v-bind:src="modelInfo.f_graph_url" alt="">
                    </div>
                </li>
                <li>
                    <div class="boxTitleFlex">
                        <div class="boxTitle"><img src="../assets/img/dm.png" alt=""><span>源代码</span></div>
                    </div>
                    <div class="boxContent">
                        <a class="alink" v-bind:href="modelInfo.f_code_url">{{modelInfo.f_code_url}}</a>
                    </div>
                </li>
                <li>
                    <div class="boxTitleFlex">
                        <div class="boxTitle"><img src="../assets/img/API.png" alt="">API接口</div>
                    </div>
                    <div class="boxContent">
                        <a class="alink" v-bind:href="modelInfo.f_api_url">{{modelInfo.f_api_url}}</a>
                    </div>
                </li>
                <li>
                    <div class="boxTitleFlex">
                        <div class="boxTitle"><img src="../assets/img/bg.png" alt="">测试报告</div>
                    </div>
                    <div class="boxContent">
                        <a class="alink" v-bind:href="modelInfo.f_report_url">{{modelInfo.f_report_url}}</a>
                    </div>
                </li>
            </ul>
            <div class="line">

            </div>
            <div class="examineBtn">
                <button @click="examinePass">审核通过</button>
                <button class="reject" @click="examineReject">审核拒绝</button>
            </div>
        </div>

        <Dialog v-if='dialogVisible' :dialogVisible='dialogVisible' :parentData='parentData' @setDialogVisible='setDialogVisible'></Dialog>
    </div>
</template>
<script>
import { Resource } from "../fetch/resource.js";
import Head from "@/components/commonHead";
import SerDetail from "@/components/commonSerDetail";
import Dialog from "@/components/commonDialog";

export default {
  data() {
    return {
      activeName:'first',
      modelInfo : {},
      dialogVisible:false,
      userId : localStorage.getItem('id'),
      usertype: localStorage.getItem('usertype'),
      parentData :{
        type: 'mod'
      }
    };
  },
  props: ['chosemodelid'],
  components: {
    Head,
    SerDetail,
    Dialog
  },
  methods: {
      examinePass(){
          this.$alert('确定通过审核？', '审核验证', {
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          callback: action => {
           if (action === 'confirm') {

             this.examine(id,key);
           }else{
           }
        }
          
        })
        },
      examine(){
let _this = this;
    Resource.ESBServlet.post("", {command: "xycoding.p_auditUser",id: 4,userid: userid}, "")
      .then(data => {
        if(data.op.code==='Y'){
          _this.$message({
                type: 'success',
                message: '审核通过'
              });
        }
      })
      .catch(err => {});
      },
      examineReject(){

      },
    handleTabsClick(){

    },
    getModelDetail() {
       
      console.log(this.chosemodelid)
    //   if(this.chosemodelid){
        Resource.ESBServlet.post("", {command: "xycoding.p_selectModelInfo",id: localStorage.getItem('id'),modelid: 186}, "")
        .then(data => {
          console.log("模块详情", data);
            this.modelInfo = data.data;
            // this.parentData.modelInfo = data.data;
        })
        .catch(err => {});
    //   }
    },
    modifyHandle() {
      this.dialogVisible = true;
       this.parentData.modelInfo  = this.modelInfo;
    },
    delHandle(){
      this.$confirm('是否删除删除此服务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Resource.ESBServlet.post("", {command: "xycoding.p_deleteModelInfo",id: localStorage.getItem('id'),modelid: this.chosemodelid}, "")
          .then(data => {
            console.log("删除模块", data);

            if(data.op.code === 'Y'){
              this.$emit("getModelList", { p_deleteModelInfo: true });
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }else{
               this.$message({
                message: data.op.info,
                type: 'warning',
              });
            }
             
          })
        .catch(err => {});
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    verifyService(type) {
        Resource.ESBServlet.post("", {command: "xycoding.p_auditModelInfo",id: localStorage.getItem('id'),modelid: this.chosemodelid, apprstate: type}, "")
          .then(data => {
            console.log("审核状态", data);
            if(data.op.code === 'Y'){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getModelDetail()
            }else{
               this.$message({
                message: data.op.info,
                type: 'warning',
              });
            }
             
          })
        .catch(err => {});
    },
    verifyNoHandle(){
      this.$confirm('确定拒绝此服务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.verifyService(9)
        })
    },
    verifyYesHandle(){
      this.$confirm('确定通过此服务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.verifyService(1)
        })
    },
    setDialogVisible(emitData) {
      console.log(emitData);
      this.dialogVisible = emitData.dialogVisible;
      if(emitData.flag == '1'){
 this.getModelDetail()
      }
     
    },
  },
  watch: {
    chosemodelid:'getModelDetail'
  },
  mounted() {
    this.getModelDetail();
  }
};
</script>
<style lang="less">
.examineMs {
  // width: 100%;
  height: 100%;
  overflow: auto;
  color: #fff;

  .head {
    background: rgba(0, 0, 0, 0.2);
  }
  .xyc {
    position: absolute;
    left: 11px;
    top: 0px;
    color: #fff;
    .mstitle {
      position: absolute;
      left: 95px;
      top: 9px;
      width: 300px;
    }
  }
  .serDetailBox {
    padding: 20px;
    padding-top: 25px;
    .serFlex {
      display: flex;
      height: 40px;
      line-height: 40px;
      .serTitle {
        flex: 1;
        font-size: 20px;
      }
    }

    .serContent {
      margin-bottom: 40px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      > div {
        height: 100%;
      }
      .serInfo {
        position: relative;
        flex: 2;
        > p {
          padding: 5px 0;
          span:first-child {
            color: #bcc8d0;
          }
        }
      }
      .cutLine {
        position: absolute;
        bottom: -20px;
        width: 1036px;
        height: 1px;
        background: rgba(255, 255, 255, 1);
        opacity: 0.14;
      }
      .lange {
        flex: 1;
        text-align: left;
        font-size: 30px;
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
            max-height: 400px;
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
    .line {
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 1);
      opacity: 0.14;
      margin-top: 30px;
    }
    .examineBtn {
      overflow: hidden;
      button {
        cursor: pointer;
        float: right;
        margin: 15px;
        border: none;
        outline: none;
        width: 85px;
        height: 34px;
        background: rgba(28, 125, 250, 1);
        border-radius: 3px;
        color: #fff;
      }
      .reject {
        background: rgba(98, 117, 129, 1);
      }
    }
  }
}
</style>


