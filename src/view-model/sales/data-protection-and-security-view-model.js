import ViewModel from '../view-model.js'
import { sales_options } from '../../helpers/options/sales-options.js'
import { common_options } from '../../helpers/options/common-options.js'

export default class DataProtectionAndSecurityViewModel extends ViewModel {

  constructor() {
    super()
    this.fields = {
      id: 0,
      shop_id: 0,
      allow_edit_balance_royalty_points_prepaid_services_remaining  : sales_options.security_level_enum.staff_or_higher,
      allow_edit_before_today_sales_invoices                        : sales_options.security_level_enum.staff_or_higher,
      allow_edit_today_sales_invoices                               : sales_options.security_level_enum.staff_or_higher,
      allow_edit_invoice_date                                       : sales_options.security_level_enum.staff_or_higher,
      sales_report_and_invoices_date_range_manager_can_search       : sales_options.sale_report_invoices_date_range_a_manager_can_search.forty_five_days,
      sales_report_and_invoices_date_range_staff_can_search         : sales_options.NUMBER_OF_DATE,
      allow_manager_print_invoices_and_sales_report                 : common_options.yes_no.yes,
    }
  }

  mapFieldsFromApi(data,shop_id) {
    this.fields.shop_id                                                      = shop_id
    this.fields.id                                                           = data.id
    this.fields.allow_edit_balance_royalty_points_prepaid_services_remaining = data.allowEditBalanceRoyaltyPointsPrepaidServicesRemaining
    this.fields.allow_edit_before_today_sales_invoices                       = data.allowEditBeforeTodaySalesInvoices
    this.fields.allow_edit_today_sales_invoices                              = data.allowEditTodaySalesInvoices
    this.fields.allow_edit_invoice_date                                      = data.allowEditInvoiceDate
    this.fields.sales_report_and_invoices_date_range_manager_can_search      = data.salesReportAndInvoicesDateRangeManagerCanSearch
    this.fields.sales_report_and_invoices_date_range_staff_can_search        = data.salesReportAndInvoicesDateRangeStaffCanSearch
    this.fields.allow_manager_print_invoices_and_sales_report                = data.allowManagerPrintInvoicesAndSalesReport
  }

  mapFieldsToApi() {
    return {
      id                                                    : this.fields.id,
      shopId                                                : this.fields.shop_id,
      allowEditBalanceRoyaltyPointsPrepaidServicesRemaining : this.fields.allow_edit_balance_royalty_points_prepaid_services_remaining,
      allowEditBeforeTodaySalesInvoices                     : this.fields.allow_edit_before_today_sales_invoices,
      allowEditTodaySalesInvoices                           : this.fields.allow_edit_today_sales_invoices,
      allowEditInvoiceDate                                  : this.fields.allow_edit_invoice_date,
      salesReportAndInvoicesDateRangeManagerCanSearch       : this.fields.sales_report_and_invoices_date_range_manager_can_search,
      salesReportAndInvoicesDateRangeStaffCanSearch         : this.fields.sales_report_and_invoices_date_range_staff_can_search,
      allowManagerPrintInvoicesAndSalesReport               : this.fields.allow_manager_print_invoices_and_sales_report

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