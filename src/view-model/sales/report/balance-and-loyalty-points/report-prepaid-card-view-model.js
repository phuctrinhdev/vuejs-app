import ViewModel from '../../../view-model.js'

export default class ReportPrepaidCardViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      client_id         : 0,
      client_name       : 0,
      prepaid_card_id   : 0,
      prepaid_card_name : '',
      balance           : 0,
      sales_date_ts     : 0,
      expiry_date_ts    : 0,
      shop_id           : 0
    }
  }
  mapFieldsFromApi(api_data) {
    this.fields.client_id         = api_data.clientId
    this.fields.client_name       = api_data.clientName
    this.fields.prepaid_card_id   = api_data.prepaidCardId
    this.fields.prepaid_card_name = api_data.prepaidCardName
    this.fields.balance           = api_data.balance
    this.fields.sales_date_ts     = api_data.salesDateTS
    this.fields.expiry_date_ts    = api_data.expiryDateTS
    this.fields.shop_id           = api_data.shopId
  }
}