<template>
  <main class="app-content">
    <section class="contents-style common-style staffs-page">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('staffs.staffs') }}</h3>
          <ul class="btn-group clearfix flr">
            <li><a class="btn secondary" @click="onActionStaff(options.form_actions.add)">{{ $t('staffs.staff-add') }}</a></li>
          </ul>        
        </article>

        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part lh-use">
              <radio-group v-model="table_filter.search_condition" :options="options.staffs_enums.search_condition" :buttons="false"
                           class="radio-common"/>
            </li>
            <li class="part"><input v-model="table_filter.search_value" type="text"></li>
            <li class="part">
              <b-form-checkbox
                id="checkbox-1"
                v-model="table_filter.status"
                :value="options.staffs_enums.status.all"
                :unchecked-value="options.staffs_enums.status.active"
                class="mt-check">
                <span class="text">{{ $t('staffs.include-inactive') }}</span>
              </b-form-checkbox>
            </li>
          </ul>
          <div class="search-btn clearfix">
            <button class="submit-btn pc" @click.prevent="onSearch"><span class="search-pc"/><span> {{ $t('general.search') }}</span></button>
            <button class="submit-btn mobile"><span class="search-mobile"/></button>     
          </div>
        </div>
        
        <div class="section-part">
          <div class="slide-x big large">
            <staffs-table :data="table_data" @change-page="onChangePage">
              <template slot="entry_date" slot-scope="{ row }">
                {{ formatDate(row.entry_date) }}
              </template>
              <template slot="working_hours" slot-scope="{ row }">
                <div class="wh-space-nowrap">
                  <ul>
                    <li v-for="(working_hour, index) in row.working_hours" :key="index">
                      {{ formatTimeOfApi(working_hour.start_time) }} ~ 
                      <span v-if="working_hour.start_time > working_hour.finish_time">{{ $t('staffs.next-day') }}</span>
                      {{ formatTimeOfApi(working_hour.finish_time) }} 
                      <span>{{ formatDayOfWeek(working_hour.worked_days_of_week) }}</span>
                    </li>
                  </ul>
                </div>
                <div class="mt5">
                  <a :data="{item: row}" class="btn secondary" @click="onWorkingHourSetup(row)">{{ $t('working-hour.setup') }}</a>
                </div>
              </template>
              <template slot="edit" slot-scope="{ row }">
                <li><a :data="{item: row}" class="btn secondary" @click="onActionStaff(options.form_actions.edit, row)">{{ $t('general.edit') }}</a></li>
              </template>
            </staffs-table>
          </div>
        </div>
      </div>
    </section>

    <!-- modal action -->
    <staff-action @reload-page="onReloadPage" />
    <working-hour-setup/>
  </main>
</template>

<script>
import { options } from '../../../helpers/options'
import staff_action from '../../../components/staffs/staff-action/staff-action.vue'
import working_hour_setup from '../../../components/staffs/working-hour/working-hour-setup.vue'
import radio_group from '../../../components/common/form/radio/radio-group/radio-group'
import component_base    from '../../../components/common/component-base/component-base'
import staffs_table from '../../../components/staffs/staffs-table/staffs-table.vue'
import { mapGetters, mapActions } from 'vuex'
import { 
  formatDate, 
  loadDayOfWeek } from '../../../helpers/common'

import moment from 'moment'

export default {
  components: {
    'working-hour-setup': working_hour_setup,
    'staff-action': staff_action,
    'radio-group': radio_group,
    'staffs-table': staffs_table
  },
  extends: component_base,
  data() {
    return {
      options,
      // table Staffs
      table_data: {
        fields: [
          { field: 'staff_number',        label: 'staffs.staff-number',  width: '7%',  sortable: false },
          { field: 'aliasname',           label: 'staffs.name-alias',    width: '15%', sortable: false },
          { field: 'fullname',            label: 'staffs.full-name',     width: '15%', sortable: false },
          { field: 'mobile_phonenumber',  label: 'staffs.mobile-number', width: '15%', sortable: false },
          { field: 'entry_date',          label: 'staffs.entry-date',    width: '10%', sortable: false, expand: true },
          { field: 'working_hours',       label: 'staffs.working-hours', width: '28%', sortable: false, expand: true, tdClass: 'tal' },
          { field: 'edit',                label: 'general.edit',         width: '10%', sortable: false, expand: true },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true
        },
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        search_condition: 1,
        search_value: '',
        status: options.staffs_enums.status.all
      },
      staff_action: {},
      workinghours: {},
      workinghour_setup_action: {}
    }
  },
  computed: {
    ...mapGetters('staff', {
      staffs_data: 'getStaffs'
    })
  },
  beforeMount(){
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableData()
  },
  methods: {
    ...mapActions('staff', [
      'getStaffAllAsync',
      'setStaffActionDataAsync',
      'updateStaffData',
      'setStaffWorkingHourSetupActionData'
    ]),
    formatDate,

    // table
    async loadTableData(){
      this.preLoader()
      await this.getStaffAllAsync(this.table_filter)

      if(this.staffs_data.is_ok){
        this.table_data.rows = this.staffs_data.data.items
        this.table_data.pagination = this.staffs_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(this.staffs_data.error_messages)

      this.preLoader(false)
    },
    onActionStaff(action, staff = {}){
      this.modal_visible = true
      this.staff_action = {
        action: action,
        data: staff,
      }
      this.setStaffActionDataAsync(this.staff_action).then(() => {
        this.showDialogById('modal-add-staffs')
      })
    },
    onWorkingHourSetup(workinghours = {}){
      this.modal_visible = true
      this.workinghour_setup_action = {
        data: workinghours
      }
      this.setStaffWorkingHourSetupActionData(this.workinghour_setup_action)
      this.showDialogById('modal-working-hour-setup')
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },
    // table UI
    onSearch(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },
    onReloadPage(){
      if(((this.table_filter.page_number - 1) * 10) == this.table_data.pagination.total_items - 1)
        this.table_filter.page_number -= 1
      this.loadTableData()
    },
    formatDayOfWeek(days){
      return loadDayOfWeek(days)
    },
    formatTimeOfApi(time){
      return moment(time, options.standard_hour_format.h24_seconds).format(options.standard_hour_format.h24)
    },
  }
}
</script>

<style lang='scss'>
@import './staffs.scss';
</style>
