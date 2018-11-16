<template>
<el-dialog title="新建微应用" :visible.sync="dialogVisible" :before-close="handleClose">
    <span class="topic"></span>
    <div class="total">
        <span class="msname">微应用名称</span>
        <input type="text" v-model='serName' placeholder="请输入微应用名称">
    </div>
    <div class="total">
        <span class="msname">语言</span>
        <input type="text" v-model='serLanguage' placeholder="请输入开发语言">
    </div>
    <div class="total">
        <span class="msname">开发人员</span>
        <input type="text" v-model='serPersonnel' placeholder="用';'分隔开发人员">
    </div>
    <div class="total">
        <span class="msname tuopu">界面图</span>
        <el-upload
          class="upload-more"
          drag
          :action="UploadFile"
          :on-success="handleAvatarSuccess" 
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove"
          list-type="picture"
          :file-list="fileList"
          :on-change="handleChange"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
    <!-- <div class="total">
        <span class="msname tuopu">界面图</span>
        <el-upload class="avatar-uploader" 
        :action="UploadFile" 
        :show-file-list="false" 
        :on-success="handleAvatarSuccess" 
        :before-upload="beforeAvatarUpload"
        >
        
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <span v-else  class="uploadstyle">上传文件</span>
            </el-upload>
    </div> -->
   
    <div class="total">
        <span class="msname">入口地址</span>
        <input type="text" v-model='serApiUrl' placeholder="请输入入口地址">
    </div>
    <div class="total">
        <span class="msname">应用说明</span>
        <input type="text"  v-model='serModelDesc' placeholder="请输入应用说明">
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitHandle()">确 定</el-button>
    </span>
</el-dialog>
</template>
<script>
import { Resource } from "../fetch/resource.js";

export default {
  data() {
    return {
      // dialogVisible: false,
      userId: localStorage.getItem("id"),
      imageUrl: "",
      serName: "",
      serModelDesc: "",
      serLanguage: "",
      serPersonnel: "",
      serModelimg: "",
      fileList: [],
      serModelArr: [],
      serApiUrl: "",
      UploadFile: Resource.UploadFile
    };
  },
  props: ["dialogVisible", "parentData"],
  methods: {
    handleChange(){

    },
    handleClose(done) {
      console.log(this.parentData);
      this.$confirm("确认关闭？")
        .then(_ => {
          this.$emit("setDialogVisible", { dialogVisible: false });
        })
        .catch(_ => {});
    },
    submitHandle() {
      console.log(this.serModelArr,this.fileList)
      let total = this.serModelArr.reduce(function(init, item,index) {
          return  index===0?item.url : init + ',' + item.url
      }, '');
      let _message;
       let params = {
        id: this.userId,
        name:this.serName,
        desc: this.serModelDesc,
        language: this.serLanguage,
        developer: this.serPersonnel,
        modelimg: total,
        apiurl: this.serApiUrl,
      };
      if(this.parentData.type === 'add'){
        params.command = "xycoding.p_addApplicationInfo"
        _message = '添加成功'
      }else if(this.parentData.type === 'mod'){
         params.command = "xycoding.p_modifyApplicationInfo"
          params.modelid = this.modelid;
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
            this.imageUrl = '';
            this.serName = '';
            this.serLanguage = '';
            this.serModelDesc = '';
            this.serPersonnel = '';
            this.serModelimg = '';
            this.serApiUrl = '';
            this.modelid = '';
            this.dialogVisible = false;
            this.$emit("setDialogVisible", { dialogVisible: false });
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

    handleAvatarSuccess(res, file, fileList) {
      this.serModelArr.push({name: file.name,url: res.data[0],status: file.status,uid: file.uid})
    },
    handleRemove(file, fileList) {
       console.log(this.serModelArr)
      
     if(file.response && file.response.errno === '0'){
       this.serModelArr = this.serModelArr.filter(el => el.url !== file.response.data[0])   
     }else{
        this.serModelArr = this.serModelArr.filter(el => el.url !== file.url)
     }
    },

    getModelDetail(){
      if(this.parentData.type === 'add'){
        console.log('添加模块',)
      }else if(this.parentData.type === 'mod'){
        console.log('修改模块')
        if(this.parentData.modelInfo){
          let imgArr = Object.values(this.parentData.modelInfo.imgs)
          imgArr = imgArr.map((item, index) => ({
            name: 'Pic' + index,
            url: item,
          }))
          this.fileList = imgArr;
          this.serModelArr = JSON.parse(JSON.stringify(imgArr))
          // this.serModelArr = imgArr
          this.serName = this.parentData.modelInfo.f_name
          this.serLanguage = this.parentData.modelInfo.f_language
          this.serModelDesc = this.parentData.modelInfo.f_desc
          this.serPersonnel = this.parentData.modelInfo.f_developer
          this.serModelimg = this.parentData.modelInfo.f_graph_url
          this.serApiUrl = this.parentData.modelInfo.f_api_url
          this.modelid = this.parentData.modelInfo.f_id
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
.el-dialog {
  width: 642px;
  // height: 5.34rem;
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
      font-size: 14px;
    }
  }
  .el-dialog__body {
    padding: 0;
    margin: 9px 0 0 19px;
    .topic {
      // position: absolute;
    }
    .total {
      display: flex;
      margin-bottom: 10px;
      .avatar-uploader {
        display: inline-block;
        width: 94px;
        height: 94px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(232, 232, 232, 1);/*no*/
        border-radius: 3px;
        position: relative;
        text-align: center;
        line-height: 94px;
        img {
          width: 100%;
          height: 100%;
        }
        .el-upload {
          width: 100%;
          height: 100%;
        }
      }
      .msname {
        margin-right: 10px;
        text-align: right;
        display: inline-block;
        min-width: 90px;
        align-self: center;
      }
      .tuopu {
        // vertical-align: top;
        align-self: start;
      }
      input {
        height: 30px;
        width: 502px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(232, 232, 232, 1);/*no*/
        border-radius: 3px;
        padding-left: 8px;
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
    }
  }
  .el-upload-list{
    max-height: 400px;
    overflow: auto;
  }
}
</style>

