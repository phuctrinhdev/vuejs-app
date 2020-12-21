import { options }              from '../../helpers/options'
import SalesTypeApi             from '../../api/sales/sales-type-api'

export default {
  data(){
    return {
      sales_type_api: new SalesTypeApi(),
    }
  },
  methods: {
    async getSalesTypesAsyncMixin(){
      let filter = {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }
      return await this.sales_type_api.getSalesTypesAsync(filter)
    }
  }
}