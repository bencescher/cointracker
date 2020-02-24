<template>
  <nav class="nav-container">
    <div class="navbar">
      <router-link tag="a" to="/">Home</router-link>
      <router-link tag="a" to="/login">Login</router-link>
      <router-link tag="a" to="/register">Register</router-link>
      <router-link tag="a" to="/dashboard">Dashboard</router-link>
      <router-link tag="a" to="/transactions">History</router-link>
    </div>
  </nav>
</template>

<style lang="scss">
.navbar {
  background-color: steelblue;
  color: #fff;
  height: 4rem;
  padding: 1rem;

  & a {
    color: inherit;
    font-size: 1.4rem;
    padding: 1rem;
    transition: all .2s ease;

    &, &:link, &:visited {
      text-decoration: none;
    }

    &:hover {
      background-color: #fff;
      color: steelblue;
    }
  }
}
</style>
