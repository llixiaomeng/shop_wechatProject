<template>
  <view class="addressBox">
    <view class="chooseAdd" v-if="hideAdd">
      <button type="default" @click="chooseAddress">请选择收货地址</button>
    </view>
    <view class="choosedInfo" v-else>
      <view class="left-info">
        <view class="line1">{{myaddress.address}}</view>
        <view class="line2">{{myaddress.userName}}&nbsp&nbsp&nbsp{{myaddress.telNumber}}</view>
      </view>
      <view class="right-icon" @click="chooseAddress">
        <uni-icons type="right" size="30"></uni-icons>
      </view>
    </view>
    <view class="addressBorder">
      <image class="addressBorderImg" src="../../static/cart_border@2x.png" mode="widthFix"></image>
    </view>
  </view>
</template>

<script>
  export default {
    name: "Address",
    props: {
      myaddress: {
        type: Object,
        default: {}
      },
    },
    data() {
      return {
        hideAdd: this.myaddress.address ? false : true
      };
    },
    watch: {
      myaddress: {
        deep: true,
        immediate: true,
        handler(newValue) {
          this.hideAdd = this.myaddress.address ? false : true
        }
      }
    },
    methods: {
      chooseAddress() {
        uni.chooseAddress({
          complete: (e) => {
            if (e.errMsg === "chooseAddress:ok") {
              this.$emit('updateAdd', {
                userName: e.userName,
                telNumber: e.telNumber,
                address: e.provinceName + e.cityName + e.countyName + e.detailInfo,
                postalCode: e.postalCode
              })
            }
            // errMsg: "chooseAddress:ok"
            // errMsg: "chooseAddress:fail cancel"
          },
        })
      }
    }
  }
</script>

<style lang="scss">
  .addressBox {
    font-size: 14px;
    margin: 0 5px;
    padding-left: 5px;

    .chooseAdd {
      padding: 27px;
    }

    .choosedInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100px;

      .line1 {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
      }
    }

    .addressBorder {
      .addressBorderImg {
        width: 100%;
      }
    }
  }
</style>