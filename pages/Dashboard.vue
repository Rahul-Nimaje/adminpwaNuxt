<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    console.log("user from store", this.$store.state.user);
  }
};
</script>