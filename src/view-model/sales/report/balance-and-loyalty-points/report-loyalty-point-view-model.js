import ViewModel from '../../../view-model.js'

export default class ReportLoyaltyPointViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      client_id         : 0,
      client_name       : '',
      client_number     : '',
      points            : 0,
      is_family         : 0,
      shop_id           : 0
    }
  }
  mapFieldsFromApi(api_data) {
    this.fields.client_id     = api_data.clientId
    this.fields.client_name   = api_data.clientName
    this.fields.client_number = api_data.clientNumber
    this.fields.points        = api_data.points
    this.fields.is_family     = api_data.isFamily
    this.fields.shop_id       = api_data.shopId
  }
}