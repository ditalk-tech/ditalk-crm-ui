<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script setup lang="ts">
const url = ref('https://gitee.com/ditalk/ditalk-crm-boot/');

function goto() {
  window.open(url.value);
}
</script>
