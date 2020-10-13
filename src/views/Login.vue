<template>
  <section class="container">
    <div class="formbox card">
      <header class="formbox--header">
        <h2>Existing user</h2>
      </header>
      <section class="formbox--content">
        <form class="form">
          <div class="form__group">
            <input
              class="form__input"
              name="email"
              placeholder="Email address"
              required
              type="email"
              v-model="email"
            />
            <label class="form__label" for="email">Email address</label>
          </div>
          <div class="form__group">
            <input
              class="form__input"
              name="password"
              placeholder="Password"
              required
              type="password"
              v-model="password"
            />
            <label class="form__label" for="password">Password</label>
          </div>
          <div class="form__group">
            <button
              @click.prevent="login()" 
              class="btn btn--green"
              type="submit">Login
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<script>
import firebase from "firebase";

export default {
  name: "login",

  data() {
    return {
      email: "",
      password: ""
    }
  },

  methods: {
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.go({ path: this.$router.path })
        },
      err => {
        alert(err.message)
      })
    }
  }
}
</script>