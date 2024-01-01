<template>
  <div class="my-5">
    <form>
      <div class="field">
        <input class="pa-4" type="file" accept="image/*" ref="file" style="display: none"
          v-on:change="FileUpload($event)" />
        <Button v-bind="$attrs" v-on="$listeners" label="" @click="$refs.file.click()"> <i
            class="pi pi-file mx-5"></i>Upload Category Image</Button>
      </div>
      <div v-if="uploadedImage" class="text-center">
        <img :src="uploadedImage" @click="imageShow = true" height="100px" width="100px" />
      </div>
      <div class="field">
        <span class="p-float-label">
          <InputText id="category_name" type="text" v-model="category_name" />
          <label for="category_name">Category Name</label>
        </span>
      </div>
      <div class="field">
        <label for="Status">Status</label>
        <Dropdown v-model="selectedStatus" :options="status" />
      </div>
      <div>
        <Checkbox v-model="category_type" :binary="true" value="category_type" />
        <label for="binary">is Sub Category</label>
      </div>
      <div class="field mt-2" v-if="category_type">
        <label for="Status">Categories</label>
        <Dropdown v-model="selectCategory" :options="categoryList" optionLabel="category_name" />
      </div>
      <div class="mt-4 field">
        <Button label="Add" @click="addCategory"></Button>
      </div>
    </form>
    <Dialog :visible.sync="imageShow" :styles="{ width: '650px' }" :modal="true">
      <img :src="uploadedImage" height="300vh" width="800vw" />
      <a download @click="clickedDownload"><button>Download</button> </a>
    </Dialog>
  </div>
</template>
<script>
import catalog from "@/services/catalog";
export default {
  props: {
    categoryList: Array,
    category: Object
  },
  data() {
    return {
      category_name: null,
      selectedStatus: "Active",
      status: ["Active", "InActive"],
      category_type: false,
      selectCategory: null,
      uploadedImage: null,
      imageShow: false
    };
  },
  created() {
    this.selectCategory = this.categoryList.length > 0 ? this.categoryList[0] : null;
    if (this.category) {
      const { category_name, status, category_type, image, rootCategories } = this.category;
      this.category_name = category_name;
      this.category_type = category_type == 'sub';
      this.selectedStatus = status;
      this.uploadedImage = image
      this.selectCategory = this.categoryList.find(category => category.id == rootCategories.id)
    }
    console.log("selectCategory", this.selectCategory)
  },
  methods: {
    async FileUpload(e) {
      var file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      this.uploadedImage = await catalog.post("/upload/image", formData);
    },
    clickedDownload() {
      const link = document.createElement('a');
      link.href = this.uploadedImage;
      link.setAttribute('download', 'file.png'); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    addCategory() {
      let categoryData = {
        category_name: this.category_name,
        status: this.selectedStatus,
        category_type: this.category_type ? 'sub' : 'root',
        image: this.uploadedImage,
        parent_id: this.selectCategory ? this.selectCategory.id : null
      }
      if (this.category) {
        categoryData.id = this.category.id
      }
      this.$emit('saveCategory', categoryData)
    },
  }
};
</script>