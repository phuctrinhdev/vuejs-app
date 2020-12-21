<template>
  <div class="common-style">
    <b-modal id="working-hour-action" 
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="ssm"
             class="working-hour-action"
             @show="onLoadForm()">
      <form class="form-wrapper">
        <div class="working-hour-box editbox">
          <div ref="startTime" class="form-group clearfix">
            <label>{{ $t('working-hour.start') }} </label>
            <select-hour v-model="workinghour.fields.start_time" :select_hour_options="time_picker_options"/>
          </div>
          <div class="form-group clearfix">
            <label>{{ $t('working-hour.finish') }} </label>
            <select-hour v-model="workinghour.fields.finish_time" :select_hour_options="time_picker_options"/>
          </div>
          <div class="form-group clearfix">
            <select-day-of-week v-model="day_of_week_select"/>
          </div>
        </div>
      </form>

      <error-box :errors="workinghour_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options"
                          @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
      </div>
    </b-modal>

    <alert id="workinghour-alert" 
           :alerts="alerts" 
           :title="$t('staffs.error-title')" 
           :close_action="true" 
           @close-event="close"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { options }           from '../../../helpers/options'
import WorkingHoursViewModel from '../../../view-model/staffs/working-hours-view-model.js'

import alert                 from '../../../components/common/alert/alert.vue'
import error_box             from '../../common/form/error-box/error-box' 
import btn_action_group      from '../../common/button/btn-action-group/btn-action-group'
import component_base        from '../../../components/common/component-base/component-base'
import select_day_of_week    from '../../common/form/select/select-day-of-week/select-day-of-week'
import select_hour           from '../../common/form/select/select-hour/select-hour'

import { loadDayOfWeek }     from '../../../helpers/common'

export default {
  components: { 
    'alert': alert, 
    'select-day-of-week': select_day_of_week,
    'btn-action-group': btn_action_group,
    'error-box': error_box,
    'select-hour': select_hour,
  },
  extends: component_base,
  data() {
    return {
      options,

      workinghour: new WorkingHoursViewModel(),
      workinghour_errors:[],

      day_of_week_select:[],
      time_picker_format: options.standard_hour_format.default,
      time_picker_options:{
        start: '00:00',
        step: '00:30',
        end: '23:30'
      },
      
      form_title: '',
      form_options: {
        delete: true
      },

      alerts: [],
    }
  },
  computed: {
    ...mapGetters('alert', {
      alerts_data: 'getAlerts'
    }),
    ...mapGetters('staff', {
      action_data: 'getStaffWorkingHourAction',
      workinghour_setup_data: 'getStaffWorkingHourSetupAction'
    })
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('staff', [
      'addWorkingHoursDataAsync',
      'updateWorkingHoursDataAsync',
      'deleteWorkingHoursDataAsync'
    ]),
    onLoadForm(){
      this.workinghour_errors = []
      let action = this.action_data.action
      let error = this.action_data.error_messages

      if(action == options.form_actions.add) {
        this.form_title = this.$i18n.t('working-hour.add-workinghour')
        this.workinghour = new WorkingHoursViewModel()
        this.form_options.delete = false
        this.day_of_week_select = [] 
      }
      if(action == options.form_actions.edit){
        this.form_title = this.$i18n.t('working-hour.edit-workinghour')
        if(error.length==0){
          this.workinghour.fields = Object.assign(this.workinghour.fields, this.action_data.data.working_hours[0])
          this.form_options.delete = true
          // set day of week
          this.day_of_week_select = this.workinghour.fields.worked_days_of_week
          // // set start & finish time 
          // this.workinghour.fields.start_time = convertTextToTime(this.workinghour.fields.start_time) 
          // this.workinghour.fields.finish_time = convertTextToTime(this.workinghour.fields.finish_time)
        }
        if(error.length!=0){
          this.workinghour_errors.push(this.action_data.error_messages[0].errorMessage)
        }
      }
      this.setAlertsData([])
    },
    close(){
      this.$nextTick(function(){
        this.$refs.startTime.focus()
      })
    },
    // alert
    showCustomAlert(alerts, modal_name){
      this.setAlertsData(alerts)
      this.alerts = alerts
      this.showDialogById(modal_name)
    },
    onConfirm(){
      this.workinghour.fields.worked_days_of_week = []
      for(let day in this.day_of_week_select){ 
        this.workinghour.fields.worked_days_of_week.push(this.day_of_week_select[day])
      }
      this.workinghour.fields = Object.assign(this.workinghour.fields, this.action_data)
      // check validate & duplicate
      this.workinghour_errors=this.workinghour.isValid()

      this.setAlertsData([])
      if(this.workinghour_errors.length == 0){
        if(this.action_data.action == options.form_actions.add){
          this.onSubmitWorkingHour(this.workinghour.fields, options.form_actions.add)
        }
        else if(this.action_data.action == options.form_actions.edit){
          this.onSubmitWorkingHour(this.workinghour.fields, options.form_actions.edit)
        }
      }
    },
    async onSubmitWorkingHour(data, action){
      this.preLoader(true)
      if(action == options.form_actions.add) await this.addWorkingHoursDataAsync(data)
      else if(action == options.form_actions.edit) await this.updateWorkingHoursDataAsync(data)
      else if(action == options.form_actions.delete) await this.deleteWorkingHoursDataAsync(data)
      this.preLoader(false)

      if(this.alerts_data.length == 0)
      {
        this.$emit('submit-working-hour')
        this.hideModal() 
      }
      else {
        this.showCustomAlert(new Array(this.alerts_data[0].errorMessage), 'workinghour-alert')  
      }
    },
    checkDuplicateDayOfWeek(){
      let duplicate = {
        status: false,
        days: [],
        message: ''
      }
      let working_days_text = ',' 
      let working_days_result = [] 
      if(this.action_data.action == options.form_actions.add)
      {
        // selected days in week
        for(let working_day in this.action_data.options.working_days){  
          working_days_text += this.action_data.options.working_days[working_day].worked_days_of_week + ','
        }
      }
      else{
        // selected days in week
        for(let working_day in this.workinghour_setup_data.data.working_hours){  
          if(this.action_data.action == options.form_actions.edit 
          && this.action_data.data.working_hours[0].id == this.workinghour_setup_data.data.working_hours[working_day].id){
            continue
          }
          working_days_text += this.workinghour_setup_data.data.working_hours[working_day].worked_days_of_week + ','
        }
      }
      // checking new days
      for(let day in this.day_of_week_select){  
        let find = working_days_text.indexOf( ','+this.day_of_week_select[day] + ',') > -1 ? true : false
        if(find) {
          duplicate.status = true
          working_days_result.push( this.day_of_week_select[day])
        }
      } 
      duplicate.message = loadDayOfWeek(working_days_result) + ' ' + this.$i18n.t('booking-opening-hours.duplicate_days')
      return duplicate
    },
    onCancel(){
      this.hideModal()
    },
    onDelete(){
      this.onSubmitWorkingHour(this.workinghour.fields, options.form_actions.delete)
    },
    hideModal(){
      this.hideDialogById('working-hour-action')
    }
  }
}
</script>

<style lang="scss">
@import '../staff-common.scss';
</style>