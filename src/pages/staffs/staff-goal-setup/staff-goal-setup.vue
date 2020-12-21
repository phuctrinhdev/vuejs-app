<template>
  <main class="app-content">
    <section id="staff-goal-setup" class="content staff-goal-setup-page">
      <div class="page-title">
        <h3>{{ $t('staff-goal.staff-goal-setup') }}</h3>
        <ul class="group-btn">
          <li class="btn"><router-link :to="{ name: 'staff-goal-management' }">{{ $t('staff-goal.goal-management') }}</router-link></li>
        </ul>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="row">
              <div class="col-12">
                <input-month-range ref="input_month_range" @input="onInputMonthRange"/>
                <div class="btn btn-white" @click="onCopyPreviousMonthGoal">{{ $t('staff-goal.copy-previous-month-goal') }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <div class="table-intro">
          <div class="intro-title">{{ table_intro_view }}</div>
          <div class="add-staff">
            <label>{{ $t('staff-goal.add-staff') }}</label>
            <select-multi-staffs v-model="staffs" :staff_options="staff_options"/>
            <div class="btn" @click="onAddStaffsToList">{{ $t('staff-goal.add-list') }}</div>
          </div>
        </div>

        <table>
          <thead>
            <th width="30%">{{ $t('sales.staff') }}</th>
            <th width="15%">{{ $t('report.service') }}</th>
            <th width="15%">{{ $t('report.product') }}</th>
            <th width="15%">{{ $t('report.prepaid-card') }}</th>
            <th width="15%">{{ $t('report.prepaid-service') }}</th>
            <th width="10%">{{ $t('general.delete') }}</th>
          </thead>
          <tbody>
            <tr v-for="(row, i) in staff_goal_setup.fields.staff_goal_setups" :key="i">
              <td>{{ row.staff_name }}</td>
              <td><input-money-by-blur v-model="row.service_amount" :decimal="0"/></td>
              <td><input-money-by-blur v-model="row.product_amount" :decimal="0"/></td>
              <td><input-money-by-blur v-model="row.prepaid_card_amount" :decimal="0"/></td>
              <td><input-money-by-blur v-model="row.prepaid_service_amount" :decimal="0"/></td>
              <td><button class="btn" @click="onDeleteStaff(row)">{{ $t('general.delete') }}</button></td>
            </tr>
          </tbody>
        </table>

        <div class="group-btn">
          <button class="btn btn-submit" @click="onConfirm">{{ $t('general.save') }}</button>
        </div>

        <div class="guides">
          <ul>
            <li>{{ $t('staff-goal.staff-goal-setup-guide-1') }}</li>
            <li>{{ $t('staff-goal.staff-goal-setup-guide-2') }}</li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { common_options }         from '../../../helpers/options/common-options'
import component_base             from '../../../components/common/component-base/component-base'
import staff_mixin                from '../../../helpers/mixins/staff-mixin'
import StaffGoalSetupApi          from '../../../api/staffs/staff-goal-setup-api'
import StaffGoalSetupViewModel    from '../../../view-model/staffs/staff-goal-setup-view-model'
// import staff_cache                from '../../../helpers/cache/staff-cache'
import select_multi_staffs        from '../../../components/common/form/select/select-multi-staffs/select-multi-staffs.vue'
import input_money_by_blur        from '../../../components/common/form/input/input-money/input-money-by-blur'
import input_month_range          from '../../../components/common/form/input/input-month-range/input-month-range'

import {
  convertDateToTimezone
} from '../../../helpers/common'


export default {
  components: {
    'select-multi-staffs': select_multi_staffs,
    'input-month-range': input_month_range,
    'input-money-by-blur': input_money_by_blur
  },
  extends : component_base,
  mixins: [staff_mixin],
  data(){
    return {
      table_filter : {
        apply_year_month            : 0,
        shop_id                     : 0,

        // ui only
        date_type                   : common_options.date_type.month,
        from_date                   : {},
        to_date                     : {},
        apply_year_current          : 0,
        apply_month_current         : 0,
      },
      table_intro         : '',
      table_intro_view    : '',
      staffs              : [],
      staff_all           : [],

      staff_goal_setup_api: new StaffGoalSetupApi(),
      staff_goal_setup    : new StaffGoalSetupViewModel(),

      errors              : [],
    }
  },
  computed:{
    staff_options(){
      let staffs_remain   = []
      let staff_seted_ids = this.staffs_seted.map(s => s.id)
      for(let staff of this.staff_all){
        if(!staff_seted_ids.includes(staff.id))
          staffs_remain.push(staff)
      }
      return staffs_remain
    },
    staffs_seted(){
      let staffs_seted = []
      if(this.staff_goal_setup.fields.staff_goal_setups.length > 0){
        for(let staff_goal of this.staff_goal_setup.fields.staff_goal_setups){
          staffs_seted.push({
            id       : staff_goal.staff_id,
            aliasname: staff_goal.staff_name
          })
        }
      }
      return staffs_seted
    }
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id

    // input month, year (cross)
    let today_timezone = convertDateToTimezone(new Date())
    let this_month = moment(today_timezone).startOf('month').toDate()
    this.$refs.input_month_range.month_range.from_date = this_month
    this.$refs.input_month_range.month_range.from_month= this_month.getMonth() + 1
    this.$refs.input_month_range.onInputFromMonth()

    await this.loadStaffGoalSetupAsync()
    await this.loadStaffOptionsAsync()
  },
  methods:{
    // month
    onInputMonthRange(month_range){
      let tmp_year  = month_range.from_year
      let tmp_month = month_range.from_month
      if(tmp_month < 10)
        tmp_month = `0${tmp_month}`

      this.table_filter.apply_year_month = `${tmp_year}${tmp_month}`
      this.table_intro = `${tmp_month}-${month_range.from_year}`
    },
    onSearch(){
      this.loadStaffGoalSetupAsync()
    },
    onCopyPreviousMonthGoal(){
      this.loadStaffGoalSetupAsync(true)
    },

    // staff
    async loadStaffOptionsAsync(){
      let response = await this.getStaffsAsyncMixin()
      if(response.is_ok){
        this.staff_all = response.data.items
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onAddStaffsToList(){
      for(let staff of this.staffs){
        let staff_goal = {
          staff_id              : staff.id,
          staff_name            : staff.aliasname,
          product_amount        : 0,
          service_amount        : 0,
          prepaid_service_amount: 0,
          prepaid_card_amount   : 0,
        }
        this.staff_goal_setup.fields.staff_goal_setups.push(staff_goal)
      }
      this.staffs = []
    },
    onDeleteStaff(row){
      this.staff_goal_setup.fields.staff_goal_setups = this.staff_goal_setup.fields.staff_goal_setups.filter(item => item.staff_id != row.staff_id)
    },
    
    async loadStaffGoalSetupAsync(is_previous){
      let query = _.cloneDeep(this.table_filter)
      if(is_previous)
        query.apply_year_month = this.getPreviousYearMonth()

      this.preLoader()
      let response = await this.staff_goal_setup_api.getStaffGoalSetupAsync(query)
      this.preLoader(false)

      if(response.is_ok){
        if(is_previous){
          let tmp_staff_goals_curr= _.cloneDeep(this.staff_goal_setup.fields.staff_goal_setups)
          let tmp_staff_goals_prev= response.data.staff_goal_setups
          let tmp_staff_goals_new  = _.differenceBy(tmp_staff_goals_curr, tmp_staff_goals_prev, 'staff_id')

          this.staff_goal_setup.mapStaffGoalFromPreviousMonth([...tmp_staff_goals_prev, ...tmp_staff_goals_new])
        }
        else {
          this.staff_goal_setup.setFields(response.data)
          this.table_intro_view = this.table_intro
          this.table_filter.apply_year_current  = this.table_intro_view.slice(3,7)
          this.table_filter.apply_month_current = this.table_intro_view.slice(0,2)
        }
      }
      else this.showAlert(response.error_messages)
    },
    getPreviousYearMonth(){
      let tmp_previous  = 0
      let tmp_year      = this.table_filter.apply_year_current
      let tmp_month     = this.table_filter.apply_month_current
      if(tmp_month == 1){
        tmp_previous = `${tmp_year - 1}12`
      }
      else {
        let tmp_month_previous = tmp_month - 1
        if(tmp_month_previous < 10)
          tmp_month_previous = `0${tmp_month_previous}`
        tmp_previous = `${tmp_year}${tmp_month_previous}`
      }
      return Number(tmp_previous)
    },
    
    async onConfirm(){
      let errors = this.staff_goal_setup.isValid()
      if(errors.length==0){
        this.preLoader()
        let response = await this.staff_goal_setup_api.addOrUpdateStaffGoalSetupAsync(this.staff_goal_setup)
        this.preLoader(false)

        if(response.is_ok){
          this.staff_goal_setup.setFields(response.data)

          // clear cache
          // staff_cache.clearCacheStaffGoalSetup()
        }
        else this.showAlert(response.error_messages)
      }
      else this.showAlert(errors)
    }
  }
}
</script>

<style lang="scss">
@import './staff-goal-setup.scss';
</style>