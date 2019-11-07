<template>
    <div class="toolbar">
        <div class="backTop" @click="top()"></div>
        <div class="total">
            <div class="current">{{current}}</div>
            <div>{{total}}</div>
        </div>
    </div>
</template>
<script>
    //引入mint-ui插件
    import {
        MessageBox,
        TabContainer,
        TabContainerItem,
        Toast,
        Loadmore,
        Spinner,
        Popup
    } from "mint-ui";

import Vuex from 'vuex'
    var choosed = "wait_for_reply";
    var fromPath = ""

    export default {
  data() {
    return {

    };
  },
  props: ["total", "current"],
  mounted() {
  },
  methods: {
      top(){

          this.$parent.handelGun();


      },
    //获取元素

    getDocument() {
      var _document = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        _document = document.documentElement;
      } else if (document.body) {
        _document = document.body;
      }
      return _document;
    },
    //获取当前index
    getIndex() {
      var _this = this;
      window.onscroll = function() {
        var top = _this.getDocument().scrollTop;
        var listIndex = Math.floor(top / 120) + 1;
        if(_this.total == 0){
          _this.current = 0
        }else{
          _this.current = listIndex
        }
        console.log(listIndex)
        return listIndex;
      };
    }
  }
};
</script>
<style scoped>
.toolbar {
  position: fixed;
  min-width:0.45rem;
  height: 0.85rem;
  right: 0.15rem;
  bottom: 1.5rem;
  text-align: center;
}
/* 媒体查询 */
/* 图标样式 */
@media only screen and (max-device-width: 413px) {
  /*iPhone 6 Portrait*/
  .backTop {
    background: url('../../static/images/kai/mainPage/scrolltop@1.5x.png') no-repeat
      center;
  }
}

@media only screen and (min-device-width: 414px) {
  /*iPhone 6+ Portrait*/
  .backTop {
    background: url('../../static/images/kai/mainPage/scrolltop@1.5x.png')
      no-repeat center;
  }
}
.backTop {
  width: 100%;
  height: 0.3rem;
  background-size: 0.18rem;
  margin-bottom: 0.1rem;
}

.total {
  border-radius: 50%;
  background-color: #49a9ea;
  font-size: 0.12rem;
  padding: 0 0.07rem;
}

.total > div {
  height: 0.22rem;
  line-height: 0.22rem;
}

.current {
  color: #fff;
  border-bottom: 0.01rem solid #fff;
}
</style>
