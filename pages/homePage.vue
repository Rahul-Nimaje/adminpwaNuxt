<template>
  <div class="backgroundImage">
      <Login/>
</div>
  </template>

  <script>
import Login from '../components/Login.vue';


  export default {
    name: "IndexPage",
    data() {
        return {};
    },
    mounted() {
        console.log("Ennnnnnnnnnnv", process.env.API_URL); // Access the API_URL environment variable
        console.log(process.env.DEBUG);
    },
    components: { Login }
}
  </script>