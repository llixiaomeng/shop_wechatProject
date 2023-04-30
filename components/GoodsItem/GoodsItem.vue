<template>
  <view class="goodsItem">
    <view class="radio" v-if="showRadio" @click.stop="emitStateChange(goodsItem.goods_id)">
      <radio :value="goodsItem.value" :checked="goodsItem.goods_state" color="#C00000" style="transform:scale(0.8)" />
    </view>
    <!-- <navigator :url="'../../subpkg/goods_detail/goods_detail?goods_id='+goodsItem.goods_id" class="imgAndInfo"> -->
    <view class="left-img">
      <image :src="goodsItem.goods_small_logo || defaultImg" mode="widthFix" class="goods-img"></image>
    </view>
    <view class="goods-info">
      <text class="name">{{goodsItem.goods_name}}</text>
      <text class="price">￥ {{goodsItem.goods_price | priceForm}}</text>
      <view v-if="showNumBox" class="numBox">
        <uni-number-box :value="goodsItem.goods_count" :min="1" background="#f0f0f0" @change="emitChangeNum" />
      </view>
    </view>
    <!-- </navigator> -->
  </view>
</template>

<script>
  export default {
    name: "GoodsItem",
    props: {
      goodsItem: {
        type: Object
      },
      showRadio: {
        type: Boolean,
        default: false
      },
      showNumBox: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        defaultImg: '../../static/failedimage.jpg',
      };
    },
    methods: {
      emitStateChange(itemId) {
        this.$emit('changeState', itemId)
      },
      emitChangeNum(value) {
        this.$emit('changeNum', {
          goods_id: this.goodsItem.goods_id,
          goods_count: value
        })
      }
    },
    filters: {
      priceForm(price) {
        return price.toFixed(2)
      }
    },
  }
</script>

<style lang="scss">
  .goodsItem {
    display: flex;
    margin: 0 10px;
    padding: 10px 5px;
    border-bottom: 1px #c0c0c0 solid;
    // align-items: center;

    .radio {
      margin: auto 0;
    }

    // .imgAndInfo {
    // display: flex;

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
      position: relative;

      .name {
        font-size: 14px;
      }

      .price {
        font-size: 16px;
        color: #C00000;
      }

      .numBox {
        position: absolute;
        bottom: 0;
        right: 0;
        // height: 50px;
        // width: 50px;
      }
    }

    // }

  }
</style>