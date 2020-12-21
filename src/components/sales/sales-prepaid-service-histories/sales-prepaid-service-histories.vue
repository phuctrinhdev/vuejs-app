<template>
  <div class="prepaid-service-histories-warpper">
    <div class="cl-info-inner">

      <!-- TABLE -->
      <view-table :data="table_data" @change-page="onChangePage">
        <!-- MOBiLE -->
        <template slot="mobile" slot-scope="{row}">
          <div class="show-mobile-text-box">
            <p>
              <span>{{ moment(convertTimeStampToDate(row.registration_date_ts)).format(common_options.standard_date_format.ymd) }}</span>
              <span>{{ formatAction(row.prepaid_service_history_type) }}</span>
              <span v-if="row.quantity_before_change != row.quantity">
                {{ SalesUtils.formatNoLimitNumber(row.quantity_before_change,0) }} ➝ 
                {{ SalesUtils.formatNoLimitNumber(row.quantity,0) }}</span> 
            </p>
            <p>
              <span>{{ row.prepaid_service_name }}</span>
              <span>{{ formatMoney(row.unit_price,0) }}</span>
              <span v-if="row.client_name != null && row.client_name != x_client_information.data.client_name">({{ formatNotes(row) }})</span>
            </p>
            <p v-if="row.expiry_date_ts_before_changed != row.expiry_date_ts && row.expiry_date_ts_before_changed != 0"> 
              {{ $t('sales-prepaid-service-tab.expiry-date-is-edited') }} : 
              {{ SalesUtils.formatNoLimitDateTs(row.expiry_date_ts_before_changed) }} ➝ 
              {{ SalesUtils.formatNoLimitDateTs(row.expiry_date_ts) }}
            </p>
          </div>
        </template>

        <!-- PC -->
        <template slot="branch_number" slot-scope="{row}">
          <div :id="'tooltip-branch-number' + row.id">
            {{ row.branch_number }}
          </div>
          <b-tooltip :target="'tooltip-branch-number' + row.id" placement="bottom">
            {{ row.shop_name }}
          </b-tooltip>
        </template>
        <template slot="date" slot-scope="{row}">
          {{ formatDate(row.registration_date_ts) }}
        </template>
        <template slot="unit_price" slot-scope="{row}">
          {{ formatMoney(row.unit_price,0) }}
        </template>
        <template slot="action" slot-scope="{row}">
          {{ formatAction(row.prepaid_service_history_type) }}
        </template>
        <template slot="changed_quantity" slot-scope="{row}">
          {{ formatChanged(row) }}
        </template>
        <template slot="notes" slot-scope="{row}">
          <p v-if="row.client_name != null && row.client_name != x_client_information.data.client_name">{{ formatNotes(row) }}</p>
          <p v-if="row.expiry_date_ts_before_changed != row.expiry_date_ts && row.expiry_date_ts_before_changed != 0">
            {{ $t('sales-prepaid-service-tab.expiry-date-is-edited') }} : 
            {{ SalesUtils.formatNoLimitDateTs(row.expiry_date_ts_before_changed) }} ➝ 
            {{ SalesUtils.formatNoLimitDateTs(row.expiry_date_ts) }}
          </p>
        </template>
        <template slot="quantity" slot-scope="{row}">
          {{ SalesUtils.formatNoLimitNumber(row.quantity,0) }}
        </template>
      </view-table>
       
    </div>
  </div>
</template>

<script>
import componentBase             from '../../common/component-base/component-base'
import view_table                from '../../../components/common/view-table/view-table'
import PrepaidServiceHistoryAPI  from '../../../api/sales/prepaid-services-history-api'
import { common_options }        from '../../../helpers/options/common-options'
import { sales_options  }        from '../../../helpers/options/sales-options'
import SalesUtils                from '../../../helpers/utils/sales-utils'
import moment                    from 'moment'
import _                         from 'lodash'
import { 
  formatMoney,
  convertTimeStampToDate,
  convertDateToTimezone
}                                from '../../../helpers/common'
import { 
  mapGetters, 
  mapActions, 
  mapMutations }      
  from 'vuex'

export default {
  components:{
    'view-table': view_table,
  },
  extends:componentBase,
  data(){
    return{
      SalesUtils,
      common_options,
      sales_options,
      prepaid_service_history_api : new PrepaidServiceHistoryAPI(),

      table_custom_fields: [
        { field : 'branch_number',           label :'sales-prepaid-service-tab.loc',                     width: '5%',    sortable: false, expand: true},
      ],

      table_data:{
        fields:[
          {field :'mobile',                  label :'',                                                  width: 'auto',  sortable: false, thClass: 'mobile', expand: true, tdClass : 'mobile', column_expand : true},
          {field :'date',                    label :'sales-prepaid-service-tab.date',                    width: '15%',   sortable: false, expand: true},
          {field :'prepaid_service_name',    label :'sales-prepaid-service-tab.prepaid-service-name',    width: '20%',   sortable: false},
          {field :'unit_price',              label :'sales-prepaid-service-tab.sales-price',             width: '10%',   sortable: false, expand: true},
          {field :'action',                  label :'sales-prepaid-service-tab.action',                  width: '10%',   sortable: false, expand: true},
          {field :'changed_quantity',        label :'sales-prepaid-service-tab.changed',                 width: '10%',   sortable: false, expand: true},
          {field :'quantity',                label :'sales-prepaid-service-tab.quantity',                width: '10%',   sortable: false, expand: true},
          {field :'notes',                   label :'sales-prepaid-service-tab.notes',                   width: '20%',   sortable: false, expand: true}
        ],
        rows: [],
        pagination: {
          total_pages: 1
        },
        options: {
          pagination : true
        }
      },
      table_filter  : {
        client_id   : 0,
        page_size   : common_options.pagination.default,
        page_number : 1,
        shop_id     : 0
      }
    }
  },
  computed:{
    ...mapGetters('client',{
      x_client_information : 'getClientInformation'
    }),
    ...mapGetters('sales_prepaid_service_history',{
      x_prepaid_service_histories : 'getPrepaidServiceHistories'
    }),
    no_limit_text(){
      return this.$i18n.t('sales-prepaid-service-tab.no-limit')
    },
    used_by_text(){
      return this.$i18n.t('sales-prepaid-service-tab.used-by')
    },
  },
  async created(){
    this.table_filter.client_id      = this.x_client_information.data.id
    this.table_filter.shop_id        = this.shop_data.shop_id

    if(this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client){
      this.table_data.fields = [...this.table_custom_fields, ...this.table_data.fields]
    }

    await this.loadDataTableAsync()
  },
  methods:{
    ...mapActions('sales_prepaid_service_history',[
      'loadSalesPrepaidServiceHistoriesAsyncData'
    ]),
    ...mapMutations('sales_prepaid_service_history',[
      'setPrepaidServiceHistoriesFilter'
    ]),

    async loadDataTableAsync(){
      this.setPrepaidServiceHistoriesFilter(this.table_filter)

      this.preLoader()
      let response = await this.loadSalesPrepaidServiceHistoriesAsyncData(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.setTableData()
      }
      else this.showAlertDialog(response.error_messages)
    },
    setTableData(){
      this.table_data.rows       = this.x_prepaid_service_histories.items
      this.table_data.pagination = this.x_prepaid_service_histories.pagination
    },
    async onChangePage(page){
      this.table_filter.page_number = page
      await this.loadDataTableAsync()
    },

    // format
    formatDate(created_date_time_ts){
      let tmp_date = convertDateToTimezone(convertTimeStampToDate(created_date_time_ts))
      return moment(tmp_date).format(common_options.standard_date_format.ymd)
    },
    formatAction(action){
      let text = ''
      let prepaid_service_history_type = _.find(sales_options.prepaid_service_history_type,t=>t.value == action)
      if (prepaid_service_history_type != undefined){
        text = this.$i18n.t(prepaid_service_history_type.text)
      }
      return text
    },
    formatChanged(model){
      let text = ''
      let changed_quantity = model.changed_quantity
      let quantity_before_change = model.quantity_before_change
      let quantity = model.quantity
      if(typeof changed_quantity != 'number' || typeof quantity_before_change != 'number' || typeof quantity != 'number') return text
      if(changed_quantity == sales_options.NOT_LIMIT || quantity == sales_options.NOT_LIMIT){
        text = this.no_limit_text
        return text
      }
      if(quantity_before_change == sales_options.NOT_LIMIT && quantity != sales_options.NOT_LIMIT){
        text = `+${formatMoney(changed_quantity,0)}`
        return text
      }
      let after_changes = quantity - quantity_before_change
      text = after_changes > 0 ? `+${formatMoney(after_changes,0)}` : formatMoney(after_changes,0)
      return text
    },
    formatNotes(row){
      return `${this.used_by_text} ${row.client_name}`
    },

    formatMoney,
    moment,
    convertTimeStampToDate
  }
}
</script>

<style lang="scss">
@import './sales-prepaid-service-histories.scss';
</style>