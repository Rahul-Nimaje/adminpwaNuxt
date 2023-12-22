<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
          <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
            :disabled="!selectedUser || !selectedUser.length" />
        </template>

        <template #end>
          <input class="pa-4" type="file" ref="file" style="display: none" v-on:change="FileUpload($event)" />

          <Button v-bind="$attrs" v-on="$listeners" label="Import" @click="$refs.file.click()"></Button>
          <Button label="Export" icon="pi pi-upload" class="p-button-help mx-2" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <DataTable ref="dt" :value="categoryList" :selection.sync="selectedUser" data-key="id" :paginator="true" :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
        responsiveLayout="scroll" :key="updateUserKey">
        <template #header>
          <div class="table-header flex flex-column md:flex-row md:justify-content-between">
            <h5 class="mb-2 md:m-0 md:align-self-center">Manage Category</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </span>
          </div>
        </template>

        <Column selectionMode="multiple" :styless="{ width: '3rem' }" :exportable="false"></Column>
        <Column field="id" header="Employee Id" :sortable="true" :styles="{ 'min-width': '12rem' }"></Column>
        <Column field="category_name" header="category_name" :sortable="true" :styles="{ 'min-width': '16rem' }"></Column>
        <Column field="category_type" header="category_type" :sortable="true" :styles="{ 'min-width': '8rem' }"></Column>
        <Column field="parent_id" header="parent_id" :sortable="true" :styles="{ 'min-width': '10rem' }"></Column>
        <Column field="status" header="Status" :sortable="true" :styles="{ 'min-width': '10rem' }"></Column>
        <Column field="createdAt" header="createdAt" :sortable="true" :styles="{ 'min-width': '10rem' }"></Column>
        <Column :exportable="false" :styles="{ 'min-width': '8rem' }">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
              @click="editUser(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning"
              @click="confirmDeleteUser(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog :visible.sync="userDialog" :style="{ width: '600px' }" header="Category" :modal="true" class="p-fluid">
      <Card flat class="flat-card"> <template #content>
          <Categoryform @hideDialog="hideDialog" @saveCategory="saveCategory" :userAction="action" :user="user" />
        </template></Card>
    </Dialog>

    <Dialog :visible.sync="deleteUserDialog" :styles="{ width: '450px' }" header="Confirm" :modal="true">
      <confirmationDialog :message="message" :deleteAll="deleteAll" @confirmAction="deleteUser"
        @closeAction="deleteUserDialog = false" />
    </Dialog>
  </div>
</template>
<script>
// import user from ''
import userForm from "@/components/userForm.vue";
import confirmationDialog from "./confirmationDialog.vue";
import _ from "lodash";
import Categoryform from "./categoryform.vue";
export default {
  components: { userForm, confirmationDialog, Categoryform },
  data() {
    return {
      categoryList: [],
      userDialog: false,
      deleteUserDialog: false,
      user: {},
      selectedUser: null,
      filters: {},
      submitted: false,
      selectedStatus: "Active",
      status: ["Active", "InActive"],
      oldUserData: {},
      message: null,
      deleteAll: false,
      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" }
      ],
      updateUserKey: 0,
      action: "update"
    };
  },
  async created() {
    this.initFilters();
    await this.fetchCategory()
  },
  methods: {
    async fetchCategory() {
      this.categoryList = await this.getcategoryList();
    },
    FileUpload(e) {
      var file = e.target.files[0];
      this.$papa.parse(file, {
        header: true,
        complete: this.onComplete
      });
    },
    async onComplete(results, file) {
      console.log("file.........", file, results);
      let importData = results?.data || [];
      importData.pop();
      const userCreatedData = await this.bulkCreateUser([...importData]);
      if (userCreatedData) {
        await this.fetchUser();
      }
    },
    openNew() {
      this.user = {};
      this.submitted = false;
      this.userDialog = true;
      this.action = "add";
    },
    hideDialog() {
      this.userDialog = false;
      this.submitted = false;
    },
    async saveCategory(category) {
      console.log("action",category);
      this.action == "add"
        ? await this.addCategoryData(category)
        : await this.editUserData(category);
    },
    async addCategoryData(category) {
      const categorySaved = await this.addCategories(category);
      if (categorySaved) {
        this.userDialog = false;
        await this.fetchCategory();
      }
    },
    async editUserData(user) {
      if (_.isEqual(user, this.oldUserData)) {
        this.setToast("error", "Changes", "No Changes Found");
        return true;
      }
      const userUpdated = await this.updateUser(user, {
        severity: "success",
        subject: "User Update",
        details: "User Updates Successfully"
      });
      if (userUpdated) {
        await this.updateUserList(userUpdated);
        this.userDialog = false;
      }
    },
    async updateUserList(user) {
      let userUpdate = await this.userList.find(obj => obj.id === user.id);
      for (let key in user) {
        Object.keys(userUpdate).includes(key)
          ? (userUpdate[key] = user[key])
          : null;
      }
      this.updateUserKey++;
    },
    editUser(user) {
      this.user = { ...this.oldUserData } = user;
      this.userDialog = true;
      this.action = 'update'
    },
    confirmDeleteUser(user) {
      this.user = user;
      this.deleteUserDialog = true;
      this.message = `Are you sure you want to delete ${this.user.fullName}`;
    },
    async deleteUser() {
      let users = [];
      users = this.selectedUser || users.push(this.user);
      await this.deleteUserFunc(users);
      this.user = {};
      this.selectedUser = [];
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async confirmDeleteSelected() {
      this.message = `Are you sure you want to delete`;
      this.deleteAll = true;
      this.deleteUserDialog = true;
    },
    async deleteUserFunc(users) {
      const deletedUser = await this.deleteUsers(users);
      if (deletedUser) {
        this.userList = this.userList.filter(obj => {
          return !users.some(user => user.id === obj.id);
        });
        this.deleteUserDialog = false;
      }
    },
    initFilters() {
      this.filters = {
        global: { value: null }
      };
    }
  }
};
</script>
<style scoped>
.flat-card {
  box-shadow: none;
  border: 0px solid #ddd;
  /* Add a border for a separation effect */
}
</style>