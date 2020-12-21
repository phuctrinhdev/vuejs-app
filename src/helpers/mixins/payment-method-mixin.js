import { options }              from '../../helpers/options'
import PaymentMethodApi                 from '../../api/sales/payment-method-api'

export default {
  data(){
    return {
      payment_method_api : new PaymentMethodApi()
    }
  },
  methods: {
    async getPaymentMethodsAsyncMixin(status){
      let filter = {
        status     : status,
        page_size  : options.pagination.max,
        page_number: 1,
        shop_id    : this.shop_data.shop_id
      }
      return await this.payment_method_api.getPaymentMethodsAsync(filter)
    }
  }
}