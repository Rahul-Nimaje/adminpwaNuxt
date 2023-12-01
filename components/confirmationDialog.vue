<template>
  <div>
    <div class="text-center">
      <h1>Are you Sure You want to Log Out!</h1>
    </div>
    <div class="text-center">
     <Button @click="$emit('confirmAction')" label="Yes"></Button>
     <Button @click="$emit('closeAction')" label="NO"></Button>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {};
  }
};
</script>
  
  