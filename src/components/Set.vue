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
    <mt-cell style="padding-right:0.2rem" v-show="!versions"
             class="mui-table-view-cell setting_vision setting_icon" title="系统升级"
             :value="'当前版本：' + oldVersions"></mt-cell>
    <mt-cell style="padding-right:0.2rem" v-show="versions" to="/setting/versions"
             class="mui-table-view-cell setting_vision setting_icon versions" title="系统升级"
             value="发现新版本"></mt-cell>

    <mt-cell title="安全退出" to="/login" class="quit">
    </mt-cell>
  </div>
</template>
<script>
  export default {
      methods:{
          back(){
              this.$router.go(-1)
          }
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
</style>
