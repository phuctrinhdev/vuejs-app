<template>
  <main class="app-content">
    <section class="content receivables-edit-history">
      <!-- BEGIN TITLE -->
      <div class="title">
        <h3>{{ $t('receivables-edit-history.outstanding-balance-edit-history') }}</h3>
        <div>
          <router-link :to="{ name: 'outstanding' }">
            {{ $t('receivables-edit-history.outstanding') }}
          </router-link>
        </div>
      </div>
      <!-- END TITLE -->

      <!-- BEGIN FILTER -->
      <div class="filter">
        <input-date-range ref="input_date_range" @input="onInputDate"/>
        <div class="keyword">
          <input v-model="table_filter.keyword"
                 :placeholder="client_name_mobile_text"
                 class="form-control"
                 type="text">
        </div>
        <div class="search">
          <button class="btn-submit" @click.prevent="onSearchAsync"><i class="btn-search-white"/> <span>{{ $t('receivables-edit-history.search') }}</span></button>
        </div>
      </div>
      <!-- END FILTER -->

      <!-- BEGIN TABLE -->
      <div class="table">
        <p>{{ total_client_text }}</p>
        <view-table :data="table_data" @change-page="onChangePagesAsync">
          <template slot="date" slot-scope="{row}">
            {{ moment(convertTimeStampToDate(row.created_date_time_ts,true)).format(common_options.standard_date_format.ymd) }}
          </template>
          <template slot="action" slot-scope="{row}">
            {{ SalesUtils.formatOutstandingHistoryType(row.outstanding_history_type) }}
          </template>
          <template slot="old_balance" slot-scope="{row}">
            {{ formatMoney(row.outstanding_before_change,0) }}
          </template>
          <template slot="new_balance" slot-scope="{row}">
            {{ formatMoney(row.outstanding,0) }}
          </template>
        </view-table>
      </div>
      <!-- END TABLE -->

    </section>
  </main>
</template>

<script>
const DEFAULT_NUMBER_PAGE         = 1
const DEFAULT_GET_ALL_CLIENT      = -1

import SalesUtils                    from '../../../helpers/utils/sales-utils.js'
import OutstandingHistoryApi         from '../../../api/sales/outstanding-history-api.js'
import component_base                from '../../../components/common/component-base/component-base.vue'
import view_table                    from '../../../components/common/view-table/view-table.vue'

import input_date_range      from '../../../components/common/form/input/input-date-range/input-date-range.vue'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import moment                        from 'moment'
import { convertTimeStampToDate,
  formatMoney }                      from '../../../helpers/common.js'

export default {
  components : {
    'view-table'               : view_table,
    'input-date-range' : input_date_range
  },
  extends : component_base,
  data(){
    return {
      SalesUtils,
      common_options,
      total_client : 0,
      outstanding_api : new OutstandingHistoryApi(),
      table_data : {
        fields : [
          // {field: 'mobile',                     label: '',                                 width: 'auto',  thClass : 'mobile', expand: true, tdClass : 'mobile', column_expand : true},
          {field: 'date',             label: 'receivables-edit-history.date',              width: '10%',   sortable: false, expand: true},
          {field: 'client_name',      label: 'receivables-edit-history.clients',           width: '20%',   sortable: false},
          // {field: 'phone_number',     label: 'receivables-edit-history.phone-number',      width: '15%',   sortable: false},
          // {field: 'mobile_number',    label: 'receivables-edit-history.mobile-number',     width: '15%',   sortable: false},
          {field: 'action',           label: 'receivables-edit-history.action',            width: '15%',   sortable: false, expand: true},
          {field: 'old_balance',      label: 'receivables-edit-history.old-balance',       width: '15%',   sortable: false, expand: true},
          {field: 'new_balance',      label: 'receivables-edit-history.new-balance',       width: '15%',   sortable: false, expand: true},
          {field: 'notes',            label: 'receivables-edit-history.note',              width: '15%',   sortable: false},
        ],
        rows   : [],
        pagination : {},
        options : {
          pagination : true
        }
      },
      table_filter : {
        client_id    : DEFAULT_GET_ALL_CLIENT,
        keyword      : '',
        from_date    : {},
        to_date      : {},
        page_size    : common_options.pagination.default,
        page_number  : DEFAULT_NUMBER_PAGE,
        shop_id      : 0,
        outstanding_history_type : sales_options.outstanding_history_type_enum.edited
      }
    }
  },
  computed : {
    client_name_mobile_text(){
      return this.$i18n.t('receivables-edit-history.client-name-or-mobile')
    },
    total_client_text(){
      let text = this.$i18n.t('receivables-edit-history.all-records-of-cliens-table')
      text = text.replace('{records}',this.total_client)
      return text
    }
  },
  async created(){
    this.table_filter.shop_id = this.shop_data.shop_id
  },
  async mounted(){ // not created because input_date_range need render first
    await this.loadDataTableAsync()
  },

  methods : {
    async loadDataTableAsync(){
      if(this.$refs.input_date_range.errors.length > 0){
        this.showAlert([...this.$refs.input_date_range.errors])
        return
      }

      this.preLoader()
      let response = await this.outstanding_api.getOutstandingHistoriesAsync(this.table_filter)
      this.preLoader(false)
      if (response.is_ok){
        this.table_data.rows       = response.data.items
        this.table_data.pagination = response.data.pagination
        this.total_client          = formatMoney(response.data.pagination.total_items,0)
      }else{
        this.showAlertDialog(response.error_messages)
      }
    },

    async onChangePagesAsync(page){
      this.table_filter.page_number = page
      await this.loadDataTableAsync()
    },

    async onSearchAsync(){
      this.table_filter.page_number = DEFAULT_NUMBER_PAGE
      await this.loadDataTableAsync()
    },

    onInputDate(data){
      this.table_filter.from_date = data.value.from_date
      this.table_filter.to_date   = data.value.to_date
    },

    moment,
    formatMoney,
    convertTimeStampToDate
  }
}
</script>

<style lang="scss">
@import './outstanding-edit-history.scss';
</style>
