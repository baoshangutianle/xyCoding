<template>
  <div class="customapp commonTotal">

    <Head :headTitle="headTitle"></Head>

    <div class="contentBox content">
      <div class="menuList">
        <el-row class="tac">
          <el-col>
            <el-menu default-active='0' :default-openeds="navsubselected">
              <el-menu-item @click="addChildSer(-1)" index="-1" v-if='usertype == 0'>
                <i class="el-icon-plus"></i>
                <span slot="title">登记定制应用</span>
              </el-menu-item>
              <el-menu-item v-for="(val,index) in tabList" :key="index" @click="tabListDetail(val.id)" :index='index.toString()'>
                <span slot="title">{{val.name}}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>

        <!-- <ul class="leftTab" v-for="(val,index) in tabList" :key="index">
              <li @click="tabListDetail(val.id)" ref="tab">{{val.name}}
                <i class="point" v-if="val.state == 0 && usertype == 9"></i>
              </li>
                
            </ul> -->
      </div>
      <div class="mainBox">
        <AppDetail :customApp='customApp' :modelId='modelId' v-if='!dialogVisible'  @getModelList='getModelListNoDetail'></AppDetail>
        <Dialog v-if='dialogVisible' :dialogVisible='dialogVisible' :parentData='parentData' @setDialogVisible='setDialogVisible'></Dialog>

      </div>
    </div>
  </div>
</template>
<script>
import { Resource } from "../fetch/resource.js";
import Head from "@/components/commonHead";
import AppDetail from "@/components/commonAppDetail";
import Dialog from "@/components/commonDialog";

export default {
  data() {
    return {
      dataList: {},
      headTitle: "定制应用",
      dialogVisible: false,
      navsubselected: ["0"],
      usertype: localStorage.getItem("usertype"),
      imageUrl: "",
      modifyId: "",
      modelId: "",
      customApp: true,
      tabList: "",
      fileList: [],
      serModelArr: [],
      command: "",
      uploadUrl: Resource.UploadFile,
      appname: "",
      devlanguage: "",
      developer: "",
      customAppDesc: "",
      apiUrl: "",
      deleteId: "",
      serGraphurl: "",
      chosemodelid: "",
      parentData: {
        type: "add",
        pageFlag: "2"
      }
    };
  },
  components: {
    Head,
    AppDetail,
    Dialog
  },
  methods: {
    handleSelect() {
      console.log(111);
      debugger;
    },
    addChildSer(item) {
      console.log(item);
      this.dialogVisible = true;
      this.parentData.modelInfo = item;
      this.chosemodelid = item;
    },
    setDialogVisible(emitData) {
      // debugger;
      // console.log(emitData);
      // this.dialogVisible = emitData.dialogVisible;
      if (emitData.flag === "1") {
        this.getModelList();
      }
    },
    handleChange() {},
    handleRemove(file, fileList) {
      console.log(this.serModelArr);

      if (file.response && file.response.errno === "0") {
        this.serModelArr = this.serModelArr.filter(
          el => el.url !== file.response.data[0]
        );
      } else {
        this.serModelArr = this.serModelArr.filter(el => el.url !== file.url);
      }
    },
    examineSucc(id) {
      let _this = this;
      let params = {
        command: "xycoding.p_auditModelInfo",
        id: localStorage.getItem("id"),
        modelid: id,
        apprstate: 1
      };
      Resource.ESBServlet.post("", params, "").then(data => {
        if (data.op.code === "E") {
          _this.$message({
            type: "warning",
            message: data.op.info
          });
        } else {
          console.log(data, "*******************");
          _this.$message({
            type: "success",
            message: "审核通过"
          });
        }
      });
    },
    examineLose(id) {
      let _this = this;
      let params = {
        command: "xycoding.p_auditModelInfo",
        id: localStorage.getItem("id"),
        modelid: id,
        apprstate: 9
      };
      Resource.ESBServlet.post("", params, "").then(data => {
        if (data.op.code === "E") {
          _this.$message({
            type: "warning",
            message: data.op.info
          });
        } else {
          // console.log(data,"*******************")
          _this.$message({
            type: "success",
            message: "审核不通过"
          });
        }
      });
    },
    addOrModify() {
      console.log(this.serModelArr, this.fileList);
      let total = this.serModelArr.reduce(function(init, item, index) {
        return index === 0 ? item.url : init + "," + item.url;
      }, "");
      total = total.split(",");
      console.log(total);
      let _this = this;
      this.dialogVisible = true;
      // xycoding.p_addCustomInfo
      let params = {
        command: "",
        id: localStorage.getItem("id"),
        name: this.appname,
        desc: this.customAppDesc,
        language: this.devlanguage,
        developer: this.developer,
        apiurl: this.apiUrl,
        pid: 3,
        rid: 3,
        modelimg: total
      };
      if (this.command === "add") {
        params.command = "xycoding.p_addCustomInfo";
        Resource.ESBServlet.post("", params, "")
          .then(data => {
            if (data.op.code === "E") {
              _this.$message({
                type: "warning",
                message: data.op.info
              });
            } else {
              _this.dialogVisible = false;
              _this.$message({
                type: "success",
                message: "新增成功"
              });
              _this.getModelList();
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (this.command === "modify") {
        params.command = "xycoding.p_modifyCustomInfo";
        params.modelid = this.modifyId;
        Resource.ESBServlet.post("", params, "").then(data => {
          if (data.op.code === "E") {
            _this.$message({
              type: "warning",
              message: data.op.info
            });
          } else {
            // console.log(data,"######################")
            _this.dialogVisible = false;
            _this.$message({
              type: "success",
              message: "修改成功"
            });
            // _this.tabListDetail(this.modifyId);
          }
        });
      } else {
      }
    },
    addCustomApp() {
      this.appname = "";
      this.apiUrl = "";
      this.imageUrl = "";
      this.customAppDesc = "";
      this.developer = "";
      this.devlanguage = "";
      this.serGraphurl = "";
      this.dialogVisible = true;
      this.command = "add";
    },
    modify(data) {
      this.dialogVisible = true;
      this.command = "modify";
      this.appname = data.f_name;
      this.modifyId = data.f_id;
      if (data.imgs) {
        let imgArr = Object.values(data.imgs);
        imgArr = imgArr.map((item, index) => ({
          name: "Pic" + index,
          url: item
        }));
        this.fileList = imgArr;
        this.serModelArr = JSON.parse(JSON.stringify(imgArr));
      }
      this.devlanguage = data.f_language;
      this.developer = data.f_developer;
      this.customAppDesc = data.f_desc;
      this.apiUrl = data.f_api_url;
    },
    shanchu(id) {
      let _this = this;
      let params = {
        command: "xycoding.p_deleteModelInfo",
        id: localStorage.getItem("id"),
        modelid: id
      };
      Resource.ESBServlet.post("", params, "").then(data => {
        if (data.op.code === "E") {
          _this.$message({
            type: "warning",
            message: data.op.info
          });
        } else {
          // console.log(data,"*******************")
          _this.$message({
            type: "success",
            message: "删除成功"
          });
          _this.getModelList();
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // handleAvatarSuccess(res, file){
    //   this.imageUrl = URL.createObjectURL(file.raw);
    //   this.serGraphurl = res.data[0];
    // },
    handleAvatarSuccess(res, file, fileList) {
      this.serModelArr.push({
        name: file.name,
        url: res.data[0],
        status: file.status,
        uid: file.uid
      });
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpg" ||
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/bmp" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("仅支持jpg，png，bmp，gif格式的图片！");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    toDetail() {
      console.log(111111);
    },
    goBack() {
      window.history.go(-1);
    },
    tabListDetail(id) {
      this.dialogVisible = false;
      this.modelId = id;
      console.log(this.modelId);
    },
    getModelList() {
      let _this = this;
      let params = {
        command: "xycoding.p_modelList",
        id: localStorage.getItem("id"),
        type: 2
      };
      Resource.ESBServlet.post("", params, "")
        .then(data => {
          if (data.op.code === "E") {
          } else {
            console.log(data, "左边列表");
            _this.tabList = data.datalist[0].memberlist;
            if (
              data.datalist.length > 0 &&
              data.datalist[0].memberlist.length > 0
            ) {
              this.modelId = data.datalist[0].memberlist[0].id;
              // this.tabListDetail(this.chosemodelid);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getModelListNoDetail(){
      let _this = this;
        let params = {
          command: "xycoding.p_modelList",
          id: localStorage.getItem("id"),
          type: 2
        };
        Resource.ESBServlet.post("", params, "")
          .then(data => {
            if (data.op.code === "E") {
            } else {
              console.log(data, "左边列表");
              _this.tabList = data.datalist[0].memberlist;
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
     getListMessage(){
      this.interval = setInterval(() =>{
        let _message = localStorage.getItem('message');
        if(_message && _message == 'XYCodingmessage'){
          localStorage.removeItem('message')
          this.getModelList();
        }
      },2000)
    }
  },
  created(){
     this.getListMessage()
  },
  mounted() {
    this.getModelList();
  }
};
</script>
<style lang="less">
@import "../style/resetStyle.less"; /*引入公共样式*/
@import "../assets/css/common.less";
.customapp {
  height: 100%;

  .contentBox {
    width: 100%;
    height: calc(100% - 40px);
    // background:rgba(0,0,0,.4);
    .disflex;
    .leftTab {
      li {
        line-height: 40px;
        cursor: pointer;
        text-indent: 30px;
        color: rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2); /*no*/
        .overHid;
        .positionR;
        .point {
          position: absolute;
          right: 15px;
          top: 20px;
          width: 6px;
          height: 6px;
          background: rgba(245, 66, 66, 1);
          border-radius: 50%;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
    .menuList {
      width: 220px;
      overflow: auto;
      .addService {
        cursor: pointer;
        color: #fff;
        text-align: center;
        line-height: 39px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1); /*no*/
        // &:hover {
        //   background-color: rgba(255, 255, 255, 0.2);
        // }
      }
      .el-dialog {
        width: 642px;
        // min-height: 534px;
        background: rgba(248, 246, 247, 1);
        border-radius: 8px;
        .el-dialog__header {
          padding: 0;
          text-align: center;
          .el-dialog__title {
            width: 69px;
            font-family: SourceHanSansCN-Regular;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 34px;
            .fs14;
          }
        }
        .el-dialog__body {
          padding: 0;
          margin: 9px 0 0 19px;
          .topic {
            // position: absolute;
            display: inline-block;
            padding-left: 18px;
            background: url("../assets/img/position.png") no-repeat left;
          }
          .total {
            margin-bottom: 10px;
            .customAppupload {
              display: inline-block;
            }
            .msname {
              margin-right: 10px;

              display: inline-block;
              min-width: 90px;
              .txtr;
            }
            .tuopu {
              vertical-align: top;
            }
            input {
              height: 30px;
              width: 502px;
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(232, 232, 232, 1); /*no*/
              border-radius: 3px;
              padding-left: 8px;
            }
            .uploadtestdoc {
              outline: none;
              border: none;
              width: 93px;
              height: 30px;
              background: rgba(28, 125, 250, 1);
              border-radius: 3px;
              color: #fff;
            }
          }
        }
      }
    }
    .mainBox {
      flex: 1;
      width: 100%;
      height: 100%;
      border-left: 1px solid #3e89ae; /*no*/
      // border-top: 1px solid #3e89ae; /*no*/
      box-sizing: border-box;
      // padding: 20px;
      overflow: auto;
    }
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
      width: 80px;
    }
  }
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
        margin: 5px 10px 5px 10px;
        color: #fff;
        cursor: pointer;
        .fs12;
        .txtc;
      }
    }
    .msicon {
      // margin: 14px 6px 0 22px;
      vertical-align: top;
    }
  }
}
</style>


