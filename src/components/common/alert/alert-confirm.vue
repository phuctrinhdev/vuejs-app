<template>
  <b-modal :id="modal_id" 
           :title="modal_title"
           :no-close-on-backdrop="true"
           :no-close-on-esc="true"
           :hide-header-close="true"
           :no-enforce-focus="true"
           hide-footer
           class="alert-modal alert-confirm-modal" > 

    <div class="validate-errors-wrapper">
      <ul class="validate-errors">
        <li v-for="(alert, index) in data_alerts" :key="index" v-html="alert"/>
      </ul>
    </div>

    <div class="modal-footer">
      <button id="btnConfirmYes" 
              :class="{'hide': hide_yes}" type="button" class="btn btn-default" 
              @click="onConfirm">{{ modal_label_yes }}</button>
      <button :class="{'hide': hide_no}" type="button" class="btn btn-default" 
              @click="onCancel">{{ modal_label_no }}</button>
    </div>
  </b-modal>
</template>

<script> 
import component_base    from '../component-base/component-base'
export default {
  extends: component_base,
  props: { 
    id: {
      type: String,
      default: ''
    },  
    title: {
      type: String,
      default: ''
    },  
    data_alerts: {
      type: Array,
      default: ()=>[]
    },  
    label_yes: {
      type: String,
      default: ''
    },  
    label_no: {
      type: String,
      default: ''
    },
    hide_yes: {
      type: Boolean,
      default: false
    },
    hide_no: {
      type: Boolean,
      default: false
    }
  }, 
  computed: {
    modal_label_no(){
      if(this.label_no == undefined || this.label_no == '')
        return this.$i18n.t('general.no')
      return this.label_no
    },
    modal_label_yes(){
      if(this.label_yes == undefined || this.label_yes == '')
        return this.$i18n.t('general.yes')
      return this.label_yes
    },
    modal_title(){
      if(this.title == undefined || this.title == '')
        return this.$i18n.t('general.alert')
      return this.title
    },
    modal_id(){
      if(this.id == undefined || this.id == '')
        return 'alert-confirm-modal'
      return this.id
    }
  },
  methods: {
    hideModal(){
      this.hideDialogById(this.modal_id)
    }, 
    onCancel(){
      this.$emit('cancel')
      this.hideModal()
    },
    onConfirm(){ 
      this.$emit('confirm')
      this.hideModal()
    }, 
  }
}
</script>

<style lang='scss'>
@import './alert.scss';
</style>