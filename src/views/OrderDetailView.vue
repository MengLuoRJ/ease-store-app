<script setup lang="ts">
import { setAuthorizationHeader, useGet } from '@/composables/useRequest'
import type { Order, OrderItem } from '@/types'
import { get, set } from '@vueuse/core'
import { useRouteParams } from '@vueuse/router'
import { onMounted, reactive, ref } from 'vue'
import { transformOrderStatus } from '@/composables/useTranformer'
import { getSignedUrl } from '@/composables/useOss'

const id = useRouteParams<string>('id')

const order = ref<Order>()

const orderItems = reactive<OrderItem[]>([])

async function getOrderData() {
  const { data, error } = await useGet('/order/id/' + id.value, {
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    console.log(get(error))
  } else if (get(data)) {
    set(order, get(data).data)
  }
}

async function getOrderItemsData() {
  const { data, error } = await useGet('/order/items/' + id.value, {
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    console.log(get(error))
  } else if (get(data)) {
    get(data).data.forEach(async (item: OrderItem) => {
      if (item.merchandise?.picture_url) {
        const picture_url = await getSignedUrl(item.merchandise?.picture_url)
        orderItems.push({ ...item, merchandise: { ...item.merchandise, picture_url } })
      } else {
        orderItems.push({ ...item })
      }
    })
  }
}

const onClickLeft = () => history.back()

onMounted(async () => {
  await getOrderData()
  await getOrderItemsData()
})
</script>

<template>
  <van-nav-bar
    title="订单详情"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    placeholder
  />
  <van-cell-group class="mx-2 my-1 shadow">
    <van-cell>
      <template #title>{{ '订单：' + order?.code }}</template>
      <template #value>
        <van-tag plain :type="order?.status === 'credit' ? 'danger' : 'primary'">
          {{ transformOrderStatus(order?.status!) }}
        </van-tag>
      </template>
      <template #label>
        <div class="flex flex-col gap-1">
          <span>{{ '订单总价：￥' + order?.amount + ' 元' }} </span>
          <span v-if="order?.status === 'paid'">{{ '支付方式：' + order?.payment_method }} </span>
          <span v-if="order?.status === 'credit'">{{ '赊账人：' + order?.credit_person }} </span>
          <span>{{ '创建时间：' + new Date(order?.start_at!).toLocaleString() }}</span>
          <span>{{ '结算时间：' + new Date(order?.close_at!).toLocaleString() }}</span>
        </div>
      </template>
    </van-cell>
  </van-cell-group>
  <van-cell-group class="mx-2 my-1 shadow">
    <van-cell>
      <template #title>{{ '订单商品：' }}</template>
      <template #label>
        <van-empty v-if="!orderItems.length" image="search" description="暂无相关商品" />
        <van-card
          v-for="(item, index) in orderItems"
          :key="index"
          :price="item.price.toPrecision(3)"
          :desc="item.merchandise?.barcode"
          :title="item.merchandise?.name"
          :thumb="item.merchandise?.picture_url"
          lazy-load
          class="merchandise mx-2 my-2 shadow"
        >
          <template #num>
            <div class="flex flex-row items-end gap-2">
              <div class="text-base">{{ item.merchandise?.specs }}</div>
              <div class="text-xl font-300">{{ 'x' + item.count }}</div>
            </div>
          </template>
        </van-card>
      </template>
    </van-cell>
  </van-cell-group>
</template>
