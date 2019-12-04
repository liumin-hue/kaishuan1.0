<template>
  <div id="resetPassword">
    <mt-header fixed title="密码修改">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <div id="info_body">
      <div class="input_test">
        <mt-field class="mui-table-view-cell use" label="原密码" placeholder="请输入原密码" type="password" v-model="OldPassword"></mt-field>
        <mt-field class="mui-table-view-cell use" label="新密码" placeholder="请输入新密码" type="password" v-model="NewPasword"></mt-field>
        <mt-field class="mui-table-view-cell use" label="确认密码" placeholder="请再次输入密码" type="password" v-model="NewPaswordAgain"></mt-field>
      </div>
    </div>
    <mt-tabbar v-model="selected">
      <mt-button type="primary" size="large" @click="confirm()">保存设置</mt-button>
    </mt-tabbar>
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
                // passage: "111111",
                selected:"",
                OldPassword: "",
                NewPasword: "",
                NewPaswordAgain:null,
            };
        },
        methods: {
            back() {
                this.$router.go(-1)
            },
            confirm: function() {
                var _this = this;
                console.log( _this.$store.state.User.PassWord)
                this.isLoading = true

                //判断密码输入
                if (this.OldPassword == "" || this.OldPassword == undefined) {
                    Toast("请输入原密码");
                } else if (this.NewPasword == "" || this.NewPasword == undefined) {
                    Toast("新密码不能为空");
                } else if (this.NewPaswordAgain == "" || this.NewPaswordAgain == undefined) {
                    Toast("确认密码不能为空");
                } else if (this.NewPasword !== this.NewPaswordAgain) {
                    Toast("两次密码输入不一致");
                } else if (this.OldPassword !== _this.$store.state.User.PassWord) {
                    Toast("原密码输入有误");
                } else {
                    MessageBox.confirm("确定保存设置?").then(action => {
                        //修改密码接口
                        //修改密码 和手机号
                        console.log(this.NewPasword)
                            this.$http.post(this.$myConfigg.host + '/Api/Home/UpdateUserInfo', {
                                "UserID":_this.$store.state.User.UserID,
                                "UserName":_this.$store.state.User.UserName,
                                "RealName":_this.$store.state.User.RealName,
                                "PassWord":this.NewPasword,
                                "Phone":_this.$store.state.User.Phone,
                                "LoginTime":_this.$store.state.User.LoginTime,
                            })
                            .then(
                                function(res) {

                                    if (res.data.IsSuccess) {
                                        //清空用户数据
                                        //提示信息
                                        Toast("密码修改成功,请重新登录");
                                        _this.$router.push("/login");
                                    } else {
                                        Toast("您不能修改密码");
                                    }
                                },
                                function(err) {
                                    Toast("请检查您的网络");
                                }
                            );
                    }).catch((cancel)=>{
                        var _this = this
                        this.OldPassword= "";
                        this.NewPasword="";
                        this.NewPaswordAgain="";
                    });
                }
            }
        }
    };
</script>
<style scoped>
  #info_body {
    padding: 0.5rem 0;
  }
  input[type='text']{
    background-color: #F0F0F0;
    margin:0;
    text-align: center;
    border:none;
  }
  /* 修改cell尺寸 */
  .mui-table-view-cell {
    padding: 0;
  }
</style>
