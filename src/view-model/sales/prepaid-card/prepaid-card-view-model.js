import ViewModel from '../../view-model.js'
export default class SalesPrepaidCardViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      id                        : 0,
      client_id                 : 0,
      client_name               : '',
      prepaid_card_id           : 0,
      prepaid_card_name         : '',
      prepaid_card_type         : 1,
      is_customize_prepaid_goods: false,
      is_head_quarter_goods     : false,
      sales_price               : 0,
      initial_balance           : 0,
      balance                   : 0,
      expiry_date_ts            : 0,
      discount_for_client       : false,
      discount_for_service      : 0,
      discount_for_product      : 0,
      invoice_date_time_ts      : 0,
      shop_id                   : 0,
      
      // chain-sharing
      chain_id                  : null,
      branch_number             : '',
      shop_name                 : '',
      client_shop_id            : 0,
      client_shop_name          : '',

      // viewing
      expand                    : false,
      is_selected               : false,
      deduction_balance         : 0,
      refund_amount             : 0
    }
  }

  mapFieldsFromApi(api_data){
    let tmp_id = 0
    if(api_data.id != undefined) 
      tmp_id = api_data.id
    if(api_data.clientPrepaidCardId != undefined) 
      tmp_id = api_data.clientPrepaidCardId
    
    this.fields.id                        = tmp_id
    this.fields.client_id                 = api_data.clientId
    this.fields.client_name               = api_data.clientName
    this.fields.prepaid_card_id           = api_data.prepaidCardId
    this.fields.prepaid_card_name         = api_data.prepaidCardName
    this.fields.prepaid_card_type         = api_data.prepaidCardType
    this.fields.is_customize_prepaid_goods= api_data.isCustomizePrepaidGoods
    this.fields.is_head_quarter_goods     = api_data.isHeadQuarterGoods
    
    this.fields.sales_price               = api_data.salesPrice
    this.fields.initial_balance           = api_data.initialBalance
    this.fields.balance                   = api_data.balance
    this.fields.expiry_date_ts            = api_data.expiryDateTS
    this.fields.discount_for_client       = api_data.discountForClient
    this.fields.discount_for_service      = api_data.discountForService
    this.fields.discount_for_product      = api_data.discountForProduct
    this.fields.invoice_date_time_ts      = api_data.invoiceDateTimeTS
    this.fields.shop_id                   = api_data.shopId

    this.fields.chain_id                  = api_data.chainId
    this.fields.branch_number             = api_data.branchNumber
    this.fields.shop_name                 = api_data.shopName
    this.fields.client_shop_id            = api_data.clientShopId
    this.fields.client_shop_name          = api_data.clientShopName

    return this.fields
  }
}