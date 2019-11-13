<template>
  <div class="kaishuan">
    <mt-header title="未缴费">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
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
          <ul class="mui-table-view mui-grid-view">
            <li v-for="(item,index) in datas" :key="index"
                class="mui-table-view-cell mui-media mui-col-xs-6 bolt_argument" @click="reactConfirm(index,$event)">
              <div class="address"><div class="addressleft"><span class="texttitle">地址：</span></div><div class="addressright">
                <span>{{item.Address}}</span></div></div>
              <div class="model_bottom">
                <div>
                  <div><span class="nametext"><span class="texttitle">姓名：</span>{{item.CusName}}</span><div class="phone"><span class="texttitle">手机号：</span>{{item.Mobile}}</div></div>
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
    import {Toast , Spinner,} from "mint-ui";
    import scrollTop from "../component/scrollTop";
    var _this = this;
    export default {
        name: '',
        components:{
            'my-scrollTop':scrollTop,
        },
        data() {
            return {
                isLoading: true,
                top: 0, //滚动条位置
                total: 0, //列表数据总数
                current: 0, //当前数据列号
                datas: [],
                //可以进行上拉
                allLoaded: false,
                //是否自动触发上拉函数
                isAutoFill: false,
                wrapperHeight: 0,
                courrentPage: 0,
                selected: "no_bolt",
                boltStitic: "no-finish",
                floorNO:"",
                roomNO:"",
                page:1,
                pagesize:"10",
                communityId:1117,
                allPage:0,
                bottomDistance:15,
                timeStart: "",
                timeEnd: "",
                startTime: '',
                endTime: '',
                pickerValue: '',
                boltStatus:0
            }
        },
        //监听变化
        activated() {
            console.log("进入了");
            //获取子组件公用方法
            this.$refs.scrollTop.getIndex();
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
            window.addEventListener('scroll',this.handleScroll,true)
        },
        methods: {
            back() {
                this.$router.go(-1)
            },
            //搜索 楼号 单元号
            handleSearch(){
                this.page = 1
                this.loadFrist();
                _this.isLoading = true;
            },
            //滚动条移动  分页改变
            handleScroll(scrollTop){
                this.top = this.$refs.wrapper.scrollTop;//滚动条距离父组件ref= wrapper 的距离高度
                console.log(this.top)
                this.current = Math.floor(this.top/120)+1;   //当前第几条数据
                console.log(this.current)
            },
            //top置顶
            handelGun(){
                this.$refs.wrapper.scrollTo(document.body.scrollHeight, 0)
                console.log(this.top)
            },
            // 下拉刷新
            loadTop() {
                this.page = 1
                this.loadFrist();  //第一次加载
                _this.isLoading = true;

            },
            // 上拉加载
            loadBottom() {
                this.page++
                this.loadMore();
            },
            reactConfirm(index,event){
                //获取点击索引号
                this.current = index+1;
                //获取点击对象
                return this.current;
            },
            // 下来刷新加载
            loadFrist() {
                var _this = this
                // this.$http.
                // get('http://222.139.181.213:14000/ChargeSystem/Charge/GetCusBoltSet', {
                this.$http({
                    method: 'post',
                    url:'http://222.139.181.213:14000/ChargeSystem/Charge/GetCusBoltSet',
                    params: {
                        BoltStatus:0,
                        CommunityID:_this.$store.state.communityID,
                        Page: this.page,
                        PageSize: this.pagesize,
                        "OperateBegTime": '',
                        "OperateEndTime": '',
                        "ImplementerBegTime":'',  //this.timeStart
                        "ImplementerEndTime":'' ,  //
                        BuildingNO: this.floorNO,
                        UnitNO: this.roomNO,
                        OrderData:"Address"
                    },

                })
                    .then(response => {
                        this.current = 0;
                        this.total = response.data.Message
                        if(this.total==0){
                            Toast("无未缴费用户")
                        }
                        console.log(response)
                        this.allLoaded = false; // 可以进行上拉
                        this.datas = response.data.Data;
                        this.$refs.loadmore.onTopLoaded();    //上拉刷新  之后显示数据
                        //一共多少个分页
                        this.allPage = response.data.Message / this.pagesize;
                        this.allPage = Math.floor(this.allPage)+1;
                        return this.allPage
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
                // this.$http.
                // get('http://222.139.181.213:14000/ChargeSystem/Charge/GetCusBoltSet', {

                this.$http({
                    method: 'post',
                    url:'http://222.139.181.213:14000/ChargeSystem/Charge/GetCusBoltSet',
                    params: {
                        BoltStatus:0,
                        CommunityID:_this.$store.state.communityID,
                        Page: this.page,
                        PageSize: this.pagesize,
                        "OperateBegTime": '',
                        "OperateEndTime": '',
                        "ImplementerBegTime":'',  //this.timeStart
                        "ImplementerEndTime":'',
                        BuildingNO: this.floorNO,
                        UnitNO: this.roomNO,
                        OrderData:"Address"
                    }
                })
                    .then(response => {
                        // concat数组的追加
                        if (this.page <= this.allPage) {
                            console.log(this.allPage)
                            console.log(this.Page)
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
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-body {
    /* 加上这个才会有当数据充满整个屏幕，可以进行上拉加载更多的操作 */
    overflow: scroll;
  }
  input[type='text']{
    background-color: #F7F7F7;
    margin:0;
    text-align: center;
    border:none;
  }
</style>
