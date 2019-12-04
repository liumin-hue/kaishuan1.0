<template>
  <div id="big-box">
    <div id="login_title"></div>
    <div id="login_from">
      <div class="input_test">
        <mt-field label=" " placeholder="用户名" v-model="ruleForm.username" value="ruleForm.username"></mt-field>
        <mt-field label=" " placeholder="密码" type="password" v-model="ruleForm.password" value="ruleForm.password"></mt-field>
      </div>
      <router-link to=''>
        <mt-button type="primary"  size="large" @click="goHome(ruleForm)">登&nbsp;&nbsp;&nbsp;&nbsp;录</mt-button>
      </router-link>
      <router-link to='/host' v-if="isIOS">
        <mt-button type="default"  size="large">返&nbsp;&nbsp;&nbsp;&nbsp;回</mt-button>
      </router-link>
    </div>
    <span id="compony">河北工大科雅能源科技股份有限公司&nbsp;&nbsp;版权所有</span>
  </div>
</template>
<script>
    import { Field, Toast } from "mint-ui";

    export default {
        data() {
            return {
                // username: "",
                // password: "",
                isIOS: false,
                ruleForm: {
                    username: '',
                    password: ''
                },

            };
        },
        mounted() {
            // this.getCookie();
            this.ruleForm.username=localStorage.getItem("keyName");//用变量代替键名
            this.ruleForm.password=localStorage.getItem("keyPass");

        },

        methods: {
            goHome() {
                if (this.ruleForm.username == "" || this.ruleForm.password == "") {
                    Toast("用户名和密码不能为空");
                } else {
                    var strName=this.ruleForm.username;//存储文本框的值
                    var strPass=this.ruleForm.password;
                    localStorage.setItem("keyName",strName);
                    localStorage.setItem("keyPass",strPass);
                    }
                    var _this = this;
                    this.$store.isLogin = true;
                    // 验证登录信息
                    this.$http
                        .get(this.$myConfigg.host + "/api/Home/Login?UserName="+this.ruleForm.username+"&PassWord="+this.ruleForm.password)
                    .then(
                        function(res) {
                            console.log(res)
                            if (res.data.IsSuccess) {
                                _this.$store.UserInfo = res.data.Data.UserID;
                                _this.$router.push({ path: "/home" });
                                // 保存账号密码
                                _this.$store.state.User = res.data.Data
                                console.log(_this.$store.state.User)
                            } else {
                                Toast(res.data.Message);
                            }
                        },
                            function(err) {
                                // console.log(err)
                                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                                    console.log("This is iOS'browser."); //这是iOS平台下浏览器
                                    Toast("请检查您的网络或重新填写服务器地址");
                                } else {
                                    Toast("请检查您的网络");
                                }
                            }
                        );
                },
        },
    };
</script>
<style scoped>
  #big-box {
    padding: 0;
    background: url("./../../static/images/kai/loginPage/bg.png") no-repeat 0 0;
    background-size: cover;
    overflow: hidden;
  }

  #login_from {
    padding: 0.3rem;
  }

  #login_from > div,
  #login_from > div input {
    font-size: 0.18rem;
  }

  #login_from > div input {
    outline: none;
    border: none;
  }

  .input_test {
    margin-bottom: 0.6rem;
  }

  .mint-button {
    height: 0.5rem;
    width: 3.05rem;
    border-radius: 0.25rem;
    margin: 0.2rem auto;
  }

  /* 媒体查询 */
  /* 图标样式 */
  @media only screen and (max-device-width: 413px) {
    /*iPhone 6 Portrait*/
    #login_title {
      background: url("./../../static/images/kai/loginPage/title.png") no-repeat
      center;
    }
  }

  @media only screen and (min-device-width: 414px) {
    /*iPhone 6+ Portrait*/
    #login_title {
      background: url("../../static/images/kai/loginPage/title@1.5x.png") no-repeat
      center;
    }
  }

  #login_title {
    width: 100%;
    height: 0.4rem;
    background-size: 2.44rem 0.38rem;
    margin-top: 1.54rem;
  }

  #compony {
    display: block;
    font-size: 0.12rem;
    margin: 0.1rem auto;
    color: #fff;
    text-align: center;
  }
  select, textarea,
  input[type='text']{
    margin-left:0.1rem !important;
    margin-bottom:0.06rem !important;
    border:none;
  }


  .mint-button--primary {
    color: #fff;
    background-color: #26a2ff;
  }
</style>
