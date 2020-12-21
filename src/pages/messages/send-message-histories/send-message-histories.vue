<template>
  <main class="app-content">
    <section class="contents-style common-style send-message-histories">
      <div class="inner">
        <div class="page-title">
          <h3>{{ $t('messages.text-messages-history') }}</h3>
          <ul class="group-btn">
            <li class="btn"><a @click="onSendMessages">{{ $t('messages.send-new-message') }}</a></li>
            <li class="btn"><a>{{ $t('messages.decline-texts-history') }}</a></li>
          </ul>
        </div>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part mr15">
              <span class="badge badge-info badge-pill search-part">{{ $t('messages.working-date') }}</span> 
              <div class="dib">
                <div class="datepicker-dib">
                  <v-date-picker v-model="registration_date_from" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"/> ~ 
                </div>
                <div class="datepicker-dib">
                  <v-date-picker v-model="registration_date_to" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"/>
                </div>
              </div>
              <span class="badge badge-info badge-pill search-part">{{ $t('messages.type') }}</span>
              <select v-model="table_filter.message_type" class="font-black">
                <option :value="0">{{ $t('general.all-select') }}</option>
                <option :value="options.messages_enums.message_type.sms">SMS</option>
                <option :value="options.messages_enums.message_type.lms">LMS</option>
                <option :value="options.messages_enums.message_type.mms">MMS</option>
              </select> 
            </li>
          </ul>
          <div class="search-btn clearfix">
            <button class="submit-btn pc dib" @click="onSearch"><span class="search-pc"/><span>{{ $t('general.search') }}</span></button>
            <button class="submit-btn mobile" @click="onSearch"><span class="search-mobile"/></button>                       
          </div>
        </div>
        <div class="section-part">            
          <div class="slide-x small">
            <div class="table-wrapper">
              <table class="vgt-table normal font-black">
                <thead>
                  <tr>
                    <th v-for="(item, index) in table_data.field_top" :key="index"
                        :rowspan="item.row_span" :colspan="item.col_span" :class="item.thClass">
                      <span class="thead-border"/>
                      <span class="thead-content">{{ $t(item.label) }}</span>
                    </th>
                  </tr>
                  <tr>
                    <th v-for="(item, index) in table_data.field_bottom" :key="index" :class="item.thClass">
                      <span class="thead-border"/>
                      <span class="thead-content">{{ $t(item.label) }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item) in table_data.rows">
                    <tr :key="item.message_master_id">
                      <td>
                        <b-form-checkbox v-model="checked" :value="item" :disabled="checkDisabled(item)" 
                                         class="dib"/> 
                        {{ item.message_master_id }}
                      </td>
                      <td>
                        {{ formatTargetDateCol(item.target_date_ts) }}
                      </td>
                      <td>
                        {{ formatMessageTypeCol(item.message_type) }}
                      </td>
                      <td>
                        {{ item.target_count }}
                      </td>
                      <td>
                        {{ item.send_count }}
                      </td>
                      <td>
                        {{ item.send_fail_count }}
                      </td>
                      <td>
                        {{ item.result_succ_count }}
                      </td>
                      <td>
                        {{ item.result_fail_count }}
                      </td>                      
                      <td>
                        {{ item.wait_count }}
                      </td>
                      <td>
                        <button class="btn secondary" @click="onShowContents(item)">{{ $t('general.view') }}</button>
                      </td>
                      <td>
                        <button class="btn secondary" @click="onShowMessageDetail(item)">{{ $t('general.view') }}</button>
                      </td>
                    </tr>
                  </template>
                  <tr v-if="table_data.rows.length <= 0">
                    <td colspan="11">{{ $t('general.table-empty') }}</td>
                  </tr>
                </tbody>
              </table>
              <pagination v-if="table_data.pagination" :pagination.sync="table_data.pagination" @change-page="onChangePage"/>
            </div>
          </div>
          <br>
          <button class="btn default" @click="onDeleteMessage">{{ $t('messages.delete-history') }}</button>
        </div>
      </div>
    </section>
    <view-contents :data="contents_data"/>
    <message-detail/>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { options }    from '../../../helpers/options'
import TextMessageApi from '../../../api/messages/text-message-api'
import view_contents  from '../../../components/messages/view-contents/view-contents'
import message_detail from '../../../components/messages/message-detail/message-detail'
import component_base from '../../../components/common/component-base/component-base'
import pagination     from '../../../components/common/pagination/pagination'
import { setupCalendar, DatePicker }  from 'v-calendar'
import { convertDateToTimezone
  , convertTimeStampToDate
  , convertDateFromTimezoneToTimestamp
  , formatDateByString,
  emptyValue
}  from '../../../helpers/common'

export default {
  components: {
    pagination,
    'message-detail' : message_detail,
    'view-contents'  : view_contents,
    'v-date-picker'  : DatePicker,
  },
  extends: component_base,
  data() {
    return {
      options : options,
      table_data: {
        field_top : [ 
          { label: 'messages.idx',               row_span:2, col_span:1, thClass: 'idx' },
          { label: 'messages.sending-date',      row_span:2, col_span:1, thClass: 'sending-date' },
          { label: 'messages.type',              row_span:2, col_span:1, thClass: 'type' },
          { label: 'messages.target',            row_span:2, col_span:1, thClass: 'target' },
          { label: 'messages.sent-success',      row_span:2, col_span:1, thClass: 'sent' },
          { label: 'messages.sent-fail',         row_span:2, col_span:1, thClass: 'holding' },
          { label: 'messages.receiving-results', row_span:1, col_span:3, thClass: 'receiving-results' },
          { label: 'messages.contents',          row_span:2, col_span:1, thClass: 'contents' },
          { label: 'messages.detail',            row_span:2, col_span:1, thClass: 'detail' },
        ],
        field_bottom: [ 
          { label: 'messages.success',        thClass: 'success' },
          { label: 'messages.fail',           thClass: 'fail' }, 
          { label: 'messages.waiting-result', thClass: 'waiting-result' }, 
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
      },
      table_filter: {
        page_size    : options.pagination.default,
        page_number  : 1,
        country_code : null,
        shop_id      : 0,
        message_type : 0,
        registration_date_from_ts : 0,
        registration_date_to_ts   : 0,
        target_count_not_less     : null,
      },
      registration_date_from: null,
      registration_date_to: null,
      checked: [],
      contents_data: null
    }
  },
  computed: {
    ...mapGetters('text_message', {
      message_masters_data: 'getMessageMasters'
    })
  },
  mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
    this.table_filter.country_code = this.shop_data.country

    let today = convertDateToTimezone(new Date())
    this.registration_date_from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    this.registration_date_to = today

    this.loadTableData()
  },
  beforeMount(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
  },
  methods: {
    ...mapActions('text_message', [
      'getMessageMastersDataAsync',
      'setMessageMasterData',
    ]),
    async loadTableData(){
      this.table_filter.registration_date_from_ts = convertDateFromTimezoneToTimestamp(this.registration_date_from),
      this.table_filter.registration_date_to_ts = convertDateFromTimezoneToTimestamp(this.registration_date_to)

      this.preLoader()
      await this.getMessageMastersDataAsync(this.table_filter)
      if(this.message_masters_data.is_ok){
        this.table_data.rows = this.message_masters_data.data.items
        this.table_data.pagination = this.message_masters_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      } else this.showAlert(this.message_masters_data.error_messages)
      this.preLoader(false)
    },
    onSearch(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadTableData()
    },
    async onDeleteMessage(){
      let data = {}
      let data_send = []

      this.checked.forEach(e => {
        data = {
          country_code : e.country_code,
          shop_id : e.shop_id,
          message_type : e.message_type,
          message_master_id : e.message_master_id,
          message_detail_id : 0
        }
        data_send.push(data) 
      })

      let text_message_api = new TextMessageApi()
      this.preLoader()
      await text_message_api.deleteTextMessagesAsync(data_send)
      this.preLoader(false)
      this.checked = []
      this.loadTableData()
    },
    formatTargetDateCol(ts){
      if (ts == 0) return '' 
      return formatDateByString(convertTimeStampToDate(ts, true), this.shop_data.format_date + ' ' + options.standard_date_format.hm)
    },
    formatMessageTypeCol(type){
      return options.messages_enums.message_type_format.find(x => x.value == type).text
    },
    checkDisabled(item){
      if(item.send_count == 0 || (item.send_count > 0 && item.send_count == item.target_count && item.wait_count == 0)) return false
      else return true
    },
    onShowContents(item){
      this.contents_data = {
        message_type : item.message_type,
        contents     : this.formatContents(item),
        image_path   : item.image_path,
        image_name   : item.image_name
      }
      this.$nextTick(function(){
        this.showDialogById('view-contents-modal')
      })
    },
    formatContents(item){ // Replace variable data 
      if(!emptyValue(item.variable_data)){
        let temp_contents_array = item.variable_data.split('.')
        let temp_contents = item.contents

        for (let index = 1; index <= temp_contents_array.length; index++) {
          temp_contents = temp_contents.replace('#$var' + index + '#$', temp_contents_array[index - 1])
        }
        return temp_contents
      } else return item.contents
    },
    onShowMessageDetail(item){
      this.setMessageMasterData(item)
      this.showDialogById('message-detail-modal')
    },
    onSendMessages(){
      this.$router.push({ name: 'send-messages', params: { type: options.messages_enums.send_page.unregister_clients }})
    }
  }
}
</script>

<style lang="scss">
@import './send-message-histories.scss';
</style>