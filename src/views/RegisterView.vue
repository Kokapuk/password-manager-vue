<template>
  <LoginLayout>
    <h1 class="login_layout_title">Register</h1>
    <form @submit.prevent="() => register()">
      <input v-model.trim="email" placeholder="Email" class="login_layout_input" type="email" required />
      <input v-model="password" placeholder="Password" class="login_layout_input" type="password" minlength="6" required />
      <span v-if="invalidReason !== null" class="login_layout_invalid">{{ invalidReason }}</span>
      <Button :loading="loading" class="login_layout_submit" type="submit">Register</Button>
      <RouterLink to="/login">
        <Button class="login_layout_button" type="button">Login</Button>
      </RouterLink>
    </form>
  </LoginLayout>
</template>

<script setup lang="ts">
import LoginLayout from '@/components/LoginLayout.vue';
import Button from '@/components/Button.vue';
import { ref } from 'vue';
import { useDbStore } from '@/stores/db';
import type { FirebaseError } from '@firebase/util';
import router, { Routes } from '@/router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const invalidReason = ref<null | string>(null);

async function register() {
  loading.value = true;

  try {
    await useDbStore().register(email.value, password.value);
    await useDbStore().sendVerification();

    localStorage.setItem('email', email.value);
    loading.value = false;

    await router.push(Routes.verification);
  } catch (e) {
    if ((e as FirebaseError).code === 'auth/email-already-in-use') {
      invalidReason.value = 'Email already in use';
    } else {
      invalidReason.value = 'Unknown error';
    }
  }

  loading.value = false;
}
</script>
