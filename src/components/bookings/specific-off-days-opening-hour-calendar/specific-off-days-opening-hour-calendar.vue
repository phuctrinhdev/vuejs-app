<template>
  <div class="calendar-wrapper">
    {{ off_days }}
    <v-date-picker v-model="days"
                   :min-date="calendar_options.calendar_min_date"

                   :disabled-attribute="calendar_options.disabled_attribute"
                   :select-attribute="{ contentStyle: {} }"
                   :formats="{ title: 'MM-YYYY' }"
                   mode="multiple" is-inline
                   @input="onChangeCalendar"/>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'
import { setupCalendar, DatePicker} from 'v-calendar'


export default {
  components: {
    'v-date-picker': DatePicker
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    calendar_options: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      options,

      days: [],
    }
  },
  computed:{
    off_days: { 
      get(){
        this.loadDays(this.data)
        return ''
      }
    },
  },
  beforeMount(){ 
    this.preloadCalendar() 
  },
  methods: {
    loadDays(days){
      if(days == null) days = []
      this.days = days
    },
    preloadCalendar(){
      setupCalendar({
        locale: this.locale,
        firstDayOfWeek: 2,
        titleTransition: 'none',
        weeksTransition: 'none',
        datePickerTintColor: '#3499db'
      })
    },
    onChangeCalendar(days){
      if(days == null) days = []
      this.$emit('change-calendar', days)
    }
  }
}
</script>

<style lang='scss'>
@import './specific-off-days-opening-hour-calendar.scss';
</style>