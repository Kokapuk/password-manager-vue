import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initializeApp } from 'firebase/app';
import { browserSessionPersistence, getAuth, setPersistence } from 'firebase/auth';

import App from './App.vue';
import router from './router';

import './assets/base.css';
import './assets/utils.css';
import './assets/loading-indicator.css';

initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'password-mngr.firebaseapp.com',
  databaseURL: 'https://password-mngr-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'password-mngr',
  storageBucket: 'password-mngr.appspot.com',
  messagingSenderId: '910296004946',
  appId: '1:910296004946:web:4b7b3a37ea30f940fd628b',
});

setPersistence(getAuth(), browserSessionPersistence);

let app: any = null;

getAuth().onAuthStateChanged(() => {
  if (app !== null) return;

  app = createApp(App);

  app.use(createPinia());
  app.use(router);

  app.mount('#app');
});
