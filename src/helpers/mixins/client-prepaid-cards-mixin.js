import { options } from '../../helpers/options'
import ClientPrepaidCardsApi from '../../api/sales/prepaid-cards-api'

export default {
  data() {
    return {
      client_prepaid_card_api: new ClientPrepaidCardsApi()
    }
  },
  methods: {
    async getClientPrepaidCardsAsyncMixin(client_id, prepaid_card_type, is_include_family_card){
      let data_filter = {
        client_id: client_id,
        include_expired_card: false,
        include_family_card: is_include_family_card,
        prepaid_card_type: prepaid_card_type,
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id
      }

      let result = await this.client_prepaid_card_api.getPrepaidCardsAsync(data_filter)

      return result
    }
  }
}