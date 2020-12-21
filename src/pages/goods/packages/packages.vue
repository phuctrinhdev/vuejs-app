<template>
  <main class="app-content">
    <section class="packages-page content">
      <div class="inner"> 
        <article class="row setup-top clearfix">
          <h3 class="col-12">{{ $t('packages.packages') }}</h3> 
        </article>
        <div class="row table-custom"> 
          <div class="col-12"> 
            <!-- table data -->
            <div class="table-data form-wrapper row"> 
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6 table-left">  
                    <goods-table :data="table_data" @change-page="onChangePage" @drag-end="onDragEnd">
                      <template slot="table-actions">
                        <div class="setup-top no-line clearfix">
                          <show-inactives v-model="table_filter.status" class="align-left" @input="onShowInactives" />
                          <ul class="btn-group clearfix">
                            <li>
                              <goods-btn v-if="show_add_button" :data="{ label: 'packages.packages-add' }" class="btn-large"
                                         @click-action="onActionPackage(options.form_actions.add)"/>
                            </li>
                          </ul>
                        </div>
                      </template>
                      <template slot="total_amount" slot-scope="{ row }">
                        {{ $n(row.total_amount) }}
                      </template>
                      <template slot="edit" slot-scope="{ row }"> 
                        <a v-if="!row.shared" class="btn btn-edit" 
                           @click="onActionPackage(options.form_actions.edit, row)">{{ $t('general.edit') }}</a>
                      </template>
                      <template slot="view" slot-scope="{ row }">
                        <a class="btn btn-view" 
                           @click="onLoadPackageItem(row)"> ➝ </a>
                      </template>
                    </goods-table>
                  </div>
                  <div class="col-md-6 table-right">
                    <package-items :data="data_packages" :show_delete="false" :class="{ 'hide': is_show_package_item }"/> 
                  </div>
                </div>
              </div> 
            </div>
          </div>
        </div> 
      </div>
    </section>
    
    <!-- modal action -->
    <package-action @reload-page="onReloadPage" @update-page="onUpdatePage"/>
  </main>
</template>

<script> 
import package_action from '../../../components/goods/package/package-action/package-action.vue' 
import package_items from '../../../components/goods/package/package-item/package-items.vue' 
import PackageApi from '../../../api/goods/package-api.js'
import show_inactives           from '../../../components/common/show-inactives/show-inactives.vue'
import { mapGetters, mapActions } from 'vuex'
import { options } from '../../../helpers/options'
import goods_table from '../../../components/goods/goods-table/goods-table.vue'  
import component_base    from '../../../components/common/component-base/component-base'
import goods_btn from '../../../components/goods/goods-btn/goods-btn.vue'
import { checkDragOptionService, showGoodsAddButton, checkShowGoodsSharedCol } from '../../../config/permission'


export default {
  components: {
    'package-action': package_action,
    'package-items': package_items, 
    'goods-table': goods_table,
    'show-inactives': show_inactives,
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
          { field: 'name',         label: 'packages.packages-name',                  width: '70%', sortable: false, tdClass: 'col-name' },
          { field: 'total_amount', label: 'packages.packages-total-amount',          width: '20%', sortable: false, expand: true },
          { field: 'edit',         label: 'general.edit',                            width: '5%', sortable: false, expand: true, thClass: this.showEditCol, tdClass: this.showEditCol },
          { field: 'view',         label: 'general.view',                            width: '5%', sortable: false, expand: true }
        ],
        rows:[],
        groups: [
          { name: 'package-shared', rows: [] },
          { name: 'package-unshared', rows: [] }
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: true,
          pagination: true
        },
      },
      
      table_filter: {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      }, 
      is_show_package_item: true,  

      data_packages:{},
      show_add_button: true
    }
  },
  computed: {
    ...mapGetters('packages', {
      packages_data: 'getPackage'
    }),
  },
  mounted() {
    this.loadPage()
  },
  methods: {
    ...mapActions('packages', [
      'getPackageDataAsync',
      'updatePackageData',
      'setPackageActionData',
      'setPackageData'
    ]),
    showShareCol(){
      let class_name = 'hide'
      if(checkShowGoodsSharedCol(options.sharing_goods_type.service)) class_name = ' show-shared'
      return class_name
    },
    formatTrueFalseCol(shared){
      return shared == true? 'O' : 'X'
    }, 
    showEditCol(){
      let class_name = 'hide'
      if(this.shop_data.chain_id==0 || this.shop_data.chain_sharing_settings.allow_shop_service) class_name = ''
      return class_name
    },
    onShowInactives(){
      this.table_filter.page_number = 1
      this.loadDataTable(this.table_filter)
    },
    loadPage(){
      this.table_data.options.drag = checkDragOptionService()
      this.show_add_button = showGoodsAddButton(options.sharing_goods_type.product)
      this.loadDataTable(this.table_filter)
    },
    // table
    async loadDataTable() { 
      this.preLoader()
      this.table_filter = Object.assign(this.table_filter, this.shop_data) 
      await this.getPackageDataAsync(this.table_filter) 
      if(this.packages_data.is_ok){
        this.table_data.rows = this.packages_data.data.items
        this.table_data.pagination = this.packages_data.data.pagination
      }
      else this.showAlert(this.packages_data.error_messages) 
      // group data for table UI
      for(let group in this.table_data.groups){
        this.table_data.groups[group].rows = []
      }
      for(let key in this.table_data.rows){
        if(this.table_data.rows[key].shared) this.table_data.groups[0].rows.push(this.table_data.rows[key])
        if(!this.table_data.rows[key].shared) this.table_data.groups[1].rows.push(this.table_data.rows[key])
      }
      // selected first service category
      let first_service_category = {} 
      if(this.table_data.rows.length > 0){
        if(this.table_data.groups[0].rows.length > 0) first_service_category = this.table_data.groups[0].rows[0]
        else first_service_category = this.table_data.groups[1].rows[0] 
        this.$set(first_service_category, 'selected', true) 
      }else{ 
        first_service_category = {} 
      }
      this.onLoadPackageItem( first_service_category) 
      this.preLoader(false)
    },
    onLoadPackageItem(item){
      if(item.id >0){
        for(let group in this.table_data.groups){
          if(this.table_data.groups[group].rows.length > 0){
            for(let row in this.table_data.groups[group].rows){
              if(this.table_data.groups[group].rows[row].id == item.id) this.$set(this.table_data.groups[group].rows[row], 'selected', true)
              else this.$set(this.table_data.groups[group].rows[row], 'selected', false)
            }
          }
        }   
        this.is_show_package_item=false 
        this.data_packages =item  
      } else{ 
        this.is_show_package_item=true 
      }
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadDataTable(this.table_filter)
    }, 
    // modal action
    onActionPackage(action, packages = {}){ 
      this.package_action = {
        action: action,
        data: packages
      }
      this.setPackageActionData(this.package_action)
      this.showDialogById('package-action-modal')
    }, 

    // event success
    onReloadPage(){ 
      this.loadPage()
    },
    onUpdatePage(packages){ 
      if(this.package_action.data.status != packages.status)
      {
        this.loadPage()
      }
      else this.updatePackageData(packages) 
      
      if(this.data_packages.id == packages.id){
        this.data_packages=packages
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
      let package_api = new PackageApi()
      let result = await package_api.updatePackageOrderNoAsync(drag_change)
      this.preLoader(false)

      if(!result.is_ok) this.showAlert(result.error_messages)
      else this.loadDataTable()
    },
  }
}
</script>

<style lang="scss">
@import './packages.scss';
</style>