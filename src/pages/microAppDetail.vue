<template>
  <div class="microSer">
    <Head  :headTitle="headTitle"></Head>
    <div class="scrollBox">
      <AppDetail :modelId='modelId' :customApp='customApp'></AppDetail> 
    </div>
   </div>
</template>
<script>
import { Resource } from "../fetch/resource.js";
import Head from "@/components/commonHead";
import AppDetail from "@/components/commonAppDetail";

export default {
  data() {
    return {
      headTitle:'微应用',
      modelid:this.$route.params.id,
      customApp:false
    };
  },
  components: {
    Head,
    AppDetail
  },
  methods: {
     goBack() {
      window.history.go(-1);
    },
    getModelDetail() {
        this.modelid = this.$route.params.id;
    },

  },

};
</script>
<style lang="less" scoped>

.microSer {
  overflow: auto;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
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
}

</style>


