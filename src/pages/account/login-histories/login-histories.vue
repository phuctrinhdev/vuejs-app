<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('login-history.title') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part mr15">
              <span class="badge badge-info badge-pill search-part">{{ $t('general.date-range') }}</span> 
              <div class="dib">
                <div class="datepicker-dib">
                  <v-date-picker v-model="table_filter.registration_date_from" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                                 @input="onInputFromDate"/> ~
                </div>
                <div class="datepicker-dib">
                  <v-date-picker v-model="table_filter.registration_date_to" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                                 @input="onInputToDate"/>
                </div>
              </div>
            </li>
            <li class="part">
              <span class="badge badge-info badge-pill search-part">User ID</span> 
              <b-form-select v-model="table_filter.user_id" :placeholder="$t('general.all')"
                             :options="user_id_options" value-field="user_id" text-field="user_id">
                <template v-slot:first>
                  <option :value="''">ALL</option>
                </template>
              </b-form-select>
            </li>
          </ul>
          <div class="search-btn clearfix">
            <button class="submit-btn pc" @click="onSearch"><span class="search-pc"/><span>{{ $t('general.search') }}</span></button>
            <button class="submit-btn mobile" @click="onSearch"><span class="search-mobile"/></button>              
          </div>
        </div>
        <div class="section-part">            
          <p class="mb5 fz13">{{ $t('login-history.all').replace('{0}', table_data.pagination.total_items) }}</p>
          <div class="slide-x small">
            <view-table :data="table_data" @change-page="onChangePage"/>
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import { formatDateBySetting
  , convertDateToTimezone 
  , convertFirstDateToTimezone}      from '../../../helpers/common'
import { options }                   from '../../../helpers/options'
import UserLoginHistoryApi           from '../../../api/account/user-login-history'
import UserAccountApi                from '../../../api/account/user-account-api'
import component_base                from '../../../components/common/component-base/component-base'
import view_table                    from '../../../components/common/view-table/view-table'
import { DatePicker, setupCalendar } from 'v-calendar'

export default {
  components: {   
    'view-table'    : view_table,
    'v-date-picker' : DatePicker,
  },  
  extends: component_base,
  data() {
    return {
      options : options,
      table_data: {
        fields: [
          { field: 'registration_date', label: 'login-history.date-time', width: '35%',  sortable: false, formatFn: this.formatDateCol },
          { field: 'user_id',           label: 'login-history.id',        width: '30%',  sortable: false },
          { field: 'login_ip',          label: 'login-history.ip',        width: '35%',  sortable: false },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: true
        },
        style: 'normal'
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        user_id: '',
        registration_date_from: convertFirstDateToTimezone(new Date()),
        registration_date_to: convertDateToTimezone(new Date()),
      },
      user_id_options: []
    }
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
  mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableData()
    this.loadUserIdOption()
  },
  methods: {
    async loadTableData(){
      let user_login_history_api = new UserLoginHistoryApi()
      let result = await user_login_history_api.getUserLoginHistoriesAsync(this.table_filter)
      if(result.is_ok){
        this.table_data.rows = result.data.items
        this.table_data.pagination = result.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
        this.table_data.total_count = this.table_data.pagination.total_items
      }
      else this.showAlert(result.error_messages)
    },
    async loadUserIdOption(){
      let user_account_api = new UserAccountApi() 
      let result = await user_account_api.getSalonUserAccountsAsync(this.table_filter)
      if(result.is_ok){ 
        this.user_id_options = result.data.items
      }
      else this.showAlert(result.error_messages)
    },
    onSearch(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },
    onInputFromDate(date){
      if(date == null)
        this.table_filter.registration_date_from = convertFirstDateToTimezone(new Date())
    },
    onInputToDate(date){
      if(date == null)
        this.table_filter.registration_date_to = convertDateToTimezone(new Date())
    },
    formatDateCol(date){
      return formatDateBySetting(date)
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadTableData()
    },
  }
}
</script>