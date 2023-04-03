<template>
    <main>
      <h1>Welcome to your your sandbox environment</h1>
      <Input
        label="firstname"
        :input-attributes="{
            placeholder: 'Enter your firstname...',
            type: 'text',
            autocomplete: 'given-name',
        }"
    >
      First-name
    </Input>
    </main>
  </template>
  
<script setup lang="ts">
import { Input } from '@/components'
</script>
  
<style lang="scss" scoped></style>