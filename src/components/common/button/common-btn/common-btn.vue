<template>
  <a class="btn" @click="onClickAction">{{ $t(data.label) }}</a>
</template>

<script>
import { options } from '../../../../helpers/options'
import component_base from '../../component-base/component-base'
export default {
  extends: component_base,
  props: {
    data: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      options: options,
      show: true
    }
  },
  methods: {
    onClickAction(){
      this.$emit('click-action')
    }
  }
}
</script>