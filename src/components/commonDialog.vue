<template>
<div class="addbox">
  <div v-if="parentData.pageFlag == '0'" class="title">
    <span v-if="parentData.type === 'mod'">微服务编辑</span>
    <span v-if="parentData.type === 'add'">微服务登记</span>
  </div>
  <div v-if="parentData.pageFlag == '1'" class="title">
    <span v-if="parentData.type === 'mod'">微应用编辑</span>
    <span v-if="parentData.type === 'add'">微应用登记</span>
  </div>
  <div v-if="parentData.pageFlag == '2'" class="title">
    <span v-if="parentData.type === 'mod'">定制应用编辑</span>
    <span v-if="parentData.type === 'add'">定制应用登记</span>
  </div>
  <div class="addDetail" >
      <div v-if="parentData.pageFlag == '0'" class="total">
          <span class="msname">微服务类别：</span>
           <el-input v-model="serCategory" placeholder="请输入微服务类别"></el-input>
          <!-- <input type="text" v-model='serName' placeholder="请输入微服务类别"> -->
      </div>
      <div v-if="parentData.pageFlag == '0'" class="total">
          <span class="msname">微服务名称：</span>
          <el-input v-model="serName" placeholder="请输入微服务名称"></el-input>
      </div>
      <div v-if="parentData.pageFlag == '1'" class="total">
        <span class="msname">微应用名称</span>
        <el-input v-model="serName" placeholder="请输入微应用名称"></el-input>
      </div>
      <div v-if="parentData.pageFlag == '2'" class="total">
        <span class="msname">定制应用名称</span>
        <el-input v-model="serName" placeholder="请输入定制应用名称"></el-input>
      </div>
      <div v-if="parentData.pageFlag == '0'" class="total">
          <span class="msname">微服务ID：</span>
           <el-input v-model="serModelno" placeholder="请输入微服务ID"></el-input>
      </div>
      <div class="total">
          <span class="msname">开发语言：</span>
          <el-select v-model="serLanguage" placeholder="请选择开发语言">
            <el-option label="Java" value="Java"></el-option>
            <el-option label="Javascript" value="Javascript"></el-option>
            <el-option label="Angularjs" value="Angularjs"></el-option>
            <el-option label="Reactjs" value="Reactjs"></el-option>
            <el-option label="Vuejs" value="Vuejs"></el-option>
          </el-select>
      </div>
       <div class="total">
          <span class="msname">版本号：</span>
          <el-input v-model="serVersion" placeholder="请输入版本号"></el-input>
      </div>
      <div class="total">
          <span class="msname">开发人员：</span>
          <el-input v-model="serPersonnel" placeholder="用';'分隔开发人员"></el-input>
      </div>
      <div v-if="parentData.pageFlag == '0'"  class="total">
          <span class="msname">微服务模块说明:</span>
          <el-input type="textarea" v-model="serModelDesc" placeholder="请输入微服务模块说明"></el-input>
          <!-- <textarea  v-model='serModelDesc' style="height:68px" placeholder="请输入服务模式说明"  type="textarea" ></textarea> -->
      </div>
      <div v-if="parentData.pageFlag == '1'"  class="total">
          <span class="msname">微应用说明:</span>
          <el-input type="textarea" v-model="serModelDesc" placeholder="请输入微应用说明"></el-input>
          <!-- <textarea  v-model='serModelDesc' style="height:68px" placeholder="请输入服务模式说明"  type="textarea" ></textarea> -->
      </div>
      <div v-if="parentData.pageFlag == '2'"  class="total">
          <span class="msname">定制应用说明:</span>
          <el-input type="textarea" v-model="serModelDesc" placeholder="请输入定制应用说明"></el-input>
          <!-- <textarea  v-model='serModelDesc' style="height:68px" placeholder="请输入服务模式说明"  type="textarea" ></textarea> -->
      </div>
      <div v-if="parentData.pageFlag == '0'"  class="total">
          <span class="msname tuopu">拓扑图:</span>
          <el-upload class="avatar-uploader" 
          :action="UploadFile" 
          :show-file-list="false" 
          :on-success="handleAvatarSuccess" 
          :before-upload="beforeAvatarUpload"
          >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <div v-else  class="uploadstyle">
                <i style="width:'40px;'"><img src="../assets/img/sctp.png" alt=""></i>
                <span>点击上传图片</span>  
              </div>
          </el-upload>
      </div>
      <div v-if="parentData.pageFlag == '1'||parentData.pageFlag == '2'"  class="total">
        <span class="msname tuopu">界面图</span>
        <el-upload
          class="upload-more"
          drag
          :action="UploadFile"
          :on-success="handleAvatarSuccessMore" 
          :before-upload="beforeAvatarUploadMore"
          :on-remove="handleRemoveMore"
          list-type="picture"
          :file-list="fileList"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
     <div v-if="parentData.pageFlag == '1'"  class="total">
          <span class="msname">关联微服务</span>
          <el-input v-model="serRelatemodelno" placeholder="请输入关联微服务"></el-input>
      </div>
     <div v-if="parentData.pageFlag == '1'||parentData.pageFlag == '2'"  class="total">
          <span class="msname">入口地址</span>
          <el-input v-model="serReporturl" placeholder="请输入入口地址"></el-input>
      </div>
      <div class="total">
          <span class="msname">源代码：</span>
          <el-input v-model="serSoureCodeUrl" placeholder="请输入源代码地址"></el-input>
      </div>
      <div class="total">
          <span class="msname">API地址：</span>
          <el-input v-model="serApiUrl" placeholder="请输入API地址"></el-input>
      </div>
      <div v-if="parentData.pageFlag == '0'"  class="total">
          <span class="msname">测试报告：</span>
          <!-- <button class="uploadtestdoc">上传测试报告</button> -->
          <!-- <button class="uploadtestdoc"> -->
            <el-upload class="avatar-uploader uploadtestdoc" 
              :action="UploadFile" 
              :show-file-list="false" 
              :on-success="handleAvatarSuccess_file" 
                :before-upload="beforeAvatarUpload_file"
              >
          <span style="color:#fff">{{docInfo.docDesc}}</span>
          </el-upload>
          <i style="line-height:2;margin-left:20px;">{{docInfo.docName}}</i>
          <!-- </button> -->
      </div>
      
       <div class="total">
          <span class="msname"></span>
          <div class="btnbox">
            <el-button v-if="parentData.pageFlag == '1' || parentData.type != 'add'" @click="handleClose('-1')">取 消</el-button>
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
      // dialogVisible: false,
      userId: localStorage.getItem("id"),
      imageUrl: "",
      serCategory: '',
      serName: "",
      serModelDesc: "",
      serModelno: '',
      reportName:'',
      serLanguage: "",
      serVersion: '',
      serPersonnel: "",
      serGraphurl: "",
      serSoureCodeUrl: "",
      serApiUrl: "",
      serReporturl: "",
      serRelatemodelno:"",
      flag : '1',
      UploadFile: Resource.UploadFile,
      serModelimg: "",
      fileList: [],
      serModelArr: [],
      docInfo: {
        docName :'',
        docDesc :'上传测试报告',
        docFlag : '-1'
      }
     
    };
  },
  props: ["dialogVisible", "parentData"],
  methods: {
    //子窗口向父窗口发送消息
   
    handleClose(flag) {
      this.flag = flag;
       this.$emit("setDialogVisible", { dialogVisible: false,flag:  this.flag });
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     this.$emit("setDialogVisible", { dialogVisible: false });
      //   })
      //   .catch(_ => {});
    },
    submitHandle(flag) {
       console.log(this.serModelArr,this.fileList)
      let total = this.serModelArr.reduce(function(init, item,index) {
          return  index===0?item.url : init + ',' + item.url
      }, '');

      this.flag = flag;
      let _message,_modelno;
      _modelno = this.serModelno;
       let params = {
         category:this.serCategory,
        id: this.userId,
        modelno:this.serModelno,
        name:this.serName,
        type: this.parentData.pageFlag,
        desc: this.serModelDesc,
        language: this.serLanguage,
        developer: this.serPersonnel?this.serPersonnel.replace(/\；/g,";"):'',
        version : this.serVersion,
        graphurl: this.serGraphurl,
        codeurl: this.serSoureCodeUrl,
        apiurl: this.serApiUrl,
        modelimg: total,
        rid: parseInt(this.parentData.pageFlag)+1,
        relatemodelno:this.serRelatemodelno,
        reporturl:this.serReporturl,
      };
      if(this.docInfo.docFlag = '1'){
        params.reportname = this.reportName;
      }
        debugger
        if(this.parentData.pageFlag == '0' && (!this.serCategory || this.serCategory.replace(/ /g,'').length == 0)){
            this.$message.error('微服务类别不能为空');
            return false;
        }
       if(this.parentData.pageFlag == '0' &&  (!this.serName ||  this.serName.replace(/ /g,'').length ==0)){
         debugger
            this.$message.error('微服务名称不能为空');
            return false;
        }
        if(this.parentData.pageFlag == '0' && (!this.serModelno ||  this.serModelno.replace(/ /g,'').length ==0)){
            this.$message.error('微服务ID不能为空');
            return false;
        }
        if(this.parentData.pageFlag == '1' && (!this.serName ||  this.serName.replace(/ /g,'').length ==0)){
           debugger
            this.$message.error('微应用名称不能为空');
            return false;
        }
         if(this.parentData.pageFlag == '2' &&  (!this.serName ||  this.serName.replace(/ /g,'').length ==0)){
            this.$message.error('定制应用名称不能为空');
            return false;
        }
        if(this.docInfo.docFlag == '0'){
            this.$message.error('文件正在上传');
            return false;
        }
      if(this.parentData.type === 'add'){
         params.command = this.parentData.pageFlag == '0'? 'xycoding.p_addServiceInfo':this.parentData.pageFlag == '1'? 'xycoding.p_addApplicationInfo':'xycoding.p_addCustomInfo'
        _message = '添加成功'
       
      }else if(this.parentData.type === 'mod'){
         params.command = this.parentData.pageFlag == '0'? 'xycoding.p_modifyServiceInfo':this.parentData.pageFlag == '1'? 'xycoding.p_modifyApplicationInfo':'xycoding.p_modifyCustomInfo'
          params.modelid = this.parentData.modelInfo.f_id;
        _message = '修改成功！'
      }
       Resource.ESBServlet.post("", params, "")
        .then(data => {
          console.log(this.parentData.type, data);
          if(data.op.code === 'Y'){
            this.$message({
              message: _message,
                type: 'success'
              });
            this.serCategory = '',
            this.imageUrl = '';
            this.serName = '';
            this.serLanguage = '';
            this.serModelDesc = '';
            this.serPersonnel = '';
            this.serGraphurl = '';
            this.serSoureCodeUrl = '';
            this.serApiUrl = '';
            this.serReporturl = '';
            this.serModelno = '';
            this.serVersion='';
            this.serRelatemodelno ='';
            this.serModelArr = [];
            this.fileList = [];
            this.docInfo=  {
              docName :'',
              docDesc :'上传测试报告',
              docFlag : '-1'
            }
           
            if(this.parentData.pageFlag == '1'){
              try{
                sendMessage("XYCodingmessage")
              }catch(e){
                //TODO handle the exception
              }
            }
            if(this.parentData.pageFlag == '0' && _modelno != this.parentData.modelInfo.f_modelno){
              console.log('modelno已经修改')
              this.$emit("setDialogVisible", { dialogVisible: false ,flag:  this.flag, newModelNo : _modelno});
            }else{
              this.$emit("setDialogVisible", { dialogVisible: false ,flag:  this.flag});
            }

          }else{
            this.$message({
              message: data.op.info,
              type: 'warning',
            });
          }
        })
        .catch(err => {});
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.serGraphurl = res.data[0];
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
    beforeAvatarUpload_file(file) {
      console.log("测试报告", file);
      this.docInfo.docFlag = '0'
      this.docInfo.docDesc = '正在上传...';
      this.reportName = file.name;
    },
    handleAvatarSuccess_file(res, file) {
      console.log(res);
      // debugger
      this.docInfo.docFlag = '1'
      this.docInfo.docDesc = '上传测试报告'
      this.docInfo.docName = file.name
      this.serReporturl = res.data[0];
    },

    beforeAvatarUploadMore(file) {
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

    handleAvatarSuccessMore(res, file, fileList) {
      this.serModelArr.push({name: file.name,url: res.data[0],status: file.status,uid: file.uid})
    },
    handleRemoveMore(file, fileList) {
       console.log(this.serModelArr)
      
     if(file.response && file.response.errno === '0'){
       this.serModelArr = this.serModelArr.filter(el => el.url !== file.response.data[0])   
     }else{
        this.serModelArr = this.serModelArr.filter(el => el.url !== file.url)
     }
    },


    getModelDetail(){
      console.log(this.parentData)
      // debugger
      if(this.parentData.type === 'add'){
        console.log('添加模块',)
      }else if(this.parentData.type === 'mod' && this.flag == '1'){
        console.log('修改模块')
        if(this.parentData.modelInfo ){
          if(this.parentData.pageFlag != '0'){
            let imgArr = Object.values(this.parentData.modelInfo.imgs)
            imgArr = imgArr.map((item, index) => ({
              name: 'Pic' + index,
              url: item,
            }))
            this.fileList = imgArr;
            this.serModelArr = JSON.parse(JSON.stringify(imgArr))

          }
          this.serCategory = this.parentData.modelInfo.f_category
          this.imageUrl = this.parentData.modelInfo.f_graph_url
          this.serName = this.parentData.modelInfo.f_name
          this.serLanguage = this.parentData.modelInfo.f_language
          this.serModelDesc = this.parentData.modelInfo.f_desc
          this.serPersonnel = this.parentData.modelInfo.f_developer
          this.serGraphurl = this.parentData.modelInfo.f_graph_url
          this.serSoureCodeUrl = this.parentData.modelInfo.f_code_url
          this.serApiUrl = this.parentData.modelInfo.f_api_url
          this.serReporturl = this.parentData.modelInfo.f_report_url
          this.serRelatemodelno = this.parentData.modelInfo.f_relate_modelno
          this.serModelno = this.parentData.modelInfo.f_modelno
          // debugger
          this.serVersion = this.parentData.modelInfo.f_version
          this.docInfo=  {
              docName :this.parentData.modelInfo.f_report_name,
              docDesc :'上传测试报告',
              docFlag : '-1'
            }
        }
        
      }
    }

  },
  watch: {
    dialogVisible:'getModelDetail'
  },
  mounted() {
    this.getModelDetail();
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
  width: 100%;
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

