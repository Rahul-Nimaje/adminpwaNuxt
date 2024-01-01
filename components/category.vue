<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
          <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
            :disabled="!selectedcategory || !selectedcategory.length" />
        </template>

        <template #end>
          <input class="pa-4" type="file" ref="file" style="display: none" v-on:change="FileUpload($event)" />

          <Button v-bind="$attrs" v-on="$listeners" label="Import" @click="$refs.file.click()"></Button>
          <Button label="Export" icon="pi pi-upload" class="p-button-help mx-2" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <DataTable ref="dt" :value="categoryList" :selection.sync="selectedcategory" data-key="id" :paginator="true"
        :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categorys" responsiveLayout="scroll"
        :key="updatecategoryKey">
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
        <Column field="id" header="Category Id" :sortable="true" :styles="{ 'min-width': '12rem' }"> </Column>
        <Column header="category Image" :sortable="true" :styles="{ 'min-width': '12rem' }"><template #body="slotProps">
            <img v-if="slotProps.data.image" :src="`${slotProps.data.image}`" :alt="slotProps.data.image" class="w-6rem shadow-2 border-round" />
          </template></Column>
        <Column field="category_name" header="category_name" :sortable="true" :styles="{ 'min-width': '16rem' }"></Column>
        <Column field="category_type" header="category_type" :sortable="true" :styles="{ 'min-width': '8rem' }"></Column>
        <Column field="parent_id" header="parent_id" :sortable="true" :styles="{ 'min-width': '10rem' }"></Column>
        <Column field="status" header="Status" :sortable="true" :styles="{ 'min-width': '10rem' }"></Column>
        <Column field="createdAt" header="createdAt" :sortable="true" :styles="{ 'min-width': '10rem' }"></Column>
        <Column :exportable="false" :styles="{ 'min-width': '8rem' }">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
              @click="editcategory(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning"
              @click="confirmDeletecategory(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog :visible.sync="categoryDialog" :style="{ width: '600px' }" header="Category" :modal="true" class="p-fluid">
      <Card flat class="flat-card"> <template #content>
          <categoryForm @hideDialog="hideDialog" @saveCategory="saveCategory" :categoryAction="action"
            :category="category" :categoryList="categoryList" />
        </template></Card>
    </Dialog>

    <Dialog :visible.sync="deletecategoryDialog" :styles="{ width: '450px' }" header="Confirm" :modal="true">
      <confirmationDialog :message="message" :deleteAll="deleteAll" @confirmAction="deletecategory"
        @closeAction="deletecategoryDialog = false" />
    </Dialog>
  </div>
</template>
<script>
// import category from ''
import categoryForm from "@/components/categoryForm.vue";
import confirmationDialog from "./confirmationDialog.vue";
import _ from "lodash";
export default {
  components: { categoryForm, confirmationDialog },
  data() {
    return {
      categoryList: [],
      categoryDialog: false,
      deletecategoryDialog: false,
      category: {},
      selectedcategory: null,
      filters: {},
      submitted: false,
      selectedStatus: "Active",
      status: ["Active", "InActive"],
      oldcategoryData: {},
      message: null,
      deleteAll: false,
      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" }
      ],
      updatecategoryKey: 0,
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
      const categoryCreatedData = await this.bulkCreatecategory([...importData]);
      if (categoryCreatedData) {
        await this.fetchcategory();
      }
    },
    openNew() {
      this.category = {};
      this.submitted = false;
      this.categoryDialog = true;
      this.action = "add";
    },
    hideDialog() {
      this.categoryDialog = false;
      this.submitted = false;
    },
    async saveCategory(category) {
      console.log("action", category);
      this.action == "add"
        ? await this.addCategoryData(category)
        : await this.editcategoryData(category);
    },
    async addCategoryData(category) {
      const categorySaved = await this.addCategories(category);
      if (categorySaved) {
        this.categoryDialog = false;
        await this.fetchCategory();
      }
    },
    async editcategoryData(category) {
      if (_.isEqual(category, this.oldcategoryData)) {
        this.setToast("error", "Changes", "No Changes Found");
        return true;
      }
      const categoryUpdated = await this.updatecategory(category, {
        severity: "success",
        subject: "category Update",
        details: "category Updates Successfully"
      });
      if (categoryUpdated) {
        await this.updatecategoryList(categoryUpdated);
        this.categoryDialog = false;
      }
    },
    async updatecategoryList(category) {
      let categoryUpdate = await this.categoryList.find(obj => obj.id === category.id);
      for (let key in category) {
        Object.keys(categoryUpdate).includes(key)
          ? (categoryUpdate[key] = category[key])
          : null;
      }
      this.updatecategoryKey++;
    },
    editcategory(category) {
      console.log("category edit............", category)
      this.category = { ...this.oldcategoryData } = category;
      this.categoryDialog = true;
      this.action = 'update'
    },
    confirmDeletecategory(category) {
      this.category = category;
      this.deletecategoryDialog = true;
      this.message = `Are you sure you want to delete ${this.category.category_name}`;
    },
    async deletecategory() {
      let categorys = [];
      categorys = this.selectedcategory || categorys.push(this.category);
      await this.deletecategoryFunc(categorys.map(obj=>obj.id));
      this.category = {};
      this.selectedcategory = [];
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async confirmDeleteSelected() {
      this.message = `Are you sure you want to delete`;
      this.deleteAll = true;
      this.deletecategoryDialog = true;
    },
    async deletecategoryFunc(categorys) {
      const deletedcategory = await this.deletecategorys(categorys);
      if (deletedcategory) {
        this.categoryList = this.categoryList.filter(obj => {
          return !categorys.some(category => category.id === obj.id);
        });
        this.deletecategoryDialog = false;
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