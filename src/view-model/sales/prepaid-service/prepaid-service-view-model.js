import ViewModel from '../../view-model.js'
import { convertHtmlToTxt } from '../../../helpers/common'

export default class PrepaidServiceViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      id                            : 0,
      loc                           : '',
      client_prepaid_service_id     : 0,
      client_id                     : 0,
      client_name                   : '',
      service_category_id           : 0,
      service_category_name         : '',
      related_service_id            : 0,
      related_service_name          : '',
      related_service_unit_price    : 0,
      prepaid_service_id            : 0,
      prepaid_service_name          : '',
      is_customize_prepaid_goods    : false,
      is_head_quarter_goods         : false,
      unit_price                    : 0,
      initial_quantity              : 0,
      quantity                      : 0,
      expiry_date_ts                : 0,
      invoice_date_time_ts          : 0,
      registration_date_ts          : 0,
      modification_date_ts          : 0,
      shop_id                       : 0,

      // chain-sharing
      chain_id                      : null,
      branch_number                 : '',
      shop_name                     : '',
      client_shop_id                : 0,
      client_shop_name              : '',

      // viewing
      expand                        : false,
      deduction_quantity            : 0,
      refund_amount                 : 0
    }
  }
  mapFieldsFromApi(api_data){
    let tmp_related_service_name = api_data.relatedServiceName
    if(!tmp_related_service_name) 
      tmp_related_service_name = api_data.prepaidServiceName
    tmp_related_service_name = convertHtmlToTxt(tmp_related_service_name)
    
    let tmp_prepaid_service_name = api_data.prepaidServiceName
    if(tmp_prepaid_service_name && tmp_prepaid_service_name.length > 0)
      tmp_prepaid_service_name = convertHtmlToTxt(tmp_prepaid_service_name)
    
    this.fields.id                            = api_data.id
    this.fields.loc                           = api_data.locNo
    this.fields.client_prepaid_service_id     = api_data.id
    this.fields.client_id                     = api_data.clientId
    this.fields.client_name                   = api_data.clientName
    this.fields.service_category_id           = api_data.serviceCategoryId,
    this.fields.service_category_name         = api_data.serviceCategoryName,
    this.fields.related_service_id            = api_data.relatedServiceId
    this.fields.related_service_name          = tmp_related_service_name
    this.fields.related_service_unit_price    = api_data.relatedServiceUnitPrice
    this.fields.prepaid_service_id            = api_data.prepaidServiceId
    this.fields.prepaid_service_name          = tmp_prepaid_service_name
    this.fields.is_customize_prepaid_goods    = api_data.isCustomizePrepaidGoods
    this.fields.is_head_quarter_goods         = api_data.isHeadQuarterGoods
    this.fields.unit_price                    = api_data.unitPrice
    this.fields.initial_quantity              = api_data.initialQuantity
    this.fields.quantity                      = api_data.quantity
    this.fields.expiry_date_ts                = api_data.expiryDateTS
    this.fields.invoice_date_time_ts          = api_data.invoiceDateTimeTS
    this.fields.registration_date_ts          = api_data.registrationDateTS
    this.fields.modification_date_ts          = api_data.modificationDateTS
    this.fields.shop_id                       = api_data.shopId,

    this.fields.chain_id                      = api_data.chainId
    this.fields.branch_number                 = api_data.branchNumber
    this.fields.shop_name                     = api_data.shopName
    this.fields.client_shop_id                = api_data.clientShopId
    this.fields.client_shop_name              = api_data.clientShopName
  }
}