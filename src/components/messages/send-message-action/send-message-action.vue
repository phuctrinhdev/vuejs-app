<template>
  <div class="contents send-message-action clearfix">
    <div :class="{'image-mms': text_message.fields.message_type == options.messages_enums.message_type.mms }" class="phone-message-box box left">
      <div class="inner">
        <p class="mb0 top clearfix">
          <span>{{ $t('messages.message') }}</span>
          <font v-if="text_message.fields.message_type == options.messages_enums.message_type.mms" class="flr">
            <label class="btn1 mt0 ml3" for="file">{{ $t('messages.load-image') }}</label> 
            <input id="file" type="file" class="non-name" 
                   @change="encodeImageFileAsURL">
          </font>
          <select v-model="text_message.fields.message_type" :class="{'w30p': text_message.fields.message_type == options.messages_enums.message_type.mms }" class="flr w150"
                  @change="onChangeMessageType()">
            <option :value="options.messages_enums.message_type.sms">SMS</option>
            <option :value="options.messages_enums.message_type.lms">LMS</option>
            <option :value="options.messages_enums.message_type.mms">MMS</option>
          </select>
        </p>
        <div v-if="text_message.fields.message_type == options.messages_enums.message_type.mms" class="mms-img-box">
          <img v-if="mms_image != ''" :src="mms_image" @load="revoke_mms_image">
          <font v-else>{{ $t('messages.image-area') }}</font>
        </div>
        <textarea ref="txArea" v-model="text_message.fields.contents" class="textbox noresize"
                  cols="30" rows="10"
                  @keyup.prevent="onCheckLength($event)" @paste="onPaste($event)"/>
        <span class="fix">
          {{ current_bytes }} / {{ max_bytes }} Bytes
        </span>
        <div class="buttonbox">
          <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.character)">#!...</button>
          <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.emoticon)">^-^</button>
          <!-- <button class="btn secondary small">Variables</button> -->
          <button class="btn secondary small" @click="onShowHelpSetup(options.messages_enums.help_send_text.sample)">{{ $t('messages.samples') }}</button>
        </div>
        <div class="buttonbox under">
          <button class="btn secondary small" v-html="$t('messages.add-rejection')"/>
          <button class="btn secondary small" @click="onSaveMyMessage" v-html="$t('messages.save-message-br')"/>
          <button class="btn secondary small" v-html="$t('messages.send-test-message')"/>
        </div>
        <div class="clearfix">          
          <span class="fz12 mt5 dib">{{ $t('messages.sender') }}</span>
          <select v-model="text_message.fields.sender_phone" style="width:50%;">
            <option v-for="(row, idx) in sender_phone_select.rows" :key="idx" :value="row.sender_phone">{{ row.sender_phone }}</option>
          </select>
          <button class="btn secondary small flr mt5">
            <router-link :to="{ name: 'message-sender-numbers' }">{{ $t('messages.setup') }}</router-link>
          </button>
        </div>
      </div>
    </div>
    <div class="phone-message-box box right">
      <div v-if="type != options.messages_enums.send_page.unregister_clients" class="bd">
        <table class="bd-none">
          <tbody>
            <!-- <tr v-if="type != options.messages_enums.send_page.client">
              <td>Target Clients</td>
              <td>100</td>
            </tr>
            <tr v-if="type != options.messages_enums.send_page.client">
              <td>Unit Price (SMS)</td>
              <td>30</td>
            </tr>
            <tr v-if="type != options.messages_enums.send_page.client">
              <td>Total Cost</td>
              <td>3,000</td>
            </tr>
            <tr v-if="type != options.messages_enums.send_page.client">
              <td>Netmoney Balance</td>
              <td>100,000</td>
            </tr> -->
            <tr v-if="type == options.messages_enums.send_page.client || type == options.messages_enums.send_page.cid_unregister_client">
              <td>{{ $t('messages.mobile-number') }}</td>
              <td>{{ send_mesasge_data.mobile_number }}</td>
            </tr>
            <tr v-if="type == options.messages_enums.send_page.client">
              <td>{{ $t('messages.client-name') }}</td>
              <td>{{ send_mesasge_data.client_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <input v-model="receiver_phone" type="text"><label class="btn1 mt0 ml3" @click="onAddReceiver">{{ $t('messages.add-number') }}</label>
        <div class="overflow-table">
          <table class="unregister-client-table">
            <tr v-for="(receiver, index) in receivers" :key="index">
              <td :class="{ 'selected' : receiver.selected }" @click="onClickReceiver(receiver)">{{ receiver.receiver_phone }}</td>
            </tr>
          </table>
        </div>
        <br>
        <label class="btn1 mt0 ml3" @click="onDeleteReceivers">{{ $t('general.delete') }}</label>
        &nbsp;&nbsp;
        <b-form-checkbox
          v-if="type == options.messages_enums.send_page.unregister_clients"
          v-model="is_duplicate"
          :value="true"
          :unchecked-value="false"
          class="dib"
        >{{ $t('messages.send-duplicate-number-info') }}</b-form-checkbox>
      </div>
      <div class="mt10">
        <div class="clearfix mb10">
          <span class="fz12">
            {{ $t('messages.sending-date') }}
            <select v-model="text_message.fields.is_send_now">
              <option :value="true">{{ $t('messages.send-immediately') }}</option>
              <option :value="false">{{ $t('messages.scheduled-sending') }}</option>
            </select>
          </span>
        </div>
        <div v-show="!text_message.fields.is_send_now" class="clearfix mb10">
          <v-date-picker v-model="target_date"
                         :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                         :input-props="{ placeholder: '' }"
                         class="date-sm"/>
          <span class="calendar-img"/>  
          <select-control v-model="target_hour" :options="target_hour_options"
                          :not-translate="true"
                          class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.hour') }}
          <select-control v-model="target_minute" :options="target_minute_options"
                          :not-translate="true"
                          class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.minutes') }} 
        </div>
      </div>
      <div class="link-guide-btn clearfix">
        <a href="#" class="btn btn-link" v-html="$t('messages.spam-message-info1')"/>
        <a href="#" class="btn btn-link">{{ $t('messages.spam-message-info2') }}</a>
      </div>
      <div class="note">
        <p v-html="$t('messages.send-message-info1')"/>
        <p v-html="$t('messages.send-message-info2')"/>
      </div>
      <div class="button-send-box">
        <button class="btn default" @click="submitActionAsync()">{{ $t('messages.send') }}</button>
      </div>
    </div> 
    <b-modal id="text-sample-list-modal" 
             :title="$t('messages.sample-add-title')"
             :no-close-on-backdrop="true"
             hide-footer
             size="xl">
      <div class="solution-message-sample">
        <div class="dib r-fln">
          <radio-group v-model="list_type" :options="options.messages_enums.list_type_select" 
                       @input="onChangeMMSType(options.messages_enums.help_send_text.sample)"/>
        </div>
        <div v-if="list_type == options.messages_enums.list_type.sample" class="mb0 mt0 flr r-fln">
          <select v-model="main_group_id" @change="onLoadSubGroup">
            <option v-for="(row, idx) in sample_main_group_select" :key="idx" :value="row.id">
              {{ row.group_name }}
            </option>
          </select>
          <select v-model="sub_group_id" @change="onSetSampleDataProp">
            <option v-for="(row, idx) in sample_sub_group_select" :key="idx" :value="row.id">
              {{ row.group_name }}
            </option>
          </select>
        </div>
        <radio-group v-if="text_message.fields.message_type == options.messages_enums.message_type.mms && list_type == options.messages_enums.list_type.sample" 
                     v-model="mms_type" :options="options.messages_enums.mms_type_select" 
                     class="clearfix" 
                     @input="onShowHelpSetup(options.messages_enums.help_send_text.sample)"/>
        
        <text-sample-list ref="text_sample_list" 
                          :data="sample_data_props"
                          @addChar="onInsertSampleText"/>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="onHideSampleModal">{{ $t('general.close') }}</button>
      </div>
    </b-modal>
    <text-special-character @addChar="onInsertText(options.messages_enums.help_send_text.character, ...arguments)"/>
    <text-special-emoticon @addChar="onInsertText(options.messages_enums.help_send_text.emoticon, ...arguments)"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { options }    from '../../../helpers/options'
import { setupCalendar
  , DatePicker } from 'v-calendar'
import radio_group               from '../../../components/common/form/radio/radio-group/radio-group' 
import component_base            from '../../../components/common/component-base/component-base'
import text_special_character    from '../../../components/messages/text-special-character/text-special-character'
import text_special_emoticon     from '../../../components/messages/text-special-emoticon/text-special-emoticon'
import text_sample_list          from '../../../components/messages/text-sample-list/text-sample-list'
import select_control            from '../../../components/common/form/select/select-control/select-control2'
import TextMessageViewModel      from '../../../view-model/messages/text-message/text-message-view-model'
import SolutionTextFeeViewModel  from '../../../view-model/messages/text-fees/solution-text-fee-view-model'
import MessageHelper             from '../../../helpers/message-helper.js'
import ClientApi                 from '../../../api/clients/client-api'
import TextMessageApi            from '../../../api/messages/text-message-api'
import SolutionTextFeeApi        from '../../../api/messages/solution-text-fee-api'
import TextSenderPhoneApi        from '../../../api/messages/text-sender-phone-api'
import TextSampleBusinessTypeApi from '../../../api/messages/text-sample-business-type-api'
import TextSampleGroupApi        from '../../../api/messages/text-sample-group-api'
import { formatDateBySetting
  , convertDateToTimezone
  , emptyValue
  , convertDateFromTimezoneToTimestamp } from '../../../helpers/common'

export default {
  components: {
    'text-special-character' : text_special_character,
    'text-special-emoticon'  : text_special_emoticon,
    'text-sample-list'       : text_sample_list,
    'select-control'         : select_control,
    'v-date-picker'          : DatePicker,
    'radio-group'            : radio_group
  },
  extends: component_base,
  props: {
    data: {
      type: undefined, // Any type
      default: null
    },
    type: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: options.page_modal_check.page
    },
    call_number: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      options: options,
      text_fees: {},    
      text_message: {},
      text_message_errors: [],
      current_bytes: 0,
      max_bytes: 0,
      is_duplicate: false,
      receivers: [],
      target_hour_options: [],
      target_minute_options: [],
      target_date: null,
      target_hour: '08',
      target_minute: '00',
      message_helper: null,

      sender_phone_select: { rows:[] },
      sample_main_group_select: {},
      sample_sub_group_select: {},
      table_filter: {},

      main_group_id: 0,
      sub_group_id: 0,

      today: convertDateToTimezone(new Date()),
      mms_image: '',
      sample_data: null,
      mms_type: options.messages_enums.mms_type.image,
      
      // targets: { 
      //   target_count     : 0, 
      //   unit_price       : 0,
      //   total_cost       : 0,
      //   netmoney_balance : 0
      // },

      send_mesasge_data: { // target : 1client (Init)
        mobile_number : null,
        client_name   : null
      },
      list_type: options.messages_enums.list_type.sample,
      sample_data_props: {
        message_type  : options.messages_enums.message_type.sms,
        country_code  : '', 
        solution_id   : 0,
        text_fees     : {},
        shop_id       : 0
      },
      first_load_sample : true, // Set Main & Sub group samples
      receiver_phone: ''
    }
  },
  watch: {
    target_date(){
      if(formatDateBySetting(this.target_date) == formatDateBySetting(this.today)){
        if(this.today.getHours() >= 22) this.target_hour = '08'
        else if(this.today.getHours().length < 2) this.target_hour = '0' + (this.today.getHours() + 1)
        else this.target_hour = String(this.today.getHours() + 1)
      } else this.target_hour = '08'
      this.target_minute = '00'
    },
    main_group_id(){
      if(this.sample_sub_group_select.length > 0)
        this.sub_group_id = this.sample_sub_group_select[0].id
    }
  },  
  beforeMount() {
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })

    this.text_fees = new SolutionTextFeeViewModel()
    this.text_message = new TextMessageViewModel()

    // Set time
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
  async mounted() {
    if(this.page == options.page_modal_check.page)
      await this.onLoadForm()
  },
  methods: {
    async onLoadForm(){
      // Init data
      this.text_message.fields.country_code = this.shop_data.country
      this.text_message.fields.solution_id = this.shop_data.solution_id
      this.text_message.fields.shop_id = this.shop_data.shop_id
      // this.text_message.fields.sender_phone = '15444634' // Todo Change Hyunsik
      this.text_message.fields.user_id = 'UserId' // Todo Change HyunSik
      this.text_message.fields.message_type = options.messages_enums.message_type.sms

      this.current_bytes = 0
      this.mms_type = options.messages_enums.mms_type.image
      this.target_date = convertDateToTimezone(new Date())

      if(this.type == options.messages_enums.send_page.client)
        await this.loadClientInfo() // Set 1ClientInfo
      else if(this.type == options.messages_enums.send_page.cid_unregister_client){
        this.send_mesasge_data.mobile_number = this.call_number
        this.receivers = this.send_mesasge_data.mobile_number
      }

      await this.loadTextInfo() // Set Max Byte, TextFee
      await this.loadSederPhones()
    },
    async loadClientInfo(){
      let data_send = {
        client_id : this.data,
        shop_id : this.shop_data.shop_id
      }
      let client_api = new ClientApi()
      this.preLoader()
      let result = await client_api.getClientAsync(data_send)
      if(result.is_ok){
        this.send_mesasge_data = result.data
        if(!emptyValue(this.send_mesasge_data.mobile_number))
          this.receivers = this.send_mesasge_data.mobile_number
      }else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    async loadTextInfo(){
      let data_send = { 
        country_code: this.shop_data.country,
        solution_id: this.shop_data.solution_id,
        chain_id: 0, // Todo Change
        shop_id: this.shop_data.shop_id
      }
      let solution_text_fee_api = new SolutionTextFeeApi()
      this.preLoader()
      let result = await solution_text_fee_api.getTextFeeByShopAsync(data_send)
      if(result.is_ok){
        this.text_fees.fields = Object.assign({}, result.data)
        this.onChangeMessageType()
      }else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    async loadSederPhones() {
      this.preLoader()
      let data_send = {
        shop_id      : this.shop_data.shop_id,
        page_size    : options.pagination.default,
        page_number  : 1,
      }
      let result = await (new TextSenderPhoneApi()).getTextSenderPhonesByShopAsync(data_send)
      if(result.is_ok){
        this.sender_phone_select.rows= result.data.items
        if (result.data.items.length >0) {
          this.text_message.fields.sender_phone = result.data.items[0].sender_phone
        }
      }
      else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    onChangeMessageType(){
      if(this.text_message.fields.message_type == this.options.messages_enums.message_type.sms){        
        this.max_bytes = this.text_fees.fields.sms_max_bytes
      }
      else if(this.text_message.fields.message_type == this.options.messages_enums.message_type.lms) {
        this.max_bytes = this.text_fees.fields.lms_max_bytes
      }
      else if(this.text_message.fields.message_type == this.options.messages_enums.message_type.mms) {
        this.max_bytes = this.text_fees.fields.mms_max_bytes
      }
      this.message_helper = new MessageHelper(this.text_message.fields.message_type, this.max_bytes)
      this.mms_image = ''
      this.sample_data = null

      setTimeout(()=> this.onCheckLength(), 4)
    },
    onCheckLength() {
      const ui = this.$refs.txArea
      let return_data = this.message_helper.check_len(ui)
      if (return_data != null) {              
        this.text_message.fields.contents = return_data.value
        this.current_bytes = return_data.length
      }
    },
    onPaste(){
      setTimeout(()=> this.onCheckLength(), 4) 
    },
    onInsertText(type, ch) {
      const ui = this.$refs.txArea
      let value = this.message_helper.insertAtCaret(ui, ch)      
      if (value != null) {
        this.text_message.fields.contents = value
      }   
      this.onCheckLength()
      ui.focus()

      if(type == options.messages_enums.help_send_text.character)
        this.hideDialogById('text-special-character-modal')
      else if(type == options.messages_enums.help_send_text.emoticon)
        this.hideDialogById('text-special-emoticon-modal')
    },
    async onShowHelpSetup(type){
      if(type == options.messages_enums.help_send_text.sample) {
        this.showDialogById('text-sample-list-modal')
        if(this.first_load_sample){
          await this.onLoadSampleInfo()
          this.first_load_sample = false
        }else{
          this.onSetSampleDataProp()
        }
      }
      else if(type == options.messages_enums.help_send_text.character)
        this.showDialogById('text-special-character-modal')
      else if(type == options.messages_enums.help_send_text.emoticon)
        this.showDialogById('text-special-emoticon-modal')
    },
    async onLoadSampleInfo(){
      let data_send_business_type = { 
        country_code       : this.shop_data.country,
        solution_id        : this.shop_data.solution_id,
        business_type_code : this.shop_data.business_type_code
      }
      let text_sample_business_type_api = new TextSampleBusinessTypeApi()

      this.preLoader()
      let result = await text_sample_business_type_api.getTextSampleBusinessTypesAsync(data_send_business_type)
      if(result.is_ok && result.data.items.length != 0){
        let data_send_main = {
          country_code : this.shop_data.country,
          solution_id  : this.shop_data.solution_id,
          group_level  : 2,
          up_level_id  : result.data.items[0].text_sample_group_id,
          group_type   : options.messages_enums.text_sample_group_type.business_type,
        }

        let text_sample_group_api = new TextSampleGroupApi()
        let result_main = await text_sample_group_api.getTextSampleGroupsAsync(data_send_main)

        if(result_main.is_ok && result_main.data.items.length != 0){
          this.sample_main_group_select = result_main.data.items
          this.main_group_id = result_main.data.items[0].id
          await this.onLoadSubGroup()
        }else if(!result_main.is_ok) this.showAlert(result.error_messages)
        else this.showAlert(new Array(this.$i18n.t('validate_messages.sample-not-exist'))) // MainGroup does not exist
      }else if(!result.is_ok) this.showAlert(result.error_messages)
      else this.showAlert(new Array(this.$i18n.t('validate_messages.sample-not-exist'))) // BusinessType does not exist
      this.preLoader(false)
    },
    async onLoadSubGroup() {
      let data_send = {
        country_code : this.shop_data.country,
        solution_id  : this.shop_data.solution_id,
        group_level  : 3,
        up_level_id  : this.main_group_id,
        group_type   : options.messages_enums.text_sample_group_type.business_type,
      }

      let text_sample_group_api = new TextSampleGroupApi()
      this.preLoader()
      let result = await text_sample_group_api.getTextSampleGroupsAsync(data_send)
      if(result && result.data.items.length != 0){
        this.sample_sub_group_select = result.data.items
        this.sub_group_id = result.data.items[0].id
        this.onSetSampleDataProp()
      }else if(!result.is_ok) this.showAlert(result.error_messages)
      else this.showAlert(new Array(this.$i18n.t('validate_messages.sample-not-exist'))) // SubGroup does not exist
      this.preLoader(false)
    },
    onSetSampleDataProp(is_create = false){
      this.sample_data_props = {
        text_sample_group_id : this.sub_group_id,
        message_type : this.text_message.fields.message_type,
        country_code : this.shop_data.country,
        solution_id  : this.shop_data.solution_id,
        text_fees    : this.text_fees.fields,
        mms_type     : this.mms_type,
        list_type    : this.list_type,
        is_create    : is_create,
        contents     : this.text_message.fields.contents
      }
      this.$nextTick(() => {
        this.$refs.text_sample_list.onLoadForm()
      })
    },
    async onSaveMyMessage(){
      this.list_type = options.messages_enums.list_type.my_message
      this.showDialogById('text-sample-list-modal')
      this.$nextTick(() => {
        this.onSetSampleDataProp(true)
      })        
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
      }
    },
    async onInsertSampleText(text){
      if(this.text_message.fields.message_type == options.messages_enums.message_type.mms 
          && this.mms_type == options.messages_enums.mms_type.image
          && this.list_type == options.messages_enums.list_type.sample) {
        this.sample_data = text

        let text_message_api = new TextMessageApi()
        this.preLoader()
        this.mms_image = await text_message_api.getImageUrl(text)
        this.preLoader(false)
      }
      else this.text_message.fields.contents = text

      if(this.list_type == options.messages_enums.list_type.sample)
        this.onHideSampleModal()
      setTimeout(()=> this.onCheckLength(), 4) 
    },
    async submitActionAsync(){
      if(this.type == options.messages_enums.send_page.client || this.type == options.messages_enums.send_page.cid_unregister_client){
        if(!emptyValue(this.receivers)) this.text_message.fields.target_count = 1
      } else if(this.type == options.messages_enums.send_page.unregister_clients){
        this.onSetReceivers()
        this.text_message.fields.target_count = this.text_message.fields.receivers.length
      }
      if(!this.text_message.fields.is_send_now)
        this.text_message.fields.target_date_ts = convertDateFromTimezoneToTimestamp(this.target_date) + (3600 * Number(this.target_hour) + (60 * Number(this.target_minute)))

      // Image from (manual(base64) or sample(url))
      if(this.text_message.fields.message_type == options.messages_enums.message_type.mms){
        if(this.sample_data == null) {
          this.text_message.fields.image_base64 = this.mms_image.replace(/^data:image\/(png|jpg|jpeg|bmp|gif);base64,/, '')
          this.text_message.fields.image_url = ''
        } else {
          this.text_message.fields.image_url = this.imagePath(this.sample_data)
          this.text_message.fields.image_base64 = ''
        }
      }
      
      this.text_message_errors = this.text_message.isValid()
      if(this.text_message_errors.length == 0) {
        let temp_contents = this.text_message.fields.contents // To Api Fail
        if(this.type == options.messages_enums.send_page.client){
          this.text_message.fields.source_type = options.messages_enums.message_source_type.none // var1 must name
          if(!emptyValue(this.text_message.fields.contents) && this.text_message.fields.contents.indexOf(this.$i18n.t('variable-data.name')) > -1){
            this.text_message.fields.contents = this.text_message.fields.contents.replace(this.$i18n.t('variable-data.name'), '#$var1#$')
          }
          this.text_message.fields.variable_data = this.$i18n.t('variable-data.name')
          let receiver = {
            receiver_phone : this.receivers,
            receiver_key   : this.send_mesasge_data.id,
            var1 : this.send_mesasge_data.client_name
          }
          this.text_message.fields.receivers.push(receiver)
        } else if(this.type == options.messages_enums.send_page.cid_unregister_client){
          let receiver = {
            receiver_phone : this.receivers,
          }
          this.text_message.fields.receivers.push(receiver)
        }
        this.preLoader(true)
        let text_message_api = new TextMessageApi()
        let result = await text_message_api.createTextMessageAsync(this.text_message.fields)
        if(result.is_ok) {
          if(this.page == options.page_modal_check.modal){
            this.$emit('reload-page')
          }else{
            this.$router.push(({ name: 'send-message-histories' }))
          }
        } else {
          this.text_message.fields.contents = temp_contents
          this.showAlert(result.error_messages)
        }
        this.preLoader(false)
      }else this.showAlert(this.text_message_errors)

      // To initialize data in case of failure
      this.text_message.fields.image_base64 = ''
      this.text_message.fields.image_url = ''
      this.text_message.fields.receivers = [] 
    },
    revoke_mms_image(){      
      if (this.mms_image && this.mms_image.startsWith('blob')) {
        window.URL.revokeObjectURL(this.mms_image)
      }
    },
    imagePath(data){
      // eslint-disable-next-line no-undef
      return process.env.AZURE_STORAGE_MESSAGE_URL + data.image_path + '/' + data.image_name
    },
    onAddReceiver(){
      this.receivers.unshift({
        receiver_phone : this.receiver_phone,
        selected       : false
      })
      let temp_view_model = new TextMessageViewModel()
      temp_view_model.fields.receivers = this.receivers
      let is_valid = temp_view_model.isValid(this.type)
      if(is_valid.length != 0) {
        this.receivers.splice(0, 1)
        this.showAlert(this.$i18n.t(is_valid))
      }
      this.receiver_phone = ''
    },
    onDeleteReceivers(){
      this.receivers = _.remove(this.receivers, (receiver) => {
        return receiver.selected == false
      })
    },
    onClickReceiver(receiver){
      receiver.selected = !receiver.selected
    },
    onSetReceivers(){ // case : Unregister clients
      if(this.receivers.length > 0){
        let flag = true
        this.receivers.forEach(item => {
          flag = true
          if(this.is_duplicate){
            if(!emptyValue(this.text_message.fields.receivers.find(x => x.receiver_phone == item.receiver_phone)))
              flag = false
          }
          if(flag){
            let receiver = {
              receiver_phone : item.receiver_phone
            }
            this.text_message.fields.receivers.push(receiver)
          }
        })
      }
    },
    onHideSampleModal(){
      this.hideDialogById('text-sample-list-modal')
    },
    onChangeMMSType(){
      this.onSetSampleDataProp()
    },
  }
}
</script>

<style lang='scss'>
@import './send-message-action.scss';
</style>
