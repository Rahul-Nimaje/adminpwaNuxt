<!-- YourComponent.vue -->
<template>
  <div class="center-container">
    <Card >
      <template #title>
        <h6 class="text-center" style="margin:0px">Login To Admin Panel</h6>
       <div class="text-center mt-2"><Avatar color="red" icon="pi pi-user" size="large"></Avatar></div> 
      </template>
      <template #content>
        <form @submit.prevent="loginUser">
          <span class="p-float-label" style="margin:20px">
            <InputText id="username" required v-model="userName" />
            <label for="username">Email | Mobile</label>
          </span>
          <span class="p-float-label" style="margin:20px">
            <Password toggleMask required v-model="password" />
            <label for="Password">Password</label>
          </span>
          <div class="text-center">
            <Button type="submit" icon="pi pi-user" label="Login" class="p-button-success" />
          </div>
        </form>
        <Button
          class="forgotpassword p-button-danger p-button-text"
          label="Forgot Password"
          @click="openDialog"
        ></Button>
      </template>
    </Card>
    <Dialog :visible.sync="displayBasic" :containerStyle="{width: '70vw'}">
      <forgotPassword @forgotPassword="forgotPassword" />
    </Dialog>
  </div>
</template>
  
  <script>
import catalog from "@/services/catalog";
// import myMixin from "~/mixins/generalmixins";
import forgotPassword from "./forgotPassword.vue";
export default {
  // mixins: [myMixin],
  components: { forgotPassword },
  data() {
    return {
      userName: null,
      password: null,
      displayBasic: false
    };
  },
  methods: {
    openDialog() {
      console.log("checccccccccccc");
      this.displayBasic = true;
    },
    async loginUser() {
      console.log("Input Data", this.userName, this.password);
      try {
        const data = await catalog.post("/users/login", {
          username: this.userName,
          password: this.password
        });
        console.log("userData..........", data);
        if (data) {
          await this.redirectToHomePage(data);
        } else {
          this.showError();
        }
      } catch (err) {
        //error handling
        console.log("catch erro", err);
        this.showError();
        throw new Error(err);
      }
    },
    redirectToHomePage(userInfo) {
      this.$router.push("/dashboard");
      delete userInfo.createdAt;
      delete userInfo.updatedaT;
      this.$store.dispatch("userInfo", userInfo);
      this.setToast(
        "success",
        "Success Message",
        "User Logged in successFully"
      );
    },
    showError() {
      this.setToast("error", "Error Message", "Username Or Password wrong");
    },
    async forgotPassword(forgotPassWordData) {
      const toast = {
        severity: "success",
        subject: "Password Change",
        details: "Password Changed SuccessFully"
      };
      await this.updateUser(forgotPassWordData, toast);
      this.displayBasic = false;
    }
  },
  mounted() {
    console.log("this.$store.state.userData", this.$store.state.user.userData);
  }
};
</script>
  <style >
</style>
