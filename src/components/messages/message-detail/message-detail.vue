<template>
  <b-modal id="message-detail-modal" 
           :title="$t('messages.message-details')" 
           size="xl" 
           hide-footer no-close-on-backdrop
           @show="onLoadForm()">
    <div class="common-style message-detail">
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
              <tr :key="item.message_detail_id">
                <td>{{ item.message_detail_id }}</td>
                <td>{{ item.var1 }}</td>
                <td>{{ item.receiver_phone }}</td>
                <td>{{ formatTargetDateCol(message_master_data.target_date_ts) }}</td>
                <td>
                  <div class="text-center note-tooltip">
                    <b-col>
                      <b-button :id="'tooltip' + item.message_detail_id" class="text-ellip" variant="outline-success">{{ item.contents }}</b-button>
                    </b-col>
                    <b-tooltip :target="'tooltip' + item.message_detail_id" class="tooltip" placement="bottom">
                      {{ item.contents }}
                    </b-tooltip>
                  </div>
                </td>
                <td>
                  <span v-if="message_master_data.message_type == options.messages_enums.message_type.mms"
                        class="img-icon" @click="onShowMMSImageModal()"/>
                </td>
                <td>{{ formatResultCol(item.message_status, options.messages_enums.message_status.not_sent) }}</td>
                <td>{{ formatResultCol(item.message_status, options.messages_enums.message_status.result_success) }}</td>
                <td>{{ formatResultCol(item.message_status, options.messages_enums.message_status.result_fail, item.result_code) }}</td>
                <td>{{ formatResultCol(item.message_status, options.messages_enums.message_status.waiting_result) }}</td>
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
    <mms-image/>
  </b-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { options }    from '../../../helpers/options'
import component_base from '../../../components/common/component-base/component-base'
import pagination     from '../../../components/common/pagination/pagination'
import mms_image      from '../../../components/messages/mms-image/mms-image'
import { formatDateByString
  , convertTimeStampToDate } from '../../../helpers/common'

export default {
  components: {
    pagination,
    'mms-image' : mms_image
  },
  extends: component_base,
  data() {
    return {
      options,
      table_data: {
        field_top : [ 
          { label: 'messages.no',            row_span:2, col_span:1, thClass: 'no' },
          { label: 'general.name',           row_span:2, col_span:1, thClass: 'name' },
          { label: 'messages.mobile-number', row_span:2, col_span:1, thClass: 'mobile-number' },
          { label: 'general.date',           row_span:2, col_span:1, thClass: 'date' },
          { label: 'messages.contents',      row_span:2, col_span:1, thClass: 'contents' },
          { label: 'messages.image',         row_span:2, col_span:1, thClass: 'image' },
          { label: 'messages.send-result',   row_span:1, col_span:4, thClass: 'send-result' },
        ],
        field_bottom: [ 
          { label: 'messages.sent-fail',      thClass: 'sent-fail' },
          { label: 'messages.success',        thClass: 'success' }, 
          { label: 'messages.fail',           thClass: 'fail' }, 
          { label: 'messages.waiting-result', thClass: 'waiting-result' }, 
        ],
        rows:[],
      },
      table_filter: {
        page_size         : options.pagination.default,
        page_number       : 1,
        country_code      : null,
        shop_id           : 0,
        message_master_id : 0,
      },
    }
  },
  computed: {
    ...mapGetters('text_message', {
      message_master_data  : 'getMessageMaster',
      message_details_data : 'getMessageDetails'
    })
  },
  mounted(){
    this.table_filter.country_code = this.shop_data.country
    this.table_filter.shop_id = this.shop_data.shop_id
  },
  methods: {
    ...mapActions('text_message', [
      'getMessageDetailsDataAsync',
      'setImageData'
    ]),
    onLoadForm(){
      this.table_filter.message_master_id = this.message_master_data.message_master_id
      this.loadTableData()
    },
    async loadTableData() {
      this.preLoader()
      await this.getMessageDetailsDataAsync(this.table_filter)
      if(this.message_details_data.is_ok){
        this.table_data.rows = this.message_details_data.data.items
        this.table_data.pagination = this.message_details_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(this.message_details_data.error_messages)
      this.preLoader(false)
    },
    formatTargetDateCol(ts){
      if (ts == 0) return '' 
      return formatDateByString(convertTimeStampToDate(ts, true), this.shop_data.format_date + ' ' + options.standard_date_format.hm)
    },
    formatResultCol(status, type, code = ''){
      if(status == type) {
        if(type == options.messages_enums.message_status.result_fail) return code
        else return 'O'
      }
      else return ''
    },
    onShowMMSImageModal(){
      this.setImageData(this.message_master_data).then(() => {
        this.showDialogById('mms-image-modal')
      })  
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadTableData()
    },
    hideModal() {
      this.hideDialogById('message-detail-modal')
    }
  }
}
</script>

<style lang="scss">
@import './message-detail.scss';
</style>