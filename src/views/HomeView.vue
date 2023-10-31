<template>
  <div class="d-flex h-100">
    <PasswordList
      v-model:selected="selectedPasswordId"
      :class="['h-100', 'password-list', { hidden: selectedPasswordId !== null }]" />
    <Transition name="password-editor" mode="out-in">
      <PasswordEditor
        @leave="() => (selectedPasswordId = null)"
        v-if="selectedPasswordId !== null"
        :password="useDbStore().passwords.find((password: IPassword) => password.id === selectedPasswordId!)!"
        class="h-100 password-editor" />
      <div v-else class="placeholder-container">
        <span class="list-placeholder">Select a password to view and edit it</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import PasswordList from '@/components/PasswordList.vue';
import PasswordEditor from '@/components/PasswordEditor.vue';
import { ref } from 'vue';
import { useDbStore } from '@/stores/db';
import type { IPassword } from '@/components/Password.vue';

const selectedPasswordId = ref<null | string>(null);
</script>

<style scoped>
.password-list {
  width: 40%;
}

.password-editor-enter-active,
.password-editor-leave-active {
  transition: opacity calc(var(--transition-duration) / 2), transform calc(var(--transition-duration) / 2);
}

.password-editor-enter-from {
  transform: translateY(50px);
  opacity: 0;
}

.password-editor-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

.password-editor {
  width: 60%;
}

.placeholder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
}

.list-placeholder {
  background-color: rgba(var(--font-color), 0.15);
  border-radius: 25px;
  padding: 5px 15px;
  font-size: 1.4rem;
  opacity: 0.5;
  font-weight: 300;
}

@media (max-width: 800px) {
  .password-list,
  .password-editor {
    width: 100%;
  }

  .placeholder-container,
  .password-list.hidden {
    display: none;
  }

  .password-editor-enter-active,
  .password-editor-leave-active {
    transition: none;
  }
}
</style>
