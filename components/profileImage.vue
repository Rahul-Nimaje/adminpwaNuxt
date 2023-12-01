<template>
  <div>
    <Avatar :key="updateKey" :image="imageSrc" class="mr-2" size="xlarge" shape="circle"></Avatar>
    <FileUpload
      mode="basic"
      name="demo[]"
      url="./upload.php"
      accept="image/*"
      :maxFileSize="1000000"
      @upload="onUpload"
      :auto="true"
      chooseLabel="Change Profile Image"
    />
  </div>
</template>
<script>
import user from "@/services/user";
export default {
  props: {
    image: {
      type: String
    }
  },
  data() {
    return {
      selectedFile: null,
      updateKey: 0,
      imageSrc: null
    };
  },
  mounted() {
    console.log("imageeeeeeefromProps", this.image);
    if (this.image) this.imageSrc = this.image;
  },
  methods: {
    // handleFileChange(event) {

    // },

    async onUpload(event) {
      console.log("event.target.files[0]", event.files[0]);
      this.selectedFile = event.files[0];
      if (!this.selectedFile) {
        alert("Please select a file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.selectedFile);
      let { data } = await user.post("/upload/image", formData);
      console.log("imageuploadddddddddd", data);
      if (data) this.$emit("imageUpload", data);
      this.setToast("info", "Success", "File Uploaded");
    }
  }
};
</script>