<template>
  <div class="good-table-wrapper">
    <div class="good-table-content">
      <vue-good-table-custom v-for="(group, index) in table_data.groups" 
                             :ref="table_data.groups[index].name" 
                             :id="table_data.groups[index].name" :key="index"
                             :rows="table_data.groups[index].rows" :columns="table_data.fields" 
                             :row-style-class="rowStyleClassFn" :select-options="table_data.options.select_options" :fixed-header="true" 
                             :class="{'empty': table_data.groups[index].rows.length == 0}" 
                             max-height="550px" row-key="id" 
                             @on-selected-rows-change="onSelectRows">
        <!-- action at top table -->
        <template slot="table-actions">
          <slot name="table-actions"/>
        </template>
        <!-- columns -->
        <template slot="table-column" slot-scope="props">
          <span v-if="props.column.column_expand">
            <slot :name="props.column.field + '_col'" :column="props.column" :props="props"/>
          </span>
          <span v-else>
            {{ $t(props.column.label) }}
          </span>
        </template>
        <!-- rows -->
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.expand">
            <slot :name="props.column.field" :row="props.row" :props="props"/>
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
        <!-- action at bottom table -->
        <div slot="table-actions-bottom">
          <p v-if="table_data.options.drag" class="drag-guide">{{ $t('general.drag-guide') }}</p>
          <slot name="table-actions-bottom"/>
        </div>
        <!-- show in no rows -->
        <div slot="emptystate">{{ $t('general.table-empty') }}</div>
      </vue-good-table-custom>
    </div>
  
    <pagination v-if="table_data.options.pagination" :pagination.sync="table_data.pagination" @change-page="onChangePage"/>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'
import pagination from '../../common/pagination/pagination.vue'
import vue_good_table_custom from '../../common/vue-good-table-custom/components/Table.vue'
import component_base from '../../common/component-base/component-base'
import sortablejs from 'sortablejs'

export default {
  components: {
    pagination,
    'vue-good-table-custom': vue_good_table_custom
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
      // options
      options,

      drag_data: {},
      sortables: []
    }
  },
  computed: {
    table_data(){
      return this.data
    },
  },
  updated(){
    this.createSortTable()
  },
  methods: {
    // drag drop
    createSortTable(){
      // create sortablejs only once
      if(this.sortables.length > 0) return
      else {
        let drag_options = {
          delay: 400, // delay to drag start in milliseconds
          delayOnTouchOnly: true, // only delay on touch device (mobile, tablet, ipad)
          touchStartThreshold: 5,
          supportPointer: false,
          animation: 100,
          onEnd: this.onDragEnd
        }
        let disabled_drag_options = {
          disabled: true
        }
        // drag all
        if(this.table_data.options.drag == options.good_table_drag.all) {
          for(let group in this.table_data.groups){
            this.mapGroupDataToSortTable(group, drag_options)
          }
        }
        // drag unshared (odd number)
        else if(this.table_data.options.drag == options.good_table_drag.unshared){
          for(let group in this.table_data.groups){
            if(group % 2 == 1){
              this.mapGroupDataToSortTable(group, drag_options)
            }
            else if(group % 2 == 0)
            {
              this.mapGroupDataToSortTable(group, disabled_drag_options)
            } 
          }
        }
      }
    },
    mapGroupDataToSortTable(group, drag_options){
      if(this.table_data.groups[group].rows.length > 0){
        let drag_group = document.querySelector('#' + this.table_data.groups[group].name + ' tbody')
        let tmp_sortable = sortablejs.create(drag_group, drag_options)
        this.sortables.push(tmp_sortable)
      }
    },
    onDragEnd(e){
      if(e.newIndex != e.oldIndex){
        let good_table_id = this.getGoodGroupNameByParentClass(e.srcElement, 'vgt-wrap')
        for(let group in this.table_data.groups){
          if(this.table_data.groups[group].name == good_table_id) this.drag_data = this.table_data.groups[group].rows
        }
        this.$emit('drag-end', this.drag_data, e)
      }
    },
    getGoodGroupNameByParentClass(src_element, parent_class){
      let group_name = ''
      for(let i = 0; i <= 10 ; i++){
        if(src_element.className.indexOf(parent_class) > -1){
          group_name = src_element.id
          break
        }
        src_element = src_element.parentElement
      }
      return group_name
    },

    // other ui
    rowStyleClassFn(row){
      let row_classes = ''
      if(row.status == options.good_status.inactive) row_classes += ' inactive'
      if(row.selected) row_classes += ' selected'
      return row_classes
    },
    onSelectRows(params) {
      this.$emit('select-rows', params.selectedRows)
    },
    onChangePage(page_num){
      this.$emit('change-page', page_num)
    },
  }
}
</script>

<style lang="scss">
@import './goods-table.scss';
</style>