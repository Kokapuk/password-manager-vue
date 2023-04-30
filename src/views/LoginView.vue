<template>
  <LoginLayout>
    <h1 class="login_layout_title">Login</h1>
    <form @submit.prevent="() => login()">
      <input
        :autofocus="email === ''"
        v-model.trim="email"
        placeholder="Email"
        class="login_layout_input"
        type="email"
        required />
      <input
        :autofocus="email !== ''"
        v-model="password"
        placeholder="Password"
        class="login_layout_input"
        type="password"
        minlength="6"
        required />
      <span v-if="invalidReason !== null" class="login_layout_invalid">{{ invalidReason }}</span>
      <Button :loading="loading" class="login_layout_submit" type="submit">Login</Button>
      <RouterLink to="/register">
        <Button class="login_layout_button" type="button">Register</Button>
      </RouterLink>
    </form>
  </LoginLayout>
</template>

<script setup lang="ts">
import LoginLayout from '@/components/LoginLayout.vue';
import Button from '@/components/Button.vue';
import { useDbStore } from '@/stores/db';
import { ref } from 'vue';
import type { FirebaseError } from '@firebase/util';
import router, { Routes } from '@/router';

const email = ref<string>(localStorage.getItem('email') !== null ? localStorage.getItem('email')! : '');
const password = ref('');
const loading = ref(false);
const invalidReason = ref<null | string>(null);

async function login() {
  loading.value = true;

  try {
    await useDbStore().login(email.value, password.value);
    await router.push(Routes.home);
    localStorage.setItem('email', email.value);
  } catch (e) {
    if (
      (e as FirebaseError).code === 'auth/invalid-email' ||
      (e as FirebaseError).code === 'auth/wrong-password' ||
      (e as FirebaseError).code === 'auth/user-not-found'
    ) {
      invalidReason.value = 'Wrong email or password';
    } else {
      invalidReason.value = 'Unknown error';
    }

    console.log((e as FirebaseError).code);
  }

  loading.value = false;
}
</script>
