<template>
  <div>
    <goods-table ref="goods_table"
                 :data="table_data" @change-page="onChangePage" @drag-end="onDragEnd">
      <!-- action at top table -->
      <template slot="table-actions">
        <div class="setup-top no-line clearfix">
          <div class="title-wrapper">
            <h3 class="category-name">&gt; {{ category.name }}</h3>
          </div>
          <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
          <ul class="btn-group clearfix">
            <li><goods-btn v-if="show_add_button" :data="{ label: 'services.service-add' }" class="btn-large"
                           @click-action="onActionService(options.form_actions.add)"/></li>
          </ul>
        </div>
      </template>
      <!-- table rows -->
      <template slot="price" slot-scope="{ row }">
        {{ $n(row.price) }}
      </template>
      <template slot="edit" slot-scope="{ row }">
        <goods-btn v-if="row.related_service_id == undefined"
                   :data="{ label: 'general.edit', item: row }" @click-action="onActionService(options.form_actions.edit, row)"/>
        <goods-btn v-else :data="{ label: 'general.edit', item: row }"
                   @click-action="onActionPrepaidService(options.form_actions.edit, row)"/>
      </template>
      <template slot="prepaid" slot-scope="{ row }">
        <goods-btn v-if="row.related_service_id == undefined && show_add_button"
                   :data="{ label: 'general.add', item: row }" @click-action="onActionPrepaidService(options.form_actions.add, row)"/>
      </template>
    </goods-table>

    <!-- modal action -->
    <service-action @reload-page="onReloadPage" @update-page="onUpdatePageService"/>
    <prepaid-service-action @reload-page="onReloadPage" @update-page-prepaid="onUpdatePagePrepaid"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { options }              from '../../../../helpers/options'
import { checkDragOptionService, showGoodsAddButton, checkShowGoodsSharedCol }      from '../../../../config/permission'
import ServiceApi               from '../../../../api/goods/service-api.js'
import PrepaidServiceApi        from '../../../../api/goods/prepaid-service-api.js'

import component_base           from '../../../common/component-base/component-base'
import show_inactives           from '../../../common/show-inactives/show-inactives.vue'
import goods_table              from '../../goods-table/goods-table.vue'
import goods_btn                from '../../goods-btn/goods-btn.vue'

import service_action           from '../service-action/service-action.vue'
import prepaid_service_action   from '../prepaid-service-action/prepaid-service-action.vue'

export default {
  components: { 
    'service-action': service_action,
    'prepaid-service-action': prepaid_service_action,
    'show-inactives': show_inactives,
    'goods-table': goods_table,
    'goods-btn': goods_btn
  },
  extends: component_base,
  data() {
    return {
      options,
      // table
      table_data: {
        fields: [
          { field: 'shared_service', label: 'services.shared',  width: '5%', sortable: false,  thClass: this.showShareCol, tdClass: this.showShareCol, formatFn: this.formatTrueFalseCol  },
          { field: 'name',    label: 'services.services',         width: '60%', sortable: false, tdClass: 'col-name' },
          { field: 'price',   label: 'services.price',            width: '20%', sortable: false, expand: true },
          { field: 'edit',    label: 'general.edit',              width: '10%', sortable: false, expand: true },
          { field: 'prepaid', label: 'services.prepaid-services', width: '10%', sortable: false, expand: true }
        ],
        rows:[],
        groups: [
          { name: 'service-shared', rows: [] },
          { name: 'service-unshared', rows: [] },
          { name: 'prepaid-service-shared', rows: [] },
          { name: 'prepaid-service-unshared', rows: [] }
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
        category: 0,
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },
      service_action:{},
      prepaid_service_action:{},
      category: { 
        name:''
      },
      show_add_button: true
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser',
    }),
    ...mapGetters('service', {
      service_data: 'getService'
    }),
  },
  created() {
    this.table_data.options.drag = checkDragOptionService()

    this.$parent.$on('loadListService', this.loadPageHasCategory)
  },
  methods: {
    ...mapActions('service', [
      'getServicesDataAsync',
      'updateServiceData',
      'setServiceActionData'
    ]), 
    ...mapActions('prepaid_service', [
      'setPrepaidServiceActionData'
    ]),
    showShareCol(){
      let class_name = 'hide'
      if(checkShowGoodsSharedCol(options.sharing_goods_type.service)) class_name = 'show-shared'
      return class_name
    },
    formatTrueFalseCol(shared){
      return shared == true? 'O' : 'X'
    },
    loadPageHasCategory(category){
      this.category=category 
      this.table_filter.category=category.id
      this.show_add_button = showGoodsAddButton(options.sharing_goods_type.service)
      this.loadDataTable(this.table_filter)
    },
    // loadPage(){ 
    //   this.loadDataTable(this.table_filter)
    // },
    // table
    async loadDataTable() {
      if(this.$refs.goods_table) this.$refs.goods_table.table_render_number = 0
      this.preLoader()
      this.table_filter = Object.assign(this.table_filter, this.shop_data) 
      await this.getServicesDataAsync(this.table_filter)
      
      if(this.service_data.is_ok){
        this.table_data.rows = this.service_data.data.items
        this.table_data.pagination = this.service_data.data.pagination  
      }
      else this.showAlert(this.service_data.error_messages)
      // group data for table UI
      for(let group in this.table_data.groups){
        this.table_data.groups[group].rows = []
      }
      for(let key in this.table_data.rows){
        // category shared then service/prepaid shared
        if(this.category && this.category.shared) this.table_data.rows[key].shared = true
        if(this.table_data.rows[key].related_service_id == undefined && this.table_data.rows[key].shared_service) this.table_data.groups[0].rows.push(this.table_data.rows[key])
        if(this.table_data.rows[key].related_service_id == undefined && !this.table_data.rows[key].shared_service) this.table_data.groups[1].rows.push(this.table_data.rows[key])
        if(this.table_data.rows[key].related_service_id != undefined && this.table_data.rows[key].shared_service) this.table_data.groups[2].rows.push(this.table_data.rows[key])
        if(this.table_data.rows[key].related_service_id != undefined && !this.table_data.rows[key].shared_service) this.table_data.groups[3].rows.push(this.table_data.rows[key])
        this.table_data.options.drag = checkDragOptionService()
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
    onActionPrepaidService(action, prepaid_service = {}){ 
      this.prepaid_service_action = {
        action: action,
        data: prepaid_service
      }
      this.setPrepaidServiceActionData(this.prepaid_service_action)
      this.showDialogById('prepaid-service-action-modal')
    },
    // modal action
    onActionService(action, service = {}){
      this.service_action = {
        action: action,
        data: service,
        category: this.category
      }
      this.setServiceActionData(this.service_action)
      this.showDialogById('service-action-modal')
    }, 
    // event success
    onReloadPage(){ 
      //this.loadPage()
      this.loadDataTable(this.table_filter)
    },
    onUpdatePageService(service){ 
      if(this.service_action.data.category != service.category || this.service_action.data.status != service.status) {
        this.table_filter.category=this.service_action.data.category
        this.loadDataTable(this.table_filter) 
      }
      else{ 
        this.updateServiceData(service)
      }
    },
    onUpdatePagePrepaid(prepaid_service){
      if(this.prepaid_service_action.data.service_category_id != prepaid_service.service_category_id 
      || this.prepaid_service_action.data.status != prepaid_service.status) {
        this.table_filter.category=this.prepaid_service_action.data.service_category_id
        this.loadDataTable(this.table_filter) 
      }
      else{
        this.updateServiceData(prepaid_service)
      }
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
      if(drag_data[0].related_service_id == undefined) {
        let service_api = new ServiceApi()
        result = await service_api.updateServiceOrderNoAsync(drag_change)
      }
      else {
        let prepaid_service_api = new PrepaidServiceApi()
        result = await prepaid_service_api.updatePrepaidServiceOrderNoAsync(drag_change)
      }
      this.preLoader(false)
      
      if(!result.is_ok) this.showAlert(result.error_messages)
      else this.loadDataTable()
    },
  }
}
</script>

<style lang="scss">
@import './service-list.scss';
</style>