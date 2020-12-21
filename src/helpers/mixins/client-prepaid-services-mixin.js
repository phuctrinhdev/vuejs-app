import { options } from '../../helpers/options'
import ClientPrepaidServicesApi from '../../api/sales/prepaid-services-api'

export default {
  data() {
    return {
      client_prepaid_services_api: new ClientPrepaidServicesApi()
    }
  },
  methods: {
    async getClientPrepaidServicesAsyncMixin(client_id, is_include_family_service){
      let data_filter = {
        client_id: client_id,
        show_expired: false,
        include_family_service: is_include_family_service,
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id
      }

      let response = await this.client_prepaid_services_api.getPrepaidServicesAsync(data_filter)
      
      return response
    }
  }
}