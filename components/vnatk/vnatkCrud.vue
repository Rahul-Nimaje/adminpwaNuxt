<template>
  <div>
    <Dialog :visible.sync="displayBasic" :containerStyle="{width: '60vw'}">
        <input-field @closedialog="displayBasic=false" :modelData="userData" />
    </Dialog>
    <Button label="ADD" @click="displayBasic=true" />
  </div>
</template>
<script>
import Button from "primevue/button/Button";
import inputField from "./inputfields.vue";
export default {
  components: { inputField, Button },
  props:{
    options:{
      type:[Object],
    }
  },
  data() {
    return {
      userData: [],
      model: "User",
      displayBasic:false
    };
  },
  computed: {},
  methods: {
    async addCatalogUser() {
      const Data = await this.adduser({ model: "user" });
      console.log("userrrrrrr", Data);
      this.userData = Data;
    //   this.userData.service=
    }
  },
  mounted() {
    this.addCatalogUser();
  }
};
</script>