import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/"
  },
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue")
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: () => import("../views/Transactions.vue")
  },
  {
    path: "/new",
    name: "NewTransaction",
    component: () => import("../views/NewTransaction.vue")
  },
  {
    path: "/edit/:transactionId",
    name: "EditTransaction",
    component: () => import("../views/EditTransaction.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
