<script setup lang="ts">
import { reactive, ref } from 'vue'

const APPINFO = reactive(__APP_INFO__)

const activeCollapse = ref([] as string[])

const onClickLeft = () => history.back()
</script>

<template>
  <van-nav-bar
    title="关于"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    placeholder
  />
  <div class="about mt-2 flex flex-col gap-2">
    <van-cell-group inset>
      <van-cell>
        <template #title>{{ APPINFO.name }}</template>
        <template #value>{{ 'v' + APPINFO.version }}</template>
      </van-cell>
      <van-cell
        title="Github Repository"
        is-link
        url="https://github.com/MengLuoRJ/ease-store-app"
      />
      <van-cell>
        <template #title>{{ 'Author: @MengLuoRJ' }}</template>
      </van-cell>
    </van-cell-group>
    <div class="mx-2">
      <van-collapse v-model="activeCollapse">
        <van-collapse-item title="dependencies" name="dependencies">
          <van-cell-group inset>
            <van-cell v-for="(ver, dep, index) in APPINFO.dependencies" :key="index">
              <template #title>{{ dep }}</template>
              <template #value>{{ ver }}</template>
            </van-cell>
          </van-cell-group>
        </van-collapse-item>
        <van-collapse-item title="devDependencies" name="devDependencies">
          <van-cell-group inset>
            <van-cell v-for="(ver, dep, index) in APPINFO.devDependencies" :key="index">
              <template #title>{{ dep }}</template>
              <template #value>{{ ver }}</template>
            </van-cell>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>
