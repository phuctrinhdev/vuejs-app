import AccountHistoryBaseViewModel from '../base-view-model/account-history-base-view-model.js'
import { convertHtmlToTxt } from '../../../helpers/common'

export default class PrepaidServiceHistoryViewModel extends AccountHistoryBaseViewModel{
  constructor(){
    super()
    this.fields.loc_no                        = ''
    this.fields.registration_date_ts          = 0
    this.fields.unit_price                    = 0
    this.fields.quantity_before_change        = 0
    this.fields.changed_quantity              = 0
    this.fields.quantity                      = 0
    this.fields.client_name                   = ''
    this.fields.client_prepaid_service_id     = 0
    this.fields.prepaid_service_history_type  = undefined
    this.fields.expiry_date_ts                = 0
    this.fields.expiry_date_ts_before_changed = 0
    this.fields.prepaid_service_name          = ''

    this.fields.chain_id                      = null
    this.fields.branch_number                 = 0
    this.fields.shop_name                     = ''
    this.fields.client_shop_id                = 0
    this.fields.client_shop_name              = ''
  }

  mapFieldsFromApi(api_data){
    let tmp_prepaid_service_name = api_data.prepaidServiceName
    if(tmp_prepaid_service_name && tmp_prepaid_service_name.length > 0)
      tmp_prepaid_service_name = convertHtmlToTxt(tmp_prepaid_service_name)

    this.fields.id                            = api_data.id
    this.fields.loc_no                        = api_data.locNo
    this.fields.registration_date_ts          = api_data.registrationDateTS
    this.fields.unit_price                    = api_data.unitPrice
    this.fields.quantity_before_change        = api_data.quantityBeforeChange
    this.fields.changed_quantity              = api_data.changedQuantity
    this.fields.quantity                      = api_data.quantity
    this.fields.client_id                     = api_data.clientId
    this.fields.client_name                   = api_data.clientName
    this.fields.client_prepaid_service_id     = api_data.clientPrepaidServiceId
    this.fields.history_ref_type              = api_data.historyRefType
    this.fields.prepaid_service_history_type  = api_data.prepaidServiceHistoryType
    this.fields.history_ref_id                = api_data.historyRefId
    this.fields.expiry_date_ts                = api_data.expiryDateTS
    this.fields.expiry_date_ts_before_changed = api_data.expiryDateTSBeforeChanged
    this.fields.prepaid_service_name          = tmp_prepaid_service_name
    this.fields.shop_id                       = api_data.shopId

    this.fields.chain_id                      = api_data.chainId
    this.fields.branch_number                 = api_data.branchNumber
    this.fields.shop_name                     = api_data.shopName
    this.fields.client_shop_id                = api_data.clientShopId
    this.fields.client_shop_name              = api_data.clientShopName
  }
}