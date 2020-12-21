<template>
  <div class="show-inactives">
    <b-form-checkbox v-model="status" :value="options.good_status.all" :unchecked-value="options.good_status.active" 
                     @input="onInput">{{ $t('general.show-inactives') }}</b-form-checkbox>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'

export default {
  props: {
    value: {
      type: Number,
      default: () => options.good_status.active
    }
  },
  data() {
    return {
      options: options,
      status: this.value
    }
  },
  methods: {
    onInput(){
      this.$emit('input', this.status)
    },
  }
}
</script>