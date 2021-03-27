import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routescomp from './routes.js'
import firebase from "firebase/app";

Vue.use(VueRouter)
Vue.config.productionTip = false

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCcfdaM54FTcPalggApKjIs91IHVQHx02E",
    authDomain: "ainran-53c80.firebaseapp.com",
    projectId: "ainran-53c80",
    storageBucket: "ainran-53c80.appspot.com",
    messagingSenderId: "610279484901",
    appId: "1:610279484901:web:4030459d145a75ef67d30c",
    measurementId: "G-5FCQ3EZEE2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const myRouter =  new VueRouter({
  routes:Routescomp,
  mode:'history'
})

new Vue({
  render: h => h(App),
  router:myRouter
}).$mount('#app')

