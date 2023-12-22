<template>
  <div>
    <nav class="p-menubar grid navbar-header">
      <Sidebar class="col-2 mx-2" />
      <h5 class="col-5 md:col-6" style="color:white">Welcome to Admin Dashbord</h5>
      <Button @click="redirect" class="p-button-text">
        <i class="pi pi-user col-1" style="color:white"></i>
      </Button>
      <Button @click="logOutUser" class="p-button-text">
        <i class="pi pi-sign-out col-1" style="color:white"></i>
      </Button>
      <Dialog :visible.sync="openDialog" :containerStyle="{width: '60%'}">
        <ConfirmDialog
          :message="`Are you sure you want to Log Out!`"
          @confirmAction="()=>{
          $store.commit('logoutUser');
          openDialog=false
          }"
          @closeAction="openDialog=false"
        />
      </Dialog>
    </nav>
  </div>
</template>
<script>
import Sidebar from "./sidebarcomponents.vue";
import ConfirmDialog from "./confirmationDialog.vue";
export default {
  components: { Sidebar, ConfirmDialog },
  data() {
    return {
      search: null,
      openDialog: false,
      items: [
        {
          label: "Collections"
          //  to:"/",
        }
      ]
    };
  },
  methods: {
    redirect() {
      console.log("checcccccccccc");
      this.$router.push("/userprofile");
    },
    logOutUser() {
      this.openDialog = true;
    }
  }
};
</script>