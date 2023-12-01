<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
          <Button
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
        </template>

        <template #end>
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="1000000"
            label="Import"
            chooseLabel="Import"
            class="mr-2 inline-block"
          />
          <Button
            label="Export"
            icon="pi pi-upload"
            class="p-button-help"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="userList"
        :selection.sync="selectedProducts"
        data-key="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        responsiveLayout="scroll"
        :key="updateUserKey"
      >
        <template #header>
          <div class="table-header flex flex-column md:flex-row md:justify-content-between">
            <h5 class="mb-2 md:m-0 md:align-self-center">Manage Users</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </span>
          </div>
        </template>

        <Column selectionMode="multiple" :styless="{width: '3rem'}" :exportable="false"></Column>
        <Column field="id" header="Employee Id" :sortable="true" :styles="{'min-width':'12rem'}"></Column>
        <Column field="fullName" header="Name" :sortable="true" :styles="{'min-width':'16rem'}"></Column>
        <Column field="mobile" header="Mobile" :sortable="true" :styles="{'min-width':'8rem'}"></Column>
        <Column field="emailid" header="Email" :sortable="true" :styles="{'min-width':'10rem'}"></Column>
        <Column field="status" header="Status" :sortable="true" :styles="{'min-width':'10rem'}"></Column>
        <Column
          field="createdAt"
          header="createdAt"
          :sortable="true"
          :styles="{'min-width':'10rem'}"
        ></Column>
        <Column :exportable="false" :styles="{'min-width':'8rem'}">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      :visible.sync="userDialog"
      :style="{width: '450px'}"
      header="User Details"
      :modal="true"
      class="p-fluid"
    >
      <userForm @hideDialog="hideDialog" @saveUser="saveUser" :userAction="action" :user="user" />
    </Dialog>

    <Dialog
      :visible.sync="deleteUserDialog"
      :styles="{width: '450px'}"
      header="Confirm"
      :modal="true"
    >
      <confirmationDialog
        :message="`Are you sure you want to delete ${user.fullName}`"
        @confirmAction="deleteUser"
        @closeAction="deleteUserDialog=false"
      />
    </Dialog>
  </div>
</template>
<script>
// import user from ''
import userForm from "@/components/userForm.vue";
import confirmationDialog from "./confirmationDialog.vue";
import _ from "lodash";
export default {
  components: { userForm, confirmationDialog },
  data() {
    return {
      userList: [],
      userDialog: false,
      deleteUserDialog: false,
      deleteProductsDialog: false,
      user: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      selectedStatus: "Active",
      status: ["Active", "InActive"],
      oldUserData: {},
      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" }
      ],
      updateUserKey: 0,
      action: "update"
    };
  },
  //   productService: null,
  created() {
    // this.productService = new ProductService();
    this.initFilters();
  },
  async mounted() {
    this.userList = await this.getUserList();
    console.log("userrrrrrrrrrrlist", this.userList);
  },
  methods: {
    formatCurrency(value) {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        });
      return;
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
    async saveUser(user, actions) {
      console.log("action", actions);
      actions == "add"
        ? await this.addUserData(user)
        : await this.editUserData(user);
    },
    async addUserData(user) {
      const userSaved = await this.addUser(user);
      if (userSaved) {
        this.userDialog = false;
      }
    },
    async editUserData() {
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
    editProduct(user) {
      console.log("productttttttttttttt", user);

      this.user = { ...this.oldUserData } = user;
      this.userDialog = true;
    },
    confirmDeleteProduct(user) {
      console.log("user.......", user);
      this.user = user;
      this.deleteUserDialog = true;
    },
    async deleteUser() {
      console.log("usersssssssssssdelete", this.user);
      let users = [];
      users.push(this.user);
      const deletedUser = await this.deleteUsers(users);
      if (deletedUser) {
        this.userList = this.userList.filter(obj => {
          return !users.some(user => user.id === obj.id);
        });
        this.deleteUserDialog = false;
      }
      this.user = {};
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }

      return index;
    },
    createId() {
      let id = "";
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      console.log("delete products");
      this.deleteProductsDialog = true;
    },
    deleteSelectedProducts() {
      this.products = this.products.filter(
        val => !this.selectedProducts.includes(val)
      );
      this.deleteProductsDialog = false;
      this.selectedProducts = null;
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Products Deleted",
        life: 3000
      });
    },
    initFilters() {
      this.filters = {
        global: { value: null }
      };
    }
  }
};
</script>