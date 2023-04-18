<template>
  <view class="searchBox" @click="toSearchPage">
    <view class="searchBar">
      <uni-icons type="search" size="16"></uni-icons>
      <text class="search-text">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "Search",
    data() {
      return {

      };
    },
    methods: {
      toSearchPage() {
        this.$emit('click')
      }
    },
  }
</script>

<style lang="scss">
  .searchBox {
    height: 50px;
    background-color: #c00000;
    display: flex;
    justify-content: center;
    align-items: center;

    .searchBar {
      width: 90%;
      line-height: 30px;
      border-radius: 16px;
      background-color: white;
      font-size: 14px;
      text-align: center;

      .search-text {
        margin-left: 5px;
      }
    }
  }
</style>