import ViewModel from '../../../view-model.js'
import { convertHtmlToTxt } from '../../../../helpers/common'

export default class ReportPrepaidServiceViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      client_id           : 0,
      client_name         : '',
      prepaid_service_id  : 0,
      prepaid_service_name: '',
      remaining_quantity  : 0,
      expiry_date_ts      : 0,
      remaining_amount    : 0,
      sales_amount        : 0,
      sales_date_ts       : 0,
      shop_id             : 0
    }
  }
  mapFieldsFromApi(api_data) {
    this.fields.client_id            = api_data.clientId
    this.fields.client_name          = api_data.clientName
    this.fields.prepaid_service_id   = api_data.prepaidServiceId
    this.fields.prepaid_service_name = convertHtmlToTxt(api_data.prepaidServiceName)
    this.fields.remaining_quantity   = api_data.remainingQuantity,
    this.fields.expiry_date_ts       = api_data.expiryDateTS,
    this.fields.remaining_amount     = api_data.remainingAmount,
    this.fields.sales_amount         = api_data.salesAmount,
    this.fields.sales_date_ts        = api_data.salesDateTS,
    this.fields.shop_id              = api_data.shopId
  }
}