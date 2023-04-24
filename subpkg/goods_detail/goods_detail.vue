<template>
  <view>
    <view v-if="goodsInfo.goods_price!==undefined">
      <swiper class="scroll-Pics" :circular="true" :autoplay="true" indicator-dots interval="1500"
        v-if="goodsInfo.pics.length>0">
        <swiper-item v-for="(pic,index) in goodsInfo.pics" :key="index">
          <image :src="pic.pics_mid" mode="heightFix" @click="preview(index)"></image>
        </swiper-item>
      </swiper>
      <view class="no-scroll" v-else>
        <image class="no-scroll-img" :src="defaultImg" mode="heightFix"></image>
      </view>

      <view class="goods-info">
        <view class="goods-price">￥ {{goodsInfo.goods_price}}</view>
        <view class="detail-title">
          <text>{{goodsInfo.goods_name}}</text>
          <view class="starornot" v-if="star===false">
            <uni-icons type="star" size="20"></uni-icons>
            <view>收藏</view>
          </view>
          <view class="starornot" v-else>
            <uni-icons type="star-filled" size="20"></uni-icons>
            <view>已收藏</view>
          </view>
        </view>
        <view class="express">快递：免运费</view>
      </view>

      <rich-text class="goods-detail" :nodes="goodsInfo.goods_introduce"></rich-text>
    </view>

    <!-- 导航区 -->
    <uni-goods-nav :fill="true" :options="options" :button-group="customButtonGroup" @click="onClick"
      @buttonClick="buttonClick" />
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'

  export default {
    data() {
      return {
        goodsId: 0,
        goodsInfo: {},
        star: true,
        defaultImg: '../../static/failedimage.jpg',
        // 导航数据
        options: [{
          icon: 'shop',
          text: '店铺',
          // info: 2,
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        customButtonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ],
      }
    },
    methods: {
      ...mapMutations('cart', ['ADDGOODS']),
      async getDetail() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id: this.goodsId
        })
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ')
        this.goodsInfo = res.message
      },
      preview(i) {
        uni.previewImage({
          current: i,
          urls: this.goodsInfo.pics.map(x => x.pics_big)
        })
      },
      onClick(e) { // 左侧
        if (e.content.text === '购物车') uni.switchTab({
          url: '../../pages/cart/cart'
        })
        //点击店铺呢
      },
      buttonClick(e) {
        if (e.content.text === '加入购物车') {
          // console.log(this.goodsInfo)
          this.ADDGOODS({
            goods_id: this.goodsId,
            goods_name: this.goodsInfo.goods_name,
            goods_price: this.goodsInfo.goods_price,
            goods_count: 1,
            goods_small_logo: this.goodsInfo.pics[0]?.pics_sma_url ? this.goodsInfo.pics[0].pics_sma_url : this
              .defaultImg,
            goods_state: true
          })
        }
        //点击立即购买？
        // this.options[1].info++
      }
    },
    computed: {
      ...mapGetters('cart', ['sum'])
    },
    watch: {
      sum: {
        immediate: true,
        handler(newValue) {
          this.options[1].info = newValue
        }
      }
    },
    onLoad(options) {
      this.goodsId = options.goods_id
      this.getDetail()
    }
  }
</script>

<style lang="scss">
  .scroll-Pics {
    height: 240px;

    swiper-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .no-scroll {
    display: flex;
    justify-content: center;
    align-items: center;

    .no-scroll-img {
      height: 240px;
    }
  }

  .goods-info {
    padding: 10px;

    .goods-price {
      color: #C00000;
      font-size: 20px;
    }

    .detail-title {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;

      .starornot {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 90px;
        padding-left: 5px;
        border-left: 1px solid #c7c7c7;
        font-size: 14px;
        color: #8a8a8a;
      }
    }

    .express {
      font-size: 14px;
      color: #8a8a8a;
    }
  }

  .uni-goods-nav {
    // position: sticky;
    // bottom: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>