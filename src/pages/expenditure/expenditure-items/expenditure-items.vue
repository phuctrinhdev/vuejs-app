<template>
  <main class="app-content">
    <section class="content expenditure-items-page">
      <div class="page-title">
        <h3>{{ $t('expenditure.expenditure-items') }}</h3>
        <ul class="group-btn">
          <li class="btn" @click="onActionExpenditureItem(common_options.form_actions.add)">{{ $t('expenditure.add-item') }}</li>
        </ul>
      </div>
      
      <div id="table-expenditure-items" class="table-expenditure-items">
        <goods-table :data="table_data" @drag-end="onDragEnd">
          <template slot="table-actions">
            <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
          </template>
          <template slot="edit" slot-scope="{row}">
            <a class="btn" @click="onActionExpenditureItem(common_options.form_actions.edit, row)">{{ $t('general.edit') }}</a>
          </template>
        </goods-table>
      </div>
    </section>

    <expenditure-item-action @added="onAddedExpenditureItem" @edited="onEditedExpenditureItem"/>
  </main>
</template>

<script>
import { mapMutations, mapGetters }  from 'vuex'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import component_base                from '../../../components/common/component-base/component-base'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'
import goods_table                   from '../../../components/goods/goods-table/goods-table'
import show_inactives                from '../../../components/common/show-inactives/show-inactives'
import ExpenditureItemApi            from '../../../api/expenditure/expenditure-items-api'
import expenditure_item_action       from '../../../components/expenditure/expenditure-item-action/expenditure-item-action.vue'
import ExpenditureItemViewModel      from '../../../view-model/expenditure/expenditure-item-view-model'


export default {
  components: {
    'goods-table'     : goods_table,
    'show-inactives'  : show_inactives,
    'expenditure-item-action': expenditure_item_action,
    'error-box'       : error_box,
    'btn-action-group': btn_action_group
  },
  extends : component_base,
  data(){
    return {
      options,
      common_options,
      
      // form
      form_options : {},
      errors       : [],

      expenditure_item_api: new ExpenditureItemApi(),
      expenditure_item: new ExpenditureItemViewModel(),
      
      table_data   : {
        fields : [
          {field: 'item_name',     label: 'expenditure.item-name',           width: '80%',   sortable: false },
          {field: 'edit',          label: 'general.edit',                    width: '20%',   sortable: false, expand: true}
        ],
        rows   : [],
        groups: [
          { name: 'expenditure-items', rows: [] }
        ],
        pagination : { total_pages: 1 },
        options : { 
          pagination: false,
          drag: options.good_table_drag.off
        }
      },
      table_filter : {
        status       : common_options.good_status.active,
        shop_id      : 0
      }
    }
  },
  computed:{
    ...mapGetters('expenditure_item',{
      x_expenditure_items       : 'getExpenditureItems',
      x_expenditure_item_action : 'getExpenditureItemAction'
    }),
  },
  async created(){
    // set drag options base user role
    this.table_data.options.drag = options.good_table_drag.all

    // load table data
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadTableDataAsync()
  },
  methods:{
    ...mapMutations('expenditure_item',[
      'setExpenditureItems',
      'setExpenditureItemAction'
    ]),
    // table
    async loadTableDataAsync(){
      this.preLoader()
      let response = await this.expenditure_item_api.getExpenditureItemsAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.setExpenditureItems(response.data)
        this.table_data.rows = this.x_expenditure_items

        // group data for drag-table
        this.table_data.groups[0].rows = this.table_data.rows
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onShowInactives(status){
      this.table_filter.status = status
      this.loadTableDataAsync()
    },

    // action
    onActionExpenditureItem(action, expenditure = new ExpenditureItemViewModel().fields){
      let expenditure_action = {
        action: action,
        data: expenditure
      }
      this.setExpenditureItemAction(expenditure_action)
      this.showDialogById('expenditure-item-action-modal')
    },
    onAddedExpenditureItem(){
      this.loadTableDataAsync()
    },
    onEditedExpenditureItem(){
      this.loadTableDataAsync()
    },

    // draggable
    async onDragEnd(drag_data, e){
      let drag_change = {
        shop_id: this.shop_data.shop_id,
        old_position_id: drag_data[e.oldIndex].id,
        new_position_id: drag_data[e.newIndex].id
      }

      this.preLoader()
      let result = await this.expenditure_item_api.updateExpenditureItemOrderNoAsync(drag_change)
      this.preLoader(false)
      
      if(result.is_ok) {
        this.loadTableDataAsync()
      }
      else this.showAlertDialog(result.error_messages)
    },
  }
}
</script>

<style lang="scss">
@import './expenditure-items.scss';
</style>
