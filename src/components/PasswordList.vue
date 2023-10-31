<template>
  <div>
    <div class="search-container">
      <div class="search-vault-container">
        <Search style="opacity: 0.5; margin-left: 8px" class="icon" />
        <input
          v-model="searchQuery"
          type="input"
          class="search"
          :placeholder="`Search Vault (${passwordsByQuery !== null ? passwordsByQuery.length : '0'})`"
        />
        <Button
          @click="() => (searchQuery = '')"
          :class="['icon-button clear-search-button', { shown: searchQuery !== '' }]"
        >
          <Close class="icon" />
        </Button>
      </div>
      <Tooltip text="Create new password" :positioning="TooltipPositioning.bottom">
        <Button :loading="passwordsByQuery === null || creating" @click="() => createNewPassword()" class="icon-button">
          <Plus class="icon" />
        </Button>
      </Tooltip>
      <Tooltip text="Sign out" :positioning="TooltipPositioning.bottom">
        <Button :loading="passwordsByQuery === null" @click="() => logout()" class="icon-button">
          <Logout class="icon" />
        </Button>
      </Tooltip>
      <Tooltip v-if="!isDesktopApp()" text="Download for Windows" :positioning="TooltipPositioning.bottom">
        <a class="icon-button" href="https://github.com/Kokapuk/desktop-password-manager/releases">
          <Button class="icon-button">
            <Download class="icon" />
          </Button>
        </a>
      </Tooltip>
    </div>
    <Transition name="loading" mode="out-in">
      <div class="h-100-local" v-if="passwordsByQuery !== null">
        <Transition name="list-placeholder" mode="out-in">
          <div v-if="passwordsByQuery.length > 0" ref="scrollable" class="h-100 scrollable">
            <TransitionGroup name="list" mode="out-in">
              <div v-for="password in passwordsByQuery" :key="password.id">
                <Password
                  :password="password"
                  :selected="props.selected === password.id"
                  @select="() => emit('update:selected', password.id)"
                />
              </div>
            </TransitionGroup>
          </div>
          <div v-else class="center h-100"><span class="list-placeholder">No passwords found</span></div>
        </Transition>
      </div>
      <div class="h-100-local scrollable" v-else>
        <div v-for="i in 10" class="password-loading-placeholder blink-loading-placeholoder">
          <div class="image-loading-placeholder"></div>
          <div class="w-100">
            <div class="title-loading-placeholder"></div>
            <div class="email-loading-placeholder"></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Search from './icons/Search.vue';
import Plus from './icons/Plus.vue';
import Logout from './icons/Logout.vue';
import Close from './icons/Close.vue';
import Button from './Button.vue';
import Password, { type IPassword } from './Password.vue';
import Tooltip from './Tooltip.vue';
import { onMounted, ref, watch } from 'vue';
import { useDbStore } from '@/stores/db';
import { uid } from 'uid';
import router, { Routes } from '@/router';
import { TooltipPositioning } from '@/types';
import Download from './icons/Download.vue';
import isDesktopApp from '../utils/isDesktopApp';

interface IProps {
  selected: null | string;
}

const emit = defineEmits(['update:selected']);
const props = defineProps<IProps>();
const searchQuery = ref<string>('');
const passwordsByQuery = ref<null | IPassword[]>(null);
const scrollable = ref<null | HTMLDivElement>(null);
const creating = ref(false);

onMounted(async () => {
  await useDbStore().storePasswords();
  passwordsByQuery.value = JSON.parse(JSON.stringify(useDbStore().passwords));
});

watch(
  () => searchQuery,
  () => {
    updatePasswordsByQuery();
  },
  { deep: true }
);

watch(
  () => useDbStore().$state,
  () => {
    updatePasswordsByQuery();
  },
  { deep: true }
);

async function createNewPassword() {
  creating.value = true;
  let newPassword: IPassword = {
    id: uid(16),
    title: '',
    email: '',
    login: '',
    phoneNumber: '',
    password: '',
    website: '',
    notes: '',
  };

  await useDbStore().writePassword(newPassword);

  if (scrollable.value !== null) {
    scrollable.value.scrollTo({ behavior: 'smooth', top: 0 });
  }

  creating.value = false;
}

async function logout() {
  await useDbStore().logout();
  await router.push(Routes.login);
}

function updatePasswordsByQuery() {
  if (passwordsByQuery === null) return;

  passwordsByQuery.value = JSON.parse(JSON.stringify(useDbStore().passwords));
  passwordsByQuery.value = passwordsByQuery.value!.filter(
    (item) =>
      item.title.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase()) ||
      item.website.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase())
  );
}
</script>

<style scoped>
.h-100-local {
  height: calc(100% - 32px - 25px);
}

.search-container {
  display: flex;
  height: 32px;
  width: 100%;
  column-gap: 10px;
  margin-bottom: 25px;
}

.search-vault-container {
  width: calc(100% - 10px - 40px);
  display: flex;
  align-items: center;
  background-color: rgb(var(--bg-light-color));
  overflow: hidden;
  border-radius: var(--border-radius);
}

.search {
  position: relative;
  width: 100%;
  background-color: transparent;
  font-size: 1.4rem;
  font-weight: 600;
  padding-left: 8px;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 100%;
  font-size: 2rem;
  font-weight: 600;
  padding: 0;
}

.clear-search-button {
  background-color: transparent;
  color: rgb(var(--font-color), 0.5);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  opacity: 0;
  scale: 0.85;
  transition: opacity calc(var(--transition-duration) / 2), scale calc(var(--transition-duration) / 2);
}

.clear-search-button.shown {
  opacity: 1;
  scale: 1;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all var(--transition-duration);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: fixed;
}

.list-placeholder-enter-active,
.list-placeholder-leave-active {
  transition: opacity calc(var(--transition-duration) / 2), transform calc(var(--transition-duration) / 2);
}

.list-placeholder-enter-from {
  transform: translateY(50px);
  opacity: 0;
}

.list-placeholder-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

.scrollable {
  padding-right: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: var(--border-radius);
}

.list-placeholder {
  font-weight: 300;
  font-size: 1.4rem;
  color: rgb(var(--font-color));
  opacity: 0.5;
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity var(--transition-duration);
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

.password-loading-placeholder {
  display: flex;
  height: 80px;
  width: 100%;
  border-radius: var(--border-radius);
  padding: 20px;
  column-gap: 15px;
  margin-bottom: 15px;
}

.image-loading-placeholder {
  aspect-ratio: 1/1;
  height: 100%;
  background-color: rgb(var(--font-color), 0.6);
  border-radius: 50%;
}

.title-loading-placeholder {
  width: 40%;
  height: calc(60% - 5px);
  margin-bottom: 5px;
  background-color: rgb(var(--font-color), 0.4);
  border-radius: 15px;
}

.email-loading-placeholder {
  width: 60%;
  height: 40%;
  background-color: rgb(var(--font-color), 0.2);
  border-radius: 15px;
}
</style>
