<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script setup lang="ts">
const url = ref('https://gitee.com/ditalk/ditalk-crm-boot');

function goto() {
  window.open(url.value);
}
</script>
