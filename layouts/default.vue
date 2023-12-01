<!-- layouts/default.vue -->
<template>
  <div>
    <!-- Header section -->
    
    <!-- Main content section -->
    <main>
      <Header v-if="$route.path!='/'&&$route.path!='/login' &&$route.path!='/homepage'">
      <!-- Your header content goes here -->
    </header>
      <Nuxt />
    </main>
    <Toast />
    <!-- Footer section -->
    <footer>
      <!-- Your footer content goes here -->
    </footer>
  </div>
</template>
  <script>
import Header from "../components/header.vue";
export default {
  components: { Header }
};
</script>
  