<template>
  <div id="home">
    <mt-header fixed title="首页"></mt-header>

    <div id="content" class="mui-content">
      <!-- 轮播图 -->
      <mt-swipe :show-indicators="false" :auto="4000">
        <mt-swipe-item></mt-swipe-item>
      </mt-swipe>

      <mt-cell title="开栓任务" to="/bolt" is-link>
        <img slot="icon" src="../../static/images/kai/mainPage/bolt.png" class="img_bolt">
      </mt-cell>
      <mt-cell title="已开栓" to="/alreadybolt" is-link>
        <img slot="icon" src="../../static/images/kai/mainPage/already.png" class="img_bolt">
      </mt-cell>
      <mt-cell title="关栓任务" to="/closebolt" is-link>
        <img slot="icon" src="../../static/images/kai/mainPage/closebolt.png" class="img_bolt">
      </mt-cell>
      <mt-cell title="已关栓" to="/alreadyclose" is-link>
        <img slot="icon" src="../../static/images/kai/mainPage/alreadyclose.png" class="img_bolt">
      </mt-cell>
      <mt-cell title="未缴费" to="/nopay" is-link>
        <img slot="icon" src="../../static/images/kai/mainPage/pay.png" class="img_bolt">
      </mt-cell>
      <mt-cell title="设置" to="/set" is-link>
        <img slot="icon" src="../../static/images/kai/mainPage/setting.png" class="img_bolt">
      </mt-cell>

    </div>
  </div>

</template>
<script>
  export default {
      data(){
          return{
            communityID:1,
            tab_selected:""
          }
      },
      //获取到小区id,userid对应的小区id
          mounted: function () {
          // console.log(this.$store.state.UserInfo)
              var _this = this
          this.$http.get(this.$myConfig.host + '/api/Home/GetCommunitysByUserID',{
              params:{
                  UserID: _this.$store.state.User.UserID
              }
          })
          .then(
              function(res) {
                  _this.communityID = res.data.Data[0].CommunityID
                  _this.$store.state.communityID = _this.communityID
              })
            }
  }
</script>
<style scoped>
#content {
  color: #565656;
}
/* 设置cell样式 */
#statistics_info .mui-table-view-cell,
#setting_info .mui-table-view-cell {
  padding: 0rem 0;
}
  /* 轮播图效果 */
.mint-swipe {
  height: 1.5rem;
  background: url("../../static/images/kai/mainPage/banner.jpg");
  background-size: cover;
}
span.mui-icon {
  display: inline-block;
  float: left;
  width: 0.3rem;
  height: 0.3rem;
  background-size: 0.3rem 0.3rem;
}
.img_bolt{
  border-image:none;
  width:25px;
  height: 25px;
  margin-right: 0.05rem;
}

</style>
