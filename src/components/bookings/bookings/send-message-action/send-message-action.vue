<template>
  <b-modal id="send-message-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           class="send-message-action-modal"
           @show="onLoadForm()">
    <div class="form-wrapper">
       
      <h3>Send Message</h3>
      <error-box :errors="errors"/>
      <footer class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { options } from '../../../../helpers/options' 
import error_box from         '../../../common/form/error-box/error-box' 
import btn_action_group from  '../../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../../common/component-base/component-base'

export default {
  components: {  
    'error-box': error_box,
    'btn-action-group': btn_action_group,
  },
  extends: component_base,
  data(){
    return {
      options,

      form_title: 'Send Message',
      form_options: {
        delete: false
      }, 
      
      errors: [],
    }
  },
  computed:{ 
  },
  methods: { 
    hideModal(){
      this.hideDialogById('send-message-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      //
    },
    onConfirm(){
      //
    },
   
  }
}
</script>

<style lang="scss">
@import './send-message-action.scss';
</style>