<template>
  <view class="page">
    <view class="emptyCart" v-if="cartList.length===0">
      <image class="emptyCartImg" mode="widthFix" src="../../static/cart_empty@2x.png"></image>
      <text>购物车空空如也~</text>
    </view>
    <view class="notEmpty" v-else>
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
            <uni-swipe-action-item :right-options="options" @click="swipeClick($event,goodsItem)" :autoClose="true">
              <navigator :url="'../../subpkg/goods_detail/goods_detail?goods_id='+goodsItem.goods_id">
                <GoodsItem :goodsItem="goodsItem" :showRadio="true" :showNumBox="true" @changeState="changeState"
                  @changeNum="changeNum"></GoodsItem>
              </navigator>
            </uni-swipe-action-item>
          </uni-swipe-action>
        </block>
      </view>
    </view>

    <!-- 结算 -->
    <view class="payBar">
      <view class="allRadio" @click="doAllChecked">
        <radio :checked="allChecked" color="#C00000" style="transform:scale(0.8)" />
        <view>全选</view>
      </view>
      <view class="sumPrice">合计：<text class="redPrice">￥ {{choosedPrice | priceForm}}</text></view>
      <view class="sumBtn" @click="payment">结算（{{choosed}}）</view>
    </view>
  </view>
</template>

<script>
  import tarbarMix from "../../mixins/tar-bar.js"
  import {
    mapMutations,
    mapState,
    mapGetters
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
        allChecked: true,
        jumpSeconds: 3
      };
    },
    methods: {
      ...mapMutations('cart', ['CHANGESTATE', 'CHANGENUM', 'DELETEGOODS', 'ALLRADIO']),
      ...mapMutations('user', ['UPPDATEADD', 'SETREDINFO']),
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
      },
      doAllChecked() {
        if (this.allChecked) {
          this.ALLRADIO(false)
        } else(
          this.ALLRADIO(true)
        )
      },
      payment() {
        if (!this.choosed) return uni.$showMsg('请选择商品进行结算！')
        if (!this.address.address) return uni.$showMsg('请填写地址！')
        if (!this.userInfo.nickName) {
          return this.autoJumpLogin()
        }
        this.createOrders()
      },
      autoJumpLogin() {
        uni.showToast({
          title: `未登录！${this.jumpSeconds--}秒后自动跳转到登录页!`,
          duration: 1500,
          icon: 'none',
          mask: true
        })
        if (this.jumpSeconds >= 0) {
          setTimeout(() => {
            this.autoJumpLogin()
          }, 1000)
        } else { //jump and reset
          this.jumpSeconds = 3
          this.SETREDINFO({
            from: '../cart/cart',
            opentype: 'switchTab'
          })
          uni.switchTab({
            url: '../my/my'
          })
        }
      },
      async createOrders() {
        const orderInfo = {
          // order_price: this.choosedPrice, 开发时写死
          order_price: 0.01,
          consignee_addr: this.address,
          goods: this.orderGoods
        }
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！请稍后再试！')

        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: res.order_number
        })
        if (res2.meta.status !== 200) return uni.$showMsg('创建订单失败！请稍后再试！')

        const [err1, succ1] = await uni.getProvider({
          service: 'payment',
        })
        if (err1) return uni.$showMsg('支付失败！')

        const [err2, succ2] = await uni.requestPayment({
          provider: succ1.provider[0],
          orderInfo: orderInfo,
          timeStamp: res2.message.pay.timeStamp,
          nonceStr: res2.message.pay.nonceStr,
          package: res2.message.pay.package,
          signType: res2.message.pay.signType,
          paySign: res2.message.pay.paySign
        })
        if (err2) return uni.$showMsg('订单未支付')

        // // 不理解？
        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: res.order_number
        })
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付')
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })
      }
    },
    mixins: [tarbarMix],
    computed: {
      ...mapState('cart', ['cart']),
      ...mapGetters('cart', ['sum', 'choosed', 'choosedPrice', 'orderGoods']),
      ...mapState('user', ['address', 'userInfo'])
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
      },
      choosed: {
        immediate: true,
        handler(newValue) {
          if (this.sum === newValue) {
            this.allChecked = true
          } else {
            this.allChecked = false
          }
        }
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
  .page {
    background-color: white;
    padding-bottom: 50px;
  }

  .emptyCart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .emptyCartImg {
      width: 80px;
      margin-bottom: 20px;
    }
  }

  .cartlist-title {
    display: flex;
    padding: 10px 0;
    margin: 0 5px;
    border-bottom: 1px solid #c7c7c7;

    view {
      margin-left: 4px;
    }
  }

  .payBar {
    background-color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;

    .allRadio {
      margin-left: 15px;
      display: flex;
    }

    .redPrice {
      color: #C00000;
    }

    .sumBtn {
      background-color: #C00000;
      line-height: 50px;
      padding: 0 20px;
      color: white;
    }
  }
</style>