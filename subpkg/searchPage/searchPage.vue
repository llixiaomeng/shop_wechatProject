<template>
  <view class="searchPage" :style="{height:windowHeight+'px', backgroundColor: 'white'}">
    <uni-search-bar @confirm="search" :focus="true" v-model="searchValue" @input="input" cancelButton="none" radius="16"
      @change="change"></uni-search-bar>

    <!-- 建议列表 -->
    <view class="suggestList">
      <navigator :url="'../goods_detail/goods_detail?goods_id='+suggItem.goods_id" class="sugg-item"
        v-for="suggItem in suggestList" :key="suggItem.goods_id">
        <text class="sugg-item-words">{{suggItem.goods_name}}</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </navigator>
    </view>

    <!-- 历史记录：建议列表不存在or为空 -->
    <view class="historyList" v-show="!suggestList || suggestList.length===0 ">
      <view class="list-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="20" @click="clearHistory"></uni-icons>
      </view>
      <view class="his-list-item">
        <uni-tag v-for="hisItem,index in historyList" :key="index" :text="hisItem" @click="clickHistory(hisItem)"
          :inverted="true"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        windowHeight: 0,
        searchValue: '',
        timer: null,
        suggestList: [],
        historyList: uni.getStorageSync('searchHistory') ? JSON.parse(uni.getStorageSync('searchHistory')) : []
      };
    },
    methods: {
      input(value) {
        if (value.trim().length === 0) {
          this.suggestList = []
          return
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getSuggestList()
        }, 500)
      },
      search(e) {
        this.saveHistory(e.value)
        this.searchValue = ''
        setTimeout(() => {
          // 跳转到商品列表
          uni.navigateTo({
            url: '../../subpkg/goods_list/goods_list?query=' + e.value
          })
        }, 0)
      },
      clickHistory(hisItem) {
        // 点击项在历史list变第一；跳转
        this.saveHistory(hisItem)
        setTimeout(() => {
          // 跳转到商品列表
          uni.navigateTo({
            url: '../../subpkg/goods_list/goods_list?query=' + hisItem
          })
        }, 0)
      },
      async getSuggestList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch?query=' + this.searchValue)
        // console.log(res)
        this.suggestList = res.message
      },
      saveHistory(kw) {
        this.historyList.unshift(kw)
        this.historyList = [...new Set(this.historyList)]
        uni.setStorageSync('searchHistory', JSON.stringify(this.historyList))
      },
      clearHistory() {
        // 清除本地存储&数据
        uni.clearStorageSync()
        this.historyList = []
      }
    },
    async onLoad() {
      const res = await uni.getWindowInfo()
      this.windowHeight = res.windowHeight
      //历史记录存储永久化。问题：最开始key在本地无存储，得不到。
      // if (uni.getStorageSync('searchHistory')) {
      //   this.historyList = JSON.parse(uni.getStorageSync('searchHistory'))
      // }
    },
  }
</script>

<style lang="scss">
  // .searchPage {
  // }

  .suggestList {
    .sugg-item {
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      background-color: white;
      font-size: 14px;
      padding: 0 10px;

      text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 0 5px;
      }
    }
  }

  .historyList {
    .list-title {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px lightgrey solid;
      line-height: 40px;
      margin: 0 5px;
      font-size: 14px;
    }

    .his-list-item {
      margin: 10px 5px;

      uni-tag {
        margin: 0 5px;
      }
    }
  }
</style>