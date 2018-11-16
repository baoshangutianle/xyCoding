<template>
    <div class="microSer commonTotal">
        <Head :headTitle="headTitle"></Head>
        <!-- <h1 class="xyc">XY Coding</h1> -->

        <!-- <div class="backTitle">
            <div class="back">
                <div class="backIndex" @click="goBack">
                    &lt;返回
                </div>
            </div>
            <span class="mstitle">微服务</span>
        </div> -->
        <div class="contentBox">
          <div class="menuList">
            <!-- <h3 v-if='usertype == 9' class="addService" @click="addParentHanldle">
                    登记微服务
            </h3> -->
             
            <el-row class="tac">
              <el-col>
                <el-menu
                  default-active="0-0" 
                  :default-openeds="navsubselected"
                  >
                  <el-menu-item  v-if='usertype == 0'  index="-1" @click='addChildSer(-1)'> 
                    <i class="el-icon-plus"></i>
                    <span slot="title">登记微服务</span>
                  </el-menu-item>
                   <el-submenu v-for='(item, index) in dataList' :key='index' :index="index+''" >
                    <template slot="title">
                      <span>{{item.category}}</span>
                      <!-- <i v-if='usertype == 9' class="el-icon-plus" style="z-index: 999" @click="addChildSer(item)"></i> -->
                    </template>
                    <el-menu-item  v-for="(_item,_index) in item.memberlist"  :key='_index' :index="index + '-' + _index" @click='handleSelect(_item)'>{{_item.name}}
                      <sup v-if='usertype == 9 && _item.state == 0'  class="is-dot"></sup>
                    </el-menu-item>
                  </el-submenu>
                </el-menu>
              </el-col>
            </el-row>
          </div>
          <div class="mainBox">

            <SerDetail v-if='!dialogVisible' v-bind:chosemodelid='chosemodelid' :activeName='activeName'  @getModelList='getModelListNoDetail'></SerDetail>
             <Dialog v-if='dialogVisible' :dialogVisible='dialogVisible' :parentData='parentData' @setDialogVisible='setDialogVisible'></Dialog>  
          </div>
        </div>
    </div>
</template>
<script>
import { Resource } from "../fetch/resource.js";
import Head from "@/components/commonHead";
import Dialog from "@/components/commonDialog";
import SerDetail from "@/components/commonSerDetail";

export default {
  data() {
    return {
      headTitle:'微服务',
      dataList: [],
      navsubselected: ["0"],
      token: "",
      activeName:'0',
      dialogVisible: false,
      usertype: localStorage.getItem('usertype'),
      chosemodelid :false,
      parentData:{
        type:'add',
        pageFlag: '0',
      }
    };
  },
  components: {
    Head,
    SerDetail,
    Dialog
  },
  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose1(key, keyPath) {
    //   // console.log(key, keyPath);
    // },
    handleSelect(item){
      //  console.log(key, keyPath);
      // debugger
      this.activeName = '0';
       this.chosemodelid = item.modelno;
       this.dialogVisible = false;
    },

    getStorage() {
      if (window.localStorage) {
        let storage = window.localStorage;
        this.token = storage.getItem("token") ? storage.getItem("token") : "";
      }
      let _this = this;
    },
    goBack() {
      window.history.go(-1);
    },
    toDetail(id) {
      this.$router.push({
        path: `/microservice/${id}`
      });
    },
    getModelList() {
      Resource.ESBServlet.post("", {command: "xycoding.p_modelList",id: localStorage.getItem('id'),type: 0}, "")
        .then(data => {
          console.log("获取微服务列表", data);
          this.dataList = data.datalist;
          if(data.datalist.length>0 && data.datalist[0].memberlist.length>0){
          this.chosemodelid = data.datalist[0].memberlist[0].modelno;
          }
        })
        .catch(err => {});
    },
    getModelListNoDetail() {
      Resource.ESBServlet.post("", {command: "xycoding.p_modelList",id: localStorage.getItem('id'),type: 0}, "")
        .then(data => {
          console.log("获取微服务列表", data);
          this.dataList = data.datalist;
        })
        .catch(err => {});
    },
    setDialogVisible(emitData) {
      // console.log(emitData);
      // this.dialogVisible = emitData.dialogVisible;
      debugger
      if( emitData.flag === '1'){
        this.getModelList()
      }
     
    },
    addChildSer(item){
      this.dialogVisible = true;
      this.parentData.modelInfo = item;
      this.chosemodelid = item
    },
    addParentHanldle(){
       this.$prompt('', '新增微服务', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入微服务名称',
        }).then(({ value }) => {
           Resource.ESBServlet.post("", {command: "xycoding.p_addServiceInfo",id: localStorage.getItem('id'),name: value, apprstate : '1'}, "")
          .then(data => {
            console.log("新增微服务分组", data);
          })
        .catch(err => {});

         this.$message({
            message: '添加成功',
            type: 'success'
          });
           this.getModelList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
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
    this.getStorage();
    this.getModelList();
  }
};
</script>
<style lang="less">
@import '../style/commonStyle.less';

.microSer {
 
  height: 100%;
  .backTitle {
    border-bottom: 1px solid #3e89ae;/*no*/
    border-top: 1px solid #3e89ae;/*no*/
    background: rgba(0, 0, 0, 0.2);

    .back {
      display: inline-block;
      vertical-align: top;
      width: 80px;
      height: 40px;
      overflow: hidden;
      border-right: 1px solid #3e89ae;/*no*/

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
  .contentBox {
    width: 100%;
    height: calc(100% - 42px);
    display: flex;
    // background: rgba(0, 0, 0, 0.4);
    .menuList {
      width: 220px;
      overflow: auto;
      .addService {
        cursor: pointer;
        color: rgba(0, 200, 246, 1);
        text-align: center;
        font-size: 14px;
        line-height: 39px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);/*no*/
        background: url("../assets/img/append.png") no-repeat 18%;
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }

    }
    .mainBox {
      flex: 1;
      width: 100%;
      height: 100%;
      border-left: 1px solid #3e89ae;/*no*/
      // border-top: 1px solid #3e89ae;/*no*/
      box-sizing: border-box;
      // padding: 20px;
      overflow: auto;
    }
  }

  .msdetail {
    display: inline-block;
    width: 298px;
    height: 346px;
    background: url("../assets/img/default.png") no-repeat center;
    margin: 20px 0 16px 30px;
    color: rgba(180, 211, 230, 1);
    overflow: hidden;
    &:hover {
      background: url("../assets/img/selected.png") no-repeat center;
    }
    .title {
      margin: 12px 0 0 14px;
    }
    ul {
      margin-top: 30px;
      margin-left: 14px;
      li {
        margin: 10px 0;
        overflow: hidden;
        .left {
          float: left;
        }
        .right {
          float: right;
          margin-right: 15px;
        }
      }
    }
    .serExp {
      display: inline-block;
      margin-left: 14px;
      margin-top: 15px;
      width: 58px;
      line-height: 20px;
      background: rgba(28, 125, 250, 1);
      border-radius: 10px;
      font-size: 12px;
      text-align: center;
    }
    i {
      display: inline-block;
      width: 207px;
      height: 1px;
      background: rgba(255, 255, 255, 1);
      opacity: 0.2;
      vertical-align: middle;
    }
    .detailExp {
      margin: 15px 13px 43px 14px;
      overflow: hidden;
      text-overflow: ellipsis; //文本溢出显示省略号
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
  }
}
</style>


