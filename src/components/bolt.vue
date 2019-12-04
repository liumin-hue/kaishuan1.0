<template>
  <div class="kaishuan">
    <mt-header title="开栓任务">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
      <div slot="right" class="export">
        <form method="post" id="form">
          <img src="../../static/images/kai/mainPage/export.png" @click="exportExl">
        </form>
      </div>
    </mt-header>
    <div class="search">
      <div class="search_input">
        <input type="text" placeholder="请输入楼栋号" v-model="floorNO" value="timeStart" class="input-building">
        <span>楼</span>
        <input type="text" placeholder="单元号" v-model="roomNO" value="timeEnd" class="input-unit">
        <span>单元</span>
      </div>
      <div class="btn-search-bolt">
        <button class="search-btn" v-on:click="handleSearch">搜索</button>
      </div>

    </div>
  <div>
    <div class="main-body" ref="wrapper" :style="{ height: (wrapperHeight-10) + 'px' }">
      <mt-loadmore
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore"
        :autoFill="isAutoFill"
      >
        <ul class="mui-table-view mui-grid-view" >
          <li v-for="(item,index) in datas" :key="index"
              class="mui-table-view-cell mui-media mui-col-xs-6 bolt_argument" @click="reactConfirm(index,$event)">
            <div class="address"><div class="addressleft"><span class="texttitle">地址：</span></div><div class="addressright">
              <span>{{item.Address}}</span></div></div>
            <div class="model_bottom">
              <div>
                <div><span class="nametext"><span class="texttitle">姓名：</span>{{item.CusName}}</span><div class="phone"><span class="texttitle">手机号：</span>{{item.Mobile}}</div></div>
                <div><span class="texttitle">下达指令时间：</span>{{item.BoltOptTime}}</div>
              </div>
              <mt-button class="bolt_news" v-on:click="btnConfirm(index)">开栓</mt-button>
            </div>
          </li>
        </ul>
<!--        <div calss="finish" style="text-align: center; width: 100%;">{{bottomText}}</div>-->
      </mt-loadmore>
    </div>
    <scroll-top :total=" total" :current="current" :top = "top" ref="scrollTop" @click="handelGun"></scroll-top>
  </div>
  </div>
</template>
<script>
    // import iconvLite from 'iconv-lite';
    // const template = 'xxxxx'
    import {Toast , Spinner,} from "mint-ui";
    import scrollTop from "../component/scrollTop";

    var XLSX = require("xlsx");
    var fromPath = "";
    var _this = this;
    var dtask = null;
    export default {
        components: {
            scrollTop,
            // excel,
        },
        data() {
            return {
                outTableData: {
                    id: 'outTable',
                    name: '开栓任务单'
                },
                chargeyear:"2019-2020",
                isLoading: true,
                top: 0, //滚动条位置
                b_topDistance: 0, //滚动条位置
                total: 0, //工单总数
                current: 0, //当前工单序列号
                datas: [],
                //可以进行上拉
                allLoaded: false,
                //是否自动触发上拉函数
                isAutoFill: false,
                wrapperHeight: 0,
                courrentPage: 0,
                selected: "no_bolt",
                boltStitic: "no-finish",
                floorNO: "",
                roomNO: "",
                page: 1,
                pagesize: "10",
                communityId: 1117,
                allPage: 0,
                bottomDistance: 15,
                timeStart: "",
                timeEnd: "",
                startTime: '',
                endTime: '',
                pickerValue: '',
                boltStatus: 1
            }
        },
        //监听变化
        activated() {
            console.log("进入了");
            // console.log(this.$store.state.isNewWorkOrder);
            // this.active = choosed;
            //获取子组件公用方法
            this.$refs.scrollTop.getIndex();
        },
        //进入前
        beforeRouteEnter: (to, from, next) => {
            //判断跳转路径
            if (from.name == "Home") {
                // this.$store.state.isMyWorkOrder = "MyWorkOrder"
                choosed = "wait_for_reply";
            }
            fromPath = from.name
            next();
        },
        created() {
            this.loadFrist();
        },
        mounted() {
            console.log("进入了");
            this.$refs.scrollTop.getIndex();
            // 父控件要加上高度，否则会出现上拉不动的情况
            this.wrapperHeight =
                document.documentElement.clientHeight -
                this.$refs.wrapper.getBoundingClientRect().top;
            window.addEventListener('scroll', this.handleScroll, true)
        },
        methods: {
            back() {
                this.$router.go(-1)
            },
            handleSearch() {
                this.page = 1
                this.loadFrist();
                _this.isLoading = true;
            },
            handleScroll() {
                this.top = this.$refs.wrapper.scrollTop;  //滚动条距离父组件ref= wrapper 的距离高度
                this.current = Math.floor(this.top / 120) + 1;   //当前第几条数据
            },
            handelGun() {
                this.$refs.wrapper.scrollTo(document.body.scrollHeight, 0)
                console.log(this.top)
            },
            //   下拉刷新
            loadTop() {
                this.page = 1
                this.loadFrist();
                _this.isLoading = true;
            },
            // 上拉加载
            loadBottom() {
                this.page++
                this.loadMore();
            },
            reactConfirm(index, event) {
                //获取点击索引号
                this.current = index + 1;
                //获取点击对象
                return this.current;

            },
            // 下来刷新加载
            loadFrist() {
                var _this = this
                this.$http({
                    method: 'post',
                    url:this.$myConfig.host + '/ChargeSystem/Charge/GetCusBoltSet',
                    params: {
                        "BoltStatus": this.boltStatus,
                        "CommunityID": _this.$store.state.communityID,
                        "Page": this.page,
                        "PageSize": this.pagesize,
                        //选择得时间
                        "OperateBegTime": '',
                        "OperateEndTime": '',
                        "ImplementerBegTime":this.timeStart ,  //this.timeStart
                        "ImplementerEndTime":this.timeEnd ,  //
                        //楼号
                        "BuildingNO": this.floorNO,
                        "UnitNO": this.roomNO,
                        "OrderData":"BoltOptTime desc"
                    }
                })

                    .then(response => {
                        response.data.Data.forEach(function (itembolt) {
                            itembolt.BoltOptTime = itembolt.BoltOptTime.substr(0, 10) + ' ' + itembolt.BoltOptTime.substr(11, 8)
                        })
                        console.log(response.data.Data)
                        this.current = 0;
                        this.total = response.data.Message
                        if (this.total == 0) {
                            Toast("没有开栓任务")
                        }
                        this.allLoaded = false; // 可以进行上拉
                        this.datas = response.data.Data;
                        this.$refs.loadmore.onTopLoaded();
                        this.allPage = response.data.Message / this.pagesize;
                        this.allPage = Math.floor(this.allPage) + 1;
                        return this.allPage
                        return this.datas
                    })
                    .catch(error => {
                        console.log(error);
                        alert("网络错误，不能访问");
                    });
            },
            // 加载更多
            loadMore() {
                var _this = this
                console.log(this.page);
                this.$http({
                    method: 'post',
                    url:this.$myConfig.host + '/ChargeSystem/Charge/GetCusBoltSet',
                    params: {
                        "BoltStatus": this.boltStatus,
                        "CommunityID": _this.$store.state.communityID,
                        "Page": this.page,
                        "PageSize": this.pagesize,
                        //选择得时间
                        "OperateBegTime": '',
                        "OperateEndTime": '',
                        "ImplementerBegTime":this.timeStart ,  //this.timeStart
                        "ImplementerEndTime":this.timeEnd ,  //
                        //楼号
                        "BuildingNO": this.floorNO,
                        "UnitNO": this.roomNO,
                        "OrderData":"BoltOptTime desc"
                    }
                })
                    .then(response => {
                        response.data.Data.forEach(function (itembolt) {
                            itembolt.BoltOptTime = itembolt.BoltOptTime.substr(0, 10) + ' ' + itembolt.BoltOptTime.substr(11, 8)
                        })
                        if (this.page <= this.allPage) {
                            this.datas = this.datas.concat(response.data.Data);
                            this.$refs.loadmore.onBottomLoaded();
                        } else if (this.page > this.allPage) {
                            this.allLoaded = true;// 若数据已全部获取完毕
                            this.$refs.loadmore.onBottomLoaded();
                            Toast("没有更多了")
                        } else {
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        alert("网络错误，不能访问");
                    });
            },
            btnConfirm(id) {
                var _this = this;
                this.current = id //数组索引
                this.$messagebox({
                    title: null,
                    message: '确认执行开栓命令吗？',
                    showCancelButton: true,
                    // confirmButtonText:"继续购物",
                    // cancelButtonText:"查看订单"
                }).then(action => {
                    if (action == 'confirm') {
                        try {
                            // 开栓完成之后 给 李彬传信息（不获取任何值）
                            this.$http.post(this.$myConfigg.host + '/api/Home/InsertOpenLog', {
                                "ID": this.$store.state.communityID,
                                "UserID": _this.$store.state.User.UserID,
                                "OpenTime": "",
                                "Remark": this.datas[id].Address,
                            }).then(res => {
                            })
                        } finally {
                            this.$http.post(this.$myConfig.host + '/ChargeSystem/Charge/OpenBolt', [{
                                    ChargeYear: this.datas[id].ChargeYear,
                                    CusID: this.datas[id].CusID,
                                    BoltID: this.datas[id].BoltID,
                                    CusName: this.datas[id].CusName,
                                    BoltStatus: this.datas[id].BoltStatus,
                                    AduitStatus: this.datas[id].AduitStatus,
                                }]
                            )
                                .then(res => {
                                    console.log(res);
                                })
                            Toast('开栓成功');
                            this.datas.splice(id, 1)   //删除对应索引号的信息 ，从“this.current”开始 删除 “1”个
                            this.total--;
                            if (this.total == 1) {
                                this.current = 1
                            } else if (this.total == 0) {
                                this.current == 0
                            } else {
                                this.current--
                            }
                            this.$store.state.datas = this.datas
                        }
                    } else {
                        console.log('取消开栓')
                    }
                })
            },
            exportExl() {
                var _this = this
                var obj = {
                    CommunityID: _this.$store.state.communityID,
                    Title:'开栓任务单',
                    BoltStatus: this.boltStatus,
                    PageSize: this.pagesize,
                    //选择得时间
                    "OperateBegTime": '',
                    "OperateEndTime": '',
                    "ImplementerBegTime":'',  //this.timeStart
                    "ImplementerEndTime":'' ,
                    BuildingNO: this.floorNO,
                    UnitNO: this.roomNO
                }
                var str = ''
                for(var key in obj) {
                    str +='&' + key + '=' + obj[key]
                }
                console.log(str)
                location.href = this.$myConfig.host + '/ChargeSystem/Charge/CusBoltExcelExport?' + str
                // form.action='http://172.30.10.84:10016/ChargeSystem/Charge/CusBoltExcelExport?' + str
                // console.log(form.action)
                // form.submit()
            },

        }
    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-body {
    /* 加上这个才会有当数据充满整个屏幕，可以进行上拉加载更多的操作 */
    overflow: scroll;
  }
  input[type='text'],
  input[type='time']{
    background-color: #F7F7F7;
    margin: 0;
    text-align: center;
    border: none;
  }

  .export img {
    width: 25px;
  }

  .outTable {
    background: url("../../static/images/kai/mainPage/export.png");
    background-size: 25px;
  }
</style>
