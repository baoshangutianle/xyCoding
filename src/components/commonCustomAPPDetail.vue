<template>
  <div class="serDetailBox">
    <div class="serFlex">
      <div class="serTitle">
        <h3 >{{dataList.f_name?dataList.f_name:''}}</h3>
      </div>
     
      <div class="serBtn" v-if="usertype !== 9">
        <el-button type="primary" @click="modify">修改</el-button>
        <el-button type="danger" @click="shanchu(dataList.f_id)">删除</el-button>
      </div>
      <div class="serBtn" v-else>
        <el-button type="danger" @click="examineLose(dataList.f_id)">审核不通过</el-button>
        <el-button type="primary" @click="examineSucc(dataList.f_id)">审核通过</el-button>
      </div>
    </div>
    
    <div class="serContent">
        <p>语言：<span>{{dataList.f_language?dataList.f_language:''}}</span></p>
        <p>开发者：<span>{{dataList.f_developer?dataList.f_developer:''}}</span></p>
    </div>
    <ul class="boxList">
      <li>
        <div class="boxTitleFlex">
          <span class="boxTitle">应用说明</span>
          <div class="borderTop"></div>
        </div>
        
        <div class="boxContent">
          <!-- <img src="../assets/img/activedma.png" alt=""> -->
          <div class="content">{{dataList.f_desc?dataList.f_desc:''}}</div>

        </div>
      </li>
      <li>
        <div class="boxTitleFlex">
          <span class="boxTitle">入口地址</span>
          <div class="borderTop"></div>
        </div>
        <div class="boxContent">
          <!-- <a class="alink" href="http://baidu.com">http://baidu.com</a> -->
          <div class="content">{{dataList.f_api_url?dataList.f_api_url:''}}</div>
        </div>
      </li>
      <li>
        <div class="boxTitleFlex">
          <span class="boxTitle">界面图</span>
          <div class="borderTop"></div>
        </div>
        <div class="boxContent">
          <!-- <a class="alink" href="http://baidu.com">http://baidu.com</a> -->
          <img  :src="dataList.imgs?value:''" alt="" class="UIpic" v-for="(value,index) in dataList.imgs" :key="index">
        </div>
      </li>
      
      
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      usertype: localStorage.getItem('usertype'),

    }
  },
  props:['dataList'],
  methods: {
    modify(){
      this.$emit('modify',this.dataList)
    },
    shanchu(id){
      if(id){

        this.$emit('shanchu',id)
      }else{
        this.$message({
          type:'warning',
          message: '已经删除'
        })
      }
    },
    examineSucc(id){
      this.$emit('examineSucc',id)

    },
    examineLose(id){
      this.$emit('examineLose',id)

    }
  }
}
</script>
<style lang="less" >
.serDetailBox {
  width: 100%;
  height: 100%;
  color: #fff;
  .serFlex {
    display: flex;
    .serTitle {
      flex: 1;
      font-size: 20px;
    }
    .serBtn {
      display: flex;
      button{
        margin-right: 10px;
      }
      // position: absolute;
    }
  }

  .serContent {
    p {
      margin: 10px 0;
    }
  }
  .boxList {
    li {
      margin-top: 30px;
      padding-top: 10px;
      .boxTitleFlex {
        display: flex;
        .boxTitle {
          top: -12px;
          padding-left: 10px;
          
          border-left: 2px solid #00c4f2;/*no*/
        }
        .borderTop {
          width: 90%;
          height: 1px;
          // border-top: 1px solid rgba(255, 255, 255,.2);/*no*/
          align-self: center;
          margin-left: 10px;
        }
      }

      .boxContent {
        padding-left: 10px;
        margin: 10px 0;
          line-height: 24px;
        .content{
          width: 95%;
        }
        .UIpic{
          max-height: 400px;          
          // max-width: 400px;          
          margin-right: 10px;
        }
      }
      .alink {
        color: #00c4f2;
        text-decoration: underline;
      }
    }
  }
}
</style>


