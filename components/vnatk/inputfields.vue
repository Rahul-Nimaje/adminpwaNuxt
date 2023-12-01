<template>
  <div style="display:flex">
    <div>
      <h3>{{ modelData.name }}</h3>
    </div>
    <div class="mt-5">
      <form v-if="modelAttributes.length>0" class="grid row" @submit.prevent="handleSubmit">
        <div v-for="(field, index) in modelAttributes" :key="index" class="md:col-6 lg:col-6">
          <span v-if="textDataTypes.includes(field.type)" class="p-float-label" style="margin:10px">
            <InputText id="username" :disabled="field.attribute=='id'" v-model="field.name" />
            <label for="username">{{ field.attribute }}</label>
          </span>
          <span v-if="field.type=='DATE'" class="p-float-label" style="margin:10px">
            <Calendar
              :disabled="disabledDate.includes(field.attribute)"
              id="icon"
              v-model="field.name"
              :showIcon="true"
            />
            <label for="username">{{ field.attribute }}</label>
          </span>
        </div>
        <div style="margin:20px">
          <Button class="p-button-sm" type="submit">Submit</Button>
        </div>
      </form>
    </div>
  </div>
</template>
  <script>
import catalog from "@/services/catalog";
export default {
  props: {
    modelData: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      modelAttributes: [],
      model: "User",
      textDataTypes: ["INTEGER", "TEXT", "STRING"],
      disabledDate: ["createdAt", "updatedAt"]
    };
  },
  computed: {},
  methods: {
    async handleSubmit() {
      console.log("Submit..........", this.modelAttributes);
      const modelAddData = {};
      this.modelAttributes.forEach(obj => {
        const key = obj.attribute;
        // Check if the 'name' property exists and is not undefined
        if (obj.name) {
          modelAddData[key] = obj.name;
        }
      });
      console.log("modelAddData", modelAddData);
    //   let addData=[];
    //   addData.push(modelAddData)
      const modelResponse = await catalog.post("/admin/vnatk/executeaction", {
        action_to_execute: "vnatk_add",
        model:this.modelData.name,
        arg_items: modelAddData
      }).then(response=>{
        this.setToast('success','Success Message',response);
        this.$emit('closedialog')
      })

    }
  },
  mounted() {
    console.log("modeeeeeeeeeeeee", this.modelData);
    if (this.modelData) {
      this.modelAttributes = this.modelData.attributes;
    }
  }
};
</script>