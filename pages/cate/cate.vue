<template>
  <view>
    <Search @click="toSearchPage" class="searchBox"></Search>
    <view class="category">
      <!-- 左侧一级 -->
      <scroll-view scroll-y="true" class="cate-first" :style="{height: windowHeight+'px'}" enable-flex="true">
        <view v-for="cate1Item in cateList" :key="cate1Item.cat_id"
          :class="['cate-first-item',active===cate1Item.cat_id?'active':'']" @click="changeCate1(cate1Item)">
          {{cate1Item.cat_name}}
        </view>
      </scroll-view>
      <!-- 右侧二三级 -->
      <scroll-view scroll-y="true" :scroll-top="scrollTop" :style="{height: windowHeight+'px'}" enable-flex="true"
        class="right-box">
        <view v-for="cate2Item in cate2List" :key="cate2Item.cat_id" class="cate-sec-third">
          <!-- 二级名称 -->
          <text class="cate-sec">/ {{cate2Item.cat_name}} /</text>
          <!-- 三级类别 -->
          <view class="cate-third">
            <view class="cate-third-item" v-for="cate3Item in cate2Item.children" :key="cate3Item.cat_id"
              @click="toGoodList(cate3Item.cat_id)">
              <image src="https://api-ugo-web.itheima.net/full/2fb113b32f7a2b161f5ee4096c319afedc3fd5a1.jpg"
                mode="widthFix"></image>
              <!-- <image :src="cate3Item.cat_icon"></image> -->
              <text>{{cate3Item.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        windowHeight: 0,
        active: 1,
        cateList: [],
        cate2List: [],
        scrollTop: 0
      };
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        this.cateList = res.message
        this.cate2List = res.message[0].children
      },
      changeCate1(activeItem) {
        this.active = activeItem.cat_id
        this.cate2List = activeItem.children

        // 滚到顶部
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      toGoodList(catId) {
        uni.navigateTo({
          url: '../../subpkg/goods_list/goods_list?cid=' + catId
        })
      },
      toSearchPage() {
        uni.navigateTo({
          url: '../../subpkg/searchPage/searchPage'
        })
      }
    },
    async onLoad() {
      const res = await uni.getWindowInfo()
      this.windowHeight = res.windowHeight - 50

      this.getCateList()
    }
  }
</script>

<style lang="scss">
  .category {
    display: flex;

    .cate-first {
      width: 130px;
      display: flex;
      flex-direction: column;
      line-height: 50px;
      font-size: 14px;

      .cate-first-item {
        background-color: #f7f7f7;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        position: relative;

        &.active {
          background-color: white;

          &::before {
            content: ' ';
            width: 3px;
            height: 25px;
            background-color: #c00000;
            position: absolute;
            top: 25px;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }

    .right-box {
      background-color: white;

      .cate-sec-third {
        text-align: center;
        font-size: 14px;
        background-color: white;
        padding: 10px 0;
        width: 95%;
        margin: 0 auto;

        .cate-sec {
          font-weight: bold;
        }

        .cate-third {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          // justify-content: space-evenly;

          .cate-third-item {
            width: 33.3%;
            display: flex;
            flex-direction: column;
            align-items: center;

            image {
              width: 70px;
              height: 70px;
            }
          }
        }
      }
    }
  }

  .searchBox {
    position: sticky;
    top: 0;
    z-index: 999;
  }
</style>