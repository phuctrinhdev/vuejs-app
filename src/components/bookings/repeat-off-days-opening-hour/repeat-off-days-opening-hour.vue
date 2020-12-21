<template>
  <div class="repeat-off-days-short booking-table">
    <button class="btn btn-white btn-large" @click="onActionRepeatOffDays">{{ $t('general.edit') }}</button>
    <view-table :data="table_data"/>

    <repeat-off-days-action :data="action_data" :action_errors="action_errors"
                            @load-action-modal="onLoadActionModal" @submit-action-modal="onSubmitActionModal"/>
  </div>
</template>

<script>
import { options }              from '../../../helpers/options'
import RepeatOffDaysApi         from '../../../api/bookings/repeat-off-days-api.js'
import view_table               from '../../common/view-table/view-table'
import repeat_off_days_action   from '../repeat-off-days-action/repeat-off-days-action'
import { loadWeekOfMonth, loadDayOfWeek, cache_session } from '../../../helpers/common'
import component_base           from '../../common/component-base/component-base'

export default {
  components: {
    'view-table': view_table,
    'repeat-off-days-action': repeat_off_days_action
  },
  extends: component_base,
  props: {
    data: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      options,

      action_data: {},
      action_errors: [],
    }
  },
  computed: {
    table_data(){
      return {
        fields: [
          { field: 'repeated_weeks',        label: 'general.week',                      width: '50%', sortable: false, formatFn: this.formatWeekOfMonthCol },
          { field: 'repeated_days_of_week', label: 'booking-opening-hours.day-of-week', width: '50%', sortable: false, formatFn: this.formatDayOfWeekCol }
        ],
        rows:[ this.data.fields ],
        pagination:{
          total_pages: 1
        },
        options: {}
      }
    }
  },
  methods: {
    formatWeekOfMonthCol(weeks){
      let weeks_text = ''
      if(this.table_data.rows[0].repeat_type == options.repeat_type.none) weeks_text = '-'
      if(this.table_data.rows[0].repeat_type == options.repeat_type.every_week) weeks_text = this.$i18n.t('booking-opening-hours.every-week')
      else if(this.table_data.rows[0].repeat_type == options.repeat_type.monthly) weeks_text = loadWeekOfMonth(weeks)

      return weeks_text
    },
    formatDayOfWeekCol(days){
      let days_text = ''
      if(this.table_data.rows[0].repeat_type == options.repeat_type.none) days_text = '-'
      else days_text = loadDayOfWeek(days)
      
      return days_text
    },

    // action modal
    onActionRepeatOffDays(){
      this.showDialogById('repeat-off-days-action-modal')
    },
    onLoadActionModal(){
      this.action_data = Object.assign({}, this.table_data.rows[0])
      this.action_errors = []
    },
    async onSubmitActionModal(data){
      // data = Object.assign(data, this.shop_data)
      this.preLoader()
      let repeat_off_days_api = new RepeatOffDaysApi()
      let data_add = {}
      let result = {}

      if(data.shop_id == 0){
        data_add = Object.assign(data, this.shop_data)
        result = await repeat_off_days_api.addRepeatOffDaysAsync(data_add)
      }
      else {
        result = await repeat_off_days_api.updateRepeatOffDaysAsync(data)
      }
      this.preLoader(false)

      // hide modal or view errors
      if(result.is_ok) {
        this.hideDialogById('repeat-off-days-action-modal')
        cache_session.clearSessionBookingSetup()
      }
      else this.action_errors = result.error_messages

      // change layout
      this.table_data.rows[0].repeat_type           = data.repeat_type
      this.table_data.rows[0].repeated_days_of_week = data.repeated_days_of_week
      this.table_data.rows[0].repeated_weeks        = data.repeated_weeks
    }
  }
}
</script>

<style lang='scss'>
@import './repeat-off-days-opening-hour.scss';
</style>