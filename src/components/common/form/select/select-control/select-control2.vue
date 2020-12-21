<template>
  <div> 
    <b-form-select v-model="select_data" :placeholder="$t(placeholder)"
                   :disabled="disabled"
                   :value-field="valueField" :text-field="textField" 
                   @change="onChange" @input="onInput"> 
      <option v-for="option in options" :value="option[valueField]" :key="option[valueField]">
        <div v-if="notTranslate">
          {{ option[textField] }}
        </div>
        <div v-else>
          {{ $t(option[textField]) }}
        </div>
      </option>
    </b-form-select>
  </div>
</template> 
<script> 
export default {
  props: { 
    value: {
      type: [String, Number,Boolean] ,
      default: ''
    }, 
    options: {
      type: Array,
      default: () => []
    },
    placeholder:{
      type: String,
      default: ''
    },
    valueField:{
      type: String,
      default: ''
    },
    textField:{
      type: String,
      default:''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    notTranslate: {
      type: Boolean,
      default: false
    } 
  },
  data(){
    return {
      set: this.value
    }
  },
  computed: { 
    select_data: {
      set(value){    
        this.set = value
      },
      get(){
        return this.set
      }
    },
  },
  watch: { // todo delete...
    value(){
      this.select_data = this.value
    }
  },
  methods: { 
    onInput(){  
      this.$emit('input', this.set)
    },
    onChange(){  
      this.$emit('change', this.set)
    }
  }, 
}
</script> 