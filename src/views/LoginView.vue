<script setup lang="ts">
import { reactive } from 'vue'
import { usePost } from '@/composables/useRequest'
import { get } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const user = useUserStore()

const formData = reactive({
  telnum: '',
  password: ''
})

async function onSubmit() {
  const { data, error } = await usePost('/authentication/login', {
    data: {
      telnum: '+86' + formData.telnum,
      password: formData.password
    }
  })
  if (get(error)) {
    console.log(error)
    return
  } else if (get(data)) {
    user.login(get(data).data.token)
    showToast({
      message: '登录成功',
      type: 'success',
      duration: 1000
    })
    history.back()
  }
}

const onClickLeft = () => history.back()
</script>

<template>
  <van-nav-bar
    title="登录"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    placeholder
  />
  <van-form class="mt-2 flex flex-col gap-2" @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        type="tel"
        v-model="formData.telnum"
        name="账号"
        label="账号"
        placeholder="账号"
        :rules="[{ required: true, message: '请填写账号' }]"
      />
      <van-field
        type="password"
        v-model="formData.password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <van-button round block type="primary" native-type="submit"> 登录 </van-button>
  </van-form>
</template>
