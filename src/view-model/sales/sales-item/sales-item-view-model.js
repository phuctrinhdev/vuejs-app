import ViewModel from '../../view-model.js'
import { sales_options } from '../../../helpers/options/sales-options'
import SalesItemStaffViewModel from '../sales-item/sales-item-staff-view-model'
import { convertHtmlToTxt,
  convertTxtToHtml } from '../../../helpers/common'

export default class SalesItemViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      sales_item_id                   : 0,
      
      goods_ref                       : {},
      goods_type                      : 0,
      goods_category_id               : 0,
      goods_category_name             : '',
      goods_id                        : 0,
      goods_name                      : '',
      unit_price                      : 0,
      quantity                        : 1,
      amount                          : 0,
      staffs                          : [],
      product_code                    : '', // event to stock-history
      product_supplier_price          : 0,

      // discount for sales item
      discount_category_id            : 0,
      discount_category_name          : '',
      discount_type                   : sales_options.discount_type.amount,
      discount_value                  : 0,

      // sales type
      sales_type_id                   : null,
      sales_type_name                 : '',
      
      // deduction points
      deduction_points                : 0,
      
      // deduction balance
      deduction_amount                : 0,
      
      // prepaid-goods
      prepaid_card_type               : 0,
      gift_card_type                  : 0,
      prepaid_goods_guid              : '', // in case: using prepaid_goods just added
      prepaid_goods_expiry_date_ts    : 0,

      // prepaid-card
      prepaid_card_initial_balance    : 0,
      discount_for_client             : false,
      discount_for_service            : 0,
      discount_for_product            : 0,

      // prepaid-service
      prepaid_service_initial_quantity: 0,
      related_service_id              : 0,
      related_service_name            : '',
      related_service_unit_price      : 0,
      is_customize_prepaid_goods      : false,

      // prepaid-goods deduct
      deduction_type                  : 0,
      deducted_prepaid_goods_ref_name : '',
      deducted_prepaid_goods_ref      : 0,  // in case (deduct)          : client already have prepaid_goods_ref (client_prepaid_goods_id)
      deducted_by_prepaid_goods_guid  : '', // in case (sale & customize): using prepaid_goods just added & use now

      // when edit sales: only get & return api
      client_prepaid_goods_id         : 0, // client_prepaid_goods_id ref to client-prepaid-goods page
      
      // viewing on template
      key                             : 0
    }
  }
  mapFieldsFromApi(api_sales_item){
    let tmp_goods_name = api_sales_item.goodsName
    if(tmp_goods_name == undefined || tmp_goods_name == null)
      tmp_goods_name = api_sales_item.itemName
    if(tmp_goods_name && tmp_goods_name.length > 0){
      tmp_goods_name = convertHtmlToTxt(tmp_goods_name)
    }

    let tmp_staffs = []
    if(api_sales_item.staffs){
      for(let staff of api_sales_item.staffs){
        let tmp_staff = new SalesItemStaffViewModel()
        tmp_staff.mapFieldsFromApi(staff)
        tmp_staffs.push(tmp_staff.getFields())
      }
    }
    
    this.fields.sales_item_id                   = api_sales_item.salesItemId
    this.fields.sales_type_id                   = api_sales_item.salesTypeId
    this.fields.sales_type_name                 = api_sales_item.salesTypeName

    this.fields.goods_type                      = api_sales_item.goodsType
    this.fields.goods_category_id               = api_sales_item.goodsCategoryId
    this.fields.goods_category_name             = api_sales_item.goodsCategoryName
    this.fields.goods_id                        = api_sales_item.goodsId
    this.fields.goods_name                      = tmp_goods_name
    this.fields.unit_price                      = api_sales_item.unitPrice
    this.fields.quantity                        = api_sales_item.quantity
    this.fields.amount                          = api_sales_item.amount
    this.fields.staffs                          = tmp_staffs
    this.fields.product_code                    = api_sales_item.productCode
    this.fields.product_supplier_price          = api_sales_item.supplierPrice
    
    this.fields.discount_category_id            = api_sales_item.discountCategoryId
    this.fields.discount_category_name          = api_sales_item.discountCategoryName
    this.fields.discount_type                   = api_sales_item.discountType
    this.fields.discount_value                  = api_sales_item.discountValue

    this.fields.prepaid_goods_expiry_date_ts    = api_sales_item.prepaidGoodsExpiryDateTS
    this.fields.prepaid_goods_guid              = api_sales_item.prepaidGoodsGuid

    this.fields.client_prepaid_goods_id         = api_sales_item.clientPrepaidGoodsId
    this.fields.deducted_prepaid_goods_ref_name = api_sales_item.deductedPrepaidGoodsRefName
    this.fields.deducted_prepaid_goods_ref      = api_sales_item.deductedPrepaidGoodsRef
    this.fields.deducted_by_prepaid_goods_guid  = api_sales_item.deductedByPrepaidGoodsGuid
    
    this.fields.prepaid_card_type               = api_sales_item.prepaidCardType
    this.fields.gift_card_type                  = api_sales_item.giftCardType
    this.fields.prepaid_card_initial_balance    = api_sales_item.prepaidCardInitialBalance
    this.fields.discount_for_client             = api_sales_item.discountForClient
    this.fields.discount_for_service            = api_sales_item.discountForService
    this.fields.discount_for_product            = api_sales_item.discountForProduct

    this.fields.prepaid_service_initial_quantity= api_sales_item.prepaidServiceInitialQuantity
    this.fields.related_service_id              = api_sales_item.relatedServiceId
    this.fields.related_service_name            = api_sales_item.relatedServiceName
    this.fields.related_service_unit_price      = api_sales_item.relatedServiceUnitPrice
    this.fields.is_customize_prepaid_goods      = api_sales_item.isCustomizePrepaidGoods
    this.fields.is_head_quarter_goods           = api_sales_item.isHeadQuarterGoods

    this.fields.deduction_type                  = api_sales_item.deductionType
    this.fields.deduction_points                = api_sales_item.deductionPoints
    this.fields.deduction_amount                = api_sales_item.deductionAmount
  }
  mapFieldsToApi(ui_sales_item){
    let tmp_goods_name = ui_sales_item.goods_name
    tmp_goods_name = convertTxtToHtml(tmp_goods_name)
    
    let tmp_staffs = []
    for(let staff of ui_sales_item.staffs){
      let tmp_staff = new SalesItemStaffViewModel()
      tmp_staffs.push(tmp_staff.mapFieldsToApi(staff))
    }

    if(ui_sales_item.deduction_amount == '') 
      ui_sales_item.deduction_amount = 0

    return {
      salesItemId                   : ui_sales_item.sales_item_id,
      salesTypeId                   : ui_sales_item.sales_type_id,
      salesTypeName                 : ui_sales_item.sales_type_name,

      goodsType                     : ui_sales_item.goods_type,
      goodsCategoryId               : ui_sales_item.goods_category_id,
      goodsCategoryName             : ui_sales_item.goods_category_name,
      goodsId                       : ui_sales_item.goods_id,
      goodsName                     : tmp_goods_name,
      unitPrice                     : ui_sales_item.unit_price,
      quantity                      : ui_sales_item.quantity,
      amount                        : ui_sales_item.amount,
      staffs                        : tmp_staffs,
      productCode                   : ui_sales_item.product_code,
      supplierPrice                 : ui_sales_item.product_supplier_price,

      discountCategoryId            : ui_sales_item.discount_category_id,
      discountCategoryName          : ui_sales_item.discount_category_name,
      discountType                  : ui_sales_item.discount_type,
      discountValue                 : ui_sales_item.discount_value,

      prepaidGoodsExpiryDateTS      : ui_sales_item.prepaid_goods_expiry_date_ts,
      prepaidGoodsGuid              : ui_sales_item.prepaid_goods_guid,

      clientPrepaidGoodsId          : ui_sales_item.client_prepaid_goods_id,
      deductedPrepaidGoodsRefName   : ui_sales_item.deducted_prepaid_goods_ref_name,
      deductedPrepaidGoodsRef       : ui_sales_item.deducted_prepaid_goods_ref,
      deductedByPrepaidGoodsGuid    : ui_sales_item.deducted_by_prepaid_goods_guid,

      prepaidCardType               : ui_sales_item.prepaid_card_type,
      giftCardType                  : ui_sales_item.gift_card_type,
      prepaidCardInitialBalance     : ui_sales_item.prepaid_card_initial_balance,
      discountForClient             : ui_sales_item.discount_for_client,
      discountForService            : ui_sales_item.discount_for_service,
      discountForProduct            : ui_sales_item.discount_for_product,

      prepaidServiceInitialQuantity : ui_sales_item.prepaid_service_initial_quantity,
      relatedServiceId              : ui_sales_item.related_service_id,
      relatedServiceName            : ui_sales_item.related_service_name,
      relatedServiceUnitPrice       : ui_sales_item.related_service_unit_price,
      isCustomizePrepaidGoods       : ui_sales_item.is_customize_prepaid_goods,
      isHeadQuarterGoods            : ui_sales_item.is_head_quarter_goods,
      
      deductionType                 : ui_sales_item.deduction_type,
      deductionPoints               : ui_sales_item.deduction_points,
      deductionAmount               : ui_sales_item.deduction_amount
    }
  }
}