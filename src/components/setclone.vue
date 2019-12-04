<template>
  <div class="kaishuan">
    <mt-header title="设置">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <mt-cell title="修改信息" to="/resetnews" is-link>
      <img slot="icon" src="../../static/images/kai/mainPage/resetnews.png" class="img_bolt">
    </mt-cell>
    <mt-cell title="密码修改" to="/resetpassword" is-link>
      <img slot="icon" src="../../static/images/kai/mainPage/resetpassword.png" class="img_bolt">
    </mt-cell>
    <mt-cell style="padding-right:0.2rem" v-show="!versions" title="系统升级" >
      <span class="system_text">当前版本{{oldVersions}}</span>
      <img slot="icon" src="../../static/images/kai/settingPage/upgrade_system.png" class="img_bolt">
    </mt-cell>
    <mt-cell style="padding-right:0.2rem" v-show="versions" to="/versions" title="系统升级">
      <span class="system_newtext">发现新版本</span>
      <img slot="icon" src="../../static/images/kai/settingPage/upgrade_system.png" class="img_bolt">
    </mt-cell>
    <mt-cell title="安全退出" to="/login" class="quit">
    </mt-cell>
  </div>
</template>
<script>
  import {Toast} from "mint-ui"
  // import $ from 'jQuery'
  export default {
      data() {
          return {
              versions: false,
              oldVersions: "0.0.9"
          };
      },

      mounted(){
          // 保存手机版本号
          var _this = this
          _this.$store.state.versions = this.oldVersions
          console.log(_this.$store.state.versions)
          this.$http
              .get(this.$myConfigg.host + "/api/Home/getversion", {
                  params: {
                  }
              })
              .then(
                  function (res) {
                      console.log(res)
                      let resInfo = $.parseJSON((JSON.stringify(res.data)))
                      if (res.data.IsSuccess) {

                          console.log(_this.$store.state.versions.split('.').join(''))  //旧版本转换格式后
                          console.log(resInfo.Data.Version.split('.').join(''))         //新版本转换格式后
                          // 判断版本号
                          if (resInfo.Data.Version.split('.').join('') > _this.$store.state.versions.split('.').join('')) {
                              _this.versions = true
                              _this.$store.state.newVersions = resInfo.Data.Version
                          } else {
                              _this.versions = false
                          }
                      } else {
                          Toast("resInfo.Message");
                      }
                  },
                  function (err) {
                      Toast("请检查您的网络");
                  }
              );
          console.log(this.oldVersions + ' ' +this.$store.state.versions)
      },
      methods:{
          back(){
              this.$router.go(-1)
          },
      }
  }
</script>
<style scoped>
  .img_bolt{
    border-image:none;
    width:18px;
    height: 18px;
    margin-right: 0.05rem;
  }
  .system_text {
    color: #49A9EA;
  }
  .system_newtext {
    color: #f44336;
  }
</style>
