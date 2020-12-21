<template>
  <div class="common-style">
    <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
    <ul class="card-btn btn-group clearfix">      
      <li><goods-btn :data="{ label: 'misc-codes.add' }" @click-action="onAction(options.form_actions.add)"/></li>
    </ul> 
    <goods-table :data="table_data"
                 @change-page="onChangePage" @drag-end="onDragEnd">
      <!-- action at top table -->      
      <!-- table columns -->
      <template slot="edit" slot-scope="{ row }">
        <goods-btn :data="{ label: 'misc-codes.edit', item: row }" 
                   @click-action="onAction(options.form_actions.edit, row)"/>
      </template>
    </goods-table>
    <!-- modal action -->
    <client-rating-action @reload-page="reloadPage" @update-page="updatePage"/>
    <client-rating-discount-hint-action v-if="onHelper"/>
  </div>
</template> 
<script>
import client_rating_action from './client-rating-action.vue'
import client_rating_discount_hint_action from './client-rating-discount-hint-action.vue'
import ClientRatingApi      from '../../../../api/clients/client-rating-api.js'

import { mapGetters, mapActions } from 'vuex'
import { options }      from '../../../../helpers/options'
import show_inactives   from '../../../common/show-inactives/show-inactives.vue'
import goods_table      from '../../../goods/goods-table/goods-table.vue'
import goods_btn        from '../../../goods/goods-btn/goods-btn.vue'
import component_base    from '../../../common/component-base/component-base'
import ClientsCache from '../../../../helpers/cache/clients-cache'

export default {
  components: { 
    'client-rating-action': client_rating_action,  
    'client-rating-discount-hint-action': client_rating_discount_hint_action,
    'show-inactives': show_inactives,
    'goods-table': goods_table,
    'goods-btn': goods_btn
  },
  extends: component_base,
  data() {
    return {
      options:options,
      
      // table
      table_data: {
        fields: [
          { field: 'name',      label: 'misc-codes.client-rating',  width: '80%', sortable: false, thClass:'col-misc-code'},
          { field: 'edit',      label: 'misc-codes.edit',           width: '20%', sortable: false, thClass:'col-misc-code', expand: true }
        ],
        rows:[],
        groups: [
          { name: 'group1', rows: [] }
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: options.good_table_drag.off,
          pagination: true
        },
      }, 
      
      table_filter: {        
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },
      client_rating_action:{},      
      loaded:false,
      onHelper:false,
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
    ...mapGetters('client_rating', {
      client_rating_data: 'getClientRating'
    }),
  },
  created() {
    // set drag options base user role    
    this.table_data.options.drag = options.good_table_drag.all    
    this.loadPage()
  },
  methods: {
    ...mapActions('client_rating', [
      'getClientRatingDataAsync',
      'updateClientRatingData',
      'setClientRatingActionData'
    ]), 
    loadPage(){ 
      this.loadDataTable(this.table_filter)      
    },
    // table
    async loadDataTable() {  
      this.preLoader()
      this.table_filter = Object.assign(this.table_filter, this.shop_data) 
      await this.getClientRatingDataAsync(this.table_filter)

      if(this.client_rating_data.is_ok){
        this.table_data.rows = this.client_rating_data.data.items
        this.table_data.pagination = this.client_rating_data.data.pagination  
      }
      else this.showAlert(this.client_rating_data.error_messages)

      // group data for table UI
      for(let group in this.table_data.groups){
        this.table_data.groups[group].rows = []
      }
      for(let key in this.table_data.rows){
        this.table_data.groups[0].rows.push(this.table_data.rows[key])
      }      
      this.preLoader(false)
    },
    onShowInactives(){
      this.table_filter.page_number = 1 
      this.loadDataTable(this.table_filter)
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadDataTable(this.table_filter)
    }, 

    // modal action
    onAction(action, data = {}){
      this.client_rating_action = {
        action: action,
        data: data,
      }      
      this.setClientRatingActionData(this.client_rating_action)
      this.showDialogById('client-rating-action-modal')
    }, 
    // event success
    reloadPage(){ 
      this.loadPage()
    },
    updatePage(clientGroup){
      if(this.client_rating_action.data.status != clientGroup.status) this.loadPage()
      else this.updateClientRatingData(clientGroup)
    },
    // draggable
    async onDragEnd(drag_data, e){
      let drag_change = {
        shop_id: this.shop_data.shop_id,
        old_position_id: drag_data[e.oldIndex].id,
        new_position_id: drag_data[e.newIndex].id
      }

      this.preLoader()
      let result = {}
      let _api = new ClientRatingApi()
      result = await _api.updateClientRatingOrderNoAsync(drag_change)      
      this.preLoader(false)
      
      if(!result.is_ok) this.showAlert(result.error_messages)
      else
      {
        ClientsCache.clearAllClientsSetupCache()
        this.loadDataTable()
      }
    },
  }
}
</script>
<style lang="scss">
@import '../add-item.scss';
</style>