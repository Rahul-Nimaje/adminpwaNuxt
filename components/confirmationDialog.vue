<template>
  <div>
    <div class="text-center">
      <h3>{{ message }}</h3>
    </div>
    <div class="text-center">
      <Button @click="$emit('confirmAction')" label="Yes"></Button>
      <Button @click="$emit('closeAction')" label="NO"></Button>
    </div>
  </div>
</template>
  
  <script>
export default {
  props: {
    message: String
  },
  data() {
    return {};
  }
};
</script>
  
  