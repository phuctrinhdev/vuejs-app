<template>
  <div>
    <b-form-select
      v-model="select_data"
      :placeholder="$t(placeholder)"
      :disabled="disabled"
      :options="data_options"
      :value-field="valueField"
      :text-field="textField"
      @change="onChange"
      @input="onInput"
    />
  </div>
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
    placeholder: {
      type: String,
      default: ''
    },
    valueField: {
      type: String,
      default: ''
    },
    textField: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      set: this.value
    }
  },
  computed: {
    select_data: {
      set(value) {
        this.set = value
      },
      get() {
        return this.set
      }
    },
    data_options: function() {
      let data_option = this.options
      for (let index in data_option) {
        data_option[index].text = this.$i18n.t(data_option[index].text)
      }
      return data_option
    }
  },
  methods: {
    onInput() {
      this.$emit('input', this.set)
    },
    onChange() {
      this.$emit('change', this.set)
    }
  }
}
</script> 
<style lang='scss'>
</style>