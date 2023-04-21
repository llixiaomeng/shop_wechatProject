<template>
  <view>
    <!-- 收货地址区 -->
    <Address :myaddress="myaddress" @updateAdd="updateAdd"></Address>
    <!-- 商品列表 -->
    <view class="cartlist-title">
      <uni-icons type="shop" size="20"></uni-icons>
      <view>购物车</view>
    </view>
    <view class="cartlist">
      <block v-for="goodsItem,i in cartList" :key="i">
        <uni-swipe-action>
          <uni-swipe-action-item :right-options="options" @click="swipeClick($event,goodsItem)">
            <GoodsItem :goodsItem="goodsItem" :showRadio="true" :showNumBox="true" @changeState="changeState"
              @changeNum="changeNum"></GoodsItem>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </block>
    </view>
  </view>
</template>

<script>
  import tarbarMix from "../../mixins/tar-bar.js"
  import {
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    data() {
      return {
        cartList: [],
        myaddress: {},
        options: [{
          text: '取消',
          style: {
            backgroundColor: '#007aff'
          }
        }, {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }],

      };
    },
    methods: {
      ...mapMutations('cart', ['CHANGESTATE', 'CHANGENUM', 'DELETEGOODS']),
      ...mapMutations('user', ['UPPDATEADD']),
      changeState(itemId) {
        this.CHANGESTATE(itemId)
      },
      changeNum(obj) {
        this.CHANGENUM(obj)
      },
      swipeClick(e, goodsItem) {
        if (e.content.text === '删除') {
          this.DELETEGOODS(goodsItem)
        }
      },
      updateAdd(userObj) {
        this.UPPDATEADD(userObj)
      }
    },
    mixins: [tarbarMix],
    computed: {
      ...mapState('cart', ['cart']),
      ...mapState('user', ['address'])
    },
    watch: {
      cart: {
        immediate: true,
        deep: true,
        handler(newValue) {
          this.cartList = newValue
        }
      },
      address: {
        immediate: true,
        deep: true,
        handler(newValue) {
          this.myaddress = newValue
        }
      }
    },
  }
</script>

<style lang="scss">
  .cartlist-title {
    display: flex;
    padding: 10px 0;
    margin: 0 5px;
    border-bottom: 1px solid #c7c7c7;

    view {
      margin-left: 4px;
    }
  }
</style>