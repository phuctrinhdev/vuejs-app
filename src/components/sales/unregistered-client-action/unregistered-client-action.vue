<template>
  <div class="unregistered-client-action-wrapper">
    <b-modal id="unregistered-client-action-modal"
             :title="'Unregistered Client Information'"
             :no-close-on-backdrop="true"
             size="lg"
             hide-footer
             @show="onLoadForm()"
             @hide="onCancel()">
      <div class="modal-body">
        <form class="filter">
          <div class="client-name">
            <label>{{ $t('clients.client-name-mobile') }}</label>
            <input v-model="table_filter.search_keyword" class="form-control">
          </div>
          <div class="search">
            <button class="btn-submit" @click.prevent="onSearchAsync"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
          </div>
        </form>

        <div class="table">
          <p>{{ unregistered_client_information_intro }}</p>
          <view-table :data="table_data" @change-page="onChangePageAsync">
            <template slot="recent_visit" slot-scope="{row}">
              {{ moment(convertTimeStampToDate(row.recent_visit,true)).format(common_options.standard_date_format.dmy) }}
            </template>
            <template slot="connect_client" slot-scope="{row}">
              <a class="btn" @click="onConnectAsync(row)">{{ $t('clients.connect') }}</a>
            </template>
          </view-table>
          <error-box :errors="errors"/>
        </div>
      </div>

      <div class="modal-footer">
        <a class="btn" @click="onCancel()">{{ $t('general.close') }}</a>
      </div>
    </b-modal>
  </div>
</template>

<script>
const CONNECTED_CLIENT_SALES_EVENT_NAME = 'connected-client-sales'
import component_base              from '../../../components/common/component-base/component-base.vue'
import view_table                  from '../../common/view-table/view-table.vue'
import error_box                   from '../../common/form/error-box/error-box.vue'
import { convertTimeStampToDate }  from '../../../helpers/common.js'
import { options }                 from '../../../helpers/options.js'
import { common_options }          from '../../../helpers/options/common-options.js'
import ClientApi                   from '../../../api/clients/client-api.js'
import SalesApi                    from '../../../api/sales/sales-api.js'
import SalesViewModel              from '../../../view-model/sales/sales/sales-view-model.js'
import moment                      from 'moment'
import { mapGetters }              from 'vuex'
import { mapActionSecurityInfo,
  convertDateToTimeStamp,
  convertDateToTimezone,
  convertTimeStampPlusLocalzone 
} from '../../../helpers/common.js'


export default {
  components : {
    'error-box'        : error_box,
    'view-table'       : view_table
  },
  extends : component_base,
  data(){
    return {
      common_options,
      errors : [],

      client_api : new ClientApi(),
      sales_api  : new SalesApi(),
      
      table_data : {
        fields     : [
          {field: 'client_number',  label: 'clients.client-number',   width: '20%',   sortable: false, expand: true},
          {field: 'client_name',    label: 'clients.client-name',     width: '20%',   sortable: false},
          {field: 'mobile_number',  label: 'clients.mobile-number',   width: '20%',   sortable: false},
          {field: 'recent_visit',   label: 'clients.recent-visit',    width: '20%',   sortable: false, expand: true},
          {field: 'connect_client', label: 'clients.connect-client',  width: '20%',   sortable: false, expand: true}
        ],
        rows       : [],
        pagination : {},
        options    : {
          pagination : true
        }
      },
      table_filter : {
        search_condition   : options.clients_enums.client_search_condition_type.name_or_number,
        search_keyword     : '',
        search_all_branchs : false,
        page_size          : common_options.pagination.default,
        page_number        : 1,
        shop_id            : 0
      }
    }
  },
  computed:{
    ...mapGetters('sales', {
      x_sales_action: 'getSalesAction',
    }),
    unregistered_client_information_intro(){return this.$i18n.t('sales.unregistered-client-information-intro')},
  },
  created(){
    this.table_filter.shop_id = this.shop_data.shop_id
  },
  methods:{
    moment,
    convertTimeStampToDate,

    hideModal(){
      this.hideDialogById('unregistered-client-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.table_filter.search_keyword = ''
      this.table_data.rows             = []
      this.table_data.pagination       = {}
      this.errors = []
    },
    
    async onSearchAsync(){
      this.preLoader()
      let response = await this.client_api.getClientsByValuesAsync(this.table_filter)
      this.preLoader(false)
      if (response.is_ok){
        this.table_data.rows       = response.data.items
        this.table_data.pagination = response.data.pagination
      }
      else{
        this.errors = response.error_messages
      }
    },
    async onChangePageAsync(page){
      this.table_filter.page_number = page
      await this.onSearchAsync()
    },
    async onConnectAsync(row){
      let query_sales = {
        sales_number : this.x_sales_action.data.sales_number,
        shop_id      : this.x_sales_action.data.shop_id,
        status       : this.x_sales_action.options.status
      }
      let response = await this.sales_api.getSalesLiveAsync(query_sales) 
      if (response.is_ok){
        let tmp_sales = new SalesViewModel()
        tmp_sales.setFields(mapActionSecurityInfo(response.data, options.form_actions.edit))
        tmp_sales.setClientInfo(row)
        tmp_sales.fields.is_sales_connect = true

        // add time
        let current_date_time    = convertDateToTimezone(new Date())
        let current_date_time_ts = convertDateToTimeStamp(current_date_time, false, true)
        tmp_sales.fields.edited_date_time_ts = convertTimeStampPlusLocalzone(current_date_time_ts)
        tmp_sales.fields.hour_of_day         = current_date_time.getHours()

        let update_sales_response = await this.sales_api.updateSalesAsync(tmp_sales)
        if(update_sales_response.is_ok){
          this.$emit(CONNECTED_CLIENT_SALES_EVENT_NAME, update_sales_response.data)
          this.hideModal()
        }
        else{
          this.errors = response.error_messages
        }
      }
      else{
        this.errors = response.error_messages
      }
    }
  }
}
</script>

<style lang="scss">
@import './unregistered-client-action.scss'
</style>
