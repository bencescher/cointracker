import firebase from "firebase";
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
    component: () => import("../views/Landing.vue"),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: () => import("../views/Transactions.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/new",
    name: "NewTransaction",
    component: () => import("../views/NewTransaction.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/edit/:transactionId",
    name: "EditTransaction",
    component: () => import("../views/EditTransaction.vue"),
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // check if route requires auth
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    // check auth state of user
    if (firebase.auth().currentUser) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else if (to.matched.some(rec => rec.meta.requiresGuest)) {
    if (!firebase.auth().currentUser) {
      next();
    } else {
      next({ name: "Dashboard" });
    }
  } else {
    next();
  }
});

export default router;
