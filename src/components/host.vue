<template>
  <div id="big-box">
      <div id="login_title"></div>
      <div>
          <div class="hostBox">
            <mt-field label="" placeholder="请输入服务器地址" v-model="host" value="host"></mt-field>
          </div>
          <router-link to='/'>
            <mt-button class="confirm" type="default"  size="large" @click="confirm()">确&nbsp;&nbsp;&nbsp;&nbsp;认</mt-button>
          </router-link>
      </div>
  </div>
</template>
<script>
import { Field, Toast } from "mint-ui";

export default {
  data() {
    return {
      host: ""
    };
  },
  mounted() {
    let _this = this
    setTimeout(function() {
      _this.host = plus.storage.getItem("gdkykf_host")
        ? plus.storage.getItem("gdkykf_host")
        : "";
    }, 20);
  },
  methods: {
    confirm() {
      this.$myConfig.host = this.host;
      plus.storage.setItem("gdkykf_host", this.host);
      this.$router.push({ path: "/" });
    }
  }
};
</script>
<style scoped>
#big-box {
  padding: 0;
  background: url("../../static/images/kai/loginPage/host.png") no-repeat 0 0;
  background-size: cover;
  overflow: hidden;
  padding: 0 0.2rem;
}

.hostBox {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
}

.hostBox,
.hostBox .mint-cell:last-child {
  background-color: rgba(0, 0, 0, 0);
}

.hostBox .mint-field .mint-cell-title,
.mint-field .mint-cell-value {
  width: 0.9rem;
  font-size: 0.2rem !important;
}

.confirm {
  border-radius: 50px;
}
</style>
