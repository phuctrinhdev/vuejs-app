import ViewModel          from '../view-model.js'
import { sales_options }  from '../../helpers/options/sales-options.js'
import { common_options } from '../../helpers/options/common-options.js'

export default class SalesGeneralSetupViewModel extends ViewModel {
  
  constructor() {
    super()
    this.fields = {
      shop_id                                    : 0,
      id                                         : 0,
      auto_select_staff_when_sales               : common_options.yes_no.yes,
      allow_omit_staff_when_add_service_sales    : sales_options.omit_staff_type_enum.allow,
      allow_omit_staff_when_add_product_sales    : sales_options.omit_staff_type_enum.allow,
      discount_input_default_window              : sales_options.discount_input_default_window_type_enum.number_keypad,
      client_sales_information_default           : sales_options.client_sales_information_default_type_enum.sales_history,
      show_price_on_goods_selection_window       : common_options.yes_no.yes,
      business_hours_for_sales_report_from       : '00:00',
      business_hours_for_sales_report_to         : '00:00',
      maximum_multi_staffs_selection             : 0,
      maximum_multi_items_selection              : 0
    }
  }

  mapFieldsFromApi(data,shop_id) {
    this.fields.id                                      = data.id
    this.fields.shop_id                                 = shop_id
    this.fields.auto_select_staff_when_sales            = data.autoSelectStaffWhenSales
    this.fields.allow_omit_staff_when_add_service_sales = data.allowOmitStaffWhenAddServiceSales
    this.fields.allow_omit_staff_when_add_product_sales = data.allowOmitStaffWhenAddProductSales
    this.fields.discount_input_default_window           = data.discountInputDefaultWindow
    this.fields.client_sales_information_default        = data.clientSalesInformationDefault
    this.fields.show_price_on_goods_selection_window    = data.showPriceOnGoodsSelectionWindow
    this.fields.business_hours_for_sales_report_from    = data.businessHoursForSalesReportFrom.substring(0,data.businessHoursForSalesReportFrom.length - 3)
    this.fields.business_hours_for_sales_report_to      = data.businessHoursForSalesReportTo.substring(0,data.businessHoursForSalesReportTo.length - 3)
    this.maximum_multi_items_selection                  = data.maximumMultiItemsSelection
    this.maximum_multi_staffs_selection                 = data.maximumMultiItemsSelection
  }

  mapFieldsToApi() {
    return {
      shopId                            : this.fields.shop_id,
      id                                : this.fields.id,
      autoSelectStaffWhenSales          : this.fields.auto_select_staff_when_sales,
      allowOmitStaffWhenAddServiceSales : this.fields.allow_omit_staff_when_add_service_sales,
      allowOmitStaffWhenAddProductSales : this.fields.allow_omit_staff_when_add_product_sales,
      discountInputDefaultWindow        : this.fields.discount_input_default_window,
      clientSalesInformationDefault     : this.fields.client_sales_information_default,
      showPriceOnGoodsSelectionWindow   : this.fields.show_price_on_goods_selection_window,
      businessHoursForSalesReportFrom   : this.fields.business_hours_for_sales_report_from,
      businessHoursForSalesReportTo     : this.fields.business_hours_for_sales_report_to,
      maximumMultiStaffsSelection       : this.maximum_multi_staffs_selection,
      maximumMultiItemsSelection        : this.maximum_multi_items_selection
    }
  }

  getValidationRules() {
    let validations = {}
    return validations
  }

  isValid() {
    return super.isValid(this.getValidationRules())
  }
}
