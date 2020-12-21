<template>
  <main class="app-content">
    <section class="content suppliers suppliers-page">
      <!--BEGIN TITLE -->
      <div class="title">
        <h3>{{ $t('suppliers.title') }}</h3>
      </div>

      <!-- BEGIN FILTER -->
      <div class="filter">
        <div class="row">
          <div class="col-6">
            <b-form-checkbox
              id="show-inactive-checkbox"
              v-model="table_filter.status" 
              :unchecked-value="inventory_options.supplier_status_enum.active" :value="inventory_options.supplier_status_enum.all"
              :class="{ 'show-inactive-checked': table_filter.status == inventory_options.supplier_status_enum.all }"
              @input="reloadDataTableWithPagesNumberIsOneAsync">{{ $t('suppliers.show-inactive') }}
            </b-form-checkbox>
          </div>
          <div class="col-6 btn-wrapper">
            <a id="btn-add-supplier" @click="onActionSupplier(common_options.form_actions.add)">{{ $t('suppliers.add-supplier') }}</a>
          </div>
        </div>
      </div>

      <!-- BEGIN TABLE -->
      <div id="table-suppliers" :class="{ 'is-loaded-suppliers': is_loaded_suppliers }" class="table">
        <view-table :data="table_data" @change-page="onChangePage">
          <template slot="edit" slot-scope="{row}">
            <a class="btn" @click="onActionSupplier(common_options.form_actions.edit,row)">{{ $t('general.edit') }}</a>
          </template>
        </view-table>
      </div>

      <supplier-action @added-supplier="reloadDataTableWithPagesNumberIsOneAsync"
                       @updated-supplier="onUpdatedSupplierAsync"/>
    </section>
  </main>
</template>

<script>
import supplier_action       from '../../../components/inventory/supplier-action/supplier-action.vue'
import component_base        from '../../../components/common/component-base/component-base.vue'
import view_table            from '../../../components/common/view-table/view-table.vue'
import { common_options }    from '../../../helpers/options/common-options.js'
import { inventory_options } from '../../../helpers/options/inventory-options.js'
//-----
import SupplierApi           from '../../../api/inventory/supplier-api.js'
import SupplierViewModel     from '../../../view-model/inventory/supplier/supplier-view-model.js'
import { mapMutations, mapGetters }   from 'vuex'

import _ from 'lodash'
export default {
  components : {
    'view-table'      : view_table,
    'supplier-action' :supplier_action
  },
  extends : component_base,
  data(){
    return {
      common_options,
      inventory_options,
      is_loaded_suppliers: false,
      supplier_api : {},
      table_data   : {
        fields : [
          {field: 'supplier_name',     label: 'suppliers.supplier',              width: '10%',   sortable: false },
          {field: 'representative',    label: 'suppliers.representative',        width: '10%',   sortable: false },
          {field: 'phone_number',      label: 'suppliers.phone-number',          width: '15%',   sortable: false },
          {field: 'mobile_number',     label: 'suppliers.mobile-number',         width: '15%',   sortable: false },
          {field: 'fax',               label: 'suppliers.fax',                   width: '10%',   sortable: false },
          {field: 'email',             label: 'suppliers.email',                 width: '10%',   sortable: false },
          {field: 'notes',             label: 'suppliers.notes',                 width: '20%',   sortable: false },
          {field: 'edit',              label: 'general.edit',                    width: '10%',   sortable: false, expand: true}
        ],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { pagination: true }
      },
      table_filter : {
        status       : inventory_options.supplier_status_enum.active, // All = 0 , Active = 1, InActive = 2
        keywords     : '',
        page_size    : common_options.pagination.default,
        page_number  : 1,
        shop_id      : 0
      }
    }
  },
  computed:{
    ...mapGetters('supplier',{
      x_suppliers : 'getSuppliers'
    })
  },
  async created(){
    this.supplier_api         = new SupplierApi()
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadDataTableAsync()
  },

  methods:{
    ...mapMutations('supplier',[
      'setSuppliers',
      'setSupplierAction',
      'updateSupplier'
    ]),
    async reloadDataTableWithPagesNumberIsOneAsync(){
      this.table_filter.page_number = 1
      await this.loadDataTableAsync()
    },
    async loadDataTableAsync(){
      this.is_loaded_suppliers = true

      this.preLoader()
      let response = await this.supplier_api.getSuppliersAsync(this.table_filter)
      this.preLoader(false)
      if (response.is_ok){
        this.setSuppliers(response.data)
        this.table_data.rows       = this.x_suppliers.items
        this.table_data.pagination = this.x_suppliers.pagination
        for(let row of this.table_data.rows){
          if(row.isSupplierInActive()){
            row.status = inventory_options.supplier_status_enum.in_active
          }else{
            row.status = inventory_options.supplier_status_enum.active
          }
        }
      }else{
        this.showAlertDialog(response.error_messages)
      }
    },

    async onChangePage(page){
      this.table_filter.page_number = page
      await this.loadDataTableAsync()
    },
    async onUpdatedSupplierAsync(supplier = new SupplierViewModel()){
      let tmp_supplier = _.find(this.table_data.rows,x=>x.supplier_id == supplier.supplier_id)
      if (typeof tmp_supplier !== 'undefined'){
        if(tmp_supplier.active != supplier.active){
          await this.reloadDataTableWithPagesNumberIsOneAsync()
        }
        else{
          this.updateSupplier(supplier)
        }
      }
    },

    onActionSupplier(action,supplier = new SupplierViewModel()){
      let supplier_action = {
        action : action,
        data   : _.cloneDeep(supplier)
      }
      this.setSupplierAction(supplier_action)
      this.showDialogById('supplier-action-modal')
    }
  }
}
</script>

<style lang="scss">
@import './suppliers.scss';
</style>