import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routescomp from './routes.js'
import firebase from "firebase/app";

Vue.use(VueRouter)
Vue.config.productionTip = false

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyABxUaQe2EBsPii9aHgVxrqIm4vENaVqGA",
    authDomain: "ainran-4df4d.firebaseapp.com",
    projectId: "ainran-4df4d",
    storageBucket: "ainran-4df4d.appspot.com",
    messagingSenderId: "198092064649",
    appId: "1:198092064649:web:82c3b6e5630ea616618358",
    measurementId: "G-Y87X8D2R0B"
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

