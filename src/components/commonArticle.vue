<template>
<div class="addbox">
  <div class="title">上传文档</div>
  <div class="addDetail" >
      <div  class="total">
          <span class="msname">文档标题：</span>
          <el-input v-model="title" placeholder="请输入文档标题，限制20个字符" maxlength='20' ></el-input>
      </div>
      <div class="total">
          <span class="msname">作者：</span>
           <el-input v-model="author" placeholder="请输入文档作者,限制30个字符" maxlength='30' ></el-input>
      </div>
      <div  class="total">
          <span class="msname">文档简介:</span>
          <el-input type="textarea" v-model="desc" placeholder="请输入文档简介,限制255个字符" maxlength='255' ></el-input>
      </div>
      <div  class="total" v-if="docType=='1'">
          <span class="msname">文档类型：</span>
          <el-select v-model="docTypeValue" placeholder="请选择文档类型">
            <el-option :label="item.f_sub_name" :value="item.f_sub_no"
            v-for="(item,index) in tabList"
            :key="index"
            ></el-option>
          </el-select>
      </div>
      <div  class="total">
          <span class="msname">上传文档：</span>
            <el-upload class="avatar-uploader uploadtestdoc" 
              :action="UploadFile" 
              :show-file-list="false" 
              :on-success="handleAvatarSuccess_file" 
                :before-upload="beforeAvatarUpload_file"
                accept='.pdf,.PDF'
              >
          <span style="color:#fff">{{docInfo.docDesc}}</span>    
          </el-upload>
          <i style="line-height:2;margin-left:20px;">{{docInfo.docName}}</i>
      </div>
       <div class="total">
          <span class="msname"></span>
          <div class="btnbox">
            <el-button @click="handleClose('-1')">取 消</el-button>
            <el-button type="primary" @click="submitHandle('1')">确 定</el-button>
          </div>
      </div>
      <!-- <div class="total ">
        <div class="btnbox">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitHandle()">确 定</el-button>
        </div>
            
      </div> -->
      <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitHandle()">确 定</el-button>
      </span> -->
  </div>
</div>

</template>
<script>
import { Resource } from "../fetch/resource.js";

export default {
  
  data() {
    return {
      // articleVisible: false,
      userId: localStorage.getItem("id"),
      title :this.title,
      author :this.author,
      url :this.url,
      desc :this.desc,
      docTypeValue:'',
      tabList:'',
      flag : '1',
      UploadFile: Resource.UploadFile,
      docInfo: {
        docName :'',
        docDesc :'上传PDF文档',
        docFlag : '-1'
      }
    };
  },
  props: ["articleVisible", "parentData","docType"],
  methods: {
 
    handleClose(flag) {
      this.flag = flag;
       this.$emit("setarticleVisible", { articleVisible: false,flag:  this.flag });
    },
    submitHandle(flag) {
      this.flag = flag;
      let _message;
        let params = {
         id: this.userId,
         title :this.title,
         author :this.author,
         url :this.url,
         desc :this.desc,
         type: this.parentData.pageFlag,
       };

    if(this.parentData.type === 'add'){
       params.command = 'xycoding.p_addArticle'
      _message = '添加成功'
    }else if(this.parentData.type === 'mod'){
       params.command = 'xycoding.p_modifyArticle'
        params.articleid = this.parentData.modelInfo.f_id;
      _message = '修改成功！'
    }
    if(this.docType=='1'){
      params.kind = this.docTypeValue;
    }
    if(this.docInfo.docFlag == '0'){
          this.$message.error('文件正在上传');
          return false;
      }
     Resource.ESBServlet.post("", params, "")
      .then(data => {
        console.log(this.parentData.type, data);
        if(data.op.code === 'Y'){
          this.$message({
              message: _message,
              type: 'success'
            });
          this.title = '',
          this.author = '',
          this.url = '',
          this.desc = '',
          this.docInfo=  {
            docName :'',
            docDesc :'上传PDF文档',
            docFlag : '-1'
          }
          this.$emit("setarticleVisible", { articleVisible: false ,flag:  this.flag});
        }else{
          this.$message({
            message: data.op.info,
            type: 'warning',
          });
        }
      })
      .catch(err => {});
      
        
    },

    beforeAvatarUpload_file(file) {
      console.log("文档", file);
       const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
          this.$message.warning('上传文档只能是 pdf 格式!');
        }
        if(isPDF){
          this.docInfo.docFlag = '0'
          this.docInfo.docDesc = '正在上传...'
        }
          return isPDF ;
    },
    handleAvatarSuccess_file(res, file) {
      this.docInfo.docFlag = '1'
      this.docInfo.docDesc = '上传PDF文档'
      this.docInfo.docName = file.name
        this.url = res.data[0];
    },


    getModelDetail(){
      console.log(this.parentData)
      if(this.parentData.type === 'add'){
        console.log('添加文档',)
      }else if(this.parentData.type === 'mod' && this.flag == '1'){
        if(this.docType=='1'&&this.parentData.modelInfo.f_kind){
          this.docTypeValue = this.parentData.modelInfo.f_kind
        }
          this.title =  this.parentData.modelInfo.f_title
          this.author = this.parentData.modelInfo.f_author
          this.url = this.parentData.modelInfo.f_url
          this.desc = this.parentData.modelInfo.f_desc
          this.docInfo=  {
              docName :this.parentData.modelInfo.f_url,
              docDesc :'上传PDF文档',
              docFlag : '-1'
            }
      }
    },
    leftTablist(){
      let params = {
        command: "xycoding.p_selectDictSubListAction",
      };
       Resource.ESBServlet.post("", params, "")
        .then(data => {
          if (data.op.code === "Y") {
            this.tabList = data.datalist;
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
  },
  watch: {
    articleVisible:'getModelDetail'
  },
  mounted() {
    // console.log(this.parentData.pageFlag);
    this.getModelDetail();
    if(this.docType=='1'){
      this.leftTablist()
    }
  }
};
</script>
<style lang="less">
.uploader-file {
  width: 100% !important;
  height: 100% !important;
  .el-upload {
    width: 100% !important;
    height: 100% !important;
  }
}
.addbox{
  .title{
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);/*no*/
      padding-left: 20px;
      color: #fff;
    }
  .addDetail{
    color: #fff;
    padding: 20px 30px;
    
    .total {
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      .avatar-uploader {
        display: inline-block;
         width: 148px;
        height: 91px;
        background: rgba(0, 0, 0, 0.25);
        border: 0;/*no*/
        border-radius: 3px;
        position: relative;
        text-align: center;
        // line-height: 94px;
        color: #BCC8D0;
        .uploadstyle{
          display: flex;
          height: 100%;
          flex-direction: column;

          i{
            display: block;
            width: 100%;
            // height: 40px;
            text-align: center;
            margin-top: 20px;
             img{
              width: 24px;
              height: 24px;
              display: inline-block;
            }
          }
          span{
            margin-top: 10px;
            display: inline;
            font-size: 12px;
          }
         
        }
        img {
          // width: 100%;
          height: 100%;
        }
        .el-upload {
          width: 100%;
          height: 100%;
        }
      }
      .msname {
        margin-right: 10px;
        text-align: left;
        display: inline-block;
        min-width: 150px;
      }
      .tuopu {
        vertical-align: top;
        
      }
     
      .el-input{
        width: 80%;
         input{
          height: 34px;
          width: 100%;
          border: 0;/*no*/
          border-radius: 3px;
          padding-left: 8px;
          background: rgba(0, 0, 0, 0.25);
          color: #fff;
        }
      }
      .el-upload-dragger{
        background: rgba(0, 0, 0, 0.25);
      }
      .el-upload__tip,.el-upload__text{
        color:#fff;
      }
      .el-select{
        width: 80%;
        .el-input{
           width: 100%;
        }
        
      }
      .el-textarea{
        height: 68px;
        width: 80%;
        border: 0;/*no*/
        border-radius: 3px;
      
       
        textarea{
          padding: 0;
          padding-left: 8px;
          border:0;
          height: 100%;
           color: #fff;
          background: rgba(0, 0, 0, 0.25);
        }
      }
      .uploadtestdoc {
        text-align: center;
        outline: none;
        border: none;
        width: 93px;
        height: 30px;
        line-height: 30px;
        font-style: normal;
        background: rgba(28, 125, 250, 1);
        border-radius: 3px;
        color: #fff;
      }
      .btnbox{
         width: 80%;
         text-align: right;
      }
      
    }
    
  }
}


</style>

