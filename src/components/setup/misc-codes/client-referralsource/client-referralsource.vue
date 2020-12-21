<template>
  <div class="common-style">
    <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
    <ul class="card-btn btn-group clearfix">      
      <li><goods-btn :data="{ label: 'misc-codes.add' }" @click-action="onAction(options.form_actions.add)"/></li>
    </ul>
    <goods-table :data="table_data" @change-page="onChangePage" @drag-end="onDragEnd">      
      <!-- table rows -->
      <template slot="edit" slot-scope="{ row }">
        <goods-btn :data="{ label: 'misc-codes.edit', item: row }" 
                   @click-action="onAction(options.form_actions.edit, row)"/>
      </template>
    </goods-table>
    <!-- modal action -->
    <client-referralsource-action @reload-page="reloadPage" @update-page="updatePage"/>
  </div>
</template> 
<script>
import client_referralsource_action from './client-referralsource-action.vue'
import ClientReferralSourceApi      from '../../../../api/clients/client-referralsource-api.js'

import { mapGetters, mapActions } from 'vuex'
import { options }    from '../../../../helpers/options'
import show_inactives from '../../../common/show-inactives/show-inactives.vue'
import goods_table    from '../../../goods/goods-table/goods-table.vue'
import goods_btn      from '../../../goods/goods-btn/goods-btn.vue'
import component_base    from '../../../common/component-base/component-base'
import ClientsCache from '../../../../helpers/cache/clients-cache'

export default {
  components: { 
    'client-referralsource-action': client_referralsource_action,    
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
          { field: 'name',    label: 'misc-codes.client-referralsource',    width: '80%', sortable: false,
            thClass:'col-misc-code'},
          { field: 'edit',    label: 'misc-codes.edit',                     width: '20%', sortable: false, expand: true,
            thClass:'col-misc-code'}
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
      client_referralsource_action:{}
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
    ...mapGetters('client_referralsource', {
      client_referralsource_data: 'getClientReferralSource'
    }),
  },
  created () {
    // set drag options base user role    
    this.table_data.options.drag = options.good_table_drag.all
    this.loadPage()
  },
  methods: {
    ...mapActions('client_referralsource', [
      'getClientReferralSourceDataAsync',
      'updateClientReferralSourceData',
      'setClientReferralSourceActionData'
    ]), 
    loadPage(){ 
      this.loadDataTable(this.table_filter)
    },
    // table
    async loadDataTable() {  
      this.preLoader()
      this.table_filter = Object.assign(this.table_filter, this.shop_data) 
      await this.getClientReferralSourceDataAsync(this.table_filter)

      if(this.client_referralsource_data.is_ok){
        this.table_data.rows = this.client_referralsource_data.data.items
        this.table_data.pagination = this.client_referralsource_data.data.pagination  
      }
      else this.showAlert(this.client_referralsource_data.error_messages)

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
      this.client_referralsource_action = {
        action: action,
        data: data,
      }      
      this.setClientReferralSourceActionData(this.client_referralsource_action)
      this.showDialogById('client-referralsource-action-modal')
    }, 
    // event success
    reloadPage(){ 
      this.loadPage()
    },
    updatePage(clientGroup){
      if(this.client_referralsource_action.data.status != clientGroup.status) this.loadPage()
      else this.updateClientReferralSourceData(clientGroup)
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
      let _api = new ClientReferralSourceApi()
      result = await _api.updateClientReferralSourceOrderNoAsync(drag_change)      
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