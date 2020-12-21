<template>
  <div v-if="errors_data.length > 0" class="validate-errors-wrapper">
    <ul class="validate-errors">
      <li v-for="(error, index) in errors_data" :key="index" v-html="error"/>
    </ul>
  </div>
</template>

<script> 

export default {
  props: { 
    errors: {
      type: Array ,
      default: () => []
    }, 
  },
  computed: {
    errors_data(){
      return this.errors
    },
  }
}
</script> 
<style lang='scss'>
 
</style>