<template>
  <div class="specific-off-days-short clearfix">
    <button class="btn btn-white btn-large" @click="onActionSpecificOffDays">{{ $t('general.edit') }}</button>
    <div class="calendar-view-only"> 
      {{ days }}
      <div class="view-only"/>
      <specific-off-days-opening-hour-calendar :data="specific_off_days" :calendar_options="calendar_options"/>
    </div>

    <b-modal id="specific-off-days-short-action-modal" 
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer  
             class="specific-off-days-short-action-modal"
             @show="onLoadForm()">
      <specific-off-days-opening-hour-calendar :data="specific_off_days_action" :calendar_options="calendar_options"
                                               @change-calendar="onChangeCalendar"/>

      <error-box :errors="specific_off_days_action_errors"/>
      <div class="modal-footer"> 
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { options } from '../../../helpers/options'
import { mapGetters } from 'vuex' 
import { checkCalendarViewAllDates } from '../../../config/permission'

import specific_off_days_opening_hour_calendar from '../specific-off-days-opening-hour-calendar/specific-off-days-opening-hour-calendar'
import SpecificOffDaysApi from '../../../api/bookings/specific-off-days-api.js'
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../../components/common/component-base/component-base'
import { convertUTCToDate, 
  convertDateToUTC, 
  convertDateToTimezone,
  cache_session } from '../../../helpers/common'

export default {
  components: {
    'specific-off-days-opening-hour-calendar': specific_off_days_opening_hour_calendar,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
  },
  extends: component_base,
  data() {
    return {
      options,

      form_title: '',
      form_options: {
        delete: false
      },

      specific_off_days: [],
      specific_off_days_action: [],
      specific_off_days_action_tmp: undefined,
      specific_off_days_action_errors: [],
      specific_off_days_dialog_id: 'specific-off-days-short-action-modal',
      calendar_options: {
        calendar_min_date: null,
        today: convertDateToTimezone(new Date()),
        this_year: new Date().getFullYear(),
        disabled_attribute: {
          contentStyle: ({ isHovered }) => ({
            // textDecoration: 'line-through',
            color: '#ccc',
            opacity: 0.5,
            // Hide background and disable cursor on hover
            ...(isHovered && {
              cursor: 'default',
              backgroundColor: 'transparent'
            })
          })
        }
      }
    }
  },
  computed: {
    ...mapGetters('opening_hours', {
      opening_hours_data: 'getOpeningHours'
    }),
    days(){
      this.loadOffDays(this.opening_hours_data)
      return '' 
    }
  },
  beforeMount(){
    if(checkCalendarViewAllDates()) this.calendar_options.calendar_min_date = null
    else this.calendar_options.calendar_min_date = this.calendar_options.today
  },
  methods: {
    loadOffDays(){
      if(this.opening_hours_data.data != undefined){
        this.specific_off_days = this.specific_off_days_action = convertUTCToDate(this.opening_hours_data.data.specific_off_days)
      }
    },
    onActionSpecificOffDays(){
      this.showDialogById(this.specific_off_days_dialog_id)
    },

    // aciton modal
    hideModal(){
      this.hideDialogById(this.specific_off_days_dialog_id)
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.form_title = this.$i18n.t('booking-opening-hours.edit-specific-off-days')
    },
    onChangeCalendar(days){
      this.specific_off_days_action_tmp = days
    },
    async onConfirm(){
      if(this.specific_off_days_action_tmp != undefined){
        // prepare data for api
        let date_delete = _.difference(this.specific_off_days, this.specific_off_days_action_tmp)
        let date_create = _.difference(this.specific_off_days_action_tmp, this.specific_off_days)

        let data_delete = this.prepareDataForApi(date_delete)
        let data_create = this.prepareDataForApi(date_create)
        
        // connect api
        this.preLoader()
        let specific_off_days_api = new SpecificOffDaysApi()

        // delete
        let result_delete = {
          is_ok: false
        }
        if(data_delete.specific_off_days.length > 0) {
          result_delete = await specific_off_days_api.deleteSpecificOffDaysAsync(data_delete)
          if(!result_delete.is_ok) this.specific_off_days_action_errors.push(result_delete.error_messages)
          else cache_session.clearSessionBookingSetup()
        }

        // create
        let result_create = {
          is_ok: false
        }
        if(data_create.specific_off_days.length > 0){
          result_create = await specific_off_days_api.createSpecificOffDaysAsync(data_create)
          if(!result_create.is_ok) this.specific_off_days_action_errors.push(result_create.error_messages)
          else cache_session.clearSessionBookingSetup()
        }
        this.preLoader(false)

        // change layout
        if(this.specific_off_days_action_errors.length == 0) this.hideModal()
        if(this.specific_off_days_action_tmp.length == 0) this.specific_off_days_action_tmp = null
        this.specific_off_days = this.specific_off_days_action_tmp
      }
    },
    prepareDataForApi(dates){
      return {
        specific_off_days: convertDateToUTC(dates),
        shop_id: this.shop_data.shop_id
      }
    }
  }
}
</script>

<style lang='scss'>
@import './specific-off-days-opening-hour.scss';
</style>