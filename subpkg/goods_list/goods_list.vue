<template>
  <view class="page">
    <view class="emptyGoodsList" v-if="goodsList.length===0">
      <view>
        <image class="noresultImg" src="../../static/noSearchResult.png" mode="widthFix"></image>
      </view>
      <view class="noresultWord">暂无相关内容，换个关键词再试试吧！</view>
    </view>

    <navigator v-else class="goodsItem" v-for="goodsItem in goodsList" :key="goodsItem.goods_id"
      :url="'../goods_detail/goods_detail?goods_id='+goodsItem.goods_id">
      <GoodsItem :goodsItem="goodsItem"></GoodsItem>
    </navigator>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        requestObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        total: 0,
        goodsList: [],
        isLoading: false
      }
    },
    methods: {
      async getGoodsList(cb) {
        if (this.isLoading) {
          return
        } else {
          this.isLoading = true
          uni.showLoading({
            title: '加载更多商品中...'
          })
          const {
            data: res
          } = await uni.$http.get('/api/public/v1/goods/search', this.requestObj)
          this.goodsList = [...this.goodsList, ...res.message.goods]
          this.requestObj.pagenum += 1
          this.total = res.message.total

          cb && cb()
          uni.hideLoading()
          this.isLoading = false
        }
      }
    },
    onReachBottom() {
      if (this.goodsList.length >= this.total) {
        uni.showToast({
          title: '没有更多啦！',
          duration: 1500
        })
        return
      }
      this.getGoodsList()
    },
    onPullDownRefresh() {
      this.requestObj.pagenum = 1
      this.goodsList = []
      this.getGoodsList()
      uni.stopPullDownRefresh(() => uni.stopPullDownRefresh())
    },
    onLoad(options) {
      if (options.query) this.requestObj.query = options.query
      if (options.cid) this.requestObj.cid = options.cid

      this.getGoodsList()
    }
  }
</script>

<style lang="scss">
  .page {
    background-color: white;

    .emptyGoodsList {
      margin: 120px auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      .noresultImg {
        width: 160px;
      }

      .noresultWord {
        color: #c7c7c7;
      }
    }
  }
</style>