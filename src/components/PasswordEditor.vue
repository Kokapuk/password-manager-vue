<template>
  <div class="password-editor-container">
    <div class="delete-edit-container">
      <Transition name="edit-save" mode="out-in">
        <Button v-if="!editing" @click="() => (editing = true)"><Pencil class="icon" /> Edit</Button>
        <Button v-else @click="() => savePassword()" :loading="saving"><Check class="icon" /> Save</Button>
      </Transition>
      <Button :loading="deleting" @click="() => (showModal = true)"><Trash class="icon" /> Delete</Button>
      <Button @click="() => emit('leave')"> <Close class="icon" /> Close</Button>
    </div>
    <div class="image-title">
      <div v-if="!imageLoaded" class="image-placeholder blink-loading-placeholoder"></div>
      <img
        v-if="password.website !== ''"
        @load="() => (imageLoaded = true)"
        :class="['image', { loading: !imageLoaded }]"
        :src="`https://www.google.com/s2/favicons?domain=${password.website}&sz=256`"
        :key="password.website" />
      <img v-else @load="() => (imageLoaded = true)" class="image" :src="Globe" />
      <input
        ref="titleInput"
        @keydown="(e) => {if ((e as KeyboardEvent).key == 'Enter') emailInput!.focus()}"
        placeholder="Title"
        :readonly="!editing"
        class="password-title w-100"
        type="text"
        v-model.trim="password.title" />
    </div>
    <div class="seperator"></div>
    <div class="input-container">
      <span class="input-title d-block">Email</span>
      <input
        ref="emailInput"
        @keydown="(e) => {if ((e as KeyboardEvent).key == 'Enter') loginInput!.focus()}"
        :readonly="!editing"
        v-model.trim="password.email"
        class="input"
        type="text" />
      <div class="action-buttons">
        <Tooltip text="Copy" :positioning="TooltipPositioning.top">
          <Button @click="() => setClipboardText(password.email)" class="icon-button"><Copy class="icon" /></Button>
        </Tooltip>
      </div>
    </div>
    <div class="input-container">
      <span class="input-title d-block">Login</span>
      <input
        ref="loginInput"
        @keydown="(e) => {if ((e as KeyboardEvent).key == 'Enter') phoneNumberInput!.focus()}"
        :readonly="!editing"
        v-model.trim="password.login"
        class="input"
        type="text" />
      <div class="action-buttons">
        <Tooltip text="Copy" :positioning="TooltipPositioning.top">
          <Button @click="() => setClipboardText(password.login)" class="icon-button"><Copy class="icon" /></Button>
        </Tooltip>
      </div>
    </div>
    <div class="input-container">
      <span class="input-title d-block">Phone Number</span>
      <input
        ref="phoneNumberInput"
        @keydown="(e) => {if ((e as KeyboardEvent).key == 'Enter') passwordInput!.focus()}"
        :readonly="!editing"
        v-model.trim="password.phoneNumber"
        class="input"
        type="text" />
      <div class="action-buttons">
        <Tooltip text="Copy" :positioning="TooltipPositioning.top">
          <Button @click="() => setClipboardText(password.phoneNumber)" class="icon-button"><Copy class="icon" /></Button>
        </Tooltip>
      </div>
    </div>
    <div class="input-container">
      <span class="input-title d-block">Password</span>
      <input
        ref="passwordInput"
        @keydown="(e) => {if ((e as KeyboardEvent).key == 'Enter') websiteInput!.focus()}"
        :readonly="!editing"
        v-model="password.password"
        class="input"
        :type="showPassword ? 'text' : 'password'" />
      <div class="action-buttons">
        <Tooltip text="Generate password" :positioning="TooltipPositioning.top">
          <Button v-if="editing" @click="() => (password.password = generatePassword())" class="icon-button">
            <CricleArrows class="icon" />
          </Button>
        </Tooltip>

        <Tooltip text="Toggle show" :positioning="TooltipPositioning.top">
          <Button class="icon-button" @click="() => (showPassword = !showPassword)">
            <EyeOff v-if="showPassword" class="icon" />
            <Eye v-else class="icon" />
          </Button>
        </Tooltip>

        <Tooltip text="Copy" :positioning="TooltipPositioning.top">
          <Button @click="() => setClipboardText(password.password)" class="icon-button"><Copy class="icon" /></Button>
        </Tooltip>
      </div>
    </div>
    <div class="input-container">
      <span class="input-title d-block">Website</span>
      <input
        ref="websiteInput"
        @keydown="(e) => {if ((e as KeyboardEvent).key == 'Enter') titleInput!.focus()}"
        @blur="() => websiteInputBlurHandle()"
        placeholder="example.com"
        :readonly="!editing"
        v-model.trim.lazy="password.website"
        class="input"
        type="text" />
    </div>
    <div class="seperator"></div>
    <div class="input-container">
      <span class="input-title d-block">Notes</span>
      <textarea ref="notesInput" v-model.trim="password.notes" style="resize: vertical" :readonly="!editing" class="input" />
    </div>
    <Modal @close="() => (showModal = false)" :show="showModal" title="Are you sure you want to delete this password?">
      <div class="modal-content">
        <Button @click="() => deletePassword()" class="modal-button">Yes</Button>
        <Button @click="() => (showModal = false)" class="modal-button blue">No</Button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import type { IPassword } from './Password.vue';
import Button from './Button.vue';
import Modal from './Modal.vue';
import Pencil from './icons/Pencil.vue';
import Trash from './icons/Trash.vue';
import Copy from './icons/Copy.vue';
import Eye from './icons/Eye.vue';
import EyeOff from './icons/EyeOff.vue';
import CricleArrows from './icons/CricleArrows.vue';
import Close from './icons/Close.vue';
import Check from './icons/Check.vue';
import Globe from '../assets/globe.png';
import { ref, watch } from 'vue';
import { useDbStore } from '@/stores/db';
import Tooltip from './Tooltip.vue';
import { TooltipPositioning } from '@/types';

interface IProps {
  password: IPassword;
}

const props = defineProps<IProps>();
const emit = defineEmits(['leave']);
const editing = ref<boolean>(false);
const password = ref<IPassword>(JSON.parse(JSON.stringify(props.password)));
const showPassword = ref<boolean>(false);
const showModal = ref(false);
const imageLoaded = ref(false);
const saving = ref(false);
const deleting = ref(false);

const titleInput = ref<null | HTMLInputElement>(null);
const emailInput = ref<null | HTMLInputElement>(null);
const loginInput = ref<null | HTMLInputElement>(null);
const phoneNumberInput = ref<null | HTMLInputElement>(null);
const passwordInput = ref<null | HTMLInputElement>(null);
const websiteInput = ref<null | HTMLInputElement>(null);
const notesInput = ref<null | HTMLTextAreaElement>(null);

watch(
  () => props.password,
  (newValue, oldValue) => {
    if (!newValue) return;

    if (oldValue && newValue.id !== oldValue.id) {
      editing.value = false;
      password.value = JSON.parse(JSON.stringify(props.password));
      showPassword.value = false;
      imageLoaded.value = false;
    }
  },
  { deep: true }
);

function setClipboardText(text: string) {
  navigator.clipboard.writeText(text);
}

async function savePassword() {
  if (JSON.stringify(props.password) !== JSON.stringify(password.value)) {
    saving.value = true;
    await useDbStore().writePassword(password.value);
    saving.value = false;
  }

  editing.value = false;
}

async function deletePassword() {
  showModal.value = false;
  deleting.value = true;
  await useDbStore().deletePassword(password.value.id);
  emit('leave');
  deleting.value = false;
}

function generatePassword() {
  const charset = '1234567890qwertyuiopasdfghjklzxcvbnm';
  let result = '';

  for (let index = 0; index < 20; index++) {
    let char = charset[Math.floor(Math.random() * charset.length)];

    if (Math.random() >= 0.5) {
      char = char.toUpperCase();
    }

    result += char;
  }

  return result;
}

function websiteInputBlurHandle() {
  let result = password.value.website.replace('http://', '').replace('https://', '').replace('www.', '');
  result = result.split('/')[0];
  password.value.website = result;
}
</script>

<style scoped>
.password-editor-container {
  padding: 0 100px 0 100px;
}

.delete-edit-container {
  display: flex;
  height: 32px;
  width: 100%;
  column-gap: 10px;
  margin-bottom: 25px;
  justify-content: right;
}

.edit-save-enter-active,
.edit-save-leave-active {
  pointer-events: none;
  transition: transform calc(var(--transition-duration) / 2), opacity calc(var(--transition-duration) / 2);
}

.edit-save-enter-from {
  transform: translateY(25px);
  opacity: 0;
}
.edit-save-leave-to {
  transform: translateY(-25px);
  opacity: 0;
}

.button {
  background-color: rgb(var(--bg-color));
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  white-space: pre;
}

.icon {
  opacity: 0.5;
}

.image-title {
  box-sizing: content-box;
  display: flex;
  align-items: center;
  column-gap: 25px;
  height: 50px;
}

.seperator {
  border-bottom: 2px solid rgba(var(--font-color), 0.1);
  margin: 25px 0 25px 0;
}

.image-placeholder {
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

.image {
  border-radius: var(--border-radius);
  height: 100%;
  aspect-ratio: 1/1;
}

.image.loading {
  display: none;
}

.password-title {
  font-size: 20px;
  font-weight: 700;
  background-color: transparent;
}

.input-container {
  position: relative;
  transition: background-color var(--transition-duration);
  border-radius: var(--border-radius);
  padding: 15px 10px;
  margin-bottom: 10px;
}

.input-container:hover {
  background-color: rgb(var(--bg-color));
}

.input-title {
  font-size: 1.4rem;
  color: rgb(var(--font-color));
  opacity: 0.5;
  margin-bottom: 5px;
}

.action-buttons {
  opacity: 0;
  display: flex;
  position: absolute;
  right: 10px;
  top: calc(50% - 16px);
  column-gap: 5px;
  transition: opacity var(--transition-duration);
}

.input-container:hover .action-buttons {
  opacity: 1;
}

.icon-button {
  padding: 4px 8px;
  background-color: transparent;
}

.input {
  width: 100%;
  background-color: transparent;
  font-size: 1.4rem;
}

.modal-content {
  display: flex;
  width: 100%;
  justify-content: right;
  column-gap: 10px;
}

.modal-button {
  font-size: 2rem;
  font-weight: 500;
  height: auto;
  padding: 8px 12px;
}

.modal-button.blue {
  background-color: rgb(var(--accent-color));
}

@media (max-width: 800px) {
  .password-editor-container {
    padding: 0;
  }
}
</style>
