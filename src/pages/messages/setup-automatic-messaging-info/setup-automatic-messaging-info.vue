<template>
  <main class="app-content">
    <section class="contents-style common-style setup-automatic-messaging-info-area">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ title }}</h3>
          <ul class="btn-group clearfix flr">
            <li><a class="btn secondary" @click="onMovePage">{{ $t('messages.back') }}</a></li>
          </ul>
        </article>
        <div class="contents setup-automatic-messaging-info">
          <b-alert show variant="warning">{{ title_info }}</b-alert>
          <div :class="{'image-mms': message_setup.fields.message_type == options.messages_enums.message_type.mms }" class="phone-message-box box left">
            <div class="inner">
              <p class="mb0 top clearfix">
                <span>{{ $t('messages.message') }}</span>
                <font v-if="message_setup.fields.message_type == options.messages_enums.message_type.mms" class="flr">
                  <label class="btn1 mt0 ml3" for="file">{{ $t('messages.load-image') }}</label> 
                  <input id="file" type="file" class="non-name" 
                         @change="encodeImageFileAsURL">
                </font>
                <select v-model="message_setup.fields.message_type" :class="{'w30p': message_setup.fields.message_type == options.messages_enums.message_type.mms }" class="flr w150"
                        @change="onChangeMessageType()">
                  <option :value="options.messages_enums.message_type.sms">SMS</option>
                  <option :value="options.messages_enums.message_type.lms">LMS</option>
                  <option v-if="action_data.type == options.messages_enums.setup_automatic_messaging_type.birthday_greetings" :value="options.messages_enums.message_type.mms">MMS</option>
                </select>
              </p>
              <div v-if="message_setup.fields.message_type == options.messages_enums.message_type.mms" class="mms-img-box">
                <img v-if="mms_image != ''" :src="mms_image">
                <font v-else>{{ $t('messages.image-area') }}</font>
              </div>
              <textarea ref="txArea" v-model="message_setup.fields.contents" class="textbox noresize"
                        cols="30" rows="10"
                        @keyup.prevent="onCheckLength($event)" @paste="onPaste($event)"/>
              <span class="fix">
                {{ current_bytes }} / {{ max_bytes }} Bytes
              </span>
              <div class="buttonbox">
                <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.variable)">{{ $t('messages.variables') }}</button>
                <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.sample)">{{ $t('messages.samples') }}</button>
                <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.preview)">{{ $t('messages.preview') }}</button>
              </div>
            </div>
          </div>
          <div class="phone-message-box box right">
            <div class="mt10">
              <div class="clearfix mb10">
                <h4 class="underline">{{ $t('messages.sending-date') }}</h4>
                <div class="date-time">
                  <template v-if="action_data.tab == options.messages_enums.setup_automatic_messaging_tab.booking">
                    <p v-if="action_data.type == options.messages_enums.setup_automatic_messaging_type.booking.the_day_before" class="day">
                      {{ $t('message-autos.the-day-before-booking-date') }}
                    </p>
                    <p v-else-if="action_data.type == options.messages_enums.setup_automatic_messaging_type.booking.on_the_day" class="day">
                      {{ $t('message-autos.on-the-day-booking-date') }}
                    </p>
                    <p v-else-if="action_data.type == options.messages_enums.setup_automatic_messaging_type.booking.hours_before" class="day">
                      {{ $t('message-autos.before-booking-time') }}
                    </p>
                    <p v-else class="day">{{ $t('messages.send-immediately') }}</p>
                    <div 
                      v-if="action_data.type == options.messages_enums.setup_automatic_messaging_type.booking.the_day_before
                      || action_data.type == options.messages_enums.setup_automatic_messaging_type.booking.on_the_day"
                      class="clearfix mb10">
                      <select-control v-model="target_hour" :options="target_hour_options"
                                      :not-translate="true"
                                      class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.hour') }}
                      <select-control v-model="target_minute" :options="target_minute_options"
                                      :not-translate="true"
                                      class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.minutes') }} 
                    </div>
                    <div 
                      v-if="action_data.type == options.messages_enums.setup_automatic_messaging_type.booking.hours_before"
                      class="clearfix mb10">
                      <select-control v-model="target_hour" :options="target_hour_options"
                                      :not-translate="true"
                                      class="dib time-sm" text-field="text" value-field="value"/>{{ $t('message-autos.hours') }}
                      <select-control v-model="target_minute" :options="target_minute_options"
                                      :not-translate="true"
                                      class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.minutes') }} 
                    </div>
                  </template>                    
                  <template v-else-if="action_data.type == options.messages_enums.setup_automatic_messaging_type.birthday_greetings">
                    <p class="day">
                      <select-control v-model="message_setup.fields.send_days_before" :options="target_date_options"
                                      :not-translate="true"
                                      class="dib time-lg" text-field="text" value-field="value"/>
                    </p>
                    <div class="clearfix mb10">
                      <select-control v-model="target_hour" :options="target_hour_options"
                                      :not-translate="true"
                                      class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.hour') }}
                      <select-control v-model="target_minute" :options="target_minute_options"
                                      :not-translate="true"
                                      class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.minutes') }} 
                    </div>
                  </template>
                  <template v-else-if="action_data.tab == options.messages_enums.setup_automatic_messaging_tab.sales">
                    <p class="day">
                      <select-control v-model="message_setup.fields.send_time" :options="target_time_options"
                                      :not-translate="true"
                                      class="dib time-lg" text-field="text" value-field="value"/>
                    </p>
                  </template>                  
                </div>
              </div>
            </div>
            <div class="operation">
              <b-form-checkbox v-model="message_setup.fields.status"  
                               :value="options.common_status.active" :unchecked-value="options.common_status.inactive"
                               name="check-button" switch>
                {{ $t('messages.operation') }} <b>{{ formatOperation(message_setup.fields.status) }}</b>
              </b-form-checkbox>
            </div>
            <div class="button-send-box clearfix">
              <button class="btn default fll" @click="submitActionAsync()">{{ $t('general.save') }}</button>
              <button v-if="message_setup.fields.id > 0" class="btn default fll" @click="onDeleteAsync()">{{ $t('general.delete') }}</button>
            </div>
          </div> 
        </div>
        <message-variable :tab="action_data.tab" :type="action_data.type" @addChar="onInsertText"/>
        <preview-message :data="message_setup" :image="mms_image"
                         :tab="action_data.tab" :type="action_data.type"/>
        <b-modal id="text-sample-list-modal" 
                 :title="$t('messages.sample-add-title')"
                 :no-close-on-backdrop="true"
                 hide-footer
                 size="xl">
          <radio-group v-if="message_setup.fields.message_type == options.messages_enums.message_type.mms" v-model="mms_type" :options="options.messages_enums.mms_type_select" 
                       class="clearfix"
                       @input="onChangeMMSType()"/>
          <text-sample-list ref="text_sample_list"
                            :data="sample_data_props"
                            @addChar="onInsertSampleText"/>
          <div class="modal-footer">
            <button class="btn btn-default" @click="onHideSampleModal">{{ $t('general.close') }}</button>
          </div>
        </b-modal>
    </div></section>
  </main>
</template>

<script>
import { options }    from '../../../helpers/options'
import { mapGetters } from 'vuex'
import component_base from '../../../components/common/component-base/component-base'

import MessageSetupClientApi     from '../../../api/message-autos/message-setup-client-api'
import MessageSetupSalesApi      from '../../../api/message-autos/message-setup-sales-api'
import MessageSetupBookingApi    from '../../../api/message-autos/message-setup-booking-api'
import MessageSetupViewModel     from '../../../view-model/message-autos/message-setup/message-setup-view-model'
import SolutionTextFeeApi        from '../../../api/messages/solution-text-fee-api'
import SolutionTextFeeViewModel  from '../../../view-model/messages/text-fees/solution-text-fee-view-model'
import TextMessageApi            from '../../../api/messages/text-message-api'

import message_variable         from '../../../components/messages/message-variable/message-variable'
import preview_message  from '../../../components/messages/preview-message/preview-message'
import text_sample_list from '../../../components/messages/text-sample-list/text-sample-list'
import radio_group      from '../../../components/common/form/radio/radio-group/radio-group' 
import select_control   from '../../../components/common/form/select/select-control/select-control2'

import MessageHelper from '../../../helpers/message-helper.js'

export default {
  components: {
    'message-variable' : message_variable,
    'text-sample-list' : text_sample_list,
    'preview-message'  : preview_message,
    'select-control'   : select_control,
    'radio-group'      : radio_group
  },
  extends : component_base,
  data(){
    return {
      options: options,
      message_setup_client_api: {},
      message_setup: {},
      message_setup_errors: [],
      solution_text_fee_api: {},
      text_message_api: {},
      shop_id: 0,

      text_fees: {},  
      current_bytes: 0,
      max_bytes: 0,
      mms_image: '',

      target_date_options: [],
      target_hour_options: [],
      target_minute_options: [],
      target_time_options: [],

      target_date: 0,
      target_hour: '08',
      target_minute: '00',
      sample_data: null,
      mms_type: options.messages_enums.mms_type.image,

      sample_data_props: {
        message_type  : options.messages_enums.message_type.sms,
        country_code  : '', 
        solution_id   : 0,
        text_fees     : {},
        shop_id       : 0
      },

      title: null,
      title_info: null,
      original_message_type: null,

      checked: true
    }
  },
  computed: {
    ...mapGetters('setup_automatic_messaging', {
      action_data: 'getSetupAutomaticMessagingInfo'
    }),
  },  
  created(){
    this.message_setup_client_api = new MessageSetupClientApi()
    this.message_setup_sales_api = new MessageSetupSalesApi()
    this.message_setup_booking_api = new MessageSetupBookingApi()
    this.message_setup = new MessageSetupViewModel()

    this.solution_text_fee_api = new SolutionTextFeeApi()
    this.text_fees = new SolutionTextFeeViewModel()

    this.text_message_api = new TextMessageApi()
 
    this.shop_id = this.shop_data.shop_id
  },
  beforeMount(){
    this.loadDataTableAsync()
  },
  methods: {
    async loadDataTableAsync() {
      //booking
      if(this.action_data.tab == options.messages_enums.setup_automatic_messaging_tab.booking){
        this.onSetTime(this.action_data.tab, this.action_data.type)
        switch (this.action_data.type) {
          case options.messages_enums.setup_automatic_messaging_type.booking.the_day_before:
            this.title = this.$i18n.t('message-autos.the-day-before')
            this.title_info = this.$i18n.t('message-autos.the-day-before-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.booking.on_the_day:
            this.title = this.$i18n.t('message-autos.on-the-day')
            this.title_info = this.$i18n.t('message-autos.on-the-day-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.booking.hours_before:
            this.title = this.$i18n.t('message-autos.hours-before')
            this.title_info = this.$i18n.t('message-autos.hours-before-info')            
            this.target_hour = '01'
            break

          case options.messages_enums.setup_automatic_messaging_type.booking.registered:
            this.title = this.$i18n.t('message-autos.booking-registration-notification')
            this.title_info = this.$i18n.t('message-autos.booking-registration-notification-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.booking.online_confirm:
            this.title = this.$i18n.t('message-autos.online-booking-confirm')
            this.title_info = this.$i18n.t('message-autos.online-booking-confirm-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.booking.canceled:
            this.title = this.$i18n.t('message-autos.booking-cancel-confirm')
            this.title_info = this.$i18n.t('message-autos.booking-cancel-confirm-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.booking.online_cancel:
            this.title = this.$i18n.t('message-autos.online-booking-cancel-confirm')
            this.title_info = this.$i18n.t('message-autos.online-booking-cancel-confirm-info')
            break
        }
        this.preLoader()
        let data_send = {
          shop_id    : this.shop_id,
          setup_type : this.action_data.type
        }
        let result = await this.message_setup_booking_api.getMessageSetupBookingListAsync(data_send)
        this.preLoader(false)
        if(result.is_ok){
          this.message_setup = result.data.items[0]
          if(this.message_setup.fields.id > 0){
            let temp = this.message_setup.fields.send_time.split(':')
            this.target_hour = temp[0]
            this.target_minute = temp[1]
          }          
        }
        else{
          this.showAlert(result.error_messages)
        }
      }
      else if(this.action_data.type == options.messages_enums.setup_automatic_messaging_type.birthday_greetings){
        this.onSetTime(this.action_data.tab, this.action_data.type)
        this.title = this.$i18n.t('messages.birthday-greetings')
        this.title_info = this.$i18n.t('messages.birthday-greetings-info')
        this.preLoader()
        let result = await this.message_setup_client_api.getMessageSetupClientAsync(this.shop_id)
        this.preLoader(false)
        if(result.is_ok){
          this.message_setup = result.data
          if(this.message_setup.fields.id > 0){
            let temp = this.message_setup.fields.send_time.split(':')
            this.target_hour = temp[0]
            this.target_minute = temp[1]
            this.original_message_type = this.message_setup.fields.message_type
          }
          if(this.message_setup.fields.message_type == options.messages_enums.message_type.mms){
            this.preLoader()
            this.mms_image = await this.text_message_api.getImageUrl(this.message_setup.fields)
            this.preLoader(false)
          }
        }
        else{
          this.showAlert(result.error_messages)
        }
      } else if(this.action_data.tab == options.messages_enums.setup_automatic_messaging_tab.sales){
        this.onSetTime(this.action_data.tab, this.action_data.type)
        switch (this.action_data.type) {
          case options.messages_enums.setup_automatic_messaging_type.points_add:
            this.title = this.$i18n.t('message-autos.points-add')
            this.title_info = this.$i18n.t('message-autos.points-add-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.points_deduction:
            this.title = this.$i18n.t('message-autos.points-deduction')
            this.title_info = this.$i18n.t('message-autos.points-deduction-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.balance_add:
            this.title = this.$i18n.t('message-autos.balance-add')
            this.title_info = this.$i18n.t('message-autos.balance-add-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.balance_deduction:
            this.title = this.$i18n.t('message-autos.balance-deduction')
            this.title_info = this.$i18n.t('message-autos.balance-deduction-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_add:
            this.title = this.$i18n.t('message-autos.prepaid-service-quantity-add')
            this.title_info = this.$i18n.t('message-autos.prepaid-service-quantity-add-info')
            break

          case options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_deduction:
            this.title = this.$i18n.t('message-autos.prepaid-service-quantity-deduction')
            this.title_info = this.$i18n.t('message-autos.prepaid-service-quantity-deduction-info')
            break
        }
        this.preLoader()
        let data_send = {
          shop_id    : this.shop_id,
          setup_type : this.action_data.type
        }
        let result = await this.message_setup_sales_api.getMessageSetupSalesAsync(data_send)
        this.preLoader(false)
        if(result.is_ok){
          this.message_setup = result.data.items[0]
        }
        else{
          this.showAlert(result.error_messages)
        }
      }

      this.message_setup.fields.country_code = this.shop_data.country
      this.message_setup.fields.shop_id = this.shop_id
      await this.loadTextInfoAsync() // Set Max Byte, TextFee
    },
    async loadTextInfoAsync(){
      let data_send = { 
        country_code: this.shop_data.country,
        solution_id: this.shop_data.solution_id,
        chain_id: 0, // Todo Change
        shop_id: this.shop_id
      }
      this.preLoader()
      let result = await this.solution_text_fee_api.getTextFeeByShopAsync(data_send)
      this.preLoader(false)
      if(result.is_ok){
        this.text_fees.fields = Object.assign({}, result.data)
        this.onChangeMessageType()
      }else this.showAlert(result.error_messages)
      this.onCheckLength()
    },
    async submitActionAsync(){
      // Image from (manual(base64) or sample(url))
      if(this.message_setup.fields.message_type == options.messages_enums.message_type.mms){
        this.message_setup.fields.mms_max_bytes = this.max_bytes
        if(this.sample_data == null) {
          this.message_setup.fields.image_base64 = this.mms_image.replace(/^data:image\/(png|jpg|jpeg|bmp|gif);base64,/, '')
          this.message_setup.fields.image_url = ''
        } else {
          this.message_setup.fields.image_url = this.imagePath(this.sample_data)
          this.message_setup.fields.image_base64 = ''
        }
      }
      if(this.message_setup.fields.status == null) this.message_setup.fields.status = options.common_status.inactive

      this.message_setup_errors = this.message_setup.isValid()
      if(this.message_setup_errors.length == 0) {
        //booking
        if(this.action_data.tab == options.messages_enums.setup_automatic_messaging_tab.booking){
          let type =this.action_data.type
          if(type == options.messages_enums.setup_automatic_messaging_type.booking.the_day_before
            || type == options.messages_enums.setup_automatic_messaging_type.booking.on_the_day
            || type == options.messages_enums.setup_automatic_messaging_type.booking.hours_before) {
            this.message_setup.fields.send_time = this.target_hour + ':' + this.target_minute
          } else this.message_setup.fields.send_time ='00:00'

          this.message_setup.fields.setup_type = this.action_data.type
          let api_action = ''
          if(this.message_setup.fields.id > 0) api_action = 'updateMessageSetupBookingAsync'
          else api_action = 'createMessageSetupBookingAsync'

          this.preLoader(true)
          let result = await this.message_setup_booking_api[api_action](this.message_setup)
          this.preLoader(false)
          if(result.is_ok) {
            this.onMovePage()
          } else {
            this.showAlert(result.error_messages)
          }
        }
        else if(this.action_data.type == options.messages_enums.setup_automatic_messaging_type.birthday_greetings){
          this.message_setup.fields.send_time = this.target_hour + ':' + this.target_minute

          // Specific case
          if(this.original_message_type == options.messages_enums.message_type.mms 
            && this.message_setup.fields.message_type != options.messages_enums.message_type.mms)
            this.message_setup.fields.is_delete_file = true
          else if(this.original_message_type != options.messages_enums.message_type.mms 
            && this.message_setup.fields.message_type != options.messages_enums.message_type.mms)
            this.message_setup.fields.is_delete_file = false
          else if(this.original_message_type != options.messages_enums.message_type.mms 
            && this.message_setup.fields.message_type == options.messages_enums.message_type.mms)
            this.message_setup.fields.is_delete_file = false

          let api_action = ''
          if(this.message_setup.fields.id > 0) api_action = 'updateMessageSetupClientAsync'
          else api_action = 'createMessageSetupClientAsync'

          this.preLoader(true)
          let result = await this.message_setup_client_api[api_action](this.message_setup)
          this.preLoader(false)
          if(result.is_ok) {
            this.onMovePage()
          } else {
            this.showAlert(result.error_messages)
          }
        }
        else if(this.action_data.tab == options.messages_enums.setup_automatic_messaging_tab.sales){
          this.message_setup.fields.setup_type = this.action_data.type
          let api_action = ''
          if(this.message_setup.fields.id > 0) api_action = 'updateMessageSetupSalesAsync'
          else api_action = 'createMessageSetupSalesAsync'

          this.preLoader(true)
          let result = await this.message_setup_sales_api[api_action](this.message_setup)
          this.preLoader(false)
          if(result.is_ok) {
            this.onMovePage()
          } else {
            this.showAlert(result.error_messages)
          }
        }        
      }else this.showAlert(this.message_setup_errors)

      // To initialize data in case of failure
      this.message_setup.fields.image_base64 = ''
      this.message_setup.fields.image_url = ''
    },
    async onDeleteAsync(){
      let result = null

      if(this.action_data.type == options.messages_enums.setup_automatic_messaging_type.birthday_greetings){
        this.preLoader(true)
        result = await this.message_setup_client_api.deleteMessageSetupClientAsync(this.message_setup)
        this.preLoader(false)
      }
      else if(this.action_data.tab == options.messages_enums.setup_automatic_messaging_tab.sales){
        this.preLoader(true)
        result = await this.message_setup_sales_api.deleteMessageSetupSalesAsync(this.message_setup)
        this.preLoader(false)
      }
      else if(this.action_data.tab == options.messages_enums.setup_automatic_messaging_tab.booking){
        this.preLoader(true)
        result = await this.message_setup_booking_api.deleteMessageSetupBookingAsync(this.message_setup)
        this.preLoader(false)
      }
      if(result.is_ok) {
        this.onMovePage()
      } else {
        this.showAlert(result.error_messages)
      }
    },
    onChangeMessageType(){
      if(this.message_setup.fields.message_type == this.options.messages_enums.message_type.sms){        
        this.max_bytes = this.text_fees.fields.sms_max_bytes
      }
      else if(this.message_setup.fields.message_type == this.options.messages_enums.message_type.lms) {
        this.max_bytes = this.text_fees.fields.lms_max_bytes
      }
      else if(this.message_setup.fields.message_type == this.options.messages_enums.message_type.mms) {
        this.max_bytes = this.text_fees.fields.mms_max_bytes
      }
      this.message_helper = new MessageHelper(this.message_setup.fields.message_type, this.max_bytes)

      this.mms_image = ''
      this.sample_data = null

      setTimeout(()=> this.onCheckLength(), 4)
    },
    onCheckLength() {
      const ui = this.$refs.txArea
      let return_data = this.message_helper.check_len(ui)
      if (return_data != null) {              
        this.message_setup.fields.contents = return_data.value
        this.current_bytes = return_data.length
      }
    },
    onPaste(){
      setTimeout(()=> this.onCheckLength(), 4) 
    },
    revoke_mms_image(){      
      if (this.mms_image && this.mms_image.startsWith('blob')) {
        window.URL.revokeObjectURL(this.mms_image)
      }
    },
    formatOperation(status){
      if(status == options.common_status.active) return 'On'
      else return 'Off'
    },
    imagePath(data){
      // eslint-disable-next-line no-undef
      return process.env.AZURE_STORAGE_MESSAGE_URL + data.image_path + '/' + data.image_name
    },
    encodeImageFileAsURL(event){
      if (event.target.files.length > 0) {
        let file_to_load = event.target.files[0]
        let file_reader = new FileReader()
        file_reader.readAsDataURL(file_to_load)
        file_reader.onload = (event) => {
          this.mms_image = event.target.result
        }
        this.sample_data = null
        this.message_setup.fields.is_delete_file = true
      }
    },
    onInsertText(ch) {
      const ui = this.$refs.txArea
      let value = this.message_helper.insertAtCaret(ui, ch)      
      if (value != null) {
        this.message_setup.fields.contents = value
      }   
      this.onCheckLength()
      ui.focus()
    },
    async onInsertSampleText(text){
      if(this.message_setup.fields.message_type == options.messages_enums.message_type.mms 
          && this.mms_type == options.messages_enums.mms_type.image) {
        this.sample_data = text

        this.preLoader()
        this.mms_image = await this.text_message_api.getImageUrl(text)
        this.preLoader(false)
        this.message_setup.fields.is_delete_file = true
      }
      else this.message_setup.fields.contents = text
      this.onHideSampleModal()
      setTimeout(()=> this.onCheckLength(), 4) 
    },
    onShowHelpSetup(type){
      if(type == options.messages_enums.help_send_text.preview)
        this.showDialogById('preview-message-modal')
      else if(type == options.messages_enums.help_send_text.variable)
        this.showDialogById('message-variable-modal')
      else if(type == options.messages_enums.help_send_text.sample){
        this.onSetSampleDataProp()
        this.$nextTick(() => {
          this.showDialogById('text-sample-list-modal')
          this.$refs.text_sample_list.onLoadForm()
        })        
      }
    },
    onSetSampleDataProp(){
      this.sample_data_props = {
        group_code   : this.onSetSampleCode(this.action_data.type),
        message_type : this.message_setup.fields.message_type,
        country_code : this.shop_data.country,
        solution_id  : this.shop_data.solution_id,
        text_fees    : this.text_fees.fields,
        mms_type     : this.mms_type,
        list_type    : options.messages_enums.list_type.sample,
      }
    },
    onMovePage(){
      this.revoke_mms_image()
      this.$router.push(({ name: 'setup-automatic-messaging' }))
    },
    onSetTime(tab, type){
      if(tab == options.messages_enums.setup_automatic_messaging_tab.booking){
        if(type == options.messages_enums.setup_automatic_messaging_type.booking.the_day_before
          || type == options.messages_enums.setup_automatic_messaging_type.booking.on_the_day){        
          for (let index = 8; index < 23; index++) {
            let hour = ''
            if(String(index).length < 2) hour = '0' + index
            else hour = String(index)
            this.target_hour_options.push({ text: hour, value: hour })
          }
          for (let index = 0; index < 6; index++) {
            let minute = ''
            minute = index + '0'
            this.target_minute_options.push({ text: minute, value: minute })
          }
        }
        else if(type == options.messages_enums.setup_automatic_messaging_type.booking.hours_before){        
          for (let index = 1; index < 3; index++) {
            let hour = ''
            if(String(index).length < 2) hour = '0' + index
            else hour = String(index)
            this.target_hour_options.push({ text: hour, value: hour })
          }
          for (let index = 0; index < 6; index++) {
            let minute = ''
            minute = index + '0'
            this.target_minute_options.push({ text: minute, value: minute })
          }
        }
      }
      else if(type == options.messages_enums.setup_automatic_messaging_type.birthday_greetings){
        this.target_date_options.push({ text: this.$i18n.t('messages.on-the-day'), value: 0 })
        for (let index = 1; index < 31; index++) {
          let date = index
          this.target_date_options.push({ text: date + this.$i18n.t('messages.day-ago'), value: date })
        }
        for (let index = 8; index < 23; index++) {
          let hour = ''
          if(String(index).length < 2) hour = '0' + index
          else hour = String(index)
          this.target_hour_options.push({ text: hour, value: hour })
        }
        for (let index = 0; index < 6; index++) {
          let minute = ''
          minute = index + '0'
          this.target_minute_options.push({ text: minute, value: minute })
        }
      }
      else if(tab == options.messages_enums.setup_automatic_messaging_tab.sales){
        this.target_time_options.push({ text: this.$i18n.t('messages.send-immediately'), value: '00:00' })
        this.target_time_options.push({ text: this.$i18n.t('message-autos.after-minutes').replace('{0}', 10), value: '00:10' })
        this.target_time_options.push({ text: this.$i18n.t('message-autos.after-minutes').replace('{0}', 20), value: '00:20' })
        this.target_time_options.push({ text: this.$i18n.t('message-autos.after-minutes').replace('{0}', 30), value: '00:30' })
        this.target_time_options.push({ text: this.$i18n.t('message-autos.after-minutes').replace('{0}', 60), value: '01:00' })
      }
    },
    onSetSampleCode(type){
      let code = ''

      //booking
      if(this.action_data.tab == options.messages_enums.setup_automatic_messaging_tab.booking) {
        if(type == options.messages_enums.setup_automatic_messaging_type.booking.the_day_before)
          code = options.messages_enums.setup_automatic_messaging_samples_code.booking.the_day_before
        else if(type == options.messages_enums.setup_automatic_messaging_type.booking.on_the_day)
          code = options.messages_enums.setup_automatic_messaging_samples_code.booking.on_the_day
        else if(type == options.messages_enums.setup_automatic_messaging_type.booking.hours_before)
          code = options.messages_enums.setup_automatic_messaging_samples_code.booking.hours_before
        else if(type == options.messages_enums.setup_automatic_messaging_type.booking.registered)
          code = options.messages_enums.setup_automatic_messaging_samples_code.booking.registered
        else if(type == options.messages_enums.setup_automatic_messaging_type.booking.online_confirm)
          code = options.messages_enums.setup_automatic_messaging_samples_code.booking.online_confirm
        else if(type == options.messages_enums.setup_automatic_messaging_type.booking.canceled)
          code = options.messages_enums.setup_automatic_messaging_samples_code.booking.canceled
        else if(type == options.messages_enums.setup_automatic_messaging_type.booking.online_cancel)
          code = options.messages_enums.setup_automatic_messaging_samples_code.booking.online_cancel
      }
      else if(type == options.messages_enums.setup_automatic_messaging_type.birthday_greetings)
        code = options.messages_enums.setup_automatic_messaging_samples_code.birthday_greetings
      else if(type == options.messages_enums.setup_automatic_messaging_type.points_add)
        code = options.messages_enums.setup_automatic_messaging_samples_code.points_add
      else if(type == options.messages_enums.setup_automatic_messaging_type.points_deduction)
        code = options.messages_enums.setup_automatic_messaging_samples_code.points_deduction
      else if(type == options.messages_enums.setup_automatic_messaging_type.balance_add)
        code = options.messages_enums.setup_automatic_messaging_samples_code.balance_add
      else if(type == options.messages_enums.setup_automatic_messaging_type.balance_deduction)
        code = options.messages_enums.setup_automatic_messaging_samples_code.balance_deduction
      else if(type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_add)
        code = options.messages_enums.setup_automatic_messaging_samples_code.prepaid_service_quantity_add
      else if(type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_deduction)
        code = options.messages_enums.setup_automatic_messaging_samples_code.prepaid_service_quantity_deduction

      return code
    },
    onHideSampleModal(){
      this.hideDialogById('text-sample-list-modal')
    },
    onChangeMMSType(){
      this.onSetSampleDataProp()
      this.$nextTick(() => {
        this.$refs.text_sample_list.onLoadForm()
      })              
    }
  }
}
</script>
<style lang='scss'>
@import './setup-automatic-messaging-info.scss';
</style>
