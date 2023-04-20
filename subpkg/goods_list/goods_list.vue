<template>
  <view class="page">
    <navigator class="goodsItem" v-for="goodsItem in goodsList" :key="goodsItem.goods_id"
      :url="'../goods_detail/goods_detail?goods_id='+goodsItem.goods_id">
      <view class="left-img">
        <image :src="goodsItem.goods_small_logo || defaultImg" mode="widthFix" class="goods-img"></image>
      </view>
      <view class="goods-info">
        <text class="name">{{goodsItem.goods_name}}</text>
        <text class="price">￥ {{goodsItem.goods_price | priceForm}}</text>
      </view>
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
        defaultImg: '../../static/failedimage.jpg',
        goodsList: [],
        isLoading: false
      }
    },
    filters: {
      priceForm(price) {
        return price.toFixed(2)
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
      },
      toGoodsDetail(goodsId) {

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
  }

  .goodsItem {
    display: flex;
    margin: 0 10px;
    padding: 10px 5px;
    border-bottom: 1px #c0c0c0 solid;

    .left-img {
      margin-right: 10px;

      .goods-img {
        width: 110px;
        display: block;
      }
    }

    .goods-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        font-size: 14px;
      }

      .price {
        font-size: 16px;
        color: #C00000;
      }
    }
  }
</style>