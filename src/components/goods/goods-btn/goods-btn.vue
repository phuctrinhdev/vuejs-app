<template>
  <a v-if="show" class="btn" @click="onClickAction">{{ $t(data.label) }}</a>
</template>

<script>
import { options } from '../../../helpers/options'

export default {
  props: {
    data: {
      type: Object,
      default: () => []
    },
    alwaysshow: {
      type: Boolean,
      default: true
    },

  },
  data(){
    return {
      options: options,
      show: true
    }
  },
  mounted(){
    if(this.alwaysshow) this.show = this.alwaysshow
    else if(this.data.item) this.show = this.checkShowButton(this.data.item)
  },
  methods: {
    onClickAction(){
      this.$emit('click-action')
    },
    checkShowButton(data){
      if(data.shop_id != data.own_shop_id) return false
      else return true
    }
  }
}
</script>