<template>
  <div class="package-item"> 
    <span>{{ checkPageHasPackage }}</span>
    <goods-table :data="table_data">
      <template slot="table-actions">
        <div class="setup-top no-line"/>
      </template>
      <template slot="price" slot-scope="{ row }">
        <span v-if="show_delete"> 
          <input-money v-model="row.price" :zero="true" @input="onChange(row)"/>
          <span v-if="row.charge_amount>0" class="charge-amount charge-amount-input">({{ $n(row.charge_amount) }})</span>
        </span>
        <span v-else>
          {{ $n(row.price) }} 
          <span v-if="row.charge_amount>0" class="charge-amount">({{ $n(row.charge_amount) }})</span>
        </span>
      </template> 
      <template slot="delete" slot-scope="{ row }"> 
        <a v-if="show_delete" class="btn btn-delete " 
           @click="onDeletePackageItem(row)">{{ $t('package-item.delete') }}</a>
      </template> 
    </goods-table> 
    <div v-if="!show_delete" class="form-group "> 
      <div class="col-md-12 text-right">{{ $t('packages.total-price') }}: {{ $n(total_amount) }} </div>
    </div>
  </div>  
</template> 
<script>   
import  PackageItemApi from '../../../../api/goods/package-item-api.js'  
import { options } from '../../../../helpers/options'
import goods_table from '../../goods-table/goods-table.vue'
import input_money from '../../../common/form/input/input-money/input-money.vue' 
import component_base    from '../../../common/component-base/component-base'
import { checkShowGoodsSharedCol } from '../../../../config/permission'

export default {
  components: {    
    'goods-table': goods_table, 
    'input-money':input_money
  }, 
  extends: component_base,
  props:{ 
    show_delete:{
      type: [Boolean],
      default: false
    } ,
    data:{
      type: [Object],
      default: function () { return {} }
    } 
  },
  data() {
    return {  
      // table
      table_data: { 
        rows:[],
        groups: [ 
          { name: 'default', rows: [] },
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: false
        },
      },  
      table_filter: {
        category: 0,
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },
      package:{},
      alerts: [],
      total_amount: 0
    }
  },
  computed: {
    checkPageHasPackage(){
      this.loadPageHasPackage(this.data)
      return ''
    }
  },
  methods: {
    loadPageHasPackage(packages){
      this.package = packages
      this.table_filter.id = packages.id
      if(this.show_delete){
        this.table_data.fields= [
          { field: 'name',    label: 'package-item.items',        width: '60%', sortable: false, tdClass: 'col-name' },
          { field: 'price',   label: 'package-item.price',        width: '30%', sortable: false, expand: true },
          { field: 'delete',  label: 'package-item.delete-title', width: '10%', sortable: false, expand: true },
        ]
      }
      else{
        this.table_data.fields= [
          { field: 'own_shop_id', label: 'services.shared',  width: '10%', sortable: false,  thClass: this.showShareCol, tdClass: this.showShareCol, formatFn: this.formatTrueFalseCol  },
          { field: 'name',    label: 'package-item.items',   width: '80%', sortable: false, tdClass: 'col-name' },
          { field: 'price',   label: 'package-item.price',   width: '20%', sortable: false, expand: true },
        ] 
      } 
      this.loadDataTable()
    }, 
    showShareCol(){
      let class_name = 'hide'
      if(checkShowGoodsSharedCol(options.sharing_goods_type.service_or_product)) class_name = ''
      return class_name
    },
    formatTrueFalseCol(own_shop_id){
      if(own_shop_id!=this.shop_data.shop_id) return 'O'
      else return 'X'
    }, 
    // table
    async loadDataTable() {  
      if(this.package.id >0){ 
        this.preLoader(this.package)
        this.table_filter = Object.assign(this.table_filter, this.shop_data)
        let package_item_api = new PackageItemApi() 
        this.package_item_data = await package_item_api.getPackageItemsAsync(this.table_filter)  
        if(this.package_item_data.is_ok){
          this.total_amount=0
          this.table_data.rows =  this.package_item_data.data.items
          for(let key in this.table_data.rows){
            this.total_amount=this.total_amount+this.table_data.rows[key].price
            if(((this.shop_data.chain_sharing_settings.share_service || this.shop_data.chain_sharing_settings.share_product) && this.shop_data.chain_sharing_settings.allow_shop_service)&&this.table_data.rows[key].own_shop_id != this.shop_data.shop_id) this.table_data.rows[key].shared=false
            else this.table_data.rows[key].shared=true
          }
          this.table_data.pagination = this.package_item_data.data.pagination   
          this.$emit('load-succeed', this.table_data.rows) 
        }
        else this.showAlert(this.package_item_data.error_messages)
        this.preLoader(false) 
      }
      else{  
        if(this.package.items){ 
          this.table_data.rows = this.package.items
        }
        else{
          this.table_data.rows = [ ]
        }
        this.table_data.pagination =  {
          page_number: 1,
          page_size: 100,
          total_items: 1000
        } 
        this.$emit('load-succeed', this.table_data.rows) 
      }
      // group data for table UI
      this.table_data.groups[0].rows = this.table_data.rows
    }, 
    onDeletePackageItem(item){  
      this.table_data.rows.splice(item.originalIndex, 1)
      this.$emit('delete-succeed', this.table_data.rows)
    },
    onChange(item){ 
      if(Number(item.price)>0){
        item.price = Number(item.price)  
      }else{
        item.price =0
      } 
      this.table_data.rows[item.originalIndex]=item 
      this.$emit('load-succeed', this.table_data.rows)
    }
  }
}
</script>

<style lang="scss">
@import './package-items.scss';
</style>