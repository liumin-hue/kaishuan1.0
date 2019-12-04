<template>
  <div id="big-box">
      <mt-header fixed title="版本升级">
        <router-link to="/home" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div>
          <div class="logo"></div>
          <div class="logoText">当前版本：{{oldVersions}}</div>
          <div class="newVersions">最新版本：{{newVersions}}</div>
          <div class="tipBox">
                <div class="content">
                    <!-- <div class="andr_click">1.安卓用户请前往PC端手机版客服扫描二维码更新系统</div> -->
                    <mt-button type="primary" v-if="!isIOS" size="large" @click="andr_click">下载安卓最新版本</mt-button>
                    <!-- <div class="ios" v-if="isIOS">ios用户请于App Store下载更新系统</div> -->
<!--                    <mt-button type="primary" v-if="isIOS" size="large" @click="ios">下载IOS最新版本</mt-button>-->
                </div>
          </div>
      </div>
  </div>
</template>
<script>
//引入mint-ui插件
import { Field } from "mint-ui";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      oldVersions: "",
      newVersions: "",
      isIOS:false,
    };
  },
  mounted() {
    // console.log(this.$store.isIOS)
    // this.isIOS = this.$store.isIOS
      console.log(this.$store.state.versions)
      console.log(this.$store.state.newVersions)
    this.oldVersions = this.$store.state.versions;
    this.newVersions = this.$store.state.newVersions;

  },
    methods: {

        andr_click() {
            plus.nativeUI.toast("正在准备环境，请稍后！");
            let wa = plus.nativeUI.showWaiting();
            var dtask = plus.downloader.createDownload(this.$myConfigg.host + "/APPStore/app.apk", {}, function(
                d,
                status
            ) {
                if (status == 200) {
                    var path = d.filename; //下载apk
                    plus.runtime.install(path); // 自动安装apk文件
                    wa.close();
                } else {
                    plus.nativeUI.alert("版本更新失败,请重新下载或前往PC端扫描二维码下载");
                    wa.close();
                }
            });
            dtask.start();
        },


    }

}
</script>
<style scoped>
.logo {
  height: 1.4rem;
  background: url("../../static/images/kai/settingPage/upsystem.png") no-repeat center
    bottom;
  background-size: 0.8rem;
}
.logoText {
  text-align: center;
  margin-top: 0.2rem;
  color: #666;
}
.newVersions {
  text-align: center;
  margin-top: 0.2rem;
  color: #f44336;
  margin-bottom: 1rem;
}
.tipBox {
  padding: 0 0.4rem;
}
.ios {
  text-align: left;
  font-size: 0.18rem;
  color: #f44336;
  padding-top: 0.8rem;
}
</style>
