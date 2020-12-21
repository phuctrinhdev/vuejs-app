<template>
  <b-modal id="action-opening-hours-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="action-opening-hours-modal"
           @show="onLoadForm()">
    <form class="form-wrapper">
      
      <div class="row form-group">
        <div class="col-5">
          <label>{{ $t('booking-opening-hours.start') }}</label>
        </div>
        <div class="col-7">
          <select-hour v-model="opening_hours.fields.start_time" :select_hour_options="select_start_time_options"/>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-5">
          <label>{{ $t('booking-opening-hours.finish') }}</label>
        </div>
        <div class="col-7">
          <select-hour v-model="opening_hours.fields.finish_time" :select_hour_options="select_finish_time_options"/>
        </div>
      </div>

      <div class="form-group">
        <select-day-of-week v-model="day_of_week_select"/>
      </div>
    </form>

    <error-box :errors="alerts_data"/>
    <div class="modal-footer">
      <btn-action-group :data="form_options" 
                        @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
    </div>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { options } from '../../../helpers/options'
import OpeningHoursViewModel from '../../../view-model/bookings/opening-hours-view-model.js' 
import { loadDayOfWeek, convertHoursToMinutes, convertMinutesToHours } from '../../../helpers/common'
import select_hour from '../../common/form/select/select-hour/select-hour'
import select_day_of_week from '../../common/form/select/select-day-of-week/select-day-of-week'
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'

export default {
  components: {
    'select-hour': select_hour,
    'select-day-of-week': select_day_of_week,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  }, 
  extends: component_base,
  data(){
    return {
      options,

      opening_hours: new OpeningHoursViewModel(),
      opening_hours_errors: [], 

      day_of_week_select:[],
      start_time: '',
      finish_time: '',
      select_start_time_options: {
        start: '00:00',
        step: '00:30',
        end: '23:30'
      },
      select_finish_time_options: {
        start: '00:00',
        step: '00:30',
        end: '36:00'
      },

      form_title: '',
      form_options: {
        delete: false
      },
    }
  },
  computed: {
    ...mapGetters('alert', {
      alerts_data: 'getAlerts',
    }),
    ...mapGetters('opening_hours', {
      action_data: 'getOpeningHoursAction'
    })
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    hideModal(){
      this.hideDialogById('action-opening-hours-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('booking-opening-hours.add-opening-hour')
        this.opening_hours = new OpeningHoursViewModel()
        this.form_options.delete = false
        this.day_of_week_select = []

        if(this.action_data.options.opening_days && this.action_data.options.opening_days.length >0){
          let opening_days_ids = [...this.action_data.options.opening_days.map(o => o.id)]
          this.opening_hours.fields.id =_.max(opening_days_ids) + 1
        }
        else{
          this.opening_hours.fields.id = 1
        }
      }
      
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('booking-opening-hours.edit-opening-hour')
        this.opening_hours.fields = Object.assign(this.opening_hours.fields, this.action_data.data.fields)
        this.form_options.delete = true
        
        // set start & finish time 
        if(this.opening_hours.fields.cross_date || this.opening_hours.fields.finish_time < this.opening_hours.fields.start_time) {
          this.opening_hours.fields.finish_time = convertMinutesToHours(convertHoursToMinutes(this.opening_hours.fields.finish_time) + options.minutes_of_24h)
        }

        // set day of week
        this.day_of_week_select = this.opening_hours.fields.opened_days_of_week
      }
      
      this.setAlertsData([])
    },
    onConfirm(){
      this.opening_hours.fields.opened_days_of_week = []
      for(let day in this.day_of_week_select){ 
        this.opening_hours.fields.opened_days_of_week.push(this.day_of_week_select[day])
      }
      this.opening_hours.fields = Object.assign(this.opening_hours.fields, this.shop_data)
      
      // check validate & duplicate
      let error_messages = this.opening_hours.isValid()
      this.setAlertsData(error_messages)

      if(this.alerts_data.length == 0){
        let tmp_opening_hours = _.cloneDeep(this.opening_hours.fields)
        let finish_time_minutes = convertHoursToMinutes(tmp_opening_hours.finish_time)
        if(finish_time_minutes >= options.minutes_of_24h){
          tmp_opening_hours.finish_time = convertMinutesToHours(finish_time_minutes - options.minutes_of_24h)
          tmp_opening_hours.cross_date = true
        }
        else tmp_opening_hours.cross_date = false
        
        if(this.action_data.action == options.form_actions.add){
          this.$emit('submit-opening-hour', tmp_opening_hours, options.form_actions.add)
        }
        else if(this.action_data.action == options.form_actions.edit){
          this.$emit('submit-opening-hour', tmp_opening_hours, options.form_actions.edit)
        }
      }
    },
    onDelete(){
      this.$emit('submit-opening-hour', this.opening_hours.fields, options.form_actions.delete)
    },
    checkDuplicateWorkHours(){
      let duplicate = {
        status: false,
        days: [],
        message: ''
      }
      let opening_days_text = ',' 
      let opening_days_result = []

      // selected days in week
      for(let opening_day in this.action_data.options.opening_days){  
        if(this.action_data.action == options.form_actions.edit 
        && this.action_data.data.fields.id == this.action_data.options.opening_days[opening_day].id){
          continue
        }
        opening_days_text += this.action_data.options.opening_days[opening_day].opened_days_of_week + ','
      }

      // checking new days
      for(let day in this.day_of_week_select){
        let find = opening_days_text.indexOf(',' + this.day_of_week_select[day] + ',') > -1 ? true : false
        if(find) {
          for(let i in this.action_data.options.opening_days){
            if(this.action_data.action == options.form_actions.edit 
            && this.action_data.data.fields.id == this.action_data.options.opening_days[i].id){
              continue
            }
            let opening_tmp = this.action_data.options.opening_days[i]
            if(opening_tmp.opened_days_of_week.includes(this.day_of_week_select[day])){
              let new_start_time_minutes = convertHoursToMinutes(this.opening_hours.fields.start_time)
              let new_finish_time_minutes = convertHoursToMinutes(this.opening_hours.fields.finish_time)
              let old_start_time_minutes = convertHoursToMinutes(opening_tmp.start_time)
              let old_finish_time_minutes = convertHoursToMinutes(opening_tmp.finish_time)
              
              if(!(new_start_time_minutes > old_finish_time_minutes || new_finish_time_minutes < old_start_time_minutes)){
                duplicate.status = true
                opening_days_result.push( this.day_of_week_select[day])
              }
            }
          }
        }
      } 
      duplicate.message = loadDayOfWeek(opening_days_result) + ': ' + this.$i18n.t('booking-opening-hours.duplicate_days')
      return duplicate
    }
  }
}
</script>

<style lang="scss">
@import './opening-hours-form.scss';
</style>