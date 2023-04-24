import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const cart = {
  namespaced: true,
  state: () => ({
    // 购物车数组，存储购物车中每个商品的信息对象
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: uni.getStorageSync('mycart') ? JSON.parse(uni.getStorageSync('mycart')) : [],
  }),
  mutations: {
    ADDGOODS(state, value) {
      // 判断购物车里有没有goodsid相同，有则+1，无则push
      const findresult = state.cart.find((goods) => {
        return goods.goods_id === value.goods_id
      })
      console.log(findresult)
      // console.log(value)
      if (findresult) {
        findresult.goods_count += 1
      } else {
        state.cart.push(value)
      }
      uni.setStorageSync('mycart', JSON.stringify(state.cart))
    },
    CHANGESTATE(state, goodsId) {
      const findresult = state.cart.find((goods) => {
        return goods.goods_id === goodsId
      })
      findresult.goods_state = !findresult.goods_state
      uni.setStorageSync('mycart', JSON.stringify(state.cart))
    },
    CHANGENUM(state, goodsObj) {
      const findresult = state.cart.find((goods) => {
        return goods.goods_id === goodsObj.goods_id
      })
      findresult.goods_count = goodsObj.goods_count
      uni.setStorageSync('mycart', JSON.stringify(state.cart))
    },
    DELETEGOODS(state, value) {
      const deleteIndex = state.cart.findIndex((goods) => {
        return goods.goods_id === value.goods_id
      })
      state.cart.splice(deleteIndex, 1)
      uni.setStorageSync('mycart', JSON.stringify(state.cart))
    },
    ALLRADIO(state, boolen) {
      state.cart.forEach((goods) => {
        goods.goods_state = boolen
      })
    },

  },
  getters: {
    sum(state) {
      //遍历cart的各元素goods_count
      let sumnum = 0
      if (state.cart) {
        state.cart.forEach((goods) => {
          sumnum += goods.goods_count
        })
      }
      return sumnum
    },
    choosed(state) {
      let choosed = 0
      if (state.cart) {
        state.cart.forEach((goods) => {
          if (goods.goods_state) {
            choosed += goods.goods_count
          }
        })
      }
      return choosed
    },
    choosedPrice(state) {
      let choosedPrice = 0
      if (state.cart) {
        state.cart.forEach((goods) => {
          if (goods.goods_state) {
            choosedPrice += goods.goods_count * goods.goods_price
          }
        })
      }
      return choosedPrice
    },
    orderGoods(state) {
      const payment = []
      state.cart.forEach((goods) => {
        if (goods.state) {
          payment.push({
            goods_id: goods.goods_id,
            goods_number: goods.goods_count,
            goods_price: goods.goods_price
          })
        }
      })
      return payment
    }
  },
}

const user = {
  namespaced: true,
  state: () => ({
    // {userName,telNumber,address,postalCode}
    address: uni.getStorageSync('address') ? JSON.parse(uni.getStorageSync('address')) : {},
    token: uni.getStorageSync('mytoken') ? JSON.parse(uni.getStorageSync('mytoken')) : '',
    // avatarUrl, gender: 0, language: "zh_CN", nickName
    userInfo: uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {},
    // from：url, opentype：way
    redirectInfo: {}
  }),
  mutations: {
    UPPDATEADD(state, value) {
      state.address = value
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    SETUSERINFO(state, value) {
      state.userInfo = value
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    },
    SETTOKEN(state, value) {
      state.token = value
      uni.setStorageSync('mytoken', JSON.stringify(state.token))
    },
    SETREDINFO(state, value) {
      state.redirectInfo = value
    },
  }
}
const store = new Vuex.Store({
  modules: {
    cart,
    user
  },
})

export default store