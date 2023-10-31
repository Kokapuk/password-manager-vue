import { defineStore } from 'pinia';
import type { IPassword } from '@/components/Password.vue';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { ref as dbref, getDatabase, get, set, remove, child } from 'firebase/database';
import { ref } from 'vue';

export const useDbStore = defineStore('db', () => {
  const passwords = ref<IPassword[]>([]);

  async function storePasswords() {
    const refToDb = dbref(getDatabase());
    const snapshot = await get(child(refToDb, `users/${getAuth().currentUser!.uid}/passwords`));

    if (!snapshot.exists()) {
      passwords.value = [];
      return;
    }

    const passwordList: IPassword[] = [];

    snapshot.forEach((childSnapshot) => {
      passwordList.push(childSnapshot.val());
    });

    passwordList.sort((a, b) => a.title.localeCompare(b.title));
    passwords.value = passwordList;
  }

  async function writePassword(password: IPassword) {
    const db = getDatabase();

    await set(dbref(db, `users/${getAuth().currentUser!.uid}/passwords/${password.id}`), password);
    await storePasswords();
  }

  async function deletePassword(id: string) {
    await remove(dbref(getDatabase(), `users/${getAuth().currentUser!.uid}/passwords/${id}`));
    await storePasswords();
  }

  async function register(email: string, password: string) {
    await createUserWithEmailAndPassword(getAuth(), email, password);
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(getAuth(), email, password);
  }

  async function logout() {
    await signOut(getAuth());
    passwords.value = [];
  }

  async function sendVerification() {
    await sendEmailVerification(getAuth().currentUser as User);
  }

  return { passwords, storePasswords, writePassword, deletePassword, register, login, logout, sendVerification };
});
