<template>
  <b-form-radio-group v-model="radio_data" :disabled="disabled" :buttons="buttons"
                      class="radio-group form-btn-group" @input="onInput($event)" @change="onChange"> 
    <b-form-radio v-for="(option, index) in options" :key="index" :value="option.value">{{ $t(option.text) }}</b-form-radio> 
  </b-form-radio-group>
</template>

<script> 
export default {
  props: { 
    value: {
      type: [String, Number, Boolean],
      default: ''
    }, 
    options: {
      type: Array,
      default: () => []
    }, 
    disabled: {
      type: Boolean,
      default: false
    },
    buttons:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      set: undefined
    }
  },
  computed: { 
    radio_data: {
      set(value){  
        this.set = value
      },
      get(){
        return this.value
      }
    }
  },
  methods: { 
    onInput(){ 
      this.$emit('input', this.set)
    },
    onChange(){
      this.$emit('change', this.set)
    }
  }
}
</script>

<style lang='scss'>
@import './radio-group.scss';
</style>