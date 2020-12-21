<template>
  <main class="app-content">
    <section class="contents-style common-style setup-automatic-messaging-expiry-date-reminder-info-area">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ title }}</h3>
          <ul class="btn-group clearfix flr">
            <li><a class="btn secondary" @click="onMovePage">{{ $t('messages.back') }}</a></li>
          </ul>
        </article>
        <div class="contents setup-automatic-messaging-expiry-date-reminder-info clearfix">
          <b-alert show variant="warning">{{ title_info }}</b-alert>
          <div class="mobile-select-phone-number">
            <select v-model="mobile_index" class="w100p">
              <option :value="0">{{ $t('general.first') }}</option>
              <option :value="1">{{ $t('general.second') }}</option>
              <option :value="2">{{ $t('general.third') }}</option>
            </select> 
          </div>
          <div class="clearfix">
            <div v-if="!is_mobile || (is_mobile && mobile_index == 0)" class="phone-message-box box left action">
              <h3 class="phone-number tac fw-bold mt10">{{ $t('general.first') }}</h3>
              <div class="inner">
                <p class="mb0 top clearfix">
                  <span>{{ $t('messages.message') }}</span>
                  <select v-model="message_setup[0].fields.message_type" class="flr w150" @change="onChangeMessageType(0, true)">
                    <option :value="options.messages_enums.message_type.sms">SMS</option>
                    <option :value="options.messages_enums.message_type.lms">LMS</option>
                  </select>
                </p>                           
                <textarea ref="txArea0" v-model="message_setup[0].fields.contents" class="textbox noresize"
                          cols="30" rows="10"
                          @keyup.prevent="onCheckLength(0)" @paste="onPaste(0)" @click="index = 0"/>
                <span class="fix">
                  {{ current_bytes[0] }} / {{ max_bytes[0] }} Bytes
                </span>
                <div class="buttonbox">
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.variable)">{{ $t('messages.variables') }}</button>
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.sample, 0)">{{ $t('messages.samples') }}</button>
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.preview, 0)">{{ $t('messages.preview') }}</button>
                </div>
                <div class="phone-message-box-info">
                  <div class="info-box">
                    <p>{{ $t('message-autos.send-before') }} 
                      <input v-model="message_setup[0].fields.send_days_before" type="number" class="w70" 
                             min="0" max="90" @blur="onCheckSendDaysBefore(0)"> {{ $t('message-autos.send-before-days') }}
                    </p>
                  </div>
                  <div class="info-box">
                    <p>{{ limit_info }} 
                      <input v-model="message_setup[0].fields.limit" type="number" class="w70"
                             @blur="onCheckLimit(0)">
                      <template v-if="shop_data.country == options.country.kr">{{ limit_info2 }} </template>
                    </p>
                  </div>
                  <div class="info-box">
                    <span class="mr10">{{ $t('messages.operation') }}</span> 
                    <div class="b-custom-switch dib">
                      <b-form-checkbox v-model="message_setup[0].fields.status"  
                                       :value="options.common_status.active" :unchecked-value="options.common_status.inactive"
                                       name="check-button" switch/>
                    </div>
                    <span>{{ formatOperation(message_setup[0].fields.status) }}</span> 
                  </div>
                </div>
              </div>
            </div>
            <div v-show="!is_mobile || (is_mobile && mobile_index == 1)" class="phone-message-box box left action">
              <h3 class="phone-number tac fw-bold mt10">{{ $t('general.second') }}</h3>
              <div class="inner">
                <p class="mb0 top clearfix">
                  <span>{{ $t('messages.message') }}</span>
                  <select v-model="message_setup[1].fields.message_type" class="flr w150" @change="onChangeMessageType(1, true)">
                    <option :value="options.messages_enums.message_type.sms">SMS</option>
                    <option :value="options.messages_enums.message_type.lms">LMS</option>
                  </select>
                </p>
                <textarea ref="txArea1" v-model="message_setup[1].fields.contents" class="textbox noresize"
                          cols="30" rows="10"
                          @keyup.prevent="onCheckLength(1)" @paste="onPaste(1)" @click="index = 1"/>
                <span class="fix">
                  {{ current_bytes[1] }} / {{ max_bytes[1] }} Bytes
                </span>
                <div class="buttonbox">
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.variable)">{{ $t('messages.variables') }}</button>
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.sample, 1)">{{ $t('messages.samples') }}</button>
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.preview, 1)">{{ $t('messages.preview') }}</button>
                </div>
                <div class="phone-message-box-info">
                  <div class="info-box">
                    <p>{{ $t('message-autos.send-before') }} 
                      <input v-model="message_setup[1].fields.send_days_before" type="number" class="w70" 
                             min="0" max="90" @blur="onCheckSendDaysBefore(1)"> {{ $t('message-autos.send-before-days') }}
                    </p>
                  </div>
                  <div class="info-box">
                    <p>{{ limit_info }} 
                      <input v-model="message_setup[1].fields.limit" type="number" class="w70"
                             @blur="onCheckLimit(1)">
                      <template v-if="shop_data.country == options.country.kr">{{ limit_info2 }} </template>
                    </p>
                  </div>
                  <div class="info-box">
                    <span class="mr10">{{ $t('messages.operation') }}</span> 
                    <div class="b-custom-switch dib">
                      <b-form-checkbox v-model="message_setup[1].fields.status"  
                                       :value="options.common_status.active" :unchecked-value="options.common_status.inactive"
                                       name="check-button" switch/>
                    </div>
                    <span>{{ formatOperation(message_setup[1].fields.status) }}</span> 
                  </div>
                </div>
              </div>
            </div>
            <div v-show="!is_mobile || (is_mobile && mobile_index == 2)" class="phone-message-box box left action">
              <h3 class="phone-number tac fw-bold mt10">{{ $t('general.third') }}</h3>
              <div class="inner">
                <p class="mb0 top clearfix">
                  <span>{{ $t('messages.message') }}</span>
                  <select v-model="message_setup[2].fields.message_type" class="flr w150" @change="onChangeMessageType(2, true)">
                    <option :value="options.messages_enums.message_type.sms">SMS</option>
                    <option :value="options.messages_enums.message_type.lms">LMS</option>
                  </select>
                </p>
                <textarea ref="txArea2" v-model="message_setup[2].fields.contents" class="textbox noresize"
                          cols="30" rows="10"
                          @keyup.prevent="onCheckLength(2)" @paste="onPaste(2)" @click="index = 2"/>
                <span class="fix">
                  {{ current_bytes[2] }} / {{ max_bytes[2] }} Bytes
                </span>
                <div class="buttonbox">
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.variable)">{{ $t('messages.variables') }}</button>
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.sample, 2)">{{ $t('messages.samples') }}</button>
                  <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.preview, 2)">{{ $t('messages.preview') }}</button>
                </div>
                <div class="phone-message-box-info">
                  <div class="info-box">
                    <p>{{ $t('message-autos.send-before') }}
                      <input v-model="message_setup[2].fields.send_days_before" type="number" class="w70" 
                             min="0" max="90" @blur="onCheckSendDaysBefore(2)"> 
                    </p>
                  </div>
                  <div class="info-box">
                    <p>{{ limit_info }}   
                      <input v-model="message_setup[2].fields.limit" type="number" class="w70"
                             @blur="onCheckLimit(2)">
                      <template v-if="shop_data.country == options.country.kr">{{ limit_info2 }} </template>
                    </p>
                  </div>
                  <div class="info-box">
                    <span class="mr10">{{ $t('messages.operation') }}</span> 
                    <div class="b-custom-switch dib">
                      <b-form-checkbox v-model="message_setup[2].fields.status"  
                                       :value="options.common_status.active" :unchecked-value="options.common_status.inactive"
                                       name="check-button" switch/>
                    </div>
                    <span>{{ formatOperation(message_setup[2].fields.status) }}</span> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sending-time-box">
          {{ $t('message-autos.sending-time') }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <select-control v-model="target_hour" :options="target_hour_options"
                          :not-translate="true"
                          class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.hour') }}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <select-control v-model="target_minute" :options="target_minute_options"
                          :not-translate="true"
                          class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.minutes') }} 
        </div>
        <div class="buttonbox">
          <button class="btn-default small" @click="submitActionAsync()">{{ $t('general.save') }}</button>
          <button v-if="message_setup[0].fields.id > 0" class="btn-default small" @click="onDeleteAsync()">{{ $t('general.delete') }}</button>
        </div>
        <message-variable :tab="action_data.tab" :type="action_data.type" @addChar="onInsertText"/>
        <preview-message :data="message_data_props" :tab="action_data.tab" :type="action_data.type"/>
        <b-modal id="text-sample-list-modal" 
                 :title="$t('messages.sample-add-title')"
                 :no-close-on-backdrop="true"
                 hide-footer
                 size="xl">
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

import MessageSetupSalesApi       from '../../../api/message-autos/message-setup-sales-api'
import MessageSetupSalesViewModel from '../../../view-model/message-autos/message-setup-sales/message-setup-sales-view-model'
import SolutionTextFeeApi         from '../../../api/messages/solution-text-fee-api'
import SolutionTextFeeViewModel   from '../../../view-model/messages/text-fees/solution-text-fee-view-model'

import message_variable from '../../../components/messages/message-variable/message-variable'
import preview_message  from '../../../components/messages/preview-message/preview-message'
import text_sample_list from '../../../components/messages/text-sample-list/text-sample-list'
import select_control   from '../../../components/common/form/select/select-control/select-control2'

import MessageHelper from '../../../helpers/message-helper.js'

export default {
  components: {
    'message-variable' : message_variable,
    'text-sample-list' : text_sample_list,
    'preview-message'  : preview_message,
    'select-control'   : select_control,
  },
  extends : component_base,
  data(){
    return {
      options: options,
      message_setup_sales_api: {},
      message_setup: [],
      message_setup_errors: [],
      solution_text_fee_api: {},
      shop_id: 0,

      text_fees: {},  
      current_bytes: [0, 0, 0],
      max_bytes: [0, 0, 0],

      target_hour_options: [],
      target_minute_options: [],

      target_date: 0,
      target_hour: '08',
      target_minute: '00',

      sample_data_props: {
        message_type  : options.messages_enums.message_type.sms,
        country_code  : '', 
        solution_id   : 0,
        text_fees     : {},
        shop_id       : 0
      },

      title: null,
      title_info: null,
      limit_info: null,
      limit_info2: null,

      message_helper: [],
      message_data_props: {},
      index: 0,
      mobile_index: 0,
      is_mobile: false
    }
  },
  computed: {
    ...mapGetters('setup_automatic_messaging', {
      action_data: 'getSetupAutomaticMessagingInfo'
    }),
  },  
  created(){
    window.addEventListener('resize', this.onChangeWindowWidth)
    this.is_mobile = window.innerWidth < 992 ? true : false
    
    this.message_setup_sales_api = new MessageSetupSalesApi()
    this.message_setup[0] = new MessageSetupSalesViewModel()
    this.message_setup[1] = new MessageSetupSalesViewModel()
    this.message_setup[2] = new MessageSetupSalesViewModel()
    this.message_data_props = new MessageSetupSalesViewModel()

    this.solution_text_fee_api = new SolutionTextFeeApi()
    this.text_fees = new SolutionTextFeeViewModel()

    this.shop_id = this.shop_data.shop_id
  },
  destroyed() {
    window.removeEventListener('resize', this.onChangeWindowWidth)
  },
  beforeMount(){
    this.loadDataTableAsync()
  },
  methods: {
    async loadDataTableAsync() {
      this.onSetTime()
      switch (this.action_data.type) {
        case options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder:
          this.title = this.$i18n.t('message-autos.prepaid-card-expiry-date-reminder')
          this.title_info = this.$i18n.t('message-autos.prepaid-card-expiry-date-reminder-info')
          this.limit_info = this.$i18n.t('message-autos.balance-info')
          this.limit_info2 = this.$i18n.t('message-autos.balance-info2')
          break

        case options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder:
          this.title = this.$i18n.t('message-autos.prepaid-service-expiry-date-reminder')
          this.title_info = this.$i18n.t('message-autos.prepaid-service-expiry-date-reminder-info')
          this.limit_info = this.$i18n.t('message-autos.quantity-info')
          this.limit_info2 = this.$i18n.t('message-autos.quantity-info2')
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
        for (let index = 0; index < result.data.items.length; index++) {
          this.$set(this.message_setup, index, result.data.items[index])
        }
        // First, Second, Third Same SendTime
        if(this.message_setup[0].fields.id > 0){
          let temp = this.message_setup[0].fields.send_time.split(':')
          this.target_hour = temp[0]
          this.target_minute = temp[1]
        }else{
          // Set Default Value
          if(this.shop_data.country == options.country.kr){
            this.message_setup[0].fields.send_days_before = 90
            this.message_setup[1].fields.send_days_before = 30
            this.message_setup[2].fields.send_days_before = 7

            if(this.action_data.type == options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder){
              this.message_setup[0].fields.limit = 10000
              this.message_setup[1].fields.limit = 1
              this.message_setup[2].fields.limit = 1
            }else{
              this.onSetMessageSetupData('limit', 1)
            }
          }
        }          
      }
      else{
        this.showAlert(result.error_messages)
      }

      this.onSetMessageSetupData('shop_id', this.shop_id)
      this.onSetMessageSetupData('country_code', this.shop_data.country)

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
        this.onChangeMessageType(0)
        this.onChangeMessageType(1)
        this.onChangeMessageType(2)
      }else this.showAlert(result.error_messages)
      this.onCheckLength(0)
      this.onCheckLength(1)
      this.onCheckLength(2)
    },
    async submitActionAsync(){
      this.message_setup_errors = []

      // SendDaysBefore Validation Check
      if(this.message_setup[0].fields.send_days_before <= this.message_setup[1].fields.send_days_before
          && this.message_setup[0].fields.status == options.common_status.active 
          && this.message_setup[1].fields.status == options.common_status.active)
        this.message_setup_errors.push(this.$i18n.t('validate_messages.send-days-before').replace('{0}', this.$i18n.t('general.first')).replace('{1}', this.$i18n.t('general.second')))
      if(this.message_setup[0].fields.send_days_before <= this.message_setup[2].fields.send_days_before
          && this.message_setup[0].fields.status == options.common_status.active 
          && this.message_setup[2].fields.status == options.common_status.active)
        this.message_setup_errors.push(this.$i18n.t('validate_messages.send-days-before').replace('{0}', this.$i18n.t('general.first')).replace('{1}', this.$i18n.t('general.third')))
      if(this.message_setup[1].fields.send_days_before <= this.message_setup[2].fields.send_days_before
          && this.message_setup[1].fields.status == options.common_status.active 
          && this.message_setup[2].fields.status == options.common_status.active)
        this.message_setup_errors.push(this.$i18n.t('validate_messages.send-days-before').replace('{0}', this.$i18n.t('general.second')).replace('{1}', this.$i18n.t('general.third')))

      let message_setup_error = this.message_setup[0].isValid()
      if(message_setup_error.length > 0){
        this.message_setup_errors.push('--------------- ' + this.$i18n.t('general.first') + ' ---------------')
        this.message_setup_errors.push(...message_setup_error)
      }

      message_setup_error = this.message_setup[1].isValid()
      if(message_setup_error.length > 0){
        this.message_setup_errors.push('--------------- ' + this.$i18n.t('general.second') + ' ---------------')
        this.message_setup_errors.push(...message_setup_error)
      }

      message_setup_error = this.message_setup[2].isValid()
      if(message_setup_error.length > 0){
        this.message_setup_errors.push('--------------- ' + this.$i18n.t('general.third') + ' ---------------')
        this.message_setup_errors.push(...message_setup_error)
      }

      if(this.message_setup_errors.length == 0) {
        if(this.action_data.type == options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder){
          this.message_setup[0].fields.setup_type = options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder_first
          this.message_setup[1].fields.setup_type = options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder_second
          this.message_setup[2].fields.setup_type = options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder_third
        }else {
          this.message_setup[0].fields.setup_type = options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder_first
          this.message_setup[1].fields.setup_type = options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder_second
          this.message_setup[2].fields.setup_type = options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder_third
        }

        this.onSetMessageSetupData('send_time', this.target_hour + ':' + this.target_minute)

        let api_action = ''
        if(this.message_setup[0].fields.id > 0) api_action = 'updateMessageSetupSalesToExpiryDateAsync'
        else api_action = 'createMessageSetupSalesToExpiryDateAsync'

        this.preLoader(true)
        let result = await this.message_setup_sales_api[api_action](this.message_setup)
        this.preLoader(false)
        if(result.is_ok) {
          this.onMovePage()
        } else {
          this.showAlert(result.error_messages)
        }
      }else this.showAlert(this.message_setup_errors)
    },
    async onDeleteAsync(){
      this.preLoader(true)
      let message_setup_sales_ids = []
      this.message_setup.forEach(item => {
        message_setup_sales_ids.push(item.fields.id)
      })
      let data_send = {
        ids     : message_setup_sales_ids,
        shop_id : this.shop_id
      }
      let result = await this.message_setup_sales_api.deleteMessageSetupSalesToExpiryDateAsync(data_send)
      this.preLoader(false)

      if(result.is_ok) {
        this.onMovePage()
      } else {
        this.showAlert(result.error_messages)
      }
    },
    onChangeMessageType(index, is_set_index = false){
      if(is_set_index) this.index = index

      if(this.message_setup[index].fields.message_type == this.options.messages_enums.message_type.sms){        
        this.$set(this.max_bytes, index, this.text_fees.fields.sms_max_bytes)
      }
      else if(this.message_setup[index].fields.message_type == this.options.messages_enums.message_type.lms) {
        this.$set(this.max_bytes, index, this.text_fees.fields.lms_max_bytes)
      }
      
      this.message_helper[index] = new MessageHelper(this.message_setup[index].fields.message_type, this.max_bytes[index])

      setTimeout(()=> this.onCheckLength(index), 4)
    },
    onCheckLength(index) {
      let ui = this.$refs['txArea' + index]
      
      let return_data = this.message_helper[index].check_len(ui)
      if (return_data != null) {              
        this.message_setup[index].fields.contents = return_data.value
        this.$set(this.current_bytes, index, return_data.length)
      }
    },
    onPaste(index){
      setTimeout(()=> this.onCheckLength(index), 4) 
    },
    formatOperation(status){
      if(status == options.common_status.active) return 'On'
      else return 'Off'
    },
    onInsertText(ch) {
      let ui = this.$refs['txArea' + this.index]

      let value = this.message_helper[this.index].insertAtCaret(ui, ch)      
      if (value != null) {
        this.message_setup[this.index].fields.contents = value
      }   
      this.onCheckLength(this.index)
      ui.focus()
    },
    async onInsertSampleText(text){
      let ui = this.$refs['txArea' + this.index]
      ui.value = text
      this.onHideSampleModal()
      setTimeout(()=> this.onCheckLength(this.index), 4) 
    },
    onShowHelpSetup(type, index = null){
      if(type == options.messages_enums.help_send_text.preview){
        this.message_data_props = this.message_setup[index]
        this.$nextTick(() => {
          this.showDialogById('preview-message-modal')
        })
      }
      else if(type == options.messages_enums.help_send_text.variable)
        this.showDialogById('message-variable-modal')
      else if(type == options.messages_enums.help_send_text.sample){
        this.onSetSampleDataProp(index)
        this.$nextTick(() => {
          this.showDialogById('text-sample-list-modal')
          this.$refs.text_sample_list.onLoadForm()
        })    
      }
    },
    onSetSampleDataProp(index){
      this.sample_data_props = {
        group_code   : this.onSetSampleCode(this.action_data.type),
        message_type : this.message_setup[index].fields.message_type,
        country_code : this.shop_data.country,
        solution_id  : this.shop_data.solution_id,
        text_fees    : this.text_fees.fields,
        mms_type     : null,
        list_type    : options.messages_enums.list_type.sample,
      }
    },
    onMovePage(){
      this.$router.push(({ name: 'setup-automatic-messaging' }))      
    },
    onSetTime(){
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
    },
    onSetSampleCode(type){
      let code = ''

      if(type == options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder)
        code = options.messages_enums.setup_automatic_messaging_samples_code.prepaid_card_expiry_date_reminder
      else if(type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder)
        code = options.messages_enums.setup_automatic_messaging_samples_code.prepaid_service_expiry_date_reminder

      return code
    },
    onChangeWindowWidth(){
      this.is_mobile = window.innerWidth < 992 ? true : false
    },
    onCheckSendDaysBefore(index){
      let error_message = []

      if(this.message_setup[index].fields.send_days_before > 90){
        error_message.push(this.$i18n.t('validate_messages.maxValue').replace('{field}', this.$i18n.t('general.days')).replace('{max_value}', 90))
        this.message_setup[index].fields.send_days_before = 90
      }else if(this.message_setup[index].fields.send_days_before < 0){
        error_message.push(this.$i18n.t('validate_messages.minValue').replace('{field}', this.$i18n.t('general.days')).replace('{min_value}', 0))
        this.message_setup[index].fields.send_days_before = 0
      }
      
      if(error_message.length > 0)
        this.showAlert(error_message)
    },
    onCheckLimit(index){
      let error_message = []
      let item_text = this.action_data.type == options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder
        ? this.$i18n.t('message-autos.quantity') : this.$i18n.t('message-autos.balance')

      if(this.message_setup[index].fields.limit < 0){
        error_message.push(this.$i18n.t('validate_messages.minValue').replace('{field}', item_text).replace('{min_value}', 0))
        this.message_setup[index].fields.limit = 0
      } else if(String(this.message_setup[index].fields.limit).length > 12){
        error_message.push(this.$i18n.t('validate_messages.maxLength').replace('{field}', item_text).replace('{max_value}', 12))
        this.message_setup[index].fields.limit = this.message_setup[index].fields.limit.slice(0, 12)
      }
      if(error_message.length > 0)
        this.showAlert(error_message)
    },
    onSetMessageSetupData(property, value){
      this.message_setup.forEach(item => {
        item.fields[property] = value
      })
    },
    onHideSampleModal(){
      this.hideDialogById('text-sample-list-modal')
    }
  }
}
</script>
<style lang='scss'>
@import './setup-automatic-messaging-expiry-date-reminder-info.scss';
</style>