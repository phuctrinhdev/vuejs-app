<template>
  <div class="list-days-component">
    <div class="title">{{ $t('general.dates') }}</div>
    <ul class="list-days-box-wrapper">
      <li v-for="day in list" :key="day.id" :class="{ selected: day.selected, past: day.past, fixed: day.is_fixed_date }" 
          @click="onSelectOffDays(day)">
        <span v-if="type == 'repeated_off_days'">{{ $t(day.date) }} ({{ $t(day.name) }})</span>
        <span v-else>{{ day.date }} ({{ $t(day.name) }})</span>
      </li>
    </ul>

    <ul class="action-wrapper">
      <li class="btn btn-white" @click="onDeleteOffDays('selected')">{{ $t('general.delete') }}</li>
      <li class="btn btn-white" @click="onDeleteOffDays('all')">{{ $t('general.delete-all') }}</li>
    </ul>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'

export default {
  props: {
    data: {
      type: Object,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    type:  {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options,
      
      // off days
      calendar_off_days: [], 

      // alert
      alerts: []
    }
  },
  computed: {
    off_days(){
      return this.data
    },
    parent_object(){
      return this.data
    },
  },
  methods: { 
    onSelectOffDays(day){
      if(this.type == 'repeated_off_days' || this.type == 'list_off_days'){
        for(let off_day in this.off_days.fields[this.type]){
          if(day.id == this.off_days.fields[this.type][off_day].id && !day.is_fixed_date) {
            this.off_days.fields[this.type][off_day].selected = !this.off_days.fields[this.type][off_day].selected 
            this.$forceUpdate()
            break
          }
        }
      }
      else {
        for(let i in this.parent_object.repeat_dates_view){
          if(day.id == this.parent_object.repeat_dates_view[i].id && !day.is_fixed_date){
            this.parent_object.repeat_dates_view[i].selected = !this.parent_object.repeat_dates_view[i].selected 
            this.$forceUpdate()
            break
          }
        }
      }
      this.$emit('change-dates')
    },
    onDeleteOffDays(type){
      if(this.type == 'repeated_off_days' || this.type == 'list_off_days'){
        let list_off_days = this.off_days.fields[this.type]

        let i = list_off_days.length
        while (i--) {
          if((list_off_days[i].selected || type == 'all') && !list_off_days[i].is_fixed_date) { 
            list_off_days.splice(i, 1)
            if(this.type != 'repeated_off_days') {
              this.off_days.fields.specific_off_days.splice(i, 1)
              this.off_days.fields.calendar_off_days.splice(i, 1)
            }
          }
        }
        this.$forceUpdate()
      }
      else {
        let list_dates = this.parent_object.repeat_dates_view

        let i = list_dates.length
        while (i--) {
          if((list_dates[i].selected || type == 'all') && !list_dates[i].is_fixed_date) {
            list_dates.splice(i, 1)
          }
        }
      }
      this.$emit('change-dates')
    }
  }
}
</script>

<style lang='scss'>
@import './list-off-days.scss';
</style>