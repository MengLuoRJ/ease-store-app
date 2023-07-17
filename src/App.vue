<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { setAppBackHistory } from './composables/useApp'

const user = useUserStore()

const themeVars = reactive({
  cardFontSize: '16px',
  cardPriceFontSize: '20px',
  cardPriceIntegerFontSize: '24px'
})

onMounted(async () => {
  await user.syncLogin()
  setAppBackHistory()
})
</script>

<template>
  <div class="min-h-[100vh] bg-gray-200">
    <van-config-provider :theme-vars="themeVars">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name" />
      </router-view>
    </van-config-provider>
  </div>
</template>
