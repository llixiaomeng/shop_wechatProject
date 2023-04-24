<template>
  <view>
    <view class="notLogin" v-if="myinfo.nickName? false:true">
      <view>
        <image class="grayImg" mode="widthFix" src="../../static/tab_icons/my.png"></image>
      </view>
      <button class="notLoginBtn" type="warn" @click="login">一键登录</button>
      <view class="notLoginText">登陆后尽享更多权益</view>
    </view>

    <view class="login" v-else>
      <view class="user">
        <view>
          <image class="userimg" mode="widthFix" :src="myinfo.avatarUrl"></image>
        </view>
        <view class="username">{{myinfo.nickName}}</view>
      </view>
      <view class="panel1">
        <view class="panel1-options">
          <text>{{0}}</text>
          <text>收藏的店铺</text>
        </view>
        <view class="panel1-options">
          <text>{{0}}</text>
          <text>收藏的商品</text>
        </view>
        <view class="panel1-options">
          <text>{{0}}</text>
          <text>关注的商品</text>
        </view>
        <view class="panel1-options">
          <text>{{0}}</text>
          <text>足迹</text>
        </view>
      </view>
      <view class="panel2">
        <view class="panel2-title">我的订单</view>
        <view class="panel2-options">
          <view class="option">
            <uni-icons color="#C00000" type="wallet-filled" size="40"></uni-icons>
            <text>待付款</text>
          </view>
          <view class="option">
            <uni-icons color="#C00000" type="notification" size="40"></uni-icons>
            <text>待收货</text>
          </view>
          <view class="option">
            <uni-icons color="#C00000" type="reload" size="40"></uni-icons>
            <text>退款/退货</text>
          </view>
          <view class="option">
            <uni-icons color="#C00000" type="cart-filled" size="40"></uni-icons>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <view class="panel3">
        <view class="panel3-options">
          <text>收货地址</text>
          <uni-icons type="right" size="20"></uni-icons>
        </view>
        <view class="panel3-options">
          <text>联系客服</text>
          <uni-icons type="right" size="20"></uni-icons>
        </view>
        <view class="panel3-options" @click="logout">
          <text>退出登录</text>
          <uni-icons type="right" size="20"></uni-icons>
        </view>
      </view>
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
        myinfo: {}
      };
    },
    methods: {
      ...mapMutations('user', ['SETUSERINFO', 'SETTOKEN', 'SETREDINFO']),
      login() {
        uni.getUserProfile({
          desc: '测试',
          success: (e) => {
            this.SETUSERINFO(e.userInfo)
            this.getUserToken(e)
          },
          fail: (e) => {
            // {errMsg: "getUserProfile:fail auth deny"}
            uni.$showMsg('登陆失败！')
          }
        })
      },
      async getUserToken(getTokenQuery) {
        const [err, res] = await uni.login()
        const query = {
          encryptedData: getTokenQuery.encryptedData,
          rawData: getTokenQuery.rawData,
          iv: getTokenQuery.iv,
          signature: getTokenQuery.signature,
          code: res.code
        }
        const tokenres = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // this.SETTOKEN(tokenres.message.token)
        this.SETTOKEN(
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
        )
        this.navigateBack()
      },
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.opentype === "switchTab") {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.SETREDINFO({})
            }
          })
        }
      },
      logout() {
        uni.showModal({
          content: '确认退出吗？',
          success: (e) => {
            if (e.confirm) {
              uni.clearStorageSync()
              this.myinfo = {}
            } else {
              return
            }
          }
        })
      },

    },
    mixins: [tarbarMix],
    computed: {
      // ...mapGetters('user', []),
      ...mapState('user', ['userInfo', 'token', 'redirectInfo'])
    },
    watch: {
      userInfo: {
        deep: true,
        immediate: true,
        handler(newVal) {
          this.myinfo = newVal
        }
      }
    }

  }
</script>

<style lang="scss">
  .notLogin {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 160px 0;
    background-color: white;

    .grayImg {
      width: 60px;
    }

    .notLoginBtn {
      margin: 20px 0;
    }

    .notLoginText {
      font-size: 14px;
      color: #c7c7c7;
    }
  }

  .login {
    width: 100%;

    .user {
      padding-top: 60px;
      background-color: #C00000;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;

      .userimg {
        width: 60px;
      }

      .username {
        margin-top: 10px;
        color: white;
        font-size: 20px;
      }
    }

    .panel1 {
      display: flex;
      margin: -8px 8px 0 8px;
      padding: 6px;
      justify-content: space-between;
      background-color: white;

      .panel1-options {
        padding: 0 10px;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    .panel2 {
      margin: 6px 8px;
      padding: 10px;
      background-color: white;

      .panel2-options {
        padding: 10px 10px 0 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .option {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }

    .panel3 {
      margin: 6px 8px;
      padding: 0 10px;
      background-color: white;

      .panel3-options {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px 0;
      }
    }
  }
</style>