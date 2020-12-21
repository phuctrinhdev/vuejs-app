import SupplierApi           from '../../api/inventory/supplier-api.js'
import { options }           from '../../helpers/options'
import { inventory_options } from '../options/inventory-options'

export default {
  data(){
    return {
      supplier_api    : {},
      supplier_filter : {}
    }
  },
  async created(){
    this.supplier_api    = new SupplierApi()
    this.supplier_filter = {
      status       : inventory_options.supplier_status_enum.active,
      keywords     : '',
      page_size    : options.pagination.max, //Number.MAX_SAFE_INTEGER,
      page_number  : 1,
      shop_id      : this.shop_data.shop_id
    }
  },

  methods: {
    async getSuppliersOptionMixinAsync(){
      let suppliers_options = []
      this.preLoader()
      let response = await this.supplier_api.getSuppliersAsync(this.supplier_filter)
      this.preLoader(false)
      if (response.is_ok){
        suppliers_options = response.data.items
      }else{
        this.showAlertDialog(response.error_messages)
      }
      return suppliers_options
    }
  },
}
