import { options } from '../../helpers/options'
import PrepaidCardApi from '../../api/goods/prepaid-card-api'

export default {
  data() {
    return {
      prepaid_card_api: new PrepaidCardApi()
    }
  },
  methods: {
    async getPrepaidCardsAsyncMixin(){
      let prepaid_card_filter = {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }

      let result = await this.prepaid_card_api.getPrepaidCardsAsync(prepaid_card_filter)

      return result
    },
  }
}