<script setup lang="ts">
import { useUserStore } from '@/stores/user'
const user = useUserStore()
</script>

<template>
  <van-nav-bar title="EaseStore" fixed placeholder />
  <div class="mx-2 flex flex-col gap-2">
    <div class="mt-2 flex flex-col gap-2">
      <van-cell v-if="!user.isLogined">
        <template #title>
          {{ '尚未登录，请先登录！' }}
        </template>
      </van-cell>
      <van-cell v-if="!!user.isLogined">
        <template #title>
          {{ '已登录：' + user.user.username }}
        </template>
      </van-cell>
    </div>
    <van-button v-if="!user.isLogined" type="primary" block :to="'/login'">登录</van-button>
    <van-button type="primary" block :to="'/merchandise/entry'" :disabled="!user.isLogined">
      商品录入
    </van-button>
    <van-button type="primary" block :to="'/merchandise/list'" :disabled="!user.isLogined">
      商品记录
    </van-button>
    <van-button type="primary" block :to="'/order/entry'" :disabled="!user.isLogined">
      订单结算
    </van-button>
    <van-button type="primary" block :to="'/order/list'" :disabled="!user.isLogined">
      订单记录
    </van-button>
    <van-button type="primary" block :to="'/about'">
      关于
    </van-button>
  </div>
</template>
