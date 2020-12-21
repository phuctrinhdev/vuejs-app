<template>
  <div class="input-date-range">
    <label v-if="label">{{ $t('input-date-range.date-range') }}</label>
    <v-date-picker id="input-from-date"
                   v-model="result.value.from_date.text"
                   :popover="{ placement: 'bottom' }"
                   :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                   :input-props="{ placeholder: '' }"
                   class="date-picker from-date"
                   @input="onInputFromDate"/>
    
    <div class="between">~</div>
    
    <v-date-picker id="input-to-date"
                   v-model="result.value.to_date.text"
                   :popover="{ placement: 'bottom' }"
                   :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                   :input-props="{ placeholder: '' }"
                   class="date-picker to-date"
                   @input="onInputToDate"/>
  </div>
</template>

<script>
// Utils
import _                             from 'lodash'
import { setupCalendar, DatePicker } from 'v-calendar'
import { 
  convertDateToTimeStamp,
  convertDateFromLocalToTimezone   } from '../../../../../helpers/common.js'

// Components
import component_base                from '../../../component-base/component-base.vue'

const FIRST_DAY_OF_WEEK           = 2
const FIRST_DAY_OF_MONTH          = 1
export default {
  components : {
    'v-date-picker' : DatePicker
  },
  extends : component_base,
  props : {
    label : {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      result : {
        value  : {
          from_date : {},
          to_date   : {}
        }
      },
      errors : []
    }
  },
  computed: {
    end_date_can_not_before_start_date(){
      return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')
    },
  },
  created(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: FIRST_DAY_OF_WEEK,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db',
    })

    this.setDefaultDateTime()
  },
  mounted() {
    this.$emit('mounted')
  },
  methods:{
    setDefaultDateTime(original_event){
      let date_local = new Date()
      let date_zone  = convertDateFromLocalToTimezone(date_local) // YYYY-MM-DD of zone.
      let to_date_ts = convertDateToTimeStamp(_.clone(date_zone).setDate(date_zone.getDate() + 1)) - 1 // Get Timestamp of current ( date + 1)
      let first_date_of_month = new Date(date_zone.getFullYear(),date_zone.getMonth(),FIRST_DAY_OF_MONTH) // (YYYY-1)-MM-01 of zone 
      
      this.result.value.from_date = { text : first_date_of_month, value : convertDateToTimeStamp(first_date_of_month)}
      this.result.value.to_date   = { text : date_zone,           value : to_date_ts}
      this.emitEvent(original_event)
    },
    // input
    onInputFromDate(date){
      if(date == null)
        this.setDefaultDateTime('input-default-from-date')
      else{
        this.result.value.from_date.value = convertDateToTimeStamp(date)
        this.emitEvent('input-from-date')
      }
    },
    onInputToDate(date){
      if(date == null)
        this.setDefaultDateTime('input-default-to-date')
      else{
        this.result.value.to_date.value = this.getTimestampAtTheEndDate(_.cloneDeep(date))
        this.emitEvent('input-to-date')
      }
    },
    getTimestampAtTheEndDate(date){
      return convertDateToTimeStamp(date.setDate(date.getDate() + 1)) - 1
    },

    // emit event
    emitEvent(original_event){
      this.errors = []
      if(this.result.value.from_date.value > this.result.value.to_date.value){
        this.errors = [this.end_date_can_not_before_start_date]
      }
      const emit_data =  _.cloneDeep(this.result)
      this.$emit('input', emit_data)
      if (original_event) {
        this.$emit(original_event, emit_data)
      }
    }
  }
}
</script>

<style lang="scss">
@import './input-date-range.scss';
</style>