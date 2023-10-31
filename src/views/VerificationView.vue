<template>
  <div class="center">
    <div>
      <h1 class="verification-text mb-10">
        You have to verify your email before using Password Manager.
        <br />
        If you're having trouble finding the message, try checking your spam folder.
        <br />
        Click the button below if you have already verified your email address.
      </h1>
      <div>
        <Button class="me-10" @click="() => restart()">I have verified my email</Button>
        <Button :disabled="resendDisabled" @click="() => resendEmail()">Resend email</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import router, { Routes } from '@/router';
import { useDbStore } from '@/stores/db';
import { ref } from 'vue';

const resendDisabled = ref(false);

async function restart() {
  await router.go(0);
}

async function resendEmail() {
  if (resendDisabled.value) return;

  await useDbStore().sendVerification();
  resendDisabled.value = true;
}
</script>

<style scoped>
.verification-text {
  font-weight: 400;
  opacity: 0.5;
}
</style>
