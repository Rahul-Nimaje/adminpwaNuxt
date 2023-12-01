<template>
  <div class="text-center">
    <div>
      <Registration :userInfo="userInfo" lable="Your Profile" buttonLabel="Update Profile"/>
    </div>
  </div>
</template>
<script>
import Registration from "./registration.vue";

export default {
  components: { Registration },
  data() {
    return {};
  },
  computed: {
    profileImage() {
      return this.$store.state.user?.user?.image;
    },
    userInfo() {
      return this.$store.state.user?.user;
    }
  }
};
</script>