<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { get, set } from '@vueuse/core'
import { useRouteParams } from '@vueuse/router'
import { showToast, type UploaderFileListItem } from 'vant'
import {
  setAuthorization,
  setAuthorizationHeader,
  useGet,
  usePatch,
  usePost
} from '@/composables/useRequest'
import {
  useQuickEntryShilfLife,
  useQuickEntryCategory,
  useQuickEntrySpecs
} from '@/composables/useQuickEntry'
import CodeScanner from '@/components/CodeScanner.vue'
import type { Barcode } from '@capacitor-mlkit/barcode-scanning'
import type { MerchandiseEntry } from '@/types'
import { getSignedUrl } from '@/composables/useOss'

const id = useRouteParams<string>('id')

const formData = ref<MerchandiseEntry>({
  name: '',
  barcode: '',
  price: 0,
  picture_url: '',
  specs: '',
  category: '',
  shilf_life: 0,
  tags: [],
  quick_tags: []
})

const uploadFiles = ref<UploaderFileListItem[]>([])

const showCodeScanner = ref(false)

const showPicker = reactive({
  specs: false,
  category: false,
  shilf_life: false
})

async function requstData() {
  const { data, error } = await useGet('/merchandise/id/' + get(id), {
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    showToast({
      message: '获取商品信息失败',
      type: 'fail'
    })
    console.log(get(error))
  } else if (get(data)) {
    set(formData, {
      ...get(data).data
    })
    if (get(formData).picture_url) {
      const picture_url = await getSignedUrl(get(formData).picture_url!)
      uploadFiles.value.push({
        url: picture_url
      })
    }
    showToast({
      message: '获取商品信息成功',
      type: 'success'
    })
  }
}

async function onSubmit() {
  console.log(get(formData).toString())
  const { data, error } = await usePatch('/merchandise/update/' + get(id), {
    data: {
      id: get(id),
      ...get(formData)
    },
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    showToast({
      message: '录入失败',
      type: 'fail'
    })
    console.log(get(error))
  } else if (get(data)) {
    showToast({
      message: '录入成功',
      type: 'success'
    })
    history.back()
  }
}

const onBarcodeScanned = (barcode: Barcode) => {
  get(formData).barcode = barcode.displayValue
}

const beforeUploaderRead = () => {
  if (!get(formData).barcode) {
    showToast('请先填写商品条码')
    return false
  } else {
    return true
  }
}

const afterUploaderRead = async (file: any) => {
  const { data, error } = await usePost('/merchandise/upload-picture/' + get(formData).barcode, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...setAuthorization()
    },
    data: {
      file: file.file
    }
  })
  if (get(error)) {
    console.log(get(error))
    showToast({
      message: '上传失败',
      type: 'fail'
    })
  } else if (get(data)) {
    get(formData).picture_url = get(data).data
  }
}

const onShellLifePickerConfirm = ({ selectedValues }: { selectedValues: number[] }) => {
  get(formData).shilf_life = selectedValues[0]
  showPicker.shilf_life = false
}

const onCategoryPickerConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  get(formData).category = selectedValues[0]
  showPicker.category = false
}

const onSpecsPickerConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  get(formData).specs = selectedValues[0]
  showPicker.specs = false
}

const onClickLeft = () => history.back()

onMounted(async () => {
  if (!get(id)) return
  await requstData()
})
</script>

<template>
  <van-nav-bar
    title="商品更新"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    placeholder
  />
  <van-form class="mt-2 flex flex-col gap-2" label-width="3.5em" @submit="onSubmit()">
    <van-cell-group inset>
      <van-field
        v-model="formData.barcode"
        name="条码"
        label="条码"
        placeholder="条码"
        :rules="[{ required: true, message: '请填写条码' }]"
      >
        <template #button>
          <van-button @click="showCodeScanner = true" size="small" type="primary">扫描</van-button>
        </template>
      </van-field>
      <CodeScanner v-model:show="showCodeScanner" @scan="onBarcodeScanned" confirmRequired />
      <van-field
        v-model="formData.name"
        name="名称"
        label="名称"
        placeholder="名称"
        :rules="[{ required: true, message: '请填写名称' }]"
      />
      <van-field
        name="价格"
        label="价格"
        placeholder="价格"
        :rules="[{ required: true, message: '请填写价格' }]"
      >
        <template #input>
          <van-stepper v-model="formData.price" step="0.5" min="0" />
          <div class="ml-2">{{ '元' }}</div>
        </template>
      </van-field>
      <van-field
        v-model="formData.specs"
        name="规格"
        label="规格"
        placeholder="规格"
        :rules="[{ required: true, message: '请填写规格' }]"
      >
        <template #button>
          <van-button @click="showPicker.specs = true" size="small" type="primary"
            >快速填写</van-button
          >
        </template>
      </van-field>
      <van-popup v-model:show="showPicker.specs" position="bottom">
        <van-picker
          :columns="useQuickEntrySpecs()"
          @confirm="onSpecsPickerConfirm"
          @cancel="showPicker.specs = false"
        />
      </van-popup>
      <van-field
        v-model="formData.category"
        name="分类"
        label="分类"
        placeholder="分类"
        :rules="[{ required: true, message: '请填写分类' }]"
      >
        <template #button>
          <van-button @click="showPicker.category = true" size="small" type="primary"
            >快速填写</van-button
          >
        </template>
      </van-field>
      <van-popup v-model:show="showPicker.category" position="bottom">
        <van-picker
          :columns="useQuickEntryCategory()"
          @confirm="onCategoryPickerConfirm"
          @cancel="showPicker.category = false"
        />
      </van-popup>
      <van-field
        name="保质期"
        label="保质期"
        placeholder="保质期"
        :rules="[{ required: true, message: '请填写保质期' }]"
      >
        <template #input>
          <van-stepper v-model="formData.shilf_life" step="30" min="0" />
          <div>
            {{
              '（' +
              formData.shilf_life +
              '天 / ' +
              (formData.shilf_life / 30).toFixed(1) +
              '个月）'
            }}
          </div>
        </template>
        <template #button>
          <van-button @click="showPicker.shilf_life = true" size="small" type="primary"
            >快速填写</van-button
          >
        </template>
      </van-field>
      <van-popup v-model:show="showPicker.shilf_life" position="bottom">
        <van-picker
          :columns="useQuickEntryShilfLife()"
          @confirm="onShellLifePickerConfirm"
          @cancel="showPicker.shilf_life = false"
        />
      </van-popup>
    </van-cell-group>
    <van-cell-group inset>
      <van-field name="uploader" label="图片">
        <template #input>
          <van-uploader
            v-model="uploadFiles"
            :before-read="beforeUploaderRead"
            :after-read="afterUploaderRead"
            capture="camera"
            :max-count="1"
          />
        </template>
      </van-field>
    </van-cell-group>
    <van-button round block type="primary" native-type="submit"> 确认更新 </van-button>
  </van-form>
</template>
