---
title: Redirecting...
layout: home
---

<script setup>
import { useData } from 'vitepress'
import { onMounted } from 'vue'

const { params } = useData()

onMounted(() => {
  if (params.value?.target) {
    window.location.replace(params.value.target)
  }
})
</script>

<p v-if="params?.target">
  Redirecting to <a :href="params.target">{{ params.target }}</a>...
</p>

<meta v-if="params?.target" http-equiv="refresh" :content="`0; url=${params.target}`">
