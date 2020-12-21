<template>
  <multiselect ref="multiselect" 
               v-model="staffs" :options="staff_list" :multiple="true"
               :searchable="false" :close-on-select="false" :clear-on-select="false" 
               :show-labels="false" :preserve-search="true" :disabled="disabled"
               :placeholder="text_select_staffs" 
               label="aliasname" track-by="id" 
               class="multi-checkbox select-multi-staffs" 
               @input="onInput($event)"
               @mouseleave.native="onMouseleave">
    <template slot="selection" slot-scope="{ values }">
      <span v-if="values.length > 2" class="selected">{{ values.length }} {{ $t('general.selected') }}</span>
      <span v-else class="selected">
        <span v-for="item in values" :key="item.index">{{ item.aliasname }}</span>
      </span>
    </template>
  </multiselect>
</template>

<script>
// import _ from 'lodash'
import { options } from '../../../../../helpers/options'
import multiselect from 'vue-multiselect'

export default {
  components: {
    multiselect
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    staff_options: {
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
    staffs: {
      set(staffs){
        this.set = staffs
      },
      get(){
        return this.value
      }
    },
    staff_list(){
      let first_option = { id: 0, aliasname: this.text_select_staffs, $isDisabled: true }
      if(this.staff_options.length == 0)
        first_option.aliasname = this.text_empty_selection
      return [first_option, ...this.staff_options]
    },
    text_select_staffs(){return this.$i18n.t('staff-goal.select-staffs')},
    text_empty_selection(){return this.$i18n.t('staff-goal.empty-selection')},
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

<style lang="scss">
.multiselect.select-multi-staffs{
  .multiselect__tags{
    .selected {
      color: $gray-dark !important;
    }
  }
}
</style>