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
    }
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

  },
}

const user = {
  namespaced: true,
  state: () => ({
    // {userName,telNumber,address,postalCode}
    address: uni.getStorageSync('user') ? JSON.parse(uni.getStorageSync('user')) : {},
  }),
  mutations: {
    UPPDATEADD(state, value) {
      state.address = value
      uni.setStorageSync('user', JSON.stringify(state.address))
    }
  }
}

const store = new Vuex.Store({
  modules: {
    cart,
    user
  },
})

export default store