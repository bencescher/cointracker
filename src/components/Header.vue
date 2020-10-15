<template>
  <nav class="nav-container">
    <div class="navbar">
      <router-link v-if="!activeUser" class="navbar__link" tag="a" to="/">
        <i class="fas fa-home"></i>
        <span class="hideOnPhone"> Home</span>
      </router-link>
      <router-link v-if="activeUser" class="navbar__link" tag="a" to="/dashboard">
        <i class="fas fa-chart-pie"></i>
        <span class="hideOnPhone"> Dashboard</span>
      </router-link>
      <router-link v-if="activeUser" class="navbar__link" tag="a" to="/new">
        <i class="fas fa-plus"></i>
        <span class="hideOnPhone"> Add new</span>
      </router-link>
      <router-link v-if="activeUser" class="navbar__link" tag="a" to="/transactions">
        <i class="fas fa-list"></i>
        <span class="hideOnPhone"> History</span>
      </router-link>
      <router-link v-if="!activeUser" class="navbar__link" tag="a" to="/register">
        <i class="fas fa-user-plus"></i>
        <span class="hideOnPhone"> Register</span>
      </router-link>
      <router-link v-if="!activeUser" class="navbar__link" tag="a" to="/login">
        <i class="fas fa-sign-in-alt"></i>
        <span class="hideOnPhone"> Login</span>
      </router-link>
      <a @click="logout" v-if="activeUser" class="navbar__link logout">
        <i class="fas fa-sign-out-alt"></i>
        <span class="hideOnPhone"> Logout</span>
      </a>
    </div>
  </nav>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      activeUser: null
    }
  },

  created() {
    if (firebase.auth().currentUser) {
      this.activeUser = firebase.auth().currentUser.email;
    }
  },

  methods: {
    logout() {
      firebase.auth().signOut()
        .then(()=> {
          this.$router.go({ path: this.$router.path })
        })
    }
  }
}
</script>
