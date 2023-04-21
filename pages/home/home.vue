<template>
  <view>
    <Search class="searchBox" @click="toSearchPage"></Search>
    <swiper :circular="true" :autoplay="true" indicator-dots interval="1500">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator :url="'../../subpkg/goods_detail/goods_detail?goods_id='+item.goods_id" class="swiperitem">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区 -->
    <view class="category">
      <view v-for="item,i in categoryList" :key="i" class="cateitem" @click="gotoCate(item)">
        <image :src="item.image_src" mode="widthFix"></image>
      </view>
    </view>
    <!-- 楼层区 -->
    <view v-for="item,i in floorList" :key="i">
      <view class="floorTitle">
        <image :src="item.floor_title.image_src" mode="widthFix"></image>
      </view>
      <view class="floorPic">
        <view class="floor-img-left">
          <navigator :url="item.product_list[0].navigator_url">
            <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}"
              mode="widthFix"></image>
          </navigator>
        </view>
        <view class="floor-img-right">
          <navigator v-for="prod,index in item.product_list" :key="index" :url="prod.navigator_url" v-if="index!==0">
            <image :style="{width:prod.image_width+'rpx'}" :src="prod.image_src" mode="widthFix">
            </image>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import tarbarMix from "../../mixins/tar-bar.js"

  export default {
    mixins: [tarbarMix],
    data() {
      return {
        swiperList: [],
        categoryList: [],
        floorList: []
      };
    },
    methods: {
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) {
          return uni.$showMsg()
          // return uni.showToast({
          //   title: '数据请求失败！',
          //   duration: 1500,
          //   icon: 'none',
          // })
        }
        this.swiperList = res.message
      },
      async getCategoryList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        this.categoryList = res.message
      },
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        // message的每一项flooritem：flooritem.product_list是数组，数组内每一项的navigator_url都要变
        res.message.forEach((flooritem) => {
          flooritem.product_list.forEach((prod) => {
            prod.navigator_url = '../../subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      gotoCate(item) {
        if (item.name === '分类') uni.switchTab({
          url: '../../pages/cate/cate'
        })
      },
      toSearchPage() {
        uni.navigateTo({
          url: '../../subpkg/searchPage/searchPage'
        })
      }
    },
    onLoad() {
      this.getSwiperList()
      this.getCategoryList()
      this.getFloorList()
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiperitem,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .category {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 14rpx 0;

    .cateitem {
      width: 20%;
    }

    image {
      width: 100%;
    }
  }

  .floorTitle {
    width: 40%;
  }

  .floorPic {
    display: flex;
    margin-left: 10rpx;
  }

  .floor-img-right {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .searchBox {
    position: sticky;
    top: 0;
    z-index: 999;
  }
</style>