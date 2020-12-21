<template>
  <div class="box-item-service">
    <div class="box-item "> 
      <div class="box-i box-i-service-category"> 
        <div class="box-i-body">
          <h3>{{ $t('packages.category') }}</h3>
          <b-list-group @scroll="onHandleScrollCategory"> 
            <b-list-group-item v-for="(category, index) in data_category" :key="category.id" :variant="category.warning_service"
                               @click="onChooseServiceCategory(category)">
              <span class="no"><div>{{ (index+1) }}</div></span>
              <span class="name">{{ category.name }}</span> 
            </b-list-group-item>  
          </b-list-group>
          <p class="lb-total-items">{{ $t('packages.total-items') }}: {{ data_category_load.pagination.total_items }}</p>
        </div>  
      </div>
      <div class="box-i box-i-service">  
        <div class="box-i-body">
          <h3>{{ $t('packages.services') }}</h3>
          <b-list-group @scroll="onHandleScrollService"> 
            <b-list-group-item v-for="(service, index) in data_service.items " :key="service.id" :variant="service.warning"
                               @click="onChooseService(service)">
              <span class="no"><div>{{ (index+1) }}</div></span>
              <span class="name">{{ service.name }}</span> 
            </b-list-group-item>  
          </b-list-group>
          <p class="lb-total-items">{{ $t('packages.total-items') }}: {{ data_service.pagination.total_items }}</p>
        </div> 
      </div> 
    </div>    
  </div>
</template>  
<script>  
import { mapGetters, mapActions } from 'vuex'   
import { options } from '../../../../helpers/options'
import { GOODS_TYPE } from '../../../../config/constant'
import goods_table from '../../goods-table/goods-table.vue'  
import component_base    from '../../../common/component-base/component-base'

export default {
  components: {    
    'goods-table': goods_table
  },
  extends: component_base,
  data() {
    return {   
      data_category_load:{
        items:[],
        is_loading_scroll:false,
        pagination: {
          total_pages: 1,
          total_items: 0,
        } 
      },
      data_category_choose: {},  
      data_service: {
        items:[],
        is_loading_scroll:false,
        pagination: {
          total_pages: 1,
          total_items: 0,
        }
      }, 
      table_filter_category: { 
        page_size: options.pagination.max,
        page_number: 1, 
        shop_id: 0,
        status: options.good_status.list_default
      },   
      table_filter_service: { 
        page_size: options.pagination.max,
        page_number: 1, 
        shop_id: 0,
        status: options.good_status.list_default
      }, 
      alerts: []
    }
  },
  computed: {
    ...mapGetters('service_category', {
      x_data_category: 'getServiceCategory'
    }),
    ...mapGetters('service', {
      x_data_service: 'getServiceNotPrepaid'
    }),
    data_category :{
      get(){ 
        this.onChooseServiceCategory(this.data_category_choose)
        return this.data_category_load.items
      } 
    } 
  }, 
  created() {
    if(!this.x_data_category.data){
      this.x_data_category.data={}
      this.x_data_category.data.items=[]  
    }
    this.$root.$on('loadServiceItem', this.loadServiceItem)
  },
  methods: {  
    ...mapActions('service_category', [
      'getServiceCategoryDataAsync',
    ]),
    ...mapActions('service', [
      'getServicesNotPrepaidDataAsync', 
    ]),
    loadServiceItem(){
      this.loadServiceCategory()
    },
    async loadServiceCategory(is_load_scroll = false){ 
      if(!is_load_scroll){  
        this.table_filter_category.page_number = 1
      }
      this.table_filter_category = Object.assign(this.table_filter_category, this.shop_data)   
      this.preLoader()
      await this.getServiceCategoryDataAsync(this.table_filter_category)
      if(this.x_data_category.is_ok){
        Object.assign(this.data_category_load.pagination, this.x_data_category.data.pagination)   
        if(this.table_filter_category.page_number <=1){
          this.data_category_choose =this.x_data_category.data.items[0]
          this.onChooseServiceCategory(this.data_category_choose, true )
        }
        this.table_filter_category.page_number = this.table_filter_category.page_number + 1
        if(is_load_scroll){ 
          this.data_category_load.items = this.data_category_load.items.concat(this.x_data_category.data.items)
          this.data_category_load.is_loading_scroll = false
        }else{
          this.data_category_load.items = this.x_data_category.data.items 
        }
      }
      else this.showAlert(this.x_data_category.error_messages)
      this.preLoader(false)
    },
    onChooseServiceCategory(item, first = false){  
      if(item.id>0){
        for(let row in this.x_data_category.data.items){
          if(this.x_data_category.data.items[row].id == item.id) this.$set(this.x_data_category.data.items[row], 'warning_service', 'warning')
          else this.$set(this.x_data_category.data.items[row], 'warning_service', '')
        }  
        if(item){
          if(first || this.data_category_choose.id != item.id){
            this.loadService(item) 
          }
          this.data_category_choose =item
        }
      } 
    },
    async onHandleScrollCategory(e){
      let sh = e.target.scrollHeight
      let st = e.target.scrollTop
      let oh = e.target.offsetHeight
      if((sh-st-oh+1) < 3){ 
        if(this.data_category_load.is_loading_scroll == false 
        && this.table_filter_category.page_number <= this.data_category_load.pagination.total_pages ){
          this.data_category_load.is_loading_scroll = true
          this.loadServiceCategory(true)
        }
      }
    },
    // table
    async loadService(category, is_load_scroll = false) { 
      if(!is_load_scroll){  
        this.table_filter_service.page_number =1
      }
      this.table_filter_service.category=category.id 
      this.table_filter_service = Object.assign(this.table_filter_service, this.shop_data) 
      this.preLoader()
      await this.getServicesNotPrepaidDataAsync(this.table_filter_service)
      if(this.x_data_service.is_ok){ 
        Object.assign(this.data_service.pagination, this.x_data_service.data.pagination)   
        this.table_filter_service.page_number = this.table_filter_service.page_number + 1
        if(is_load_scroll){ 
          this.data_service.items = this.data_service.items.concat(this.x_data_service.data.items)
          this.data_service.is_loading_scroll = false
        }else{
          this.data_service.items  = this.x_data_service.data.items   
        }
      }
      else this.showAlert(this.x_data_service.error_messages) 
      this.preLoader(false)
    }, 
    onChooseService(service){  
      for(let row in this.data_service.items){
        if(this.data_service.items[row].id == service.id) {
          this.$set(this.data_service.items[row], 'warning', 'warning')
        }
        else this.$set(this.data_service.items[row], 'warning', '')
      }  
      this.$emit('choose-item', { type: GOODS_TYPE.SERVICE, item: service} ) 
    }, 
    async onHandleScrollService(e){
      let sh = e.target.scrollHeight
      let st = e.target.scrollTop
      let oh = e.target.offsetHeight
      if((sh-st-oh+1) < 3){ 
        if( this.data_service.is_loading_scroll == false && this.table_filter_service.page_number <= this.data_service.pagination.total_pages ){   
          this.data_service.is_loading_scroll = true
          this.loadService(this.data_category_choose, true)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import './service-items.scss';
</style>