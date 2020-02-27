<template>
  <div id="app">
    <app-header></app-header>
    <main class="view-content">
      <transition name="slide" mode="out-in">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script>
import Header from "./components/Header";

export default {
  components: {
    "app-header": Header
  }
};
</script>
