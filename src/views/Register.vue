<template>
  <section class="container">
    <div class="formbox card">
      <header class="formbox--header">
        <h2>New user</h2>
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
              @click.prevent="register"
              class="btn btn--green"
              type="submit"
            >Register</button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<script>
import firebase from "firebase";

export default {
  name: "register",

  data() {
    return {
      email: "",
      password: ""
    }
  },

  methods: {
    register() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          alert('Account created for ' + user.user.email + '. You will now be redirected to your dashboard.')
          this.$router.go({ path: this.$router.path })
        })
        .catch(() => alert('Could not create user for ' + this.email + '. Please try to use another e-mail address and/or password!'))
    }
  }
}
</script>
