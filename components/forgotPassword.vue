<template>
  <div>
    <div class="text-center">
      <span>Forgot Password</span>
    </div>
    <div class="text-center row">
      <div class="col-12">
        <InputText
          id="username"
          class="p-inputtext-sm"
          placeholder="Enter Email/Mobile"
          required
          v-model="userName"
        />
      </div>
      <div class="col-12">
        <Password
          toggleMask
          class="p-inputtext-sm"
          placeholder="New Password"
          required
          v-model="passWord"
        />
      </div>
      <div>
        <Button class="p-button-sm" @click="forgotPassword" label="Submit" />
      </div>
    </div>
  </div>
</template>
<script>
import user from "@/services/user";
export default {
  data() {
    return {
      userName: null,
      passWord: null
    };
  },
  methods: {
    async forgotPassword() {
        let forgotPassWordData = {
          emailid: this.userName,
          mobile:this.userName,
          password: this.passWord
        };
       this.$emit('forgotPassword',forgotPassWordData)
    }
  }
};
</script>