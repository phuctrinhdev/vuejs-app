<template> 
  <div class="btn-action-group">
    <button v-if="show_confirm" id="btnConfirm" class="btn btn-default" 
            @click.prevent="onEvent('confirm')">{{ $t('general.confirm') }}</button>
    <button class="btn btn-secondary" @click.prevent="onEvent('cancel')">{{ $t('general.cancel') }}</button>
    <button v-if="options.delete" id="btnDelete" class="btn btn-default" 
            @click.prevent="onEvent('delete')">{{ $t('general.delete') }}</button>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => []
    },
  },
  computed: {
    options(){
      return this.data
    },
    show_confirm(){
      let is_show = true
      if(this.options.confirm === false) 
        is_show = false
      return is_show
    }
  },
  methods: {
    onEvent(event){
      this.$emit(event)
    },
  }
}
</script>

<style lang="scss">
.btn-action-group {
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  .btn {
    margin: 5px !important;
  }
}
</style>