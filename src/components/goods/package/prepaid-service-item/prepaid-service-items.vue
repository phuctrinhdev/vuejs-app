<template>
  <div class="box-item-prepaid-service">
    <div class="box-item "> 
      <div class="box-i box-i-service-category"> 
        <div class="box-i-body">
          <h3>{{ $t('packages.category') }}</h3>
          <b-list-group @scroll="onHandleScrollCategory"> 
            <b-list-group-item v-for="(category, index) in data_category.items" :key="category.id" :variant="category.warning"
                               @click="onChooseServiceCategory(category)"> 
              <span class="no"><div>{{ (index+1) }}</div></span>
              <span class="name">{{ category.name }}</span> 
            </b-list-group-item> 
          </b-list-group>
          <p class="lb-total-items">{{ $t('packages.total-items') }}: {{ data_category.pagination.total_items }}</p>
        </div>  
      </div>
      <div class="box-i box-i-service">  
        <div class="box-i-body">
          <h3>{{ $t('packages.prepaid-services') }}</h3> 
          <b-list-group @scroll="onHandleScrollService">
            <b-list-group-item v-for="(service, index) in data_prepaid_service.items" :key="service.id" :variant="service.warning"
                               @click="onChoosePrepaidService(service)">
              <span class="no"><div>{{ (index+1) }}</div></span>
              <span class="name">{{ service.name }}</span>
            </b-list-group-item> 
          </b-list-group>
          <p class="lb-total-items">{{ $t('packages.total-items') }}: {{ data_prepaid_service.pagination.total_items }}</p>
        </div> 
      </div> 
    </div>  
  </div>
</template>  
<script>  
import { mapGetters, mapActions } from 'vuex'
import { GOODS_TYPE } from '../../../../config/constant'
import { options } from '../../../../helpers/options'
import goods_table from '../../goods-table/goods-table.vue' 
import component_base    from '../../../common/component-base/component-base'

export default {
  components: {
    'goods-table': goods_table
  },
  extends: component_base,
  data() {
    return {   
      data_category:  {
        items:[],
        is_loading_scroll:false,
        pagination: {
          total_pages: 1,
          total_items: 0,
        } 
      },  
      data_category_choose: {}, 
      data_prepaid_service: {
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
    }
  },
  computed: {
    ...mapGetters('prepaid_service', {
      x_data_prepaid_service: 'getPrepaidServices'
    }),
    ...mapGetters('service_category', {
      x_data_category: 'getServiceCategory'
    }),
  }, 
  created: function() {
    this.$root.$on('loadPrepaidServiceItem', this.loadPrepaidService) 
  },
  methods: {  
    ...mapActions('service_category', [
      'getServiceCategoryDataAsync',
    ]),
    ...mapActions('prepaid_service', [
      'getPrepaidServicesDataAsync', 
    ]),
    loadPrepaidService( ){ 
      this.loadServiceCategory()
    },
    async loadServiceCategory(is_load_scroll = false){ 
      if(!is_load_scroll){  
        this.table_filter_category.page_number =1
      }
      this.table_filter_category = Object.assign(this.table_filter_category, this.shop_data)   
      this.preLoader() 
      await this.getServiceCategoryDataAsync(this.table_filter_category)  
      if(this.x_data_category.is_ok){ 
        Object.assign(this.data_category.pagination, this.x_data_category.data.pagination)   
        if(is_load_scroll){ 
          this.data_category.items = this.data_category.items.concat(this.x_data_category.data.items)
          this.data_category.is_loading_scroll = false
        }else{
          this.data_category.items = this.x_data_category.data.items 
        }  
        if(this.table_filter_category.page_number <=1){ 
          this.onChooseServiceCategory(this.x_data_category.data.items[0])
        } 
        this.table_filter_category.page_number = this.table_filter_category.page_number + 1
       
      } else this.showAlert(this.x_data_category.error_messages)  
      this.preLoader(false)
    }, 
    async onHandleScrollCategory(e){
      let sh = e.target.scrollHeight
      let st =  e.target.scrollTop
      let oh =  e.target.offsetHeight
      if((sh-st-oh+1) < 3){ 
        if(this.data_category.is_loading_scroll == false 
        && this.table_filter_category.page_number <= this.data_category.pagination.total_pages ){
          this.data_category.is_loading_scroll = true
          this.loadServiceCategory( true)
        }
      }
    },
    onChooseServiceCategory(item){ 
      for(let row in this.data_category.items){
        if(this.data_category.items[row].id == item.id) this.$set(this.data_category.items[row], 'warning', 'warning')
        else this.$set(this.data_category.items[row], 'warning', '')
      }  
      if(item){
        if( this.data_category_choose.id != item.id){ 
          this.loadPrepaidServices(item)
        }
        this.data_category_choose =item
      }
    },
    // table
    async loadPrepaidServices(category, is_load_scroll = false) {  
      if(!is_load_scroll){  
        this.table_filter_service.page_number =1
      }
      this.table_filter_service.category=category.id 
      this.table_filter_service = Object.assign(this.table_filter_service, this.shop_data) 
      this.preLoader()
      await this.getPrepaidServicesDataAsync(this.table_filter_service)
      if(this.x_data_prepaid_service.is_ok){
        Object.assign(this.data_prepaid_service.pagination, this.x_data_prepaid_service.data.pagination)   
        this.table_filter_service.page_number = this.table_filter_service.page_number + 1
        if(is_load_scroll){ 
          this.data_prepaid_service.items = this.data_prepaid_service.items.concat(this.x_data_prepaid_service.data.items)
          this.data_prepaid_service.is_loading_scroll = false
        }else{
          this.data_prepaid_service.items  = this.x_data_prepaid_service.data.items   
        }
      }
      else this.showAlert(this.x_data_prepaid_service.error_messages)
      this.preLoader(false)
    },  
    onChoosePrepaidService(prepaid_service){  
      for(let row in this.data_prepaid_service.items){
        if(this.data_prepaid_service.items[row].id == prepaid_service.id) {
          this.$set(this.data_prepaid_service.items[row], 'warning', 'warning')
        }
        else this.$set(this.data_prepaid_service.items[row], 'warning', '')
      }  
      this.$emit('choose-item', { type: GOODS_TYPE.PREPAID_SERVICE, item: prepaid_service} )
    },   
    async onHandleScrollService(e){
      let sh = e.target.scrollHeight
      let st =  e.target.scrollTop
      let oh =  e.target.offsetHeight
      if((sh-st-oh+1) < 3){ 
        if( this.data_prepaid_service.is_loading_scroll == false 
        && this.table_filter_service.page_number <= this.data_prepaid_service.pagination.total_pages ){   
          this.data_prepaid_service.is_loading_scroll = true
          this.loadPrepaidServices(this.data_category_choose, true)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import './prepaid-service-items.scss';
</style>