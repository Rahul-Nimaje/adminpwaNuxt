<template>
  <div v-if="user">
    <div class="field">
      <label for="FristName">First Name</label>
      <InputText
        id="FristName"
        v-model.trim="user.first_name"
        required="true"
        autofocus
        :class="{'p-invalid': submitted && !user.first_name}"
      />
      <small class="p-invalid" v-if="submitted && !user.first_name">First Name is required.</small>
    </div>
    <div class="field">
      <label for="LastName">Last Name</label>
      <InputText id="LastName" v-model.trim="user.last_name" autofocus />
    </div>
    <div class="field">
      <label for="Email Id">Email</label>
      <InputText
        id="emailid"
        v-model.trim="user.emailid"
        required="true"
        autofocus
        :class="{'p-invalid': submitted && !user.emailid}"
      />
      <small class="p-invalid" v-if="submitted && !user.emailid">Email is required.</small>
    </div>
    <div class="field">
      <label for="Mobile">Mobile Number</label>
      <InputText
        id="Mobile"
        v-model.trim="user.mobile"
        required="true"
        autofocus
        :class="{'p-invalid': submitted && !user.mobile}"
      />
      <small class="p-invalid" v-if="submitted && !user.mobile">Mobile is required.</small>
    </div>
    <div class="field">
      <label for="Status">Status</label>
      <Dropdown v-model="selectedStatus" :options="status" />
    </div>
    <div class="field">
      <label for="PassWord">PassWord</label>
      <InputText
        id="PassWord"
        v-model.trim="user.password"
        required="true"
        autofocus
        :class="{'p-invalid': submitted && !user.password}"
      />
      <small class="p-invalid" v-if="submitted && !user.password">Password is required.</small>
    </div>
    <div class="grid justify-content-end">
      <div class="col-3">
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      </div>
      <div class="col-3">
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text p-flex-column"
          :disabled="userValidation()"
          @click="saveUser"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      submitted: false,
      selectedStatus: "Active",
      status: ["Active", "InActive"]
    };
  },
  methods: {
    userValidation() {
      return !this.user.first_name || !this.user.emailid || !this.user.password;
    },
    hideDialog() {
      this.$emit("hideDialog");
    },
    saveUser() {
      this.$emit("saveUser");
    }
  }
};
</script>