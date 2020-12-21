<template>
  <div class="tabbox-table client-info-button-por">
    <div class="client-info-button">                      
      <button v-if="!emptyValue(x_client_information.data.mobile_number)" class="btn default" @click="onSendMessage">{{ $t('sales-message-tab.send-message') }}</button>
    </div>
    <span class="fz13 color-gray">{{ $t('sales-message-tab.all').replace('{0}', table_data.pagination.total_items ).replace('{1}', 'Todo : Shop Number') }} <!-- HyunSik -->
    </span>
    <div class="slide-x large">
      <table class="normal">
        <thead>
          <tr>
            <th class="w7p" rowspan="2"/>
            <th class="w12p" rowspan="2">{{ $t('sales-message-tab.mobile-number') }}</th>
            <th class="w15p" rowspan="2">{{ $t('sales-message-tab.sending-date-time') }}</th>
            <th class="w7p" rowspan="2">{{ $t('sales-message-tab.type') }}</th>
            <th class="w20p" rowspan="2">{{ $t('sales-message-tab.message') }}</th>
            <th class="w7p" rowspan="2">{{ $t('sales-message-tab.image') }}</th>
            <th class="w8p" rowspan="2">{{ $t('sales-message-tab.waiting-sending') }}</th>
            <th class="w24p" colspan="3">{{ $t('sales-message-tab.receiving-results') }}</th>
          </tr>
          <tr>
            <th class="w8p">{{ $t('sales-message-tab.success') }}</th>
            <th class="w8p">
              <p>{{ $t('sales-message-tab.fail-code') }} Todo</p>
              <p><span class="fail-code-img" @click="onFailCode()"/></p>
            </th>
            <th class="w8p">{{ $t('sales-message-tab.waiting-result') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in table_data.rows" :key="index">
            <td>
              <div class="custom-checkbox">
                <b-form-checkbox v-model="checked" :value="row" :disabled="checkDisabled(row.message_status)"/>
              </div>  
            </td>
            <td>{{ row.receiver_phone }}</td>
            <td>{{ formatTargetDateCol(row.target_date_ts) }}</td>
            <td>{{ formatMessageTypeCol(row.message_type) }}</td>
            <td>
              <div class="common-style">
                <div class="text-center content-tooltip">
                  <b-col>
                    <b-button :id="'tooltip' + index" class="text-ellip" variant="outline-success">{{ row.contents }}</b-button>
                  </b-col>
                  <b-tooltip :target="'tooltip' + index" class="tooltip" placement="bottom">
                    {{ row.contents }}
                  </b-tooltip>
                </div>  
              </div>
            </td>
            <td><span v-if="row.message_type == options.messages_enums.message_type.mms" class="img-icon" @click="onImgShow(row)"/></td>
            <td>{{ formatResultCol(row, options.messages_enums.message_result_col.waiting_sending) }}</td>
            <td>{{ formatResultCol(row, options.messages_enums.message_result_col.success) }}</td>
            <td>{{ formatResultCol(row, options.messages_enums.message_result_col.fail) }}</td>
            <td>{{ formatResultCol(row, options.messages_enums.message_result_col.waiting_result) }}</td>
          </tr>
          <tr v-if="table_data.rows.length <= 0">
            <td colspan="10">{{ $t('general.table-empty') }}</td>
          </tr>
        </tbody>
      </table>  
    </div>
    <br>
    <button class="btn default" @click="onDeleteMessage()">{{ $t('sales-message-tab.delete') }}</button>
    <br>
    <div>
      <pagination :pagination.sync="table_data.pagination" @change-page="onChangePage"/>
    </div>
    <div class="textbox mt10 fz13">
      <p>
        - {{ $t('sales-message-tab.guide-text1') }}
      </p>
      <p>
        - {{ $t('sales-message-tab.guide-text2') }}
      </p>
    </div>
    <fail-code-modal/>
    <img-show-modal/>
    <send-message-modal :data="String(x_client_information.data.id)" :type="options.messages_enums.send_page.client" :page="options.page_modal_check.page"
                        @reload-page="onReloadPage"/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import component_base     from '../../common/component-base/component-base'
import TextMessageAPI     from '../../../api/messages/text-message-api'
import img_show_modal     from '../../../components/clients/client-information/img-show-modal.vue'
import fail_code_modal    from '../../../components/clients/client-information/fail-code-modal.vue'
import send_message_modal from '../../../components/messages/send-message-modal/send-message-modal'
import pagination         from '../../common/pagination/pagination'
import { options }        from '../../../helpers/options'
import { common_options } from '../../../helpers/options/common-options'
import { convertDateFromTimezoneToTimestamp
  , convertDateToTimezone
  , convertTimeStampToDate
  , formatDateByString
  , emptyValue } from '../../../helpers/common'

export default {
  components: {
    pagination,
    'img-show-modal'     : img_show_modal,
    'fail-code-modal'    : fail_code_modal,
    'send-message-modal' : send_message_modal,
  },
  extends : component_base,
  data(){
    return {
      options,
      common_options,
      text_message_api : {},
      table_data:{
        rows      : [],
        pagination: {
          total_pages: 1
        }
      },
      table_filter: {
        page_size     : common_options.pagination.default,
        page_number   : 1,
        country_code  : null,
        shop_id       : 0,
        receiver_key  : '',
        registration_date_from_ts   : 0,
        registration_date_to_ts     : 0,
      },
      checked: []
    }
  },
  computed:{
    ...mapGetters('client',{
      x_client_information : 'getClientInformation'
    }),
    ...mapGetters('client_message_history',{
      x_client_message_histories : 'getClientMessageHistories'
    }),
  },
  async created(){
    this.text_message_api = new TextMessageAPI()
    this.table_filter.shop_id = this.shop_data.shop_id
    this.table_filter.country_code = this.shop_data.country
    this.table_filter.receiver_key = String(this.x_client_information.data.id)

    let temp_today = convertDateToTimezone(new Date())
    
    this.table_filter.registration_date_from_ts = convertDateFromTimezoneToTimestamp(new Date(temp_today.getFullYear(), temp_today.getMonth() - 2, temp_today.getDate()))
    this.table_filter.registration_date_to_ts = convertDateFromTimezoneToTimestamp(new Date(temp_today.getFullYear(), temp_today.getMonth(), temp_today.getDate() + 1))

    await this.loadDataTableAsync()
  },
  methods:{
    emptyValue,
    ...mapActions('client_message_history',[
      'loadClientMessageHistoriesAsyncData'
    ]),
    ...mapMutations('client_message_history',[
      'setClientMessageHistoriesFilter'
    ]),
    ...mapActions('text_message', [
      'setImageData'
    ]),
    async loadDataTableAsync(){
      this.setClientMessageHistoriesFilter(this.table_filter)

      this.preLoader()
      let response = await this.loadClientMessageHistoriesAsyncData(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.setTableData()
      }
      else this.showAlertDialog(response.error_messages)
    },
    setTableData(){
      this.table_data.rows       = this.x_client_message_histories.items
      this.table_data.pagination = this.x_client_message_histories.pagination
    },
    onImgShow(row) {
      this.setImageData(row).then(() => {
        this.showDialogById('img-show-modal')
      })  
    }, 
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadDataTableAsync()
    },
    formatResultCol(row, col){
      let result = ''

      if((row.message_status == options.messages_enums.message_status.result_success && col == options.messages_enums.message_result_col.success)
          || (row.message_status == options.messages_enums.message_status.not_sent && col == options.messages_enums.message_result_col.waiting_sending) 
          || (row.message_status == options.messages_enums.message_status.waiting_result && col == options.messages_enums.message_result_col.waiting_result))
        result = 'O'
      else if(col == options.messages_enums.message_result_col.fail){
        if(row.message_status == options.messages_enums.message_status.send_fail)
          result = row.send_status_code
        else if(row.message_status == options.messages_enums.message_status.result_fail)
          result = row.result_code
      }
      return result
    },
    formatTargetDateCol(ts){
      if (ts == 0) return '' 
      return formatDateByString(convertTimeStampToDate(ts, true), this.shop_data.format_date + ' ' + options.standard_date_format.hm)
    },
    formatMessageTypeCol(type){
      return options.messages_enums.message_type_format.find(x => x.value == type).text
    },
    checkDisabled(message_status){
      if(message_status == options.messages_enums.message_result_col.waiting_sending)
        return false
      else 
        return true
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
          message_detail_id : e.message_detail_id
        }
        data_send.push(data) 
      })

      this.preLoader()
      await this.text_message_api.deleteTextMessagesAsync(data_send)
      this.preLoader(false)
      this.checked = []
      await this.loadDataTableAsync()
    },
    onFailCode() {
      this.showDialogById('fail-code-modal')
    },
    onSendMessage(){
      this.showDialogById('send-message-modal')
    },
    async onReloadPage(){
      await this.loadDataTableAsync()
    }
  }
}
</script>

<style lang="scss">
@import './client-messages-history.scss'
</style>