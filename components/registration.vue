<template>
  <Card>
    <template #title>
      <div class="text-center">{{ labelRegistartion }}</div>
    </template>
    <template #content>
      <form @submit.prevent="registerUser" class="grid p-fluid registration-form">
        <ProfileImage
          :key="updateKey"
          @imageUpload="imageUpload"
          :image="useData.image"
          class="col-12 md:col-12"
        />
        <div class="col-12 md:col-6">
          <span class="p-float-label" style="margin:20px">
            <InputText :required="!userInfo" id="username" v-model="useData.first_name" />
            <label for="username">First Name</label>
          </span>
        </div>
        <div class="col-12 md:col-6">
          <span class="p-float-label" style="margin:20px">
            <InputText id="last_name" v-model="useData.last_name" />
            <label for="last_name">Last Name</label>
          </span>
        </div>
        <div class="col-12 md:col-6">
          <span class="p-float-label" style="margin:20px">
            <InputText
              :required="!userInfo"
              id="mobile"
              @keypress="onlyNumber"
              :minlength="maxMobileLength"
              :maxlength="maxMobileLength"
              v-model="useData.mobile"
            />
            <label for="mobile">Mobile</label>
          </span>
        </div>
        <div class="col-12 md:col-6">
          <span class="p-float-label" style="margin:20px">
            <InputText
              id="emailid"
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              :required="!userInfo"
              v-model="useData.emailid"
            />
            <label for="emailid">Email</label>
          </span>
        </div>
        <div class="col-12 md:col-6">
          <span class="p-float-label" style="margin:20px">
            <Password :required="!userInfo" v-model="useData.password" toggleMask />
            <label for="password">Password</label>
          </span>
        </div>
        <Button :label="buttonLabel||'Register User'" icon="pi pi-user-plus" type="submit" />
      </form>
    </template>
  </Card>
</template>
   </Card>
</template>
<script>
import catalog from "@/services/catalog";
// import myMixin from "~/mixins/generalmixins";
import ProfileImage from "./profileImage.vue";

export default {
  // mixins: [myMixin],
  props: {
    userInfo: {
      type: [Object]
    },
    lable: String,
    buttonLabel: String
  },
  data() {
    return {
      useData: {
        first_name: null,
        last_name: null,
        mobile: null,
        emailid: null,
        password: null
      },
      updateKey: 0,
      labelRegistartion: null,
      maxMobileLength: 10
    };
  },
  beforeMount() {
    console.log("registration ", this.userInfo);
    this.labelRegistartion = this.lable ? this.lable : "Registration";
    if (this.userInfo) {
      this.useData = { ...this.userInfo };
    }
  },
  computed: {},
  methods: {
    imageUpload(image) {
      console.log("imageeeeeeeeeee",image)
      this.useData.image = image;
      this.updateKey++;
    },
    async registerUser() {
      try {
        if (this.userInfo) {
          delete this.useData.token;
          const toast = {
            severity: "success",
            subject: "Profile Update",
            details: "Profile Updated SuccessFully"
          };
          let data = await this.updateUser(this.useData, toast);
          return;
        }
        let data = await catalog.post("/users/register", this.useData);
        console.log("data.......", typeof data.data);
        typeof data.data == "string"
          ? this.setToast("error", "Success Message", "User Already Register")
          : this.setToast(
              "success",
              "Success Message",
              "User  Registered Successfully"
            );
      } catch (err) {
        // For Error Handling
        throw new Error(err);
      }
    },
    onlyNumber($event) {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    }
  },
  components: { ProfileImage }
};
</script>
