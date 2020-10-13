import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import router from "./router";
import store from "./store";
import "./assets/sass/main.scss";
import "./assets/css/all.css";

Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(() => {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
})
