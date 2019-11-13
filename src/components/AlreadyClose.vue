<template>
  <div class="kaishuan">
    <mt-header title="已关栓">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <div class="search">
      <div class="search_input">
        <input type="text" placeholder="请输入楼栋号" v-model="floorNO" value="timeStart" class="input-building">
        <span>楼</span>
        <input type="text" placeholder="请输入单元号" v-model="roomNO" value="timeEnd" class="input-unit">
        <span>单元</span>
      </div >
      <div class="btn-search-bolt">
        <button class="search-btn" v-on:click="handleSearch">搜索</button>
      </div>
    </div>
    <div class="time">
      <div class="time_input">
        <input type="text" readonly @click="open('picker1')" placeholder="起始时间" class="time-btn" :value="timeStart |
        formatDate()">
        <div class="timetext">至</div>
        <input type="text" readonly @click="openpicker('picker2')" placeholder="终止时间" class="time-btn" :value="timeEnd |
        formatDate()">
      </div>
    </div>
    <mt-datetime-picker
      ref="picker1"time
      type="datetime"
      v-model="timeStart"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="startDate"
      :endDate="endDate"
      @cancel="handelcancel"
      @confirm="handleChange">
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="picker2"
      type="datetime"
      v-model="timeEnd"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="startDate"
      :endDate="endDate"
      :cancel-text="cancel"
      :confirm-text="confirm"
      @cancel="handelcancel"
      @confirm="handleChange">
    </mt-datetime-picker>
    <div style="height: 100%;">
      <div class="main-body" ref="wrapper" :style="{ height: (wrapperHeight-10) + 'px' }" >
        <mt-loadmore
          :top-method="loadTop"
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          ref="loadmore"
          :autoFill="isAutoFill"
        >
          <ul class="mui-table-view mui-grid-view" >
            <li v-for="(item,index) in datas" :key="index"  @click="reactConfirm(index,$event)"
                class="mui-table-view-cell mui-media mui-col-xs-6 bolt_argument" >
              <div class="address"><div class="addressleft"><span class="texttitle">地址：</span></div><div class="addressright">
                <span>{{item.Address}}</span></div></div>
              <div class="model_bottom">
                <div>
                  <div><span class="nametext"><span class="texttitle">姓名：</span>{{item.CusName}}</span><div class="phone"><span class="texttitle">手机号：</span>{{item.Mobile}}</div></div>
                  <div><span class="texttitle">关栓时间：</span>{{item.ImplementerTime}}</div>
                </div>

              </div>
            </li>
          </ul>

        </mt-loadmore>
      </div>
      <my-scrollTop :total=" total" :current="current" :top = "top" ref="scrollTop" @click="handelGun"></my-scrollTop>
    </div>
  </div>
</template>

<script>
    import {formatDate} from '../../static/js/date.js'
    import scrollTop from "../component/scrollTop";
    import {Toast } from "mint-ui";
    var fromPath = "";
    var _this = this;
    export default {
        filters: {                    //时间转换
            formatDate(time) {
                var date = new Date(time);
                if(time==""){
                    return formatDate(date,'');
                }else{
                    return formatDate(date, 'yyyy/MM/dd');
                }


            },
        },
        components:{
            'my-scrollTop':scrollTop,
        },
        name: "goodslist",
        data() {
            return {
                isLoading: true,
                top: 0, //滚动条位置
                total: 0, //工单总数
                current: 0, //当前工单序列号
                startTime: '',
                endTime: '',
                pickerValue: '',
                boltStatus: 3,
                datas: [],
                allLoaded: false, //可以进行上拉
                isAutoFill: false,//是否自动触发上拉函数
                wrapperHeight: 0,
                selected: "no_bolt",
                boltStitic: "no-finish",
                floorNO: "",
                roomNO: "",
                page: 1,
                pagesize: "10",
                communityId: 1117,
                allPage: 0,
                topText: "",
                timeStart: "",      //选择时间区间查询：开始时间
                timeEnd: "",        //选择时间区间查询：结束时间
                startDate: new Date('2019-1-1'),
                endDate: new Date(),     //设置结束时间
                value: new Date(),          //定义显示时间
                visible: false,
                cancel:"取消",
                confirm:"确定",
                time:""
            };
        },
        //监听变化
        activated() {
            console.log("进入了");
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
            // 父控件要加上高度，否则会出现上拉不动的情况
            this.wrapperHeight =
                document.documentElement.clientHeight -
                this.$refs.wrapper.getBoundingClientRect().top;
            window.addEventListener('scroll',this.handleScroll,true)
            // this.value.setDate(this.value.getDate())     //当前日期的前一天
            // console.log(this.value.toLocaleDateString())            //将昨天的日期转为日期字符串形式
            // this.timeStart =this.value.toLocaleDateString()
            // this.timeEnd =new Date()      //当前日期
            // console.log(this.timeEnd.toLocaleDateString())      //将当前日期打印成 年月日
        },
        methods: {
            back() {
                this.$router.go(-1)
            },
            handleScroll(e){
                // this.$refs.wrapper = window
                this.top = this.$refs.wrapper.scrollTop;  //滚动条距离父组件ref= wrapper 的距离高度
                this.current = Math.floor(this.top/120)+1;   //当前第几条数据
            },
            handelGun(){
                this.$refs.wrapper.scrollTo(document.body.scrollHeight, 0)
            },
            //搜索楼号单元号
            handleSearch() {
                this.page = 1
                this.loadFrist();
                console.log(this.floorNO);
                console.log(this.roomNO);
                this.current=0;

            },
            //触发datatime picker 时间面板
            open(picker) {
                this.$refs[picker].open();
            },
            //结束时间按钮
            openpicker(picker) {
                this.$refs[picker].open();
            },
            //时间面板
            handleChange(value) {
                var _this = this;
                this.date = value.toString();
                this.loadFrist();

            },
            handelcancel(cancel){
                var _this = this
                this.timeStart = _this.$store.state.timeStart;
                this.timeEnd = _this.$store.state.timeEnd;
                this.loadFrist();
            },
            reactConfirm(index,event){
                //获取点击索引号
                this.current = index+1;
                //获取点击对象
                return this.current;

            },
            //   下拉刷新
            loadTop() {
                this.page = 1
                this.loadFrist();
            },
            // 上拉加载
            loadBottom() {
                this.page++;
                this.loadMore();
            },
            // 下来刷新加载
            loadFrist() {
                var _this = this
                // this.$http.get('http://222.139.181.213:14000/ChargeSystem/Charge/GetCusBoltSet', {
                this.$http({
                    method: 'post',
                    url:'http://222.139.181.213:14000/ChargeSystem/Charge/GetCusBoltSet',
                    params: {
                        BoltStatus: 4,
                        CommunityID: this.$store.state.communityID,
                        Page: this.page,
                        PageSize: this.pagesize,
                        //选择得时间
                        "OperateBegTime": '',
                        "OperateEndTime": '',
                        "ImplementerBegTime":this.timeStart ,  //this.timeStart
                        "ImplementerEndTime":this.timeEnd ,  //
                        //楼号
                        BuildingNO: this.floorNO,
                        UnitNO: this.roomNO,
                        OrderData:"ImplementerTime desc"
                    }
                })
                    .then(response => {
                        response.data.Data.forEach(function (item) {
                            console.log("已关栓")
                            console.log(item.ImplementerTime)
                            if(item.ImplementerTime == null){}
                            else{
                                item.ImplementerTime = item.ImplementerTime.substr(0,10)+' '+item.ImplementerTime.substr(11,8)
                            }

                        })
                        console.log(this.$store.state.communityID)
                        this.current = 0
                        this.total = response.data.Message
                        if(this.timeStart>this.timeEnd & this.timeEnd!=0){
                            Toast("请选择有效的时间段")
                        }else if(this.total==0){
                            Toast("没有已关栓的用户")
                        }else{
                            _this.$store.state.timeStart=this.timeStart
                            _this.$store.state.timeEnd=this.timeEnd
                            this.page = 1
                        }
                        this.allLoaded = false; // 可以进行上拉
                        this.datas = response.data.Data;
                        this.$refs.loadmore.onTopLoaded();
                        this.allPage = response.data.Message / this.pagesize;
                        this.allPage = Math.floor(this.allPage)+1;
                        return this.allPage
                        return this.total


                    })
                    .catch(error => {
                        console.log(error);
                        alert("网络错误，不能访问");
                    });
            },
            // 加载更多
            loadMore() {
                console.log(this.page);
                // this.$http.get('http://222.139.181.213:14000/ChargeSystem/Charge/GetCusBoltSet', {
                this.$http({
                    method: 'post',
                    url:'http://222.139.181.213:14000/ChargeSystem/Charge/GetCusBoltSet',
                    params: {
                        BoltStatus: 4,
                        CommunityID: this.$store.state.communityID,
                        Page: this.page,
                        PageSize: this.pagesize,
                        //选择得时间
                        "OperateBegTime": '',
                        "OperateEndTime": '',
                        "ImplementerBegTime":this.timeStart ,  //this.timeStart
                        "ImplementerEndTime":this.timeEnd ,  //his.timeEnd
                        //楼号
                        BuildingNO: this.floorNO,
                        UnitNO: this.roomNO,
                        OrderData:"ImplementerTime desc"
                    }
                })
                    .then(response => {
                        // concat数组的追加
                        console.log(response)

                        response.data.Data.forEach(function (item) {
                            console.log(item.ImplementerTime)
                            if(item.ImplementerTime == null){}
                            else{
                                item.ImplementerTime = item.ImplementerTime.substr(0,10)+' '+item.ImplementerTime.substr(11,8)
                            }

                        })

                        if (this.page <= this.allPage) {
                            console.log(this.allPage)
                            console.log(this.page)
                            this.datas = response.data.Data;
                            this.datas = this.datas.concat(response.data.Data);
                            this.$refs.loadmore.onBottomLoaded();
                        }else if( this.page > this.allPage){
                            this.allLoaded = true;// 若数据已全部获取完毕
                            this.$refs.loadmore.onBottomLoaded();
                            Toast("没有更多了")
                        }else{

                        }

                    })
                    .catch(error => {
                        console.log(error);
                        alert("网络错误，不能访问");
                    });
            },

        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-body {
    /* 加上这个才会有当数据充满整个屏幕，可以进行上拉加载更多的操作 */
    overflow: scroll;
  }

  input[type='text'] {
    background-color: #F7F7F7;
    margin: 0;
    text-align: center;
    border: none;
  }

  .time {
    display: flex;
    width: 100%;
    padding: 14px 8.9%;
    background-color: #fff;
    border-bottom: 0.5px solid #999;
    /*flex-direction: ;*/
  }

  .timetext {
    width: 10%;
    text-align: center;

  }

  .time_input {
    width: 82%;
    height: 30px;
    /*margin-left:4%;*/
    display: flex;
    flex-direction: row;
    line-height: 29px;
    vertical-align: middle;
    border-radius: 4px;
  }

  .time-btn {
    width: 45%;
    background-color: #fff;
    background: url("../../static/images/kai/mainPage/date.png") no-repeat 4%;
    background-size: 20px;
    border: 0.5px solid #999;
    height: 30px;
    padding: 0 5px;
  }

  .tmpl {
    touch-action: none;
  }

</style>
