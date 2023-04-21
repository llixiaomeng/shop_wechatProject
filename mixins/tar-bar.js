 import {
   mapGetters
 } from 'vuex'

 export default {
   computed: {
     ...mapGetters('cart', ['sum'])
   },
   methods: {
     setCartBadge() {
       if (this.sum !== 0) {
         uni.setTabBarBadge({
           index: 2,
           text: `${this.sum}`
         })
       }
     }
   },
   watch: {
     sum: {
       immediate: true,
       handler(newValue) {
         this.setCartBadge()
       }
     }
   },
   onShow() {
     this.setCartBadge()
   }
 }