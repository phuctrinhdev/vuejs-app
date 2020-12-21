<template>
  <multiselect ref="multiselect" 
               v-model="selected_days" :options="day_of_week_options" :multiple="true"
               :searchable="false" :close-on-select="false" :clear-on-select="false" 
               :show-labels="false" :preserve-search="true" :disabled="disabled"
               label="name" track-by="value" placeholder="" 
               class="multi-checkbox select-day-of-week" 
               @input="onInput($event)"
               @mouseleave.native="onMouseleave">
    <template slot="selection" slot-scope="{ values }">
      <span v-if="values.length > 3" class="selected">{{ values.length }} {{ $t('general.selected') }}</span>
      <span v-else class="selected">
        <span v-for="item in values" :key="item.index">
          {{ item.name }}
        </span>
      </span>
    </template>
  </multiselect>
</template>

<script>
import { options } from '../../../../../helpers/options'
import multiselect from 'vue-multiselect'
import _ from 'lodash'

export default {
  components: {
    multiselect
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fixed_days: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      options,

      set: []
    }
  },
  computed: {
    selected_days: {
      set(new_days){
        // arrange days
        new_days = _.sortBy(new_days, ['value'])
        if(new_days.length > 0 && new_days[0].value == 0){
          new_days = new_days.concat(new_days[0])
          new_days.splice(0, 1)
        }

        // set days
        this.set = []
        for(let day in new_days){
          this.set.push(new_days[day].value)
        }
      },
      get(){
        let arr_days = []
        for(let index in this.value){
          arr_days.push(this.day_of_week_options.filter(day => this.value[index] == day.value)[0])
        }
        return arr_days
      }
    },
    day_of_week_options(){
      let day_options = [
        { name: this.$i18n.t('general.select-day-of-week'), $isDisabled: true },
        { name: this.$i18n.t('general.monday'),     value: options.days_of_week.monday },
        { name: this.$i18n.t('general.tuesday'),    value: options.days_of_week.tuesday },
        { name: this.$i18n.t('general.wednesday'),  value: options.days_of_week.wednesday },
        { name: this.$i18n.t('general.thursday'),   value: options.days_of_week.thursday },
        { name: this.$i18n.t('general.friday'),     value: options.days_of_week.friday },
        { name: this.$i18n.t('general.saturday'),   value: options.days_of_week.saturday },
        { name: this.$i18n.t('general.sunday'),     value: options.days_of_week.sunday }
      ]
      for(let i in day_options){
        if(i != 0){
          let day_option = day_options[i]
          if(this.fixed_days.includes(day_option.value)) day_option.$isDisabled = true
          else day_option.$isDisabled = false
        }
      }
      return day_options
    }
  },
  methods: {
    onInput(){
      this.$emit('input', this.set)
    },
    onChange(){
      this.$emit('change', this.set)
    },
    onMouseleave(){
      if(this.$refs.multiselect.isOpen) 
        this.$refs.multiselect.toggle()
    }
  }
}
</script>

<style lang="scss">
.multiselect.multi-checkbox.select-day-of-week .multiselect__content {
  .multiselect__element {
    &:first-child {
      .multiselect__option.multiselect__option--disabled{
        background: transparent !important;
        span:before{
          display: none;
        }
      } 
    }
    .multiselect__option.multiselect__option--disabled{
      background: $gray-lighten !important;
      span:before{
        display: block;
        content: "\2714";
        position: absolute;
        top: 4px;
        left: 10px;
      }
    }
  }
}
</style>