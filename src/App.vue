<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
  <van-tabbar route fixed>
    <van-tabbar-item replace to="/clockView">打卡</van-tabbar-item>
    <van-tabbar-item replace to="/calendarView">日历</van-tabbar-item>
    <van-tabbar-item replace to="/statsView">统计</van-tabbar-item>
    <van-tabbar-item replace to="/settnigsView">设置</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>

</style>
