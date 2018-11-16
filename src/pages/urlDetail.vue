<template>
    <div class="microApp">
      <Head :headTitle='headTitle'></Head>
      <div class="scrollBox" >
        <iframe :src="url" frameborder="0" width="100%" height="100%"></iframe>
      </div>
    </div>
</template>

<script>

import { Resource } from "../fetch/resource.js";
import Head from "@/components/commonHead";

export default {
  data() {
    return {
       headTitle:'网页浏览',
       url:decodeURIComponent(decodeURIComponent(this.$route.params.url)),
    };
  },
  components: {
    Head
  },
  methods: {
   
  },
  created(){
    console.log(this.$route.params.id)
  }

};
</script>
<style lang="less">
@import '../assets/css/common.less';

.microApp {
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
}
</style>


