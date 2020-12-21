<template>
  <b-modal :id="modal_id"
           :class="modal_id"
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           @show="onLoadForm()"
           @hide="onCancel()">
    

    <error-box :errors="errors"/>
    <div class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template>

<script>
import radio_group                   from '../../common/form/radio/radio-group/radio-group.vue'
import component_base                from '../../../components/common/component-base/component-base'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'
import { common_options }            from '../../../helpers/options/common-options.js'
import { options }                   from '../../../helpers/options'
// import { mapGetters } from 'vuex'

export default {
  components: {
    'error-box'       : error_box,
    'radio-group'     : radio_group,
    'btn-action-group': btn_action_group
  },
  extends : component_base,
  data(){
    return {
      // common
      options,
      common_options,

      // modal
      modal_id: 'client-photo-action-modal',
      form_options : {
        delete: false
      },
      errors       : [],

      // view

    }
  },
  computed:{
    // 
    
  },
  methods:{
    hideModal(){
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },

    onLoadForm(){
      //
    },
    async onConfirm() {
      // 
    }
  }
}
</script>

<style lang="scss">
@import './client-avatar-action.scss';
</style>
