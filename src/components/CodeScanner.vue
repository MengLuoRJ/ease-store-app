<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { set, get } from '@vueuse/core'
import { BarcodeScanner, BarcodeFormat, type Barcode } from '@capacitor-mlkit/barcode-scanning'
import { setAppBackCallbackOnce, setAppBackHistory } from '@/composables/useApp'

const props = defineProps<{
  barcodeFormat?: BarcodeFormat
  confirmRequired?: boolean
  show: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  scan: [value: Barcode]
}>()

const showScanner = computed({
  get() {
    return props.show
  },
  set(val) {
    emit('update:show', val)
  }
})

const showScannerWindow = ref(false)

const barcode = ref<Barcode>()

const barcodeResult = computed(() => {
  return get(barcode)?.displayValue
})

const startScan = async () => {
  document.querySelector('body')?.classList.add('code-scanner-active')
  set(showScannerWindow, true)

  setAppBackCallbackOnce(() => {
    document.querySelector('body')?.classList.remove('code-scanner-active')
    set(showScanner, false)
    set(barcode, undefined)
  })

  const listener = await BarcodeScanner.addListener('barcodeScanned', async (result) => {
    await listener.remove()
    await BarcodeScanner.stopScan()
    set(showScannerWindow, false)
    set(barcode, result.barcode)
    if (!props.confirmRequired) emitResult()
  })

  // Start the barcode scanner
  await BarcodeScanner.startScan()
}

const restartScan = async () => {
  set(barcode, undefined)
  await startScan()
}

const emitResult = () => {
  document.querySelector('body')?.classList.remove('code-scanner-active')
  emit('scan', get(barcode)!)
  set(showScanner, false)
  set(barcode, undefined)
  setAppBackHistory()
}

watch(
  () => props.show,
  async (val) => {
    if (!val) return
    set(barcode, undefined)
    await startScan()
  }
)
</script>
<template>
  <div v-if="!!showScanner" class="code-scanner">
    <div v-if="!!showScannerWindow" class="scan-window">
      <div class="scan-box">
        <div class="scan-corner"></div>
      </div>
    </div>
    <div v-if="!!barcode" class="result-line">{{ barcodeResult }}</div>
    <van-button
      v-if="!!barcode"
      class="operation-button-rescan"
      @click="restartScan()"
      plain
      type="primary"
      block
    >
      重新扫描
    </van-button>
    <van-button v-if="!!barcode" class="operation-button-confirm" @click="emitResult()" block>
      确认
    </van-button>
  </div>
</template>

<style>
body.code-scanner-active {
  visibility: hidden;
  overflow: hidden;
}

.code-scanner {
  visibility: visible;
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.scan-window {
  width: 45vw;
  height: 45vw;
}

.scan-box {
  width: 45vw;
  height: 45vw;
  position: absolute;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 51, 0.2);
}

.scan-box::after,
.scan-box::before,
.scan-corner::after,
.scan-corner::before {
  content: no-open-quote;
  display: block;
  position: absolute;
  width: 50px;
  height: 50px;
  border: 2px solid transparent;
}

.scan-box::after,
.scan-box::before {
  top: 0;
  border-top-color: #00ff33;
}

.scan-corner::after,
.scan-corner::before {
  bottom: 0;
  border-bottom-color: #00ff33;
}

.scan-box::before,
.scan-corner::before {
  left: 0;
  border-left-color: #00ff33;
}

.scan-box::after,
.scan-corner::after {
  right: 0;
  border-right-color: #00ff33;
}

.result-line {
  width: 50vw;
  height: 30px;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  margin-top: 32px;
  border-top: blue 1px dashed;
  border-bottom: blue 1px dashed;
}

.operation-button-rescan {
  margin-top: 32px;
}

.operation-button-confirm {
  margin-top: 16px;
}
</style>
