<template>
  <multiselect ref="multiselect" 
               v-model="selected_weeks" :options="week_of_month_options" :multiple="true"
               :searchable="false" :close-on-select="false" :clear-on-select="false" 
               :show-labels="false" :preserve-search="true" :disabled="disabled"
               label="name" track-by="value" placeholder="" 
               class="multi-checkbox" 
               @input="onInput($event)"
               @mouseleave.native="onMouseleave">
    <template slot="selection" slot-scope="{ values }">
      <span v-if="values.length > 3" class="selected">{{ values.length }} {{ $t('general.selected') }}</span>
      <span v-else class="selected">
        <span v-for="item in values" :key="item.index">{{ item.name }}</span>
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
    }
  },
  data(){
    return {
      options,

      set: []
    }
  },
  computed: {
    selected_weeks: {
      set(new_weeks){
        new_weeks = _.sortBy(new_weeks, ['value'])

        this.set = []
        for(let index in new_weeks){
          this.set.push(new_weeks[index].value)
        }
      },
      get(){
        let arr_weeks = []
        for(let index in this.value){
          arr_weeks.push(this.week_of_month_options.filter(week => this.value[index] == week.value)[0])
        }
        return arr_weeks
      }
    },
    week_of_month_options(){
      return [
        { name: this.$i18n.t('general.select-week'), $isDisabled: true,                             translate: 'general.first-week' },
        { name: this.$i18n.t('general.first-week'),  value: options.repeated_weeks_options.first,   translate: 'general.first-week' },
        { name: this.$i18n.t('general.second-week'), value: options.repeated_weeks_options.second,  translate: 'general.second-week' },
        { name: this.$i18n.t('general.third-week'),  value: options.repeated_weeks_options.third,   translate: 'general.third-week' },
        { name: this.$i18n.t('general.fourth-week'), value: options.repeated_weeks_options.fourth,  translate: 'general.fourth-week' }
      ]
    }
  },
  methods: {
    onInput(){
      this.$emit('input', this.set)
    },
    onMouseleave(){
      if(this.$refs.multiselect.isOpen) 
        this.$refs.multiselect.toggle()
    }
  }
}
</script>