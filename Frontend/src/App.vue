<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<template>
 <v-app>
  <Header />
  <v-main>
    <v-container>
      <RouterView />
    </v-container>
  </v-main>
 </v-app>
</template>

<style scoped></style>
