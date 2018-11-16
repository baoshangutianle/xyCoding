<template>
  <div class="devNorms">

    <Head :headTitle="headTitle"></Head>
    <div class="contentBox" v-if='!articleVisible'>
      <div class="menuList">
        <el-row class="tac">
          <el-col>
            <el-menu :default-active="type=='1'?'-1':'0'" :default-openeds="navsubselected">
              <el-menu-item index="-2" @click="upload">
                <i class="el-icon-plus"></i>
                <span slot="title">上传</span>
              </el-menu-item>
              <el-menu-item index="-1" @click="getArticleList()" v-if="type=='1'">
                <span slot="title">全部</span>
              </el-menu-item>
              <el-menu-item v-for="(val,index) in tabList" :key="index" @click="getArticleList(val.f_sub_no)" :index='index.toString()' v-if="type=='1'">
                <span slot="title">{{val.f_sub_name}}</span>
              </el-menu-item>
              <el-menu-item v-for="(val,index) in articleList" :key="index" @click="getDevDetail(val.f_id)" :index='index.toString()' v-if="type=='0'">
                <span slot="title">{{val.f_title}}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <div class="docDetail">
        <div class="modelTitle" v-if="type =='1'">
          <ul class="title">
            <li>技术文档</li>
            <li>作者</li>
            <li>上传时间</li>
            <li>简介</li>
          </ul>
          <ul class="content" v-for="(item,index) in articleList" @click="articelDetailHandle(item)" :key="index">
            <li>{{item.f_title}} <img src="../assets/img/word.png" alt="" v-if="item.f_url?(item.f_url.substring(item.f_url.lastIndexOf('.')+1)=='docx'?true:false):''"><img src="../assets/img/pdf.png" alt="" v-if="item.f_url?(item.f_url.substring(item.f_url.lastIndexOf('.')+1)=='pdf'?true:false):''"></li>
            <li>{{item.f_author}}</li>
            <li>{{item.f_appr_time}}</li>
            <li>{{item.f_desc}}</li>

            <!-- <li class="examine">
                <div class="bj" @click="modifyHandle"></div>
                <div class="sc" @click="delHandle"></div>
            </li> -->
          </ul>

        </div>
        <div class="showPDF" v-if="type=='0'">
          <PDFDetail v-if="choseUrl" :choseUrl="choseUrl">  </PDFDetail> 
          <div class="noDataDesc" v-if='!choseUrl'>暂无数据</div>
          <!-- <iframe :src=url frameborder="0" width="100%" height="100%"></iframe> -->
        </div>
      </div>
      <!-- <div class="uploadDoc" @click="addArticleHanldle">上传文档</div> -->

    </div>

    <el-dialog title="文档地址" :visible.sync="articelDetailVisible">
      <a style="color:#1683fa;text-decoration: underline" :href="docUrl">{{docUrl}}</a>
      <div slot="footer" class="dialog-footer">
        <el-button @click="articelDetailVisible = false">取 消</el-button>
        <el-button type="primary" @click="articelDetailVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <Article v-if='articleVisible' :articleVisible='articleVisible' :docType='type' :parentData='parentData' @setarticleVisible='setarticleVisible'></Article>
  </div>
</template>
<script>
import { Resource } from "../fetch/resource.js";
import Head from "@/components/commonHead";
import Article from "@/components/commonArticle";
import PDFDetail from "@/components/commonPDFDetail";

export default {
  data() {
    return {
      type: this.$route.params.type,
      headTitle: this.$route.params.type == "0" ? "开发规范" : "技术文档",
      articelDetailVisible: false,
      docUrl: "",
      url: "",
      tabList: "",
      navsubselected: ["0"],
      userId: localStorage.getItem("id"),
      articleList: [],
      usertype: localStorage.getItem("usertype"),
      articleVisible: false,
      parentData: {
        type: "add",
        pageFlag: this.$route.params.type
      },
      choseUrl:''
    };
  },
  components: {
    Head,
    Article,
    PDFDetail
  },
  methods: {
    getArticleList(no) {
      let params = {
        command: "xycoding.p_articleList",
        id: this.userId,
        type: this.type,
        kind: ""
      };
      if (no) {
        params.kind = no;
      }
      Resource.ESBServlet.post("", params, "")
        .then(data => {
          console.log("查询开发文档", data);
          if (data.op.code === "Y") {
            this.articleList = data.datalist;
            this.choseUrl = this.articleList[0].f_url
            console.log(this.choseUrl)
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDevDetail(id) {
      let params = {
        command: "xycoding.p_selectArticle",
        id: this.userId,
        articleid: id
      };
      Resource.ESBServlet.post("", params, "")
        .then(data => {
          console.log("开发文档详情", data);
          if (data.op.code === "Y") {
            if(data.data.f_url){
              this.choseUrl = data.data.f_url;
              // debugger
              //打开本地文档
              // openFile(data.data.f_url);
              //在线预览文档
              // previewDocument(data.data.f_url)
            }else{
              this.choseUrl = ''
            }
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    tabListDetail(no) {
      let params = {
        command: "xycoding.p_selectDictMainAction",
        id: this.userId,
        dict_no: no
      };
      Resource.ESBServlet.post("", params, "")
        .then(data => {
          console.log("点击左边右边显示", data);
          if (data.op.code === "Y") {
            // this.tabList = data.datalist;
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addArticleHanldle() {
      this.articleVisible = true;
    },
    setarticleVisible(emitData) {
      this.articleVisible = emitData.articleVisible;
      if (emitData.flag === "1") {
        this.getArticleList();
      }
    },
    leftTablist() {
      let params = {
        command: "xycoding.p_selectDictSubListAction"
      };
      Resource.ESBServlet.post("", params, "")
        .then(data => {
          console.log("查询左边列表", data);
          if (data.op.code === "Y") {
            this.tabList = data.datalist;
            this.choseUrl = this.tabList[0].f_url
            debugger
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    upload() {
      this.articleVisible = true;
    },
    articelDetailHandle(item) {
      if(item.f_url){
        previewDocument(item.f_url);
      }else{
        this.$message({
          type:'warning',
          message:'没有上传文档'
        })
      }
      // this.articelDetailVisible = true;
      // this.docUrl = item.f_url ? item.f_url : "暂无数据";
    }
  },

  mounted() {
    console.log(this.type);
    this.getArticleList();
    if (this.type == "1") {
      this.leftTablist();
    }
  }
};
</script>
<style lang="less">
@import "../style/resetStyle.less"; /*引入公共样式*/
@import "../assets/css/common.less";
.el-menu-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.devNorms {
  height: 100%;

  .contentBox {
    width: 100%;
    height: calc(100% - 40px);
    .disflex;
    .leftTab {
      li {
        line-height: 40px;
        // background:rgba(0,0,0,.4);
        text-indent: 20px;
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
      overflow: hidden;
      border-right: 1px solid rgba(255, 255, 255, 0.14);
      .uploadDoc {
        float: right;
        cursor: pointer;
        margin-right: 28px;
        margin-top: 14px;
        width: 80px;
        color: #fff;
        text-align: center;
        line-height: 30px;
        background: rgba(28, 125, 250, 1);
        border-radius: 3px;
      }

      .el-dialog {
        width: 642px;
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
    .docDetail {
      flex: 1;
      width: calc(100% - 220px);
      overflow: auto;
      .modelTitle {
        clear: both;
        ul {
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          // overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2); /*no*/
          color: rgba(255, 255, 255, 0.8);
          li {
            flex: 1;
            height: 49px;
            text-indent: 20px;
            line-height: 50px;

            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .title {
          li {
            font-weight: 700;
          }
        }
        .content {
          color: #fff;
          li {
            img {
              width: 16px;
              height: 15px;
              vertical-align: middle;
              border-radius: 50%;
              margin-left: 10px;
            }
          }
          .examine {
            display: flex;
            justify-content: flex-start;
            align-items: center;
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
        .content:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      }
      .showPDF {
        width: auto;
        height: 100%;
        padding:20px 40px;
      }
      .noDataDesc{
        text-align: center;
        font-size: 18px;
        color: #fff;
      }
    }
  }
}
</style>


