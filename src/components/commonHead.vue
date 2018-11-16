<template>
    <div class="head"  :class="{headBg: headTitle}">
        <div class="title" v-if="headTitle"><img src="../assets/img/zyxylogo.png" alt=""><div>{{headTitle}}</div> </div>
        <!-- <select name="" id="" class="logout" @change="logout">
          <option value="1" selected>用户管理</option>
          <option value="2" >退出</option>
        </select> -->
        <div style="-webkit-app-region:drag;height:100%;  width: calc(100% - 200px);cursor:move"></div>
        <div class="logout" @click="touserManage" v-show="ismanage===9?true:false">
          用户管理
        </div>
        <i class="line" v-show="ismanage===9?true:false"></i>
        <!-- <div class="logout" @click="logout">退出 |</div> -->
        <div class="header-btn">
            <button class="btn-s" @click="winMin()"></button>
            <button class="btn-b" @click="sizeSwitch()"></button>
            <button class="btn-c" @click="closeWindow()"></button>
        </div>
    </div>
</template>
<script>
export default {
  props: ["ismanage", "headTitle"],
  data() {
    return {
      homePage: false
    };
  },
  mounted() {},
  methods: {
    logout() {
      // let storage = window.localStorage;
      // if(storage.getItem('user')){
      //   storage.removeItem('user');
      this.$router.push({ name: "Login" });
      // }
    },
    winMin: function() {
      winMinAndRestore();
    },
    sizeSwitch: function() {
      windowSizeSwitch();
    },
    closeWindow: function() {
      closeWin();
    },
    touserManage() {
      try {
        createSpecialWindow(
          { url: "index.html#/usermanage", id: "usermanage" },
          "xycoding"
        );
      } catch (error) {
        this.$router.push({ name: "usermanage" });
      }
    }
  }
};
</script>
<style lang="less">
.headBg {
  background: rgba(0, 0, 0, 0.2);
}
.head {
  height: 40px;
  position: relative;
  .line {
    width: 1px;
    height: 18px;
    background: rgba(246, 247, 251, 1);
    opacity: 0.3;
    position: absolute;
    right: 144px;
    top: 10px;
  }
  select {
    border: none;
    outline: none;
    option {
      background: transparent;
      color: #000;
    }
  }
  .title {
    color: #fff;
    font-size: 16px;
    position: absolute;
    left: 10px;
    display: flex;
    height: 100%;
    > div {
      height: 100%;
      line-height: 40px;
      margin-left: 20px;
      // font-size: 14px;
    }
    img {
      height: 100%;
    }
  }
  .logout {
    color: #fff;
    background: transparent;
    position: absolute;
    right: 160px;
    top: 10px;
    z-index: 99;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
  }
  .header-btn {
    position: absolute;
    right: 0;
    z-index: 99;
    top: 0;
    button {
      width: 45px;
      height: 40px;
      background: initial;
      border: none;
      background-repeat: no-repeat;
      outline: none;
      background-size: 16px 14px;
      background-position: center;
      transition: all 0.3s;
      cursor: pointer;
      -webkit-filter: hue-rotate(40deg) saturate(0.5) brightness(390%)
        saturate(4);
      filter: hue-rotate(40deg) saturate(0.5) brightness(390%) saturate(4);
      &:hover {
        opacity: 0.5;
      }
    }
    .btn-c {
      background-image: url("../assets/img/top_icon_off.svg");
    }
    .btn-s {
      background-image: url("../assets/img/top_icon_zxh.svg");
    }
    .btn-b {
      background-image: url("../assets/img/top_icon_fd.svg");
    }
  }
}
</style>


