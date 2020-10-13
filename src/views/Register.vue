<template>
  <section class="container">
    <div class="formbox card">
      <header class="formbox--header">
        <h2>New user</h2>
      </header>
      <section class="formbox--content">
        <form class="form">
          <div class="form__group">
            <label for="email">Email address</label>
            <input
              class="form__input"
              type="email"
              name="email"
              required
            />
          </div>
          <div class="form__group">
            <label for="password">Password</label>
            <input
              class="form__input"
              type="password"
              name="password"
              required
            />
          </div>
          <div class="form__group">
            <button class="btn btn--green" type="submit">Register</button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: "register",

  data() {
    return {
      
    }
  }
}
</script>
