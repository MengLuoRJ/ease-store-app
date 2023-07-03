<script setup lang="ts">
import { getSignedUrl } from '@/composables/useOss'
import { setAuthorizationHeader, useGet, usePost } from '@/composables/useRequest'
import type { Merchandise, MerchandiseItem } from '@/types'
import type { Barcode } from '@capacitor-mlkit/barcode-scanning'
import { get, set } from '@vueuse/core'
import { showToast } from 'vant'
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { PaymentMethonds } from '@/constants'

const user = useUserStore()

const showCodeScanner = ref(false)
const showManualEntry = ref(false)
const showItemPicker = ref(false)
const showPaymentPicker = ref(false)

const total_amount = ref(0)
const merchandiseCart = reactive<MerchandiseItem[]>([])
const order_info = reactive({
  payment_method: '',
  status: '',
  credit_person: '',
  start_at: '',
  close_at: ''
})

const merchandiseItems = reactive<Merchandise[]>([])
const manualEntry = ref('')

const tabActive = ref<'paid' | 'credit'>('paid')

const updateTotalAmount = () => {
  set(
    total_amount,
    merchandiseCart.reduce((acc, cur) => {
      return acc + cur.price * cur.count
    }, 0)
  )
}

const onBarcodeScanned = async (barcode: Barcode) => {
  await requstMerchandiseBarcode(barcode.displayValue)
}

const onManualEntryConfirm = async () => {
  if (!get(manualEntry)) return
  await requstMerchandiseBarcode(get(manualEntry))
  set(manualEntry, '')
}

const requstMerchandiseBarcode = async (barcode: string) => {
  const { data, error } = await useGet('/merchandise/barcode/' + barcode, {
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
        merchandiseItems.push({ ...get(item), picture_url })
      } else {
        merchandiseItems.push({ ...get(item) })
      }
    })
    set(showItemPicker, true)
  }
}

const onItemPicked = (item: Merchandise) => {
  const finder = merchandiseCart.findIndex((i) => i.id === item.id)
  if (finder === -1) {
    merchandiseCart.push({
      ...item,
      count: 1
    })
  } else {
    merchandiseCart[finder].count++
  }
  updateTotalAmount()
  merchandiseItems.splice(0, merchandiseItems.length)
  set(showItemPicker, false)
}

const onMerchandiseCartRemove = async (item: MerchandiseItem) => {
  const finder = merchandiseCart.findIndex((i) => i.id === item.id)
  if (finder === -1) return
  merchandiseCart.splice(finder, 1)
  updateTotalAmount()
}

async function submitOrder() {
  if (order_info.payment_method === 'credit') order_info.payment_method = ''
  order_info.status = get(tabActive)
  order_info.close_at = new Date().toISOString()
  const { data, error } = await usePost('/order/create', {
    data: {
      user_uuid: user.user.uuid,
      amount: get(total_amount),
      items: merchandiseCart.map((item) => {
        return {
          merchandise_id: item.id,
          price: item.price,
          price_settlement: item.price_settlement,
          count: item.count
        }
      }),
      ...order_info
    },
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    showToast({
      message: '提交失败',
      type: 'fail'
    })
    console.log(error)
  } else if (get(data)) {
    showToast({
      message: '提交成功',
      type: 'success'
    })
    history.back()
  }
}

const onClickLeft = () => history.back()

onMounted(() => {
  order_info.start_at = new Date().toISOString()
})
</script>

<template>
  <van-nav-bar
    title="订单结算"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    placeholder
  />

  <van-empty v-if="!merchandiseCart.length" description="暂未添加商品" />

  <div v-if="!!merchandiseCart.length" class="merchandise-cart flex flex-col mt-2">
    <van-swipe-cell v-for="(item, index) in merchandiseCart" :key="index">
      <van-card
        :price="item.price.toPrecision(3)"
        :desc="item.barcode"
        :title="item.name"
        :thumb="item.picture_url"
        class="mx-2 my-0.5 shadow"
      >
        <template #num>
          <div class="flex flex-row items-end gap-2">
            <div class="text-base">{{ item.specs }}</div>
            <div class="text-xl font-300">{{ 'x' + item.count }}</div>
          </div>
        </template>
        <template #footer>
          <van-button
            size="mini"
            icon="minus"
            :disabled="item.count <= 0"
            @click="item.count-- && updateTotalAmount()"
          ></van-button>
          <van-button
            size="mini"
            icon="plus"
            @click="item.count++ && updateTotalAmount()"
          ></van-button>
        </template>
      </van-card>
      <template #right>
        <van-button
          square
          text="删除"
          type="danger"
          class="delete-button"
          @click="onMerchandiseCartRemove(item)"
        />
      </template>
    </van-swipe-cell>
  </div>
  <CodeScanner v-model:show="showCodeScanner" @scan="onBarcodeScanned" confirmRequired />
  <van-dialog
    v-model:show="showManualEntry"
    @confirm="onManualEntryConfirm()"
    title="商品手录"
    show-cancel-button
  >
    <van-field v-model="manualEntry" />
  </van-dialog>
  <van-popup v-model:show="showItemPicker" position="bottom">
    <van-empty v-if="!merchandiseItems.length" image="search" description="暂无相关商品" />
    <div v-for="(item, index) in merchandiseItems" :key="index" class="mx-2 my-1">
      <van-card
        :price="item.price.toPrecision(3)"
        :desc="item.barcode"
        :title="item.name"
        :thumb="item.picture_url"
        class="shadow"
        @click="onItemPicked(item)"
      >
        <template #tags>
          <van-tag plain type="primary" v-for="(tag, index) in item.tags" :key="index">
            {{ tag }}
          </van-tag>
        </template>
      </van-card>
    </div>
  </van-popup>
  <van-popup v-model:show="showPaymentPicker" position="bottom" class="h-[50%] overflow-hidden">
    <div class="h-full flex flex-col gap-1 overflow-hidden">
      <div class="mt-2 mx-auto">
        {{ '价格总计：￥' + total_amount.toPrecision(3) + ' 元' }}
      </div>
      <van-tabs v-model:active="tabActive" class="h-75% overflow-y-overlay">
        <van-tab title="支付" name="paid" class="">
          <van-radio-group v-model="order_info.payment_method">
            <van-cell-group inset>
              <van-cell
                v-for="(item, index) in PaymentMethonds"
                :key="index"
                :title="item"
                clickable
                @click="order_info.payment_method = item"
              >
                <template #right-icon>
                  <van-radio :name="item" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </van-tab>
        <van-tab title="赊账" name="credit">
          <van-field
            v-model="order_info.credit_person"
            name="赊账人"
            label="赊账人"
            placeholder="赊账人"
            :rules="[{ required: true, message: '请填写赊账人' }]"
          />
        </van-tab>
      </van-tabs>
      <van-button
        v-if="tabActive === 'paid'"
        :disabled="!order_info.payment_method"
        class="mt-2"
        type="primary"
        @click="submitOrder()"
      >
        确认支付
      </van-button>
      <van-button
        v-if="tabActive === 'credit'"
        :disabled="!order_info.credit_person"
        class="mt-2"
        type="primary"
        @click="submitOrder()"
      >
        确认赊账
      </van-button>
    </div>
  </van-popup>
  <van-action-bar placeholder>
    <div class="ml-12 mr-6">{{ '价格总计：￥' + total_amount.toPrecision(3) + ' 元' }}</div>
    <van-action-bar-button @click="showManualEntry = true" type="warning" text="商品手录" />
    <van-action-bar-button @click="showCodeScanner = true" type="warning" text="商品扫码" />
    <van-action-bar-button
      @click="showPaymentPicker = true"
      type="danger"
      text="结算"
      :disabled="!merchandiseCart.length"
    />
  </van-action-bar>
</template>
