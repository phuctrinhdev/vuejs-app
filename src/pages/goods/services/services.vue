<template>
  <main class="app-content">
    <section class="services-page content">
      <div class="inner"> 
        <article class="setup-top clearfix">
          <h3>{{ $t('services.services') }}</h3> 
        </article>
        <div class="row table-custom">
          <div class="col-12"> 
            <!-- table data -->
            <div class="table-data form-wrapper row">  
              <div class="col-12 col-lg-6 table-left">
                <goods-table :data="table_data" @change-page="onChangePage" @drag-end="onDragEnd">
                  <!-- action at top table -->
                  <template slot="table-actions">
                    <div class="setup-top no-line clearfix">
                      <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
                      <ul class="btn-group clearfix">
                        <li><goods-btn v-if="show_add_button" :data="{ label: 'services.service-category-add' }" class="btn-large"
                                       @click-action="onActionServiceCategory(options.form_actions.add)"/></li>
                      </ul>
                    </div>
                  </template>
                  <!-- table rows -->
                  <template slot="edit" slot-scope="{ row }">
                    <goods-btn :data="{ label: 'general.edit', item: row }"
                               @click-action="onActionServiceCategory(options.form_actions.edit, row)"/>
                  </template>
                  <template slot="view" slot-scope="{ row }">
                    <goods-btn :data="{ label: 'general.view-arrow' }" @click-action="onLoadService(row)"/>
                  </template>
                </goods-table>
              </div>
              <div class="col-12 col-lg-6 table-right">  
                <service-list ref="service_list" :class="{ 'hide': is_hide_list_service }"/>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </section>  
    <!-- modal action -->
    <service-category-action @reload-page="onReloadPage" @update-page="onUpdatePage"/>
  </main>
</template>

<script>
// api
import ServiceCategoryApi from '../../../api/goods/service-category-api.js'

// group components
import service_category_action from '../../../components/goods/services/service-category-action/service-category-action.vue' 
import service_list from '../../../components/goods/services/service-list/service-list.vue' 
import goods_table from '../../../components/goods/goods-table/goods-table.vue'
import goods_btn from '../../../components/goods/goods-btn/goods-btn.vue'

// common components
import component_base    from '../../../components/common/component-base/component-base'
import show_inactives from '../../../components/common/show-inactives/show-inactives.vue'
import { mapGetters, mapActions } from 'vuex'

// config, helpers
import { options } from '../../../helpers/options'
import { checkDragOptionService, showGoodsAddButton, checkShowGoodsSharedCol } from '../../../config/permission'

export default {
  components: {
    'service-category-action': service_category_action,
    'service-list': service_list,
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
          { field: 'shared', label: 'services.shared',  width: '5%', sortable: false,  thClass: this.showShareCol, tdClass: this.showShareCol, formatFn: this.formatTrueFalseCol  },
          { field: 'name', label: 'services.services-category',  width: '60%', sortable: false, tdClass: 'col-name' },
          { field: 'edit', label: 'general.edit',                width: '20%', sortable: false, expand: true },
          { field: 'view', label: 'general.view',                width: '20%', sortable: false, expand: true }
        ],
        rows:[],
        groups: [
          { name: 'service-category-shared', rows: [] },
          { name: 'service-category-unshared', rows: [] }
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
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      }, 
      is_hide_list_service: true,
      flag: [],
      show_add_button: true
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser',
      shop_data: 'getShop'
    }),
    ...mapGetters('service_category', {
      service_categorys_data: 'getServiceCategory'
    }),
  },
  mounted() {
    this.table_data.options.drag = checkDragOptionService()
    this.loadPage()
  },
  methods: {
    ...mapActions('service_category', [
      'getServiceCategoryDataAsync',
      'updateServiceCategoryData',
      'setServiceCategoryActionData',
      'setServiceCategoryData'
    ]),
    showShareCol(){
      let class_name = 'hide'
      if(checkShowGoodsSharedCol(options.sharing_goods_type.service))  class_name = 'show-shared'
      return class_name
    },
    formatTrueFalseCol(shared){
      return shared == true? 'O' : 'X'
    },
    onLoadService(item){
      for(let group in this.table_data.groups){
        if(this.table_data.groups[group].rows.length > 0){
          for(let row in this.table_data.groups[group].rows){
            if(this.table_data.groups[group].rows[row].id == item.id) this.$set(this.table_data.groups[group].rows[row], 'selected', true)
            else this.$set(this.table_data.groups[group].rows[row], 'selected', false)
          }
        }
      }
      
      this.is_hide_list_service=false
      this.$emit('loadListService', item)
    },
    loadPage(){ 
      this.show_add_button = showGoodsAddButton(options.sharing_goods_type.service)
      this.loadDataTable(this.table_filter)
    },

    // table
    async loadDataTable() { 
      this.preLoader()
      this.table_filter = Object.assign(this.table_filter, this.shop_data) 
      await this.getServiceCategoryDataAsync(this.table_filter)
      
      if(this.service_categorys_data.is_ok){
        this.table_data.rows = this.service_categorys_data.data.items
        this.table_data.pagination = this.service_categorys_data.data.pagination
      }
      else this.showAlert(this.service_categorys_data.error_messages)

      // group data for table UI
      for(let group in this.table_data.groups){
        this.table_data.groups[group].rows = []
      }
      for(let key in this.table_data.rows){
        if(this.table_data.rows[key].shared) this.table_data.groups[0].rows.push(this.table_data.rows[key])
        if(!this.table_data.rows[key].shared) this.table_data.groups[1].rows.push(this.table_data.rows[key])
      }
      // selected first service category
      if(this.table_data.rows.length > 0){
        let first_service_category = {}
        if(this.table_data.groups[0].rows.length > 0) first_service_category = this.table_data.groups[0].rows[0]
        else first_service_category = this.table_data.groups[1].rows[0]

        this.$set(first_service_category, 'selected', true)
        this.onLoadService(first_service_category)
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
    onActionServiceCategory(action, service_category = {}){ 
      this.service_category_action = {
        action: action,
        data: service_category
      }
      this.setServiceCategoryActionData(this.service_category_action)
      this.showDialogById('service-category-action-modal')
    }, 
    // event success
    onReloadPage(){  
      this.loadPage()
    },
    onUpdatePage(service_category){ 
      if(this.service_category_action.data.status != service_category.status) this.loadPage()
      else this.updateServiceCategoryData(service_category)
    }, 
    // draggable
    async onDragEnd(drag_data, e){
      let drag_change = {
        shop_id: this.shop_data.shop_id,
        old_position_id: drag_data[e.oldIndex].id,
        new_position_id: drag_data[e.newIndex].id
      }

      this.preLoader()
      let service_category_api = new ServiceCategoryApi()
      let result = await service_category_api.updateServiceCategoryOrderNoAsync(drag_change)
      this.preLoader(false)

      if(!result.is_ok) this.showAlert(result.error_messages)
      else this.loadDataTable()
    },
  }
}
</script>

<style lang="scss">
@import './services.scss';
</style>