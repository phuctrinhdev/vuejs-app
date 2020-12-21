<template>
  <div class="common-style add-item-modal">
    <form class="form-wrapper clearfix">
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label class="require">{{ $t('misc-codes.item-name') }} </label>
        </div>
        <div class="col-12 col-sm-8">
          <input v-model="model.fields.name" type="text" class="form-control">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label>{{ $t('misc-codes.status') }} </label>
        </div>
        <div class="col-12 col-sm-8">
          <radio-group v-model="model.fields.status" :options="options.option_goods_status" :buttons="true"/>
        </div>
      </div>
    </form>

    <error-box :errors="errors"/>
    <div class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </div>
</template>

<script>
import { options }            from '../../../../helpers/options'

import radio_group            from '../../../common/form/radio/radio-group/radio-group' 
import error_box              from '../../../common/form/error-box/error-box' 
import btn_action_group       from '../../../common/button/btn-action-group/btn-action-group'

export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  props: {
    model: {
      type: Object,
      default: () => []
    },
    errors: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      options, 
      
      form_title: '',
      form_options: {
        delete: false
      },
    }
  },
  methods: { 
    onConfirm(){
      this.$emit('confirm', this.model)
    },
    onCancel(){
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss">
@import '../add-item.scss';
</style>