import { options }              from '../../helpers/options'
import ExpenditureItemApi                 from '../../api/expenditure/expenditure-items-api'

export default {
  data(){
    return {
      expenditure_item_api : new ExpenditureItemApi()
    }
  },
  methods: {
    async getExpenditureItemsAsyncMixin(){
      let filter = {
        status       : options.good_status.active,
        shop_id      : this.shop_data.shop_id
      }
      let response = await this.expenditure_item_api.getExpenditureItemsAsync(filter)
      return response
    }
  }
}