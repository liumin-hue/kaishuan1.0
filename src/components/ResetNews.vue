<template>
  <div id="resetnews">
    <mt-header fixed title="修改信息">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <div id="info_body">
      <div class="input_test">
        <mt-field class="mui-table-view-cell use" label="用户姓名" placeholder="请输入用户姓名" v-model="realName"></mt-field>
        <mt-field class="mui-table-view-cell use"
                  label="手机号码"
                  placeholder="请输入手机号码"
                  type="number"
                  v-model="telephone"></mt-field>
      </div>
    </div>
    <mt-tabbar v-model="selected">
      <mt-button type="primary" size="large" @click="confirm()">保存设置</mt-button>
    </mt-tabbar>
  </div>
</template>
<script>
    //引入mint-ui插件
    import { MessageBox, Field } from "mint-ui";
    import { Toast } from "mint-ui";
    export default {
        data() {
            return {
                selected:"",
                telephone:"",
                realName:""
            };
        },
        mounted(){
            this.telephone = this.$store.state.User.Phone
            this.realName = this.$store.state.User.RealName
        },
        activated() {
            console.log(this.$store.state.User.Phone)
            this.telephone = this.$store.state.User.Phone
            this.realName = this.$store.state.User.RealName
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            confirm: function() {
                var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if (this.realName == "" || this.realName == undefined){
                    Toast("请输入用户姓名");
                }else if(this.telephone == "" || this.telephone == undefined) {
                    Toast("手机号码不能为空");

                }else if(!myreg.test(this.telephone)){
                            Toast("请输入有效手机号")
                            return false;
                } else{

                    MessageBox.confirm("确定保存设置?").then(action => {
                        //修改密码接口
                        //修改密码 和手机号
                        this.$http.post(this.$myConfig.host + '/Api/Home/UpdateUserInfo', {
                            "UserID":this.$store.state.User.UserID,
                            "UserName":this.$store.state.User.UserName,
                            "RealName":this.realName,
                            "PassWord":this.$store.state.User.PassWord,
                            "Phone":this.telephone,
                            "LoginTime":this.$store.state.User.LoginTime,
                        })
                            .then(res => {
                                    if (res.data.IsSuccess) {
                                        Toast("信息修改成功");
                                        this.$store.state.User.Phone = this.telephone
                                        this.$store.state.User.RealName = this.realName
                                    } else {
                                        Toast("输入格式有误");
                                    }
                                },
                                function(err) {
                                    Toast("请检查您的网络");
                                },
                            )
                    }).catch((cancel)=>{
                        this.telephone = this.$store.state.User.Phone
                        this.realName = this.$store.state.User.RealName
                    });
                }
            },

        }
    };
</script>
<style scoped>
  /* 修改cell尺寸 */
  #resetnews{
    padding: 0.5rem 0;
  }
  .mui-table-view-cell{
    padding: 0;
  }
  .mint-field .mint-cell-title{
    width:1.02rem;
  }
</style>
