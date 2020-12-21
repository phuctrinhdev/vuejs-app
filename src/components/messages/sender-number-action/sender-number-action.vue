<template>
  <div class="common-style">
    <b-modal :id="page_id"
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             @show="onLoadForm()">            
      <form class="form-wrapper clearfix">
        <div class="form-group">
          <label>{{ $t('messages.sender-number') }}</label>
          <input ref="senderPhone" v-model="text_sender_phone.fields.sender_phone" type="text">
        </div>        
      </form> 
      <error-box :errors="text_sender_phone_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>
    <!-- alert -->
    <alert id="text-sender-phone-error-alert" :alerts="alerts" :title="$t('staffs.error-title')"
           :close_action="true"/>
  </div>
</template>

<script>
import { mapActions }         from 'vuex'
import { options }            from '../../../helpers/options'
import btn_action_group       from '../../common/button/btn-action-group/btn-action-group'
import error_box              from '../../common/form/error-box/error-box' 
import alert                  from '../../../components/common/alert/alert.vue'
import component_base         from '../../../components/common/component-base/component-base'
import TextSenderPhoneViewModel from '../../../view-model/messages/text-sender-phones/text-sender-phone-view-model.js'
import TextSenderPhoneApi     from '../../../api/messages/text-sender-phone-api'

export default {
  components: {
    'alert': alert,
    'btn-action-group': btn_action_group,
    'error-box': error_box,
  },
  extends: component_base,
  data() {
    return {
      page_id: 'sender-number-action-modal',
      options,      
      form_title: '',
      form_options: {
        delete: false
      },
      text_sender_phone: {},
      text_sender_phone_errors: [],
      alerts: [],
      action_data : {action : options.form_actions.add }
    }
  },
  beforeMount(){
    this.text_sender_phone = new TextSenderPhoneViewModel()
  },
  methods: { 
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById(this.page_id)
    },
    onLoadForm(){
      //add
      {
        this.form_title = this.$i18n.t('messages.add-sender-number')
        this.text_sender_phone = new TextSenderPhoneViewModel()
        this.text_sender_phone.fields.country_code= this.shop_data.country
        this.text_sender_phone.fields.shop_id = this.shop_data.shop_id
        this.text_sender_phone.fields.user_id = this.x_user.user_name
        this.text_sender_phone.fields.certification_type = options.messages_enums.sender_phone_certification_type.none
      }
      this.text_sender_phone_errors = []
    },
    onConfirm(){
      //add
      {
        this.submitActionAsync('createTextSenderPhoneAsync', 'reload-page')
      }
    },
    async submitActionAsync(api_action, success_action){      
      // validate
      this.text_sender_phone_errors = this.text_sender_phone.isValid()
      if(this.text_sender_phone_errors.length == 0) {
        this.preLoader()
        let api = new TextSenderPhoneApi() 
        let result = await api[api_action](this.text_sender_phone.fields)
        this.preLoader(false)        
        if(result.is_ok) {
          this.actionSuccess(result, success_action)
        }
        else this.showCustomAlert(new Array(result.error_messages[0].errorMessage), 'text-sender-phone-error-alert')        
      }
    },
    // alert
    showCustomAlert(alerts, modal_name){
      this.setAlertsData(alerts)
      this.alerts = alerts
      this.showDialogById(modal_name)
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      }      
      else this.showAlert(result.error_messages)
    },    
  }
}
</script>