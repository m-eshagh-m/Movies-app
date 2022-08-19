<script setup>
import TheHeader from './components/layout/TheHeader.vue';

</script>

<template>
  <TheHeader />
  <section class="container mx-auto my-10">
    <RouterView>
    </RouterView>
  </section>
</template>

