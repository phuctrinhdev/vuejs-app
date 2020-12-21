<template>
  <b-modal :id="modal_id" 
           :title="modal_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="alert-modal"  
           @show="onLoadForm()">
    <div class="validate-errors-wrapper">
      <ul class="validate-errors">
        <li v-for="(alert, index) in modal_content" :key="index" v-html="alert"/>
      </ul>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" @click="onCancel">{{ modal_cancel_title }}</button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters, mapActions} from 'vuex' 
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
    alerts: {
      type: Array,
      default: () => []
    }, 
    close_action: {
      type: Boolean,
      default: false
    },
    cancel_title: {
      type: String,
      default: ''
    },
  },
  data(){
    return {
      modal_id: this.id,
      data_title: this.title,
      data_cancel_title: this.cancel_title
    }
  },
  computed: {
    ...mapGetters('alert', {
      alerts_data: 'getAlerts',
      options_data: 'getOptions',
    }),
    modal_title:{
      get: function () {
        let title = ''
        if(this.isValidText(this.data_title)) title = this.data_title
        else title = this.$i18n.t('general.alert') 
        return title
      },
      set: function (new_value) { 
        this.data_title = new_value 
      }
    },
    modal_cancel_title:{
      get: function () {
        let title = ''
        if(this.isValidText(this.data_cancel_title)) title = this.data_cancel_title
        else title = this.$i18n.t('general.close')
        return title
      },
      set: function (new_value) { 
        this.data_cancel_title = new_value 
      }
    },

    modal_content() {
      let content = ''
      if(this.modal_id == 'alert-modal') content = this.alerts_data
      else content = this.alerts
      
      return content
    },
   
  },
  methods: { 
    ...mapActions('alert', [
      'setResultData',
    ]),
    hideModal(){
      this.hideDialogById(this.modal_id)
    },
    onCancel(){ 
      if(this.close_action)
        this.$emit('close-event', true)
      this.hideModal()
    },
    onLoadForm(){
      if(this.options_data!= undefined){ 
        this.modal_title = this.options_data.title 
        this.modal_cancel_title = this.options_data.cancel_title 
      }
    },
    isValidText(text){
      return (text != undefined && text !=null && text.length>0)
    },
  }
}
</script>

<style lang='scss'>
@import './alert.scss';
</style>