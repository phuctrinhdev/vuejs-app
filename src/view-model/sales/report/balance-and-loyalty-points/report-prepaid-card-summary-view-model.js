import ViewModel from '../../../view-model.js'

export default class ReportPrepaidCardSummaryViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      prepaid_card_id   : 0,
      prepaid_card_name : '',
      total_clients     : 0,
      total_amount      : 0
    }
  }
  mapFieldsFromApi(api_data) {
    this.fields.prepaid_card_id   = api_data.prepaidCardId
    this.fields.prepaid_card_name = api_data.prepaidCardName
    this.fields.total_clients     = api_data.totalClients
    this.fields.total_amount      = api_data.totalAmount
  }
}