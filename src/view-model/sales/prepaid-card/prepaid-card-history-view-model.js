import AccountHistoryBaseViewModel from '../base-view-model/account-history-base-view-model.js'
export default class PrepaidCardHistoryViewModel extends AccountHistoryBaseViewModel{
  constructor(){
    super()
    this.fields.client_prepaid_card_id        = 0
    this.fields.sales_price                   = 0
    this.fields.prepaid_card_history_type     = undefined
    this.fields.balance_before_change         = 0
    this.fields.changed_balance               = 0
    this.fields.balance                       = 0
    this.fields.created_date_time_ts          = 0
    this.fields.loc_no                        = ''
    this.fields.card_name                     = ''
    this.fields.from_card                     = ''
    this.fields.to_card                       =  ''
    this.fields.client_name                   = ''
    this.fields.expiry_date_ts                = ''
    this.fields.expiry_date_ts_before_changed = ''

    this.fields.chain_id                      = null
    this.fields.branch_number                 = 0
    this.fields.shop_name                     = ''
    this.fields.client_shop_id                = 0
    this.fields.client_shop_name              = ''
  }

  mapFieldsFromApi(api_data){
    this.fields.id                            = api_data.id
    this.fields.client_id                     = api_data.clientId
    this.fields.client_prepaid_card_id        = api_data.clientPrepaidCardId
    this.fields.sales_price                   = api_data.salesPrice
    this.fields.history_ref_type              = api_data.historyRefType
    this.fields.history_ref_id                = api_data.historyRefId
    this.fields.prepaid_card_history_type     = api_data.prepaidCardHistoryType
    this.fields.balance_before_change         = api_data.balanceBeforeChange
    this.fields.changed_balance               = api_data.changedBalance
    this.fields.balance                       = api_data.balance
    this.fields.created_date_time_ts          = api_data.createdDateTimeTS
    this.fields.loc_no                        = api_data.locNo
    this.fields.card_name                     = api_data.cardName
    this.fields.from_card                     = api_data.fromCard
    this.fields.to_card                       = api_data.toCard
    this.fields.client_name                   = api_data.clientName
    this.fields.expiry_date_ts                = api_data.expiryDateTS
    this.fields.expiry_date_ts_before_changed = api_data.expiryDateTSBeforeChanged
    this.fields.shop_id                       = api_data.shopId

    this.fields.chain_id                      = api_data.chainId
    this.fields.branch_number                 = api_data.branchNumber
    this.fields.shop_name                     = api_data.shopName
    this.fields.client_shop_id                = api_data.clientShopId
    this.fields.client_shop_name              = api_data.clientShopName
  }
}