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
      <userForm @hideDialog="hideDialog" @saveUser="saveUser" :user="user" />
    </Dialog>

    <Dialog
      :visible.sync="deleteProductDialog"
      :styles="{width: '450px'}"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="user">
          Are you sure you want to delete
          <b>{{user.fullName}}</b>?
        </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductDialog = false"
        />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
      </template>
    </Dialog>

    <Dialog
      :visible.sync="deleteProductsDialog"
      :styles="{width: '450px'}"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="user">Are you sure you want to delete the selected products?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
  </div>
</template>
<script>
// import user from ''
import userForm from "@/components/userForm.vue";
export default {
  components: { userForm },
  data() {
    return {
      userList: [],
      userDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      user: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      selectedStatus: "Active",
      status: ["Active", "InActive"],
      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" }
      ]
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
    },
    hideDialog() {
      this.userDialog = false;
      this.submitted = false;
    },
    saveUser() {
      console.log("test", this.submitted);
      this.submitted = true;

      //   if (this.user.first_name.trim()) {
      //     if (this.product.id) {
      //       this.product.inventoryStatus = this.product.inventoryStatus.value
      //         ? this.product.inventoryStatus.value
      //         : this.product.inventoryStatus;
      //       this.products[this.findIndexById(this.product.id)] = this.product;
      //       this.$toast.add({
      //         severity: "success",
      //         summary: "Successful",
      //         detail: "Product Updated",
      //         life: 3000
      //       });
      //     } else {
      //       this.product.id = this.createId();
      //       this.product.code = this.createId();
      //       this.product.image = "product-placeholder.svg";
      //       this.product.inventoryStatus = this.product.inventoryStatus
      //         ? this.product.inventoryStatus.value
      //         : "INSTOCK";
      //       this.products.push(this.product);
      //       this.$toast.add({
      //         severity: "success",
      //         summary: "Successful",
      //         detail: "Product Created",
      //         life: 3000
      //       });
      //     }

      //     this.userDialog = false;
      //     this.product = {};
      //   }
    },
    editProduct(user) {
      console.log("productttttttttttttt", user);
      this.user = { ...user };
      this.userDialog = true;
    },
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductDialog = true;
    },
    deleteProduct() {
      this.user = this.user.filter(val => val.id !== this.user.id);
      this.deleteProductDialog = false;
      this.product = {};
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000
      });
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