<template>
  <main class="app-content">
    <section class="contents-style common-style setup-automatic-messaging-post-visit-info-area">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ title }}</h3>
          <ul class="btn-group clearfix flr">
            <li><a class="btn secondary" @click="onMovePage">{{ $t('message-autos.back') }}</a></li>
          </ul>
        </article>
        <div class="contents setup-automatic-messaging-post-visit-info">
          <b-alert show variant="warning">{{ title_info }}</b-alert>
          <div class="phone-message-box box left">
            <div class="inner">
              <p class="mb0 top clearfix">
                <span>{{ $t('messages.message') }}</span>
                <select v-model="message_setup_detail.fields.message_type" class="flr w150"
                        @change="onChangeMessageType()">
                  <option :value="options.messages_enums.message_type.sms">SMS</option>
                  <option :value="options.messages_enums.message_type.lms">LMS</option>
                </select>
              </p>
              <textarea ref="txArea" v-model="message_setup_detail.fields.contents" class="textbox noresize"
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
                <span>{{ $t('message-autos.service-category') }}</span>
                <multiselect ref="multiSelect" v-model="category_ids" 
                             :options="category_select" 
                             :multiple="true" 
                             :searchable="false" 
                             :close-on-select="false" 
                             :clear-on-select="false" 
                             :preserve-search="true"
                             :show-labels="false"
                             :placeholder="$t('general.select-info')"
                             class="multi-checkbox select-day-of-week"  
                             label="category_name" 
                             track-by="category_name"
                             @select="onSelectAll($event, true)"
                             @remove="onSelectAll($event, false)"
                             @mouseleave.native="onMouseleave()">
                  <template v-if="category_ids.length && isOpen!=undefined" slot="selection" slot-scope="{ isOpen }">
                    <span v-if="category_ids.length > 3" class="selected">{{ category_ids.length }} {{ $t('general.selected') }}</span>
                    <span v-else class="selected">
                      <span v-for="item in category_ids" :key="item.index">
                        {{ item.category_name }}
                      </span>
                    </span>
                  </template>
                </multiselect>
                <br>
                * {{ $t('message-autos.detail-edit-info') }}
                <table class="normal">
                  <thead>
                    <tr>
                      <td>{{ $t('general.status') }}</td>
                      <td>{{ $t('message-autos.recent-visit-type') }}<br>{{ $t('message-autos.date-selection') }}</td>
                      <td>{{ $t('message-autos.sending-date') }}</td>
                      <td>{{ $t('message-autos.visit-count-type') }}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="detail in message_setup_detail_list" :key="detail.fields.detail_id" @click="onShowDetail(detail.fields.detail_id)">
                      <td><span :class="status_class(detail)"/></td>
                      <td>{{ onSetDetailCol(detail, 'visit_type') }}</td>
                      <td>{{ onSetDetailCol(detail, 'sending_date') }}</td>
                      <td v-html="onSetDetailCol(detail, 'apply_to')"/>
                    </tr>
                    <tr v-if="message_setup_detail_list.length <= 0">
                      <td colspan="4">{{ $t('general.table-empty') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <button class="btn secondary" @click="onShowDetail(null)">{{ $t('general.add') }}</button>
            <div v-if="is_show_detail" class="detail-info">
              <h2>{{ detail_title }}</h2>
              {{ $t('message-autos.recent-visit-type') }} {{ $t('message-autos.date-selection') }} 
              <span class="fail-code-img" @click="onShowVisitCountTypeInfo()"/>
              <radio-group v-model="message_setup_detail.fields.visit_type" :options="options.messages_enums.visit_type_select" 
                           class="clearfix"
                           @input="onCheckVisitType"/>
              {{ $t('message-autos.sending-date') }}
              <select-control v-model="sending_date" :options="target_date_options"
                              :not-translate="true"
                              class="dib time-lg" text-field="text" value-field="value"/><br>
              {{ $t('message-autos.visit-count-type') }}
              <b-form-checkbox-group v-model="visit_count_type" :disabled="message_setup_detail.fields.visit_type == options.messages_enums.visit_type.by_sales_category">
                <b-form-checkbox :value="options.messages_enums.visit_count_type.first_visit">{{ $t('message-autos.first-visit') }}</b-form-checkbox>
                <b-form-checkbox :value="options.messages_enums.visit_count_type.re_visit">{{ $t('message-autos.re-visit') }}</b-form-checkbox>
              </b-form-checkbox-group>
              <div class="operation">
                <b-form-checkbox v-model="message_setup_detail.fields.status"  
                                 :value="options.common_status.active" :unchecked-value="options.common_status.inactive"
                                 name="check-button" switch>
                  {{ $t('messages.operation') }} <b>{{ formatOperation(message_setup_detail.fields.status) }}</b>
                </b-form-checkbox>
              </div>
              <button v-if="message_setup_detail.fields.detail_id > 0" class="btn secondary" @click="submitActionAsync()">{{ $t('general.edit') }}</button>
              <button v-else class="btn secondary" @click="submitActionAsync()">{{ $t('general.add') }}</button>
              <button class="btn secondary" @click="onHideDetail()">{{ $t('general.cancel') }}</button>
              <button v-if="message_setup_detail.fields.detail_id > 0" class="btn secondary" @click="onDeleteDetailAsync()">{{ $t('general.delete') }}</button>
            </div>
          </div> 
        </div>
        <message-variable :tab="action_data.tab" @addChar="onInsertText"/>
        <preview-message :data="message_setup_detail"
                         :tab="action_data.tab"/>
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
    </div><visit-count-type-info/></section>
  </main>
</template>

<script>
import _              from 'lodash'
import { options }    from '../../../helpers/options'
import component_base from '../../../components/common/component-base/component-base'
import { mapGetters
  , mapMutations }    from 'vuex'

import ServiceCategoryApi             from '../../../api/goods/service-category-api'
import MessageSetupPostVisitApi       from '../../../api/message-autos/message-setup-post-visit-api'
import MessageSetupPostVisitViewModel from '../../../view-model/message-autos/message-setup-post-visit/message-setup-post-visit-view-model'
import SolutionTextFeeApi             from '../../../api/messages/solution-text-fee-api'
import SolutionTextFeeViewModel       from '../../../view-model/messages/text-fees/solution-text-fee-view-model'

import message_variable from '../../../components/messages/message-variable/message-variable'
import preview_message  from '../../../components/messages/preview-message/preview-message'
import text_sample_list from '../../../components/messages/text-sample-list/text-sample-list'
import radio_group      from '../../../components/common/form/radio/radio-group/radio-group' 
import select_control   from '../../../components/common/form/select/select-control/select-control2'
import multiselect      from 'vue-multiselect'

import visit_count_type_info from '../../../components/messages/visit-count-type-info/visit-count-type-info'

import MessageHelper from '../../../helpers/message-helper.js'

export default {
  components: {
    'message-variable' : message_variable,
    'text-sample-list' : text_sample_list,
    'preview-message'  : preview_message,
    'select-control'   : select_control,
    'radio-group'      : radio_group,
    'visit-count-type-info' : visit_count_type_info,
    multiselect
  },
  extends : component_base,
  data(){
    return {
      options: options,
      message_setup_post_visit_api: {},
      message_setup_master: {},
      message_setup_detail: {},
      message_setup_detail_list: [],
      message_setup_errors: [],
      solution_text_fee_api: {},
      shop_id: 0,

      text_fees: {},  
      current_bytes: 0,
      max_bytes: 0,

      target_date_options: [],

      target_date: 0,

      sample_data_props: {
        message_type  : options.messages_enums.message_type.sms,
        country_code  : '', 
        solution_id   : 0,
        text_fees     : {},
        shop_id       : 0
      },

      title: null,
      title_info: null,

      sending_date: 60 * 24,
      visit_count_type : null,
      is_show_detail : false,
      category_select: [],
      category_ids:    [],
      detail_title: null
    }
  },
  computed: {
    ...mapGetters('setup_automatic_messaging', {
      action_data: 'getSetupAutomaticMessagingInfo'
    }),
  },  
  created(){
    this.message_setup_post_visit_api = new MessageSetupPostVisitApi()
    this.message_setup_master = new MessageSetupPostVisitViewModel()
    this.message_setup_detail = new MessageSetupPostVisitViewModel()
    this.service_category_api = new ServiceCategoryApi()
    this.message_setup_detail_list = []

    this.solution_text_fee_api = new SolutionTextFeeApi()
    this.text_fees = new SolutionTextFeeViewModel()

    this.shop_id = this.shop_data.shop_id
    this.onSetTime()
  },
  async beforeMount(){
    await this.loadDataTableAsync()
  },
  methods: {
    ...mapMutations('setup_automatic_messaging', [
      'setSetupAutomaticMessagingInfo',
    ]),
    async loadDataTableAsync() {
      this.title = this.$i18n.t('message-autos.post-visit-title')
      this.title_info = this.$i18n.t('message-autos.post-visit-info')

      if(this.action_data.id != null){ // Edit Detail
        this.preLoader()
        let result = await this.message_setup_post_visit_api.getMessageSetupPostVisitMasterAsync(this.action_data.id)
        this.preLoader(false)
        if(result.is_ok){
          this.message_setup_master = result.data.master
          this.message_setup_detail_list = result.data.items

          // Set Selected Category Name
          if(this.message_setup_master.fields.category_ids != null){
            this.preLoader()
            let service_category_result = await this.service_category_api.getServiceCategoryNamesAsync(this.message_setup_master.fields.category_ids)
            this.preLoader(false)
            if(service_category_result.is_ok){
              this.category_select.push({ category_name: this.$i18n.t('message-autos.selected-category'), $isDisabled: true })
              service_category_result.data.items.forEach(item => {
                this.category_ids.push({ category_name: item.name })
                this.category_select.push({ category_name: item.name, $isDisabled: true })
              })
            } else this.showAlert(service_category_result.error_messages)
          }else{
            this.category_select.push({ category_name: this.$i18n.t('general.all-select'), $isDisabled: true })
            this.category_ids.push({ category_name: this.$i18n.t('general.all-select'), value: null })
          }
        } else this.showAlert(result.error_messages)
      }else{ // Add Master
        let service_category_filter = {
          page_size: options.pagination.max,
          page_number: 1,
          shop_id: this.shop_data.shop_id,
          status: options.good_status.active
        }

        let service_categorys_result = await this.service_category_api.getServiceCategoryAsync(service_category_filter)
        if(service_categorys_result.is_ok) {
          this.category_select.push({ category_name: this.$i18n.t('general.select-info'), $isDisabled: true })
          this.category_select.push({ category_name: this.$i18n.t('general.all-select'), value: null })  
          service_categorys_result.data.items.forEach(item => {
            this.category_select.push({ category_name: item.name, value: item.id })  
          })
        } else this.showAlert(service_categorys_result.error_messages)
      }
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
      setTimeout(()=> this.onCheckLength(), 4)
    },
    async submitActionAsync(){
      // Set Visit Count Type
      if(this.visit_count_type.length >= 2) this.message_setup_detail.fields.visit_count_type = options.messages_enums.visit_count_type.first_re_visit
      else if(this.visit_count_type.length == 0) this.message_setup_detail.fields.visit_count_type = options.messages_enums.visit_count_type.none
      else this.message_setup_detail.fields.visit_count_type = this.visit_count_type[0]

      this.message_setup_errors = this.message_setup_detail.isValid()

      if(this.message_setup_errors.length == 0) {
        // Set SendDaysAfter, SendTimeAfter
        if(this.sending_date < 60 * 24) {
          this.message_setup_detail.fields.send_days_after = 0
          this.message_setup_detail.fields.send_time_after = this.sending_date
        }
        else {
          this.message_setup_detail.fields.send_days_after = this.sending_date/(60 * 24)
          this.message_setup_detail.fields.send_time_after = 0
        }
        this.message_setup_detail.fields.master_id = this.action_data.id
        let api_action = ''
        if(this.action_data.id == null) {
          this.message_setup_detail.fields.country_code = this.shop_data.country
          this.message_setup_detail.fields.shop_id = this.shop_id

          // Select All
          if(_.map(this.category_ids , 'value').find(e => e == null) === null) this.message_setup_detail.fields.category_ids = null  
          else this.message_setup_detail.fields.category_ids = _.orderBy(_.map(this.category_ids , 'value'), [], ['asc'])
          api_action = 'createMessageSetupPostVisitMasterAsync' 
        }
        else if(this.message_setup_detail.fields.detail_id > 0) api_action = 'updateMessageSetupPostVisitDetailAsync'
        else api_action = 'createMessageSetupPostVisitDetailAsync'
        
        this.preLoader(true)
        let result = await this.message_setup_post_visit_api[api_action](this.message_setup_detail)
        this.preLoader(false)
        if(result.is_ok) {
          if(this.action_data.id == null){
            this.setSetupAutomaticMessagingInfo({
              tab : options.messages_enums.setup_automatic_messaging_tab.post_visit,
              id  : result.data.fields.master_id
            })
          }
          this.onClearDetail()
          this.onHideDetail()
          this.category_select = []
          this.category_ids = []
          await this.loadDataTableAsync()
        } else {
          this.showAlert(result.error_messages)
        }
      }else this.showAlert(this.message_setup_errors)

      // Init Date
      this.message_setup_detail.fields.send_time_after = 0
      this.message_setup_detail.fields.send_days_after = 0
    },
    onChangeMessageType(){
      if(this.message_setup_detail.fields.message_type == this.options.messages_enums.message_type.sms){        
        this.max_bytes = this.text_fees.fields.sms_max_bytes
      }
      else if(this.message_setup_detail.fields.message_type == this.options.messages_enums.message_type.lms) {
        this.max_bytes = this.text_fees.fields.lms_max_bytes
      }
      this.message_helper = new MessageHelper(this.message_setup_detail.fields.message_type, this.max_bytes)

      setTimeout(()=> this.onCheckLength(), 4)
    },
    clearData(){
      this.message_setup_detail.fields.contents = ''
      this.current_bytes = 0
    },
    onCheckLength() {
      const ui = this.$refs.txArea
      let return_data = this.message_helper.check_len(ui)
      if (return_data != null) {              
        this.message_setup_detail.fields.contents = return_data.value
        this.current_bytes = return_data.length
      }
    },
    onPaste(){
      setTimeout(()=> this.onCheckLength(), 4) 
    },
    formatOperation(status){
      if(status == options.common_status.active) return 'On'
      else return 'Off'
    },
    onInsertText(ch) {
      const ui = this.$refs.txArea
      let value = this.message_helper.insertAtCaret(ui, ch)      
      if (value != null) {
        this.message_setup_detail.fields.contents = value
      }   
      setTimeout(()=> this.onCheckLength(), 4)
      ui.focus()
    },
    async onInsertSampleText(text){
      this.message_setup_detail.fields.contents = text
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
        group_code   : options.messages_enums.setup_automatic_messaging_samples_code.post_visit,
        message_type : this.message_setup_detail.fields.message_type,
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
      this.target_date_options.push({ text: this.$i18n.t('messages.send-immediately'), value: 0 })
      this.target_date_options.push({ text: 30 + this.$i18n.t('message-autos.send-minutes-after2'), value: 30 })
      this.target_date_options.push({ text: 1 + this.$i18n.t('message-autos.send-hour-after2'), value: 60 })

      this.target_date_options.push({ text: 1 + this.$i18n.t('message-autos.day-after'), value: 1 * 60 * 24 })
      for (let index = 2; index < 31; index++) {
        this.target_date_options.push({ text: index + this.$i18n.t('message-autos.day-after'), value: index * 60 * 24 })
      }
      this.target_date_options.push({ text: 35 + this.$i18n.t('message-autos.days-after'), value: 35 * 60 * 24 })
      this.target_date_options.push({ text: 45 + this.$i18n.t('message-autos.days-after'), value: 45 * 60 * 24 })
      this.target_date_options.push({ text: 50 + this.$i18n.t('message-autos.days-after'), value: 50 * 60 * 24 })
      this.target_date_options.push({ text: 55 + this.$i18n.t('message-autos.days-after'), value: 55 * 60 * 24 })
      this.target_date_options.push({ text: 60 + this.$i18n.t('message-autos.days-after'), value: 60 * 60 * 24 })
      this.target_date_options.push({ text: 70 + this.$i18n.t('message-autos.days-after'), value: 70 * 60 * 24 })
      this.target_date_options.push({ text: 80 + this.$i18n.t('message-autos.days-after'), value: 80 * 60 * 24 })
      this.target_date_options.push({ text: 90 + this.$i18n.t('message-autos.days-after'), value: 90 * 60 * 24 })
    },
    onSetDetailCol(detail, column){
      let result = ''

      if(column == 'visit_type'){
        if(detail.fields.visit_type == options.messages_enums.visit_type.by_sales) result = this.$i18n.t('message-autos.by-sales')
        else result = this.$i18n.t('message-autos.by-sales-category')
      }else if(column == 'sending_date'){
        if(detail.fields.send_days_after == 0) {
          if(detail.fields.send_time_after == 0) result = this.$i18n.t('messages.send-immediately')
          else if(detail.fields.send_time_after == 30) result = this.$i18n.t('message-autos.send-minutes-after').replace('{0}', detail.fields.send_time_after)
          else result = this.$i18n.t('message-autos.send-hour-after').replace('{0}', detail.fields.send_time_after/60)
        }
        else if(detail.fields.send_days_after == 1) result = detail.fields.send_days_after + this.$i18n.t('message-autos.day-after')
        else result = detail.fields.send_days_after + this.$i18n.t('message-autos.days-after') 
      } else if(column == 'apply_to'){
        if(detail.fields.visit_count_type == options.messages_enums.visit_count_type.first_visit) result = this.$i18n.t('message-autos.first-visit')
        else if(detail.fields.visit_count_type == options.messages_enums.visit_count_type.re_visit) result = this.$i18n.t('message-autos.re-visit')
        else if(detail.fields.visit_count_type == options.messages_enums.visit_count_type.first_re_visit) result = this.$i18n.t('message-autos.first-visit') + '<br>' + this.$i18n.t('message-autos.re-visit')
      }

      return result 
    },
    status_class(detail) {
      let class_name = ''
      
      if(detail.fields.status == options.common_status.active) class_name = 'active-btn'
      else class_name = 'inactive-btn'

      return class_name
    },
    async onShowDetail(id){
      if(this.category_ids.length > 0) {
        this.is_show_detail = true
        if(id == null){
          this.detail_title = this.title + ' ' + this.$i18n.t('general.add') 
          this.message_setup_detail = new MessageSetupPostVisitViewModel()
          this.onClearDetail()
        }else{
          this.detail_title = this.title + ' ' + this.$i18n.t('general.edit') 
          this.preLoader()
          let result = await this.message_setup_post_visit_api.getMessageSetupPostVisitDetailAsync(id)
          this.preLoader(false)
          if(result.is_ok){
            this.message_setup_detail = result.data

            // Visit Count Type
            if(this.message_setup_detail.fields.visit_count_type == options.messages_enums.visit_count_type.first_re_visit){
              this.visit_count_type = [options.messages_enums.visit_count_type.first_visit, options.messages_enums.visit_count_type.re_visit]
            }else if(this.message_setup_detail.fields.visit_count_type == options.messages_enums.visit_count_type.none){
              this.visit_count_type = []
            }else this.visit_count_type = [this.message_setup_detail.fields.visit_count_type]

            // Sending Date
            if(this.message_setup_detail.fields.send_days_after == 0) this.sending_date = this.message_setup_detail.fields.send_time_after
            else this.sending_date = this.message_setup_detail.fields.send_days_after * 60 * 24

            setTimeout(()=> this.onCheckLength(), 4) 
          }else{
            this.showAlert(result.error_messages)          
          }
        }
      } else this.showAlert([this.$i18n.t('validate_messages.select-category')])
    },
    onClearDetail(){
      this.message_setup_detail = new MessageSetupPostVisitViewModel()
      
      this.sending_date = 60 * 24
      this.visit_count_type = []
      setTimeout(()=> this.onCheckLength(), 4)
    },
    onHideDetail(){
      this.is_show_detail = false
    },
    async onDeleteDetailAsync(){
      this.message_setup_detail.fields.master_id = this.action_data.id
      this.preLoader(true)
      let result = await this.message_setup_post_visit_api.deleteMessageSetupPostVisitDetailAsync(this.message_setup_detail)
      this.preLoader(false)
      if(result.is_ok) {
        this.onClearDetail()
        this.onHideDetail()
        if(this.message_setup_detail_list.length == 1){
          this.setSetupAutomaticMessagingInfo({
            tab : options.messages_enums.setup_automatic_messaging_tab.post_visit,
            id  : null
          })
          this.message_setup_detail_list = []
        }
        this.category_select = []
        this.category_ids = []
        await this.loadDataTableAsync()
      } else {
        this.showAlert(result.error_messages)
      }
    },
    onMouseleave(){
      if(this.$refs.multiSelect.isOpen) 
        this.$refs.multiSelect.toggle()
    },
    onSelectAll(data, is_check){
      if(data.value == null){
        if(is_check){
          this.$nextTick(() => {
            this.category_ids = []
            this.category_ids.push({ category_name: this.$i18n.t('general.all-select'), value: null })
          })

          this.category_select.forEach(e => {
            if(e.value != null) e.$isDisabled = true
          })
        }else{
          this.category_select.forEach(e => {
            e.$isDisabled = false
          })
        }
      }
    },
    onCheckVisitType(){
      if(this.message_setup_detail.fields.visit_type == options.messages_enums.visit_type.by_sales_category){
        this.visit_count_type = []
      }
    },
    onShowVisitCountTypeInfo(){
      this.showDialogById('visit-count-type-info-modal')
    },
    onHideSampleModal(){
      this.hideDialogById('text-sample-list-modal')
    }
  }
}
</script>
<style lang='scss'>
@import './setup-automatic-messaging-post-visit-info.scss';
</style>
