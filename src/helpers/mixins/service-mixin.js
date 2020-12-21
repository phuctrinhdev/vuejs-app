import { options }          from '../../helpers/options'
import ServiceCategoryApi   from '../../api/goods/service-category-api'
import ServiceApi           from '../../api/goods/service-api'
import PrepaidServiceApi    from '../../api/goods/prepaid-service-api'

export default {
  data() {
    return {
      service_api: new ServiceApi()
    }
  },
  methods: {
    async loadServiceCategorysAsync(){
      let service_category_filter = {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }
      
      let api = new ServiceCategoryApi() 
      let result = await api.getServiceCategoryAsync(service_category_filter)
      
      return result
    },
    async loadServicesAsync(category_id, page_number){
      let service_filter = {
        category: category_id,
        page_size: options.pagination.max,
        page_number: page_number,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }
      
      let result = await this.service_api.getServicesAsync(service_filter)

      return result
    },
    async loadServiceAsync(service_id, shop_id){
      let tmp_shop_id = this.shop_data.shop_id
      if(shop_id > 0)
        tmp_shop_id = shop_id
      let query = {
        shop_id: tmp_shop_id,
        status : options.good_status.all
      }
      let response = await this.service_api.getServiceAsync(service_id, query)
      return response
    },
    async loadPrepaidServicesAsync(category_id, page_number){
      let prepaid_service_filter = {
        category: category_id,
        page_size: options.pagination.max,
        page_number: page_number,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }
      
      let api = new PrepaidServiceApi() 
      let result = await api.getPrepaidServiceAsync(prepaid_service_filter)

      return result
    },
  }
}