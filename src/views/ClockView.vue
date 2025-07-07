<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue';
import type { clockLogInterface, clockLogListInterface } from '@/model/ClockView.ts'
// 今天
const today = dayjs().format('YYYY-MM-DD')

// 计时器
let timeId: number = 0

// 练习时长
const practiceTime = ref('00:00:00')

// 是否开始
const isBegin = ref(false)

// 是否暂停
const isPause = ref(false)

// 是否显示暂停或继续按钮
const isShowPauseButton = ref(false);

// 开始时间
let startTime = ''

// 结束时间
let endTime = ''

// 暂停次数
let pauseCount = 0

// 某一次打卡秒数
let onceClockSecond = 0

// 是否打开打卡结束时的总结框
const isShowFinishSummary = ref(false)

// 用户的总结
const summary = ref('')

// 打卡按钮文字
const clockButtonText = computed(() => {
  return isBegin.value ? '结束打卡' : '开始打卡'
})

// 继续或暂停文字
const pauseButtonText = computed(() => {
  return isPause.value ? '继续打卡' : '暂停打卡'
})

// 历史打卡记录
const recentPracticeLogs = ref<clockLogListInterface[]>([])

// 点击开始打卡
const handleClock = () => {
  isBegin.value = !isBegin.value
  if (isBegin.value) {
    isShowPauseButton.value = true
    startTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    setTime()
  } else {
    clearInterval(timeId)
    isShowFinishSummary.value = true
    endTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
}

// 计时
const setTime = () => {
  clearInterval(timeId)
  const beginStep = Date.now()
  const existedSecond = timeToSecond(practiceTime.value)
  timeId = setInterval(() => {
    const nextStep = Date.now()
    onceClockSecond = existedSecond + Math.floor((nextStep - beginStep) / 1000)
    practiceTime.value = secondToTime(onceClockSecond)
  }, 1000)
}

// 秒数转时分秒
const secondToTime = (allSecond: number) => {
  const second = Math.floor(allSecond % 60)
  const minute = Math.floor((allSecond / 60) % 60)
  const hour = Math.floor(allSecond / 3600)
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
}

// 时分秒转秒数
const timeToSecond = (time: string) => {
  return time.split(':').reduce((acc, cur) => Number(acc) * 60 + Number(cur), 0)
}

// 点击暂停或继续
const handlePause = () => {
  isPause.value  = !isPause.value
  if (isPause.value) {
    pauseCount++
    clearInterval(timeId)
  } else {
    setTime()
  }
}

// 点击确定
const handleConfirm = () => {
  const logs = JSON.parse(localStorage.getItem('practiceLogs') || '[]')
  const obj = logs.find((item: clockLogListInterface) => item.date === today)
  const clockObj = {
    onceClockSecond,
    duration: practiceTime.value,
    summary: summary.value,
    startTime,
    endTime,
  }
  if (obj) {
    obj.logList.unshift(clockObj)
    const allClockSecond = obj.logList.reduce((acc: number, cur: clockLogInterface) => acc + cur.onceClockSecond, 0)
    obj.allDuration = secondToTime(allClockSecond)
    obj.pauseCount = pauseCount
  } else {
    const newObj = {
      date: today,
      logList: [clockObj],
      allDuration: practiceTime.value,
      pauseCount
    }
    logs.unshift(newObj)
  }
  localStorage.setItem('practiceLogs', JSON.stringify(logs))
  recentPracticeLogs.value = logs.slice(0, 5)
  isShowFinishSummary.value = false
  isShowPauseButton.value = false
  practiceTime.value = '00:00:00'
  summary.value = ''
}


// 点击取消
const handleCancel = () => {
  clearInterval(timeId)
  isPause.value = true
  isBegin.value = true
}

const getRecentPracticeLogs = () => {
  recentPracticeLogs.value = JSON.parse(localStorage.getItem('practiceLogs') || '[]').slice(0, 5)
}

onMounted(() => {
  getRecentPracticeLogs()
})

</script>

<template>
  <div>
    <div>今天是{{ today }}日 </div>
    <div>
      <span>练习时长</span>
      <span>{{ practiceTime }}</span>
    </div>
    <van-button type="primary" @click="handleClock">{{ clockButtonText }}</van-button>
    <van-button v-show="isShowPauseButton" @click="handlePause">{{ pauseButtonText }}</van-button>
  </div>
  <div>
    <div>
      <span>历史打卡记录</span>
    </div>
    <ul>
      <li v-for="(item, index) in recentPracticeLogs" :key="index">
        <span>{{ item.date }}</span>|
        <span>练琴时长：{{ item.allDuration }}</span>|
        <span>{{ item.logList.length }}次</span>|
        <span>{{ item.pauseCount }}次暂停</span>
      </li>
    </ul>
  </div>
  <van-dialog v-model:show="isShowFinishSummary" showCancelButton
    @confirm="handleConfirm" @cancel="handleCancel">
    <div>写点什么吧，比如：</div>
    <ul>
      <li>今天练了什么？</li>
      <li>有什么收获？</li>
      <li>哪段最难？</li>
      <li>是否比昨天进步了</li>
      <li>今天的练习感受如何？</li>      
    </ul>
    <van-field v-model="summary" type="textarea" title="写点儿什么呗">

    </van-field>
  </van-dialog>
</template>