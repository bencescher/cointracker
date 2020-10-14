import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import router from "./router";
import store from "./store";
import "./assets/sass/main.scss";
import "./assets/css/all.css";

Vue.config.productionTip = false;

// vue filter for currency format
Vue.filter('currency-format', (value)=> {
  return value.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
});

firebase.auth().onAuthStateChanged(() => {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
})
