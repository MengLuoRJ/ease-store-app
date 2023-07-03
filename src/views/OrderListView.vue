<script setup lang="ts">
import { setAuthorizationHeader, useGet } from '@/composables/useRequest'
import router from '@/router'
import type { Order } from '@/types'
import { get, set } from '@vueuse/core'
import { reactive, ref } from 'vue'
import { transformOrderStatus } from '@/composables/useTranformer'

const listLoading = ref(false)
const listFinished = ref(false)

const page = reactive({
  page: 1,
  pageCount: 1,
  take: 10
})

const orderList = reactive<Order[]>([])

const onListLoad = async () => {
  const { data, error } = await useGet('/order/all', {
    params: {
      page: page.page,
      take: page.take
    },
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    console.log(get(error))
  } else if (get(data)) {
    const result = get(data).data
    page.pageCount = result.meta.pageCount
    page.page = result.meta.hasNextPage ? page.page + 1 : page.page
    set(listFinished, !result.meta.hasNextPage)
    orderList.push(...result.data)
  }
}

const onCheckOrder = async (id: number) => {
  router.push('/order/detail/' + id)
}

const onClickLeft = () => history.back()
</script>

<template>
  <van-nav-bar
    title="订单记录"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    placeholder
  />
  <van-list
    v-model:loading="listLoading"
    :finished="listFinished"
    finished-text="没有更多了"
    @load="onListLoad"
  >
    <van-cell-group
      v-for="(item, index) in orderList"
      :key="index"
      @click="onCheckOrder(item.id)"
      class="mx-2 my-1 shadow"
    >
      <van-cell>
        <template #title>{{ '订单：' + item.code }}</template>
        <template #value>
          <van-tag plain :type="item.status === 'credit' ? 'danger' : 'primary'">
            {{ transformOrderStatus(item.status) }}
          </van-tag>
        </template>
        <template #label>
          <div class="flex flex-col gap-1">
            <span>{{ '订单总价：￥' + item.amount + ' 元' }} </span>
            <span v-if="item.status === 'paid'">{{ '支付方式：' + item.payment_method }} </span>
            <span v-if="item.status === 'credit'">{{ '赊账人：' + item.credit_person }} </span>
            <span>{{ '创建时间：' + new Date(item.start_at).toLocaleString() }}</span>
            <span>{{ '结算时间：' + new Date(item.close_at).toLocaleString() }}</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </van-list>
</template>
