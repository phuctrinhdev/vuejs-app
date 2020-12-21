import ViewModel from '../../view-model.js'
import RefundItemStaffViewModel from '../../../view-model/sales/refund-item/refund-item-staff-view-model'
import { sales_options } from '../../../helpers/options/sales-options'
import { convertHtmlToTxt, convertTxtToHtml } from '../../../helpers/common'

export default class RefundItemViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      goods_type            : 0,
      goods_category_id     : 0,
      goods_category_name   : '',
      goods_id              : 0,
      original_goods_id     : 0,
      goods_name            : '',
      unit_price            : 0,
      quantity              : 1,
      amount                : 0,
      deduction_amount      : 0,
      staffs                : [],
      product_code          : '',
      product_supplier_price: 0,
      prepaid_card_type     : sales_options.prepaid_card_type.deposit_card,
      deducted_prepaid_goods_ref_name : '',
      is_customize_prepaid_goods      : false,
      is_head_quarter_goods           : false,
    }
  }
  mapFieldsFromApi(api_refund_item){
    let tmp_goods_name = api_refund_item.goodsName
    tmp_goods_name = convertHtmlToTxt(tmp_goods_name)

    let tmp_staffs = []
    for(let staff of api_refund_item.staffs){
      let tmp_staff = new RefundItemStaffViewModel()
      tmp_staff.mapFieldsFromApi(staff)
      tmp_staffs.push(tmp_staff.getFields())
    }

    this.fields.goods_type            = api_refund_item.goodsType
    this.fields.goods_category_id     = api_refund_item.goodsCategoryId
    this.fields.goods_category_name   = api_refund_item.goodsCategoryName
    this.fields.goods_id              = api_refund_item.goodsId
    this.fields.original_goods_id     = api_refund_item.originalGoodsId
    this.fields.goods_name            = tmp_goods_name
    this.fields.unit_price            = api_refund_item.unitPrice
    this.fields.quantity              = api_refund_item.quantity
    this.fields.amount                = api_refund_item.amount
    this.fields.deduction_amount      = api_refund_item.deductionAmount  
    this.fields.staffs                = tmp_staffs,
    this.fields.product_code          = api_refund_item.productCode
    this.fields.product_supplier_price= api_refund_item.supplierPrice
    this.fields.prepaid_card_type     = api_refund_item.prepaidCardType
    this.fields.deducted_prepaid_goods_ref_name = api_refund_item.deductedPrepaidGoodsRefName
    this.fields.is_customize_prepaid_goods      = api_refund_item.isCustomizePrepaidGoods
    this.fields.is_head_quarter_goods           = api_refund_item.isHeadQuarterGoods
  }
  mapFieldsToApi(ui_refund_item){
    let tmp_goods_name = ui_refund_item.goods_name
    tmp_goods_name = convertTxtToHtml(tmp_goods_name)

    let tmp_staffs = []
    for(let staff of ui_refund_item.staffs){
      let tmp_staff = new RefundItemStaffViewModel()
      tmp_staffs.push(tmp_staff.mapFieldsToApi(staff))
    }

    if(ui_refund_item.amount == '') ui_refund_item.amount = 0
    
    return {
      goodsType                   : ui_refund_item.goods_type,
      goodsCategoryId             : ui_refund_item.goods_category_id,
      goodsCategoryName           : ui_refund_item.goods_category_name,
      goodsId                     : ui_refund_item.goods_id,
      originalGoodsId             : ui_refund_item.original_goods_id,
      goodsName                   : tmp_goods_name,
      unitPrice                   : ui_refund_item.unit_price,
      quantity                    : ui_refund_item.quantity,
      amount                      : ui_refund_item.amount,
      deductionAmount             : ui_refund_item.deduction_amount,
      staffs                      : tmp_staffs,
      productCode                 : ui_refund_item.product_code,
      supplierPrice               : ui_refund_item.product_supplier_price,
      prepaidCardType             : ui_refund_item.prepaid_card_type,
      deductedPrepaidGoodsRefName : ui_refund_item.deducted_prepaid_goods_ref_name,
      isCustomizePrepaidGoods     : ui_refund_item.is_customize_prepaid_goods,
      isHeadQuarterGoods          : ui_refund_item.is_head_quarter_goods
    }
  }
}