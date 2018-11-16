<template>
    <div class="microApp">
        <Head :headTitle='headTitle'></Head>
        <div class="scrollBox"  v-if='!dialogVisible'>
          <div class="msdetail msadd">
            <div class="imgBox">
               <span class="listTitle">&nbsp; </span>
                <div class="listMain" @click="addMsAppHanldle">
                  <div>
                    <img src="../assets/img/dj.png" alt="">
                    <p>登记微应用</p>
                  </div>
                </div>
            </div>
          </div>
          <div :class="item.classType === 'hor'? 'msdetailHo' : 'msdetail'" v-for="(item, index) in dataList" :key="index">
            <sup v-if='usertype == 9 && item.state == 0'  class="is-dot"></sup>
            <div class="imgBox" >
              <span class="listTitle">{{item.name}}</span>
              <div class="listMain" @click="toDetail(item.id)">
                <img v-bind:src="item.imageurl" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="scrollBox"  v-if='dialogVisible'>
          <Dialog :dialogVisible='dialogVisible' :parentData='parentData' @setDialogVisible='setDialogVisible'></Dialog>  
        </div>
     
        
    </div>
</template>
<script>

import { Resource } from "../fetch/resource.js";
import Dialog from "@/components/commonDialog";
// import Dialog from "@/components/commonDialogApp";
import Head from "@/components/commonHead";

export default {
  data() {
    return {
       headTitle:'微应用',
      dataList: [],
      dialogVisible: false,
       usertype: localStorage.getItem('usertype'),
       interval : '',
       chosemodelid :'',
        parentData:{
          type:'add',
          pageFlag: '1',
        },
      token: ""
    };
  },
  components: {
    Head,
    Dialog
  },
  methods: {
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
      try {
        createSpecialWindow({ url: `index.html#/micappDetail/${id}`, id: id });
      } catch (error) {
        this.$router.push({
          path: `/micappDetail/${id}`
        });
       
      }
    },
    getModelList() {
       Resource.ESBServlet.post("", {command: "xycoding.p_modelList",id: localStorage.getItem('id'),type: 1}, "")
        .then(data => {
          console.log("获取微应用列表", data);
          if(data.datalist[0].memberlist.length > 0){
            this.dataList = data.datalist[0].memberlist;
          }else{
             this.dataList = [];
          }
          this.dataList.map(item =>{
            let img = new Image(); 
            img.src = item.imageurl; 
            if(item.scale === 'W'){
              item.classType = 'hor'
            }else{
              item.classType = 'ver'
            }
          })
        })
        .catch(err => {});
    },
     setDialogVisible(emitData) {
      // console.log(emitData);
      this.dialogVisible = emitData.dialogVisible;
       if( emitData.flag === '1'){
        this.getModelList()
      }
    },

    addMsAppHanldle(item) {
      this.dialogVisible = true;
      // this.parentData.modelInfo = item;
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
  mounted() {
    this.getStorage();
    this.getModelList()
  },
  created(){
     this.getListMessage()
  },
  destroyed(){
     clearInterval(this.interval);
  }
  
};
</script>
<style lang="less">
@import '../assets/css/common.less';

.microApp {
  overflow: auto;
  .backTitle {
    border-bottom: 2px solid #3e89ae;/*no*/
    border-top: 2px solid #3e89ae;/*no*/
    background: rgba(0, 0, 0, 0.2);

    .back {
      display: inline-block;
      vertical-align: top;
      width: 80px;
      height: 40px;
      overflow: hidden;
      border-right: 2px solid #3e89ae;/*no*/

      .backIndex {
        background: url("../assets/img/back.png") no-repeat center;
        width: 60px;
        height: 28px;
        line-height: 28px;
        margin: 5px 10px 5px 10px;
        color: #fff;
        cursor: pointer;
        .txtc;
        .fs12;
      }
    }
    .msicon {
      margin: 14px 6px 0 22px;
      vertical-align: top;
    }
    .mstitle {
      display: inline-block;
      color: #fff;
      line-height: 40px;
    }
  }

  .scrollBox{
     position: fixed;
     top: 40px;
     bottom: 0;
     overflow: auto;
     display: flex;
     width: 100%;
     flex-wrap: wrap;
     padding: 0 10px;
     align-content: flex-start;
    //  justify-content: space-between;
  }
  .msdetail,.msdetailHo {
    width: 258px;
    // height: 356px;
    margin: 10px 14px 10px 0px;
    color: rgba(180, 211, 230, 1);
    // overflow: hidden;
    .positionR;
     .is-dot {
      position: absolute;
      background-color: #f84b42;
      border-radius: 12px;
      display: inline-block;
      width: 12px;
      height: 12px;
      top: 8px;
      right: 12px;
      transform: translateY(-50%) translateX(100%);
    }
    .coverModel {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 368px;
      transition: all 0.4s;
      flex-direction: column;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      .modelTop {
        flex: 1;
        width: 100%;
        background: #000;
        opacity: 0.3;
      }
      .modelName {
        width: 100%;
        height: 40px;
        background: #000;
        opacity: 0.6;
        color: #fff;
        line-height: 40px;
        .txtc;
      }
    }
    .imgBox {
      width: 100%;
      height: 100%;
      .listTitle{
        color: #fff;
        font-size: 12px;
      }
      .listMain{
        width: 100%;
        height: 457px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        margin-top: 5px;
        line-height : 457px;
        // display: flex;
        img{
          width: 100%;
          vertical-align: middle;
          height: auto;
          max-height: 100%;
        }
      }
    }
    &:hover .coverModel {
      top: 0;
    }
  }
    .msadd{
    .imgBox{
      .listMain{
        width: 100%;
        height: 457px;
        position: relative;
        border: 1px dashed #3e89ae;/*no*/
        >div{
          position: absolute;
          top: 40%;
          width: 100%;
          text-align: center;
          line-height: 2;
          img{
            display: inline-block;
              width: 40px !important;
          }
          p{
            font-size: 10px;
            font-weight: bold;
            margin-top: 5px;
          }
        }
      }
    }
  }
  .msdetailHo{
    width: 546px;
  }
}
</style>


