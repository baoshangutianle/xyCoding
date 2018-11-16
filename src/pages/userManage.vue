<template>
  <div class="userManage">

    <Head :headTitle="headTitle"></Head>
     <div v-if="(tabsIndex === '4' || tabsIndex === '5') && (!dialogVisible && !articleVisible)" class="uploadDoc" @click="addArticleHanldle('0')">上传文档</div>

    <el-tabs  v-if='!dialogVisible && !articleVisible &&!appVisible' v-model="activeName" type="card" @tab-click="handleTabsClick">
      <el-tab-pane label="用户管理" name="first" >
        <div class="modelTitle">
          <ul class="title">
            <li>用户昵称</li>
            <li>地区</li>
            <li>注册时间</li>
            <li>审核操作</li>
          </ul>
          <ul class="content" v-for="(data,key) in dataList" :key="key">
            <li>
              <img :src="data.f_headimg_url?data.f_headimg_url:defaultHead" alt="">
              <span>{{data.f_name}}</span>
            </li>
            <li>{{data.f_area}}</li>
            <li>{{data.f_createtime}}</li>

            <li class="examine" v-if="data.f_type=='0' && data.f_valid=='0'">
              <button @click="succExamine(data.f_id,true)">通过</button>
              <!-- <button @click="failExamine(data.id,true)">拒绝</button> -->
            </li>
            <li class="examine" v-if="data.f_type=='0' && data.f_valid !=='0'">
            </li>
            <li class="examine" v-if="data.f_type=='9'">
                管理员
            </li>
          </ul>
        </div>

      </el-tab-pane>
      <el-tab-pane label="微服务审核" name="second" >
        <div class="modelTitle">
          <ul class="title">
            <li>微服务ID</li>
            <li>微服务名称</li>
            <li>开发语言</li>
            <li>开发人员</li>
            <li>版本号</li>
            <li>微服务模块说明</li>
            <li>审核操作</li>
          </ul>
          <ul class="content" v-for="(data,key) in msDataList" :key="key">
            <li>{{data.modelno}}</li>
            <li  @click="toExamineMs(data)" class="label">{{data.name}}</li>
            <li>{{data.language}}</li>
            <li>{{data.developer}}</li>
            <li>{{data.version}}</li>
            <li>{{data.desc}}
            </li>
            <li class="examine" v-if="data.state==0" >
              <button @click="failExamine(data.id,false,0)">拒绝</button>
              <button @click="succExamine(data.id,false,0)">通过</button>
            </li>
            <li class="examine" v-if="data.state==9">
                已拒绝
            </li>
          </ul>

        </div>
      </el-tab-pane>
      <el-tab-pane label="微应用审核" name="third" >
        <div class="modelTitle">
          <ul class="title">
            <!-- <li>微应用ID</li> -->
            <li>微应用名称</li>
            <li>开发语言</li>
            <li>开发人员</li>
            <li>版本号</li>
            <li>微服务模块说明</li>
            <li>审核操作</li>
          </ul>
          <ul class="content"  v-for="(data,key) in maDataList" :key="key">
            <!-- <li>{{data.id}}</li> -->
            <li class="label" @click="toExamineMa(data)">{{data.name}}</li>
            <li>{{data.language}}</li>
            <li>{{data.developer}}</li>
            <li>{{data.version}}</li>
            <li>{{data.desc}}
            </li>
            <li class="examine" v-if="data.state==0">
              <button @click="failExamine(data.id,false,1)">拒绝</button>
              <button @click="succExamine(data.id,false,1)">通过</button>
            </li>
            <li class="examine" v-if="data.state==9">
                已拒绝
            </li>
          </ul>

        </div>
      </el-tab-pane>
      <el-tab-pane label="定制应用审核" name="fourth">
         <div class="modelTitle">
          <ul class="title">
            <!-- <li>定制应用ID</li> -->
            <li>定制应用名称</li>
            <li>开发语言</li>
            <li>开发人员</li>
            <li>版本号</li>
            <li>微服务模块说明</li>
            <li>审核操作</li>
          </ul>
         <ul class="content"  v-for="(data,key) in cuMaDataList" :key="key">
            <!-- <li>{{data.id}}</li> -->
            <li class="label" @click="toExamineMa(data)">{{data.name}}</li>
            <li>{{data.language}}</li>
            <li>{{data.developer}}</li>
            <li>{{data.version}}</li>
            <li>{{data.desc}}
            </li>
            <li class="examine" v-if="data.state==0" >
              <button @click="failExamine(data.id,false,2)">拒绝</button>
              <button @click="succExamine(data.id,false,2)">通过</button>
            </li>
            <li class="examine" v-if="data.state==9">
                已拒绝
            </li>
          </ul>
         </div>
      </el-tab-pane>
      <el-tab-pane label="开发规范管理" name="fifth" >
        
        <div class="modelTitle">
          <ul class="title">
            <li>开发文档</li>
            <li>作者</li>
            <li>上传时间</li>
            <li>简介</li>
           
            <li>操作</li>
          </ul>
          <ul class="content" v-for="(item,index) in articleList0" :key="index">
            <li>{{item.f_title}}</li>
            <li>{{item.f_author}}</li>
            <li>{{item.f_appr_time}}</li>
            <li>{{item.f_desc}}</li>
           
            <li class="examine">
              <div class="bj" @click="modifyHandle(item, '0')"></div>
              <div class="sc" @click="delHandle(item, '0')"></div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="技术文档管理" name="sixth" >
        <div class="modelTitle">
          <ul class="title">
            <li>技术文档</li>
            <li>作者</li>
            <li>上传时间</li>
            <li>简介</li>
           
            <li>操作</li>
          </ul>
          <ul class="content" v-for="(item,index) in articleList1" :key="index">
            <li>{{item.f_title}}</li>
            <li>{{item.f_author}}</li>
            <li>{{item.f_appr_time}}</li>
            <li>{{item.f_desc}}</li>
           
            <li class="examine">
              <div class="bj" @click="modifyHandle(item, '1')"></div>
              <div class="sc" @click="delHandle(item,'1')"></div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="scrollBox"  v-if='appVisible || dialogVisible || articleVisible'>
      <AppDetail v-if='appVisible' :scroll='scroll' v-bind:modelId='modelid' :customApp='appVisible'  @getModelList='getParentApp' :sign='sign'></AppDetail>
      <SerDetail v-if='dialogVisible'  v-bind:chosemodelid='chosemodelid'  @getModelList='getParentSer' :sign='sign'></SerDetail>
      <Article  v-if='articleVisible' :docType='docType'  :articleVisible='articleVisible' :parentData='parentData' @setarticleVisible='setarticleVisible'></Article> 
    </div>
     
  </div>

</template>
<script>
import Head from "@/components/commonHead";
import { Resource } from "../fetch/resource.js";
import SerDetail from "@/components/commonSerDetail";
import AppDetail from "@/components/commonAppDetail";
import Article from "@/components/commonArticle";
// import bridge from './vue-temp/vue-editor-bridge.js';

let qrContent;
export default {
  data() {
    return {
      tabsIndex:'0',
      headTitle:'审核列表',
      dialogVisible:false,
      appVisible:false,
      chosemodelid: '',
      dataList: "",
      msDataList:'',
      cuMaDataList:'',
      modelid:'',
      docType:'',
      sign:true,
      scroll:true,
      id: "",
      activeName: "first",
      modelInfo: {},
      articleList0: [],
      articleList1: [],
      articleVisible: false,
      parentData:{
          type:'add',
          pageFlag: '0',
        },
      userId: "",
      maDataList:'',
      defaultHead:
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541590337267&di=b064d363eb215a2d4534d8034ce2d13b&imgtype=0&src=http%3A%2F%2Fm.vstou.com%2Fupload%2Fimage%2F78%2F201511%2F1448238930349721.jpg"
    };
  },
  components: {
    Head,SerDetail,Article,AppDetail
  },
  mounted() {
    this.getUserList();
    this.getMsDataList();
    this.getMaDataList();
    this.getcuMaDataList();
    this.getArticleList0();
    this.getArticleList1();
    this.getStorage();
  },
  methods: {
    handleTabsClick(tab,event) {
      console.log(tab.index,"######################")
      this.tabsIndex = tab.index;
      switch(tab.index){
        case '0':
        this.getUserList();
        break;
        case '1':
        this.getMsDataList();
        break;
        case '2':
        this.getMaDataList();
        break;
        case '3':
        this.getcuMaDataList();
        break;
        case '4':
        this.getArticleList0();
        break;
        case '5':
        this.getArticleList1();
        break;
      }
      // debugger
    },
    toExamineMs(item) {
      // this.$router.push({
      //   name: "examineMs"
      // });
      this.chosemodelid = item.id;
       this.dialogVisible = true;
    },
    toExamineMa(item) {
      this.modelid = item.id;
       this.appVisible = true;
    },
    examine(id,state,type){
       Resource.ESBServlet.post(
        "",
        { command: "xycoding.p_auditModelInfo", id: localStorage.getItem('id'),modelid:id,apprstate:state },
        ""
      )
        .then(data => {
          console.log("审核结guo", data);
          if(data.op.code==='Y'){
            console.log(type);
             this.$message({
              message: '操作成功',
                type: 'success'
              });
              debugger
            switch(type){
              case 0 :
            this.getMsDataList();
            break;
            case 1:
            this.getMaDataList();
            break;
            case 2:
            this.getcuMaDataList();
              break;
            }
           
          }else{
 
             this.$message.error(data.op.info);
          }
        })
        .catch(err => {});
    },
    examineUser(id){
       Resource.ESBServlet.post(
        "",
        { command: "xycoding.p_auditUser", id: localStorage.getItem('id'),userid:id },
        ""
      )
        .then(data => {
          if(data.op.code==='Y'){
            this.getUserList();
            this.$message({
              message: '操作成功',
                type: 'success'
              });
          }else{
             this.$message.error(data.op.info);
          }
        })
        .catch(err => {});
    },
    succExamine(id,isUser,type){
      this.$alert('确定此操作？', '审核验证', {
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          callback: action => {
           if (action === 'confirm') {
             if(isUser){
               this.examineUser(id);
             }else{
               this.examine(id,1,type);
             }
           }else{
           }
        }
        })
    },
    failExamine(id,isUser,type){
          this.$alert('确定此操作？', '审核验证', {
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          callback: action => {
           if (action === 'confirm') {
             if(isUser){
               this.examineUser(id)
             }else{
               this.examine(id,9,type);
             }
           }else{
           }
        }
          
        })
    },
    getStorage() {
      if (window.localStorage) {
        let storage = window.localStorage;
        this.id = storage.getItem("id") ? storage.getItem("id") : "";
      }
    },
    getParentSer(params){
      this.dialogVisible = params.dialogVisible;
      if(params.flag == '1'){
        this.getMsDataList()
      }
    },
    getParentApp(params){
      
      this.appVisible = params.dialogVisible;
      console.log(params);
      if(params.flag == '1'){
        this.getMaDataList()
        this.getcuMaDataList()
      }
    },
    setarticleVisible(emitData) {
      this.articleVisible = emitData.articleVisible;
       if( emitData.flag === '1'){
         if(this.tabsIndex === '4'){
            this.getArticleList0()
         }else if(this.tabsIndex === '5'){
           this.getArticleList1()
         }
       
      }
    },
    //yyyymmdd
    ymdfilter(input) {
      if (input != "" && input != null && input != undefined && input != "--") {
        if (input.indexOf("-", 0) == -1) {
          var year = input.toString().substr(0, 4);
          var month = input.toString().substr(4, 2);
          var day = input.toString().substr(6, 2);
          return year + month + day;
        } else {
          var year = input.toString().substr(0, 4);
          var month = input.toString().substr(5, 2);
          var day = input.toString().substr(8, 2);
          return year + "-" + month + "-" + day;
        }
      } else {
        return "--";
      }
    },
    getUserList() {
      let _this = this;
      Resource.ESBServlet.post(
        "",
        { command: "xycoding.p_userList", id: localStorage.getItem('id')},
        ""
      )
        .then(data => {
          console.log("用户列表", data);
          _this.dataList = data.datalist;
        })
        .catch(err => {});
    },
    getMsDataList() {
      let _this = this;
      Resource.ESBServlet.post(
        "",
        { command: "xycoding.p_auditModelList", id: localStorage.getItem('id') ,type: "0"},
        ""
      )
        .then(data => {
          console.log("微服务列表", data);
          let arr = [];
          for(let i =0;i<data.datalist.length;i++){
            for(let j =0;j<data.datalist[i].memberlist.length;j++){
              arr.push(data.datalist[i].memberlist[j]);
            }
          }
          _this.msDataList = arr;
          console.log(_this.msDataList)
        })
        .catch(err => {});
    },
    getMaDataList() {
      let _this = this;
      Resource.ESBServlet.post(
        "",
        { command: "xycoding.p_auditModelList", id: localStorage.getItem('id') ,type: '1'},
        ""
      )
        .then(data => {
          console.log("微应用列表", data);
          _this.maDataList = data.datalist[0].memberlist;
        })
        .catch(err => {});
    },
    getcuMaDataList() {
      let _this = this;
      Resource.ESBServlet.post(
        "",
        { command: "xycoding.p_auditModelList", id: localStorage.getItem('id') ,type: '2'},
        ""
      )
        .then(data => {
          console.log("定制应用列表", data);
          _this.cuMaDataList = data.datalist[0].memberlist;
        })
        .catch(err => {});
    },
    getArticleList0() {
      let params = {
        command: "xycoding.p_articleList",
        id: localStorage.getItem('id'),
        type: 0
      };
      Resource.ESBServlet.post("", params, "")
        .then(data => {
           console.log('查询开发文档',data)
          if (data.op.code === "Y") {
            this.articleList0 = data.datalist;
          } else {
           
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getArticleList1() {
      let params = {
        command: "xycoding.p_articleList",
        id: localStorage.getItem('id'),
        type: 1
      };
      Resource.ESBServlet.post("", params, "")
        .then(data => {
           console.log('查询技术文档',data)
          if (data.op.code === "Y") {
            this.articleList1 = data.datalist;
          } else {
           
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addArticleHanldle(){
      this.parentData.type = 'add'
      this.parentData.pageFlag = this.tabsIndex == '4'?'0' : '1'
      this.docType = this.parentData.pageFlag;
      this.articleVisible = true;
    },

    modifyHandle(item,type) {
      this.parentData.type = 'mod'
      this.parentData.pageFlag = type;
      this.docType = type;
      this.articleVisible = true;
       this.parentData.modelInfo  = item;
    },
    delHandle(item,type){
      this.$confirm('是否确定此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Resource.ESBServlet.post("", {command: "xycoding.p_deleteArticle",id: localStorage.getItem('id'),articleid: item.f_id}, "")
          .then(data => {
            console.log("删除模块", data);

            if(data.op.code === 'Y'){
              if(type === '0'){
                this.getArticleList0()
              }else if(type === '1'){
                this.getArticleList1()
              }
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
  }
};
</script>
<style lang="less">
@import url("../style/resetStyle.less");
.userManage {
  .el-tabs__nav {
    border: 0 !important;
  }
  .el-tabs__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important; /*no*/
  }

  .el-tabs__item {
    border-left: 1px solid rgba(255, 255, 255, 0.1) !important; /*no*/
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px !important;
  }
  .el-tabs__item:first-child {
    border-left: none !important;
  }
  .is-active {
    background-color: rgba(28, 125, 250, 1) !important;
    color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; /*no*/
  }
  .el-table > td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2); /*no*/
  }
  .el-table {
    background-color: rgba(0, 0, 0, 0.1) !important;
    
    //  display: flex;
  }
  .el-tabs__header{
    margin: 0;
  }
  .el-tabs{
    width: 100%;
position: fixed;
     top: 40px;
     bottom: 0;
     overflow: auto;
         display: flex;
    flex-direction: column;
    .el-tabs__content{
      overflow: auto;
    }
  }
  // height: 768px;
  height: 100%;
  overflow:auto;
  .uploadDoc{
    cursor: pointer;
    width:80px;
    color: #fff;
    text-align: center;
    line-height:30px;
    background:rgba(28,125,250,1);
    border-radius:3px;
    position: absolute;
    right: 30px;
    top: 45px;
    z-index: 8888;
  }
.scrollBox{
     position: fixed;
     top: 40px;
     bottom: 0;
     overflow: auto;
     display: flex;
     width: 100%;
     flex-wrap: wrap;
     align-content: flex-start;
     justify-content: space-between;
  }
  .modelTitle {
    padding: 20px;
    ul {
      display: flex;
      justify-content: space-between;
      // overflow: hidden;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2); /*no*/
      color: rgba(255, 255, 255, 0.8);
      li {
        flex: 1;
        height: 49px;
        text-indent: 12px;
        line-height: 50px;
        font-size: 14px;
      overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
      }
    }
        .title{
          li{
  
            font-weight: 700;
          }
  
        }
    .content {
      color: #fff;
      li {
        img {
          width: 32px;
          height: 32px;
          vertical-align: middle;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
       .label{
          text-decoration: underline;
          cursor: pointer;
        }
      .examine {
        button {
          margin: 0 7px;
          cursor: pointer;
          border: none;
          outline: none;
          color: #fff;
          background: inherit;
        }
         display: flex;
        justify-content: flex-start;
        align-items: center;
         >div{
          width: 20px;
          height: 30px;
          display: inline-block;
          margin-left: 20px;
        }
        .bj{
           background-image: url("../assets/img/bj.png");
           background-repeat: no-repeat; 
          //  background-size: 100%;
            cursor: pointer;
        }
        .bj:hover{
           background-image: url("../assets/img/bjx.png");
            background-size: 100%;
            cursor: pointer;
        }
        .sc{
           background-image: url("../assets/img/sc.png");
           background-repeat: no-repeat; 
          //  background-size: 100%;
            cursor: pointer;
        }
        .sc:hover{
           background-image: url("../assets/img/scx.png");
             background-size: 100%;
            cursor: pointer;
        }
      }
    }
    .content:hover{
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>


