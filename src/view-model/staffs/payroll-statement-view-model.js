import ViewModel             from '../view-model'
import { 
  convertDateToTimezone,
  formatMoney,
} from '../../helpers/common'

export default class PayrollStatementViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      summary: [],
      services: [],
      products: [],
      prepaid_cards: [],
      prepaid_services: [],
    }
  }

  mapFieldsFromApi(api_data){
    let tmp_summary = []
    for(let item of api_data.summary){
      tmp_summary.push(this.mapSummaryFromApi(item))
    }
    if(api_data.summary.length > 0){
      let total_item = {
        staff_name        : 'TOTAL',
        service_sales     : tmp_summary.reduce((total, item) => total + item.service_sales,0),
        service_deduction : tmp_summary.reduce((total, item) => total + item.service_deduction,0),
        product_sales     : tmp_summary.reduce((total, item) => total + item.product_sales,0),
        product_deduction : tmp_summary.reduce((total, item) => total + item.product_deduction,0),
        prepaid_cards     : tmp_summary.reduce((total, item) => total + item.prepaid_cards,0),
        prepaid_services  : tmp_summary.reduce((total, item) => total + item.prepaid_services,0),
        total             : tmp_summary.reduce((total, item) => total + item.total,0)
      }
      tmp_summary.push(total_item)
    }
    
    let tmp_services = []
    for(let item of api_data.services){
      tmp_services.push(this.mapServicesFromApi(item))
    }
    let tmp_products = []
    for(let item of api_data.products){
      tmp_products.push(this.mapProductsFromApi(item))
    }
    let tmp_prepaid_cards = []
    for(let item of api_data.prepaidCards){
      tmp_prepaid_cards.push(this.mapPrepaidCardsFromApi(item))
    }
    let tmp_prepaid_services = []
    for(let item of api_data.prepaidServices){
      tmp_prepaid_services.push(this.mapPrepaidServicesFromApi(item))
    }

    this.fields.summary            = tmp_summary
    this.fields.services           = tmp_services
    this.fields.products           = tmp_products
    this.fields.prepaid_cards      = tmp_prepaid_cards
    this.fields.prepaid_services   = tmp_prepaid_services
  }
  mapSummaryFromApi(api_data){
    return {
      staff_name        : api_data.staffName,
      service_sales     : api_data.serviceSales,
      service_deduction : api_data.serviceDeduction,
      product_sales     : api_data.productSales,
      product_deduction : api_data.productDeduction,
      prepaid_cards     : api_data.prepaidCards,
      prepaid_services  : api_data.prepaidServices,
      total             : api_data.total
    }
  }
  mapServicesFromApi(api_data){
    let tmp_date                      = convertDateToTimezone(new Date(api_data.invoiceDateTS) * 1000)
    let tmp_type                      = api_data.salaryType == 1 ? 'Sales' : 'Refund'
    let tmp_quantity                  = formatMoney(api_data.quantity,0)
    let tmp_sales_amount              = formatMoney(api_data.salesAmount,0)
    let tmp_salary_for_sales          = formatMoney(api_data.salaryForSales,0)
    let tmp_prepaid_card_deduction    = formatMoney(api_data.prepaidCardDeduction,0)
    let tmp_prepaid_service_deduction = formatMoney(api_data.prepaidServiceDeduction,0)
    let tmp_salary_for_deduction      = formatMoney(api_data.salaryForDeduction,0)

    return {
      staff_id                  : api_data.staffId,
      staff_name                : api_data.staffName,
      invoice_date_ts           : tmp_date,
      client_name               : api_data.clientName,
      salary_type               : tmp_type,
      item_name                 : api_data.itemName,
      quantity                  : tmp_quantity,
      sales_amount              : tmp_sales_amount,
      salary_sales_setting      : api_data.salarySalesSetting,
      salary_for_sales          : tmp_salary_for_sales,
      prepaid_card_deduction    : tmp_prepaid_card_deduction,
      prepaid_service_deduction : tmp_prepaid_service_deduction,
      salary_deduction_setting  : api_data.salaryDeductionSetting,
      salary_for_deduction      : tmp_salary_for_deduction,
    }
  }
  mapProductsFromApi(api_data){
    let tmp_date                      = convertDateToTimezone(new Date(api_data.invoiceDateTS) * 1000)
    let tmp_type                      = api_data.salaryType == 1 ? 'Sales' : 'Refund'
    let tmp_quantity                  = formatMoney(api_data.quantity,0)
    let tmp_sales_amount              = formatMoney(api_data.salesAmount,0)
    let tmp_salary_for_sales          = formatMoney(api_data.salaryForSales,0)
    let tmp_prepaid_card_deduction    = formatMoney(api_data.prepaidCardDeduction,0)
    let tmp_salary_for_deduction      = formatMoney(api_data.salaryForDeduction,0)
    
    return {
      staff_id                  : api_data.staffId,
      staff_name                : api_data.staffName,
      invoice_date_ts           : tmp_date,
      client_name               : api_data.clientName,
      salary_type               : tmp_type,
      item_name                 : api_data.itemName,
      quantity                  : tmp_quantity,
      sales_amount              : tmp_sales_amount,
      salary_sales_setting      : api_data.salarySalesSetting,
      salary_for_sales          : tmp_salary_for_sales,
      prepaid_card_deduction    : tmp_prepaid_card_deduction,
      salary_deduction_setting  : api_data.salaryDeductionSetting,
      salary_for_deduction      : tmp_salary_for_deduction,
    }
  }
  mapPrepaidCardsFromApi(api_data){
    let tmp_date                      = convertDateToTimezone(new Date(api_data.invoiceDateTS) * 1000)
    let tmp_type                      = api_data.salaryType == 1 ? 'Sales' : 'Refund'
    let tmp_quantity                  = formatMoney(api_data.quantity,0)
    let tmp_sales_amount              = formatMoney(api_data.salesAmount,0)
    let tmp_prepaid_card_deduction    = formatMoney(api_data.prepaidCardDeduction,0)
    let tmp_refund_by_prepaid_card    = formatMoney(api_data.refundByPrepaidCard,0)
    let tmp_net_sales                 = formatMoney(api_data.netSales,0)
    let tmp_salary_for_sales          = formatMoney(api_data.salaryForSales,0)

    return {
      staff_id              : api_data.staffId,
      staff_name            : api_data.staffName,
      invoice_date_ts       : tmp_date,
      client_name           : api_data.clientName,
      salary_type           : tmp_type,
      item_name             : api_data.itemName,
      quantity              : tmp_quantity,
      sales_amount          : tmp_sales_amount,
      prepaid_card_deduction: tmp_prepaid_card_deduction,
      refund_by_prepaid_card: tmp_refund_by_prepaid_card,
      net_sales             : tmp_net_sales,
      salary_sales_setting  : api_data.salarySalesSetting,
      salary_for_sales      : tmp_salary_for_sales
    }
  }
  mapPrepaidServicesFromApi(api_data){
    let tmp_date                      = convertDateToTimezone(new Date(api_data.invoiceDateTS) * 1000)
    let tmp_type                      = api_data.salaryType == 1 ? 'Sales' : 'Refund'
    let tmp_quantity                  = formatMoney(api_data.quantity,0)
    let tmp_sales_amount              = formatMoney(api_data.salesAmount,0)
    let tmp_prepaid_card_deduction    = formatMoney(api_data.prepaidCardDeduction,0)
    let tmp_refund_by_prepaid_card    = formatMoney(api_data.refundByPrepaidCard,0)
    let tmp_net_sales                 = formatMoney(api_data.netSales,0)
    let tmp_salary_for_sales          = formatMoney(api_data.salaryForSales,0)

    return {
      staff_id              : api_data.staffId,
      staff_name            : api_data.staffName,
      invoice_date_ts       : tmp_date,
      client_name           : api_data.clientName,
      salary_type           : tmp_type,
      item_name             : api_data.itemName,
      quantity              : tmp_quantity,
      sales_amount          : tmp_sales_amount,
      prepaid_card_deduction: tmp_prepaid_card_deduction,
      refund_by_prepaid_card: tmp_refund_by_prepaid_card,
      net_sales             : tmp_net_sales,
      salary_sales_setting  : api_data.salarySalesSetting,
      salary_for_sales      : tmp_salary_for_sales
    }
  }

  isValid(){
    let validations = {
      
    }
    return super.isValid(validations)
  }
}
