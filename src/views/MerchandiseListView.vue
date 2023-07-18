<script setup lang="ts">
import { getSignedUrl } from '@/composables/useOss'
import { setAuthorizationHeader, useGet } from '@/composables/useRequest'
import router from '@/router'
import type { Merchandise } from '@/types'
import type { Barcode } from '@capacitor-mlkit/barcode-scanning'
import { get, set } from '@vueuse/core'
import { showToast } from 'vant'
import { reactive, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import CodeScanner from '@/components/CodeScanner.vue'

const merchandiseList = reactive<Merchandise[]>([])

const searchLine = ref('')
const searching = ref(false)

const showCodeScanner = ref(false)

const listLoading = ref(false)
const listFinished = ref(false)

const page = reactive({
  page: 1,
  pageCount: 1,
  take: 10
})

const onBarcodeScanned = (barcode: Barcode) => {
  set(searchLine, barcode.displayValue)
}

async function requestMerchandiseListDataByName() {
  set(searching, true)
  merchandiseList.splice(0, merchandiseList.length)
  const { data, error } = await useGet('/merchandise/name', {
    params: {
      name: get(searchLine)
    },
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    showToast({
      message: '查询失败',
      type: 'fail'
    })
    console.log(error)
  } else if (get(data)) {
    ;(get(data).data as Merchandise[]).forEach(async (item) => {
      if (item.picture_url) {
        const picture_url = await getSignedUrl(item.picture_url)
        get(merchandiseList).push({ ...get(item), picture_url })
      } else {
        get(merchandiseList).push({ ...get(item) })
      }
    })
  }
}

async function requestMerchandiseListDataByBarcode() {
  set(searching, true)
  merchandiseList.splice(0, merchandiseList.length)
  const { data, error } = await useGet('/merchandise/barcode/' + get(searchLine), {
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    showToast({
      message: '查询失败',
      type: 'fail'
    })
    console.log(error)
  } else if (get(data)) {
    ;(get(data).data as Merchandise[]).forEach(async (item) => {
      if (item.picture_url) {
        const picture_url = await getSignedUrl(item.picture_url)
        get(merchandiseList).push({ ...get(item), picture_url })
      } else {
        get(merchandiseList).push({ ...get(item) })
      }
    })
  }
}

const onListLoad = async () => {
  const { data, error } = await useGet('/merchandise/all', {
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
    ;(result.data as Merchandise[]).forEach(async (item: Merchandise) => {
      if (item.picture_url) {
        const picture_url = await getSignedUrl(item.picture_url)
        get(merchandiseList).push({ ...get(item), picture_url })
      } else {
        get(merchandiseList).push({ ...get(item) })
      }
    })

    set(listLoading, false)
  }
}

const onUpdateMerchandise = async (id: number) => {
  router.push('/merchandise/update/' + id)
}

const onSearchClear = () => {
  console.log('onSearchClear')
  set(searchLine, '')
  set(searching, false)
  console.log(get(searchLine))
}

const onClickLeft = () => history.back()

const changeRouterKeepAlive = (name: string, keepAlive: boolean) => {
  router.options.routes.map((item: any) => {
    if (item.name === name) {
      item.meta.keepAlive = keepAlive
    }
  })
}

onBeforeRouteLeave((to, from) => {
  if (to.name !== 'MerchandiseUpdate' && to.name !== 'MerchandiseDetail') {
    changeRouterKeepAlive(from.name as string, false)
  } else {
    changeRouterKeepAlive(from.name as string, true)
  }
})
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
  <div class="merchandise-list mt-2">
    <van-cell-group inset>
      <van-field v-model="searchLine" label="商品名称" clearable @clear="onSearchClear">
        <template #button>
          <van-button size="small" type="primary" @click="requestMerchandiseListDataByName()">
            查询
          </van-button>
        </template>
      </van-field>
      <van-field v-model="searchLine" label="商品条码" clearable @clear="onSearchClear">
        <template #button>
          <div class="flex flex-row gap-1">
            <van-button size="small" type="default" @click="showCodeScanner = true">
              扫描
            </van-button>
            <van-button size="small" type="primary" @click="requestMerchandiseListDataByBarcode()">
              查询
            </van-button>
          </div>
        </template>
      </van-field>
    </van-cell-group>
    <CodeScanner v-model:show="showCodeScanner" @scan="onBarcodeScanned" confirmRequired />
    <div v-if="!searching">
      <van-list
        v-model:loading="listLoading"
        :finished="listFinished"
        finished-text="没有更多了"
        @load="onListLoad"
      >
        <van-card
          v-for="(item, index) in merchandiseList"
          :key="index"
          :price="item.price.toPrecision(3)"
          :desc="item.barcode"
          :title="item.name"
          :thumb="item.picture_url"
          lazy-load
          @click="onUpdateMerchandise(item.id)"
          class="merchandise mx-2 my-2 shadow"
        >
          <template #num>
            <div class="flex flex-row items-end gap-2">
              <div class="text-base">{{ item.specs }}</div>
            </div>
          </template>
        </van-card>
      </van-list>
    </div>
    <div v-if="searching">
      <van-empty v-if="!merchandiseList.length" image="search" description="暂无相关商品" />
      <van-card
        v-for="(item, index) in merchandiseList"
        :key="index"
        :price="item.price.toPrecision(3)"
        :desc="item.barcode"
        :title="item.name"
        :thumb="item.picture_url"
        lazy-load
        @click="onUpdateMerchandise(item.id)"
        class="merchandise mx-2 my-2 shadow"
      >
        <template #num>
          <div class="flex flex-row items-end gap-2">
            <div class="text-base">{{ item.specs }}</div>
          </div>
        </template>
      </van-card>
    </div>
  </div>
</template>
