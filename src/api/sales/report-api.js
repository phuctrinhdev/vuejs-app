import _ from 'lodash'
import Http                                    from '../../helpers/http'
// import moment from 'moment'
import { getServiceUrl }                       from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
// import { options } from '../../helpers/options'
import { common_options }    from '../../helpers/options/common-options'
import { bookings_options }  from '../../helpers/options/bookings-options'
import { sales_options }     from '../../helpers/options/sales-options'
import SalesViewModel        from '../../view-model/sales/sales/sales-view-model'
import SalesTotalViewModel   from '../../view-model/sales/report/sales-total/sales-total-view-model'
import PaymentTotalViewModel from '../../view-model/sales/report/sales-total/payment-total-view-model.js'

import ReportPrepaidCardViewModel         from '../../view-model/sales/report/balance-and-loyalty-points/report-prepaid-card-view-model'
import ReportPrepaidCardSummaryViewModel  from '../../view-model/sales/report/balance-and-loyalty-points/report-prepaid-card-summary-view-model'
import ReportPrepaidServiceViewModel      from '../../view-model/sales/report/balance-and-loyalty-points/report-prepaid-service-view-model'
import ReportLoyaltyPointViewModel        from '../../view-model/sales/report/balance-and-loyalty-points/report-loyalty-point-view-model'
import SalesByStaffViewModel              from '../../view-model/sales/report/sales-by-staff-view-model'
import SalesByItemServiceViewModel        from '../../view-model/sales/report/sales-by-item-service-view-model'
import SalesByItemProductViewModel        from '../../view-model/sales/report/sales-by-item-product-view-model'
import SalesByItemPrepaidCardViewModel    from '../../view-model/sales/report/sales-by-item-prepaid-card-view-model'
import SalesByItemPrepaidServiceViewModel from '../../view-model/sales/report/sales-by-item-prepaid-service-view-model'
import DetailSalesTotalViewModel          from '../../view-model/sales/report/sales-total/detail-sales-total-view-model'

import { 
  mapPagingFromApi,
  convertHtmlToTxt
  // convertMinutesToHours,
  // convertTimeStampToDate 
}                    from '../../helpers/common'

const url_aggr                = getServiceUrl(SERVICE_TYPES.SALES_AGGR, 1)
const url_read                = getServiceUrl(SERVICE_TYPES.SALES_READ, 1)
const url_read_client_report  = getServiceUrl(SERVICE_TYPES.REPORT_SALES_CLIENT_REPORT_READ, 1)
const url_read_balance_points = getServiceUrl(SERVICE_TYPES.REPORT_BALANCE_AND_LOYALTY_POINTS_READ, 1)

// sales analysis
let url_read_sales_by_date_report                     = url_read + SERVICE_EXTEND_TYPES.SALES_BY_DATE_REPORT
let url_read_sales_by_month_report                    = url_read + SERVICE_EXTEND_TYPES.SALES_BY_MONTH_REPORT
let url_read_service_sales__date                      = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES__DATE
let url_read_service_sales__date_range                = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES__DATE_RANGE
let url_read_service_sales__month_range               = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES__MONTH_RANGE
let url_read_service_sales_by_item__date              = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES_BY_ITEM__DATE
let url_read_service_sales_by_item__date_range        = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES_BY_ITEM__DATE_RANGE
let url_read_service_sales_by_item__month             = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES_BY_ITEM__MONTH
let url_read_service_sales_by_months                  = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES_BY_MONTHS
let url_read_service_sales_by_sales_types__date       = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES_BY_SALES_TYPES__DATE
let url_read_service_sales_by_sales_types__date_range = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES_BY_SALES_TYPES__DATE_RANGE
let url_read_service_sales_by_sales_types__month      = url_read + SERVICE_EXTEND_TYPES.SERVICE_SALES_BY_SALES_TYPES__MONTH
let url_read_product_sales_by_months                  = url_read + SERVICE_EXTEND_TYPES.PRODUCT_SALES_BY_MONTHS
let url_read_product_sales_by_item__date              = url_read + SERVICE_EXTEND_TYPES.PRODUCT_SALES_BY_ITEM__DATE
let url_read_product_sales_by_item__date_range        = url_read + SERVICE_EXTEND_TYPES.PRODUCT_SALES_BY_ITEM__DATE_RANGE
let url_read_product_sales_by_item__month_range       = url_read + SERVICE_EXTEND_TYPES.PRODUCT_SALES_BY_ITEM__MONTH_RANGE
let url_read_sales_by_discount_category__date         = url_read + SERVICE_EXTEND_TYPES.SALES_BY_DISCOUNT_CATEGORY__DATE
let url_read_sales_by_discount_category__date_range   = url_read + SERVICE_EXTEND_TYPES.SALES_BY_DISCOUNT_CATEGORY__DATE_RANGE
let url_read_sales_by_discount_category__month        = url_read + SERVICE_EXTEND_TYPES.SALES_BY_DISCOUNT_CATEGORY__MONTH
let url_read_income_statement__date                   = url_aggr + SERVICE_EXTEND_TYPES.INCOME_STATEMENT__DATE
let url_read_income_statement__date_range             = url_aggr + SERVICE_EXTEND_TYPES.INCOME_STATEMENT__DATE_RANGE
let url_read_income_statement__month                  = url_aggr + SERVICE_EXTEND_TYPES.INCOME_STATEMENT__MONTH
let url_read_booking_deposit_summary__date            = url_read + SERVICE_EXTEND_TYPES.BOOKING_DEPOSIT_SUMMARY__DATE
let url_read_booking_deposit_summary__date_range      = url_read + SERVICE_EXTEND_TYPES.BOOKING_DEPOSIT_SUMMARY__DATE_RANGE
let url_read_booking_deposit_summary__month           = url_read + SERVICE_EXTEND_TYPES.BOOKING_DEPOSIT_SUMMARY__MONTH

// client analysis


// booking analysis
const url_read_booking_report                               = getServiceUrl(SERVICE_TYPES.BOOKING_REPORT_READ, 1)
let url_bookings_by_date                                    = url_read_booking_report + SERVICE_EXTEND_TYPES.BOOKING_BY_DATE
let url_bookings_by_month                                   = url_read_booking_report + SERVICE_EXTEND_TYPES.BOOKING_BY_MONTH
let url_detailed_analysis_of_bookings__month__resource      = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__MONTH__RESOURCE
let url_detailed_analysis_of_bookings__month__day           = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__MONTH__DAY
let url_detailed_analysis_of_bookings__month__hour          = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__MONTH__HOUR
let url_detailed_analysis_of_bookings__date_range__resource = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__RESOURCE
let url_detailed_analysis_of_bookings__date_range__day      = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__DAY
let url_detailed_analysis_of_bookings__date_range__hour     = url_read_booking_report + SERVICE_EXTEND_TYPES.DETAILED_ANALYSIS_OF_BOOKING__DATE_RANGE__HOUR

// Client
const url_read_client                              = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_READ, 1)
let url_read_sales_by_repeat_clients__date         = url_read_client_report + SERVICE_EXTEND_TYPES.SALES_BY_REPEAT_CLIENTS__DATE
let url_read_sales_by_repeat_clients__date_range   = url_read_client_report + SERVICE_EXTEND_TYPES.SALES_BY_REPEAT_CLIENTS__DATE_RANGE
let url_read_sales_by_repeat_clients__month        = url_read_client_report + SERVICE_EXTEND_TYPES.SALES_BY_REPEAT_CLIENTS__MONTH
let url_read_clients_summary__date                 = url_read_client_report + SERVICE_EXTEND_TYPES.CLIENTS_SUMMARY__DATE
let url_read_clients_summary__date_range           = url_read_client_report + SERVICE_EXTEND_TYPES.CLIENTS_SUMMARY__DATE_RANGE
let url_read_clients_summary__month                = url_read_client_report + SERVICE_EXTEND_TYPES.CLIENTS_SUMMARY__MONTH
let url_new_client_repeat_report                   = url_read_client_report + SERVICE_EXTEND_TYPES.NEW_CLIENT_REPORT
let url_new_client_by_months_report                = url_read_client + SERVICE_EXTEND_TYPES.NEW_CLIENT_BY_MONTHS_REPORT
let url_new_client_by_referral_source__date_range  = url_read_client + SERVICE_EXTEND_TYPES.NEW_CLIENT_BY_REFERRAL_SOURCE__DATE_RANGE
let url_new_client_by_referral_source__month_range = url_read_client + SERVICE_EXTEND_TYPES.NEW_CLIENT_BY_REFERRAL_SOURCE__MONTH_RANGE

// balance and loyalty points
let url_read_prepaid_cards_report         = url_read_balance_points + SERVICE_EXTEND_TYPES.PREPAID_CARDS_REPORT
let url_read_prepaid_card_summary_report  = url_read_balance_points + SERVICE_EXTEND_TYPES.PREPAID_CARD_SUMMARY_REPORT
let url_read_prepaid_services_report      = url_read_balance_points + SERVICE_EXTEND_TYPES.PREPAID_SERVICES_REPORT
let url_read_loyalty_points_report        = url_read_balance_points + SERVICE_EXTEND_TYPES.LOYALTY_POINTS_REPORT

// sales
let url_read_sales_total_report__date               = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_REPORT__DATE
let url_read_sales_total_report__month              = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_REPORT__MONTH
let url_read_sales_total_report__date_range         = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_REPORT__DATE_RANGE

let url_read_sales_total_by_staff_report__date      = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_STAFF__DATE
let url_read_sales_total_by_staff_report__month     = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_STAFF__MONTH
let url_read_sales_total_by_staff_report__date_range= url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_STAFF__DATE_RANGE

let url_read_sales_total_by_item_service_report__date                 = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__SERVICE__DATE
let url_read_sales_total_by_item_service_report__month                = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__SERVICE__MONTH
let url_read_sales_total_by_item_service_report__date_range           = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__SERVICE__DATE_RANGE
let url_read_sales_total_by_item_product_report__date                 = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PRODUCT__DATE
let url_read_sales_total_by_item_product_report__month                = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PRODUCT__MONTH
let url_read_sales_total_by_item_product_report__date_range           = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PRODUCT__DATE_RANGE
let url_read_sales_total_by_item_prepaid_card_report__date            = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PREPAID_CARD__DATE
let url_read_sales_total_by_item_prepaid_card_report__month           = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PREPAID_CARD__MONTH
let url_read_sales_total_by_item_prepaid_card_report__date_range      = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PREPAID_CARD__DATE_RANGE
let url_read_sales_total_by_item_prepaid_service_report__date         = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__DATE
let url_read_sales_total_by_item_prepaid_service_report__month        = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__MONTH
let url_read_sales_total_by_item_prepaid_service_report__date_range   = url_read + SERVICE_EXTEND_TYPES.SALES_TOTAL_BY_ITEM__PREPAID_SERVICE__DATE_RANGE 


export default class ReportApi {
  constructor(){
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    if(response.data.isOK) {
      let sales_vm = new SalesViewModel()
      sales_vm.mapSaleFromApi(response.data.result)
      this.result.data = sales_vm.getFields()
    }
    return this.result
  }

  // SalesByDate
  async getSalesByDateReportAsync(query){
    let query_map = {
      fromDateTS              : query.from_date_ts,
      toDateTS                : query.to_date_ts,
      prepaidSalesCountingType: query.prepaid_sales_counting_type,
      shopId                  : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_sales_by_date_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          for(let item of response.data.result.reportItems){
            let tmp_key = item.key.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let tmp_date = tmp_key.slice(6,8)
            let txt_date = `${tmp_year}`
            if(tmp_month.length > 0)
              txt_date += `-${tmp_month}`
            if(tmp_date.length > 0)
              txt_date += `-${tmp_date}`
              
            let tmp_item = {
              key                   : item.key,
              date                  : txt_date,
              from_date_ts          : item.fromDateTS,
              to_date_ts            : item.toDateTS,
              service_amount        : item.serviceAmount,
              product_amount        : item.productAmount,
              prepaid_card_amount   : item.prepaidCardAmount,
              prepaid_service_amount: item.prepaidServiceAmount,
              total_amount          : item.serviceAmount + item.productAmount + item.prepaidCardAmount + item.prepaidServiceAmount
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  // SalesByMonth
  async getSalesByMonthReportAsync(query){
    let query_map = {
      fromDateTS              : query.from_date_ts,
      toDateTS                : query.to_date_ts,
      prepaidSalesCountingType: query.prepaid_sales_counting_type,
      shopId                  : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_sales_by_month_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          for(let item of response.data.result.reportItems){
            let tmp_key = item.key.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let tmp_date = tmp_key.slice(6,8)
            let txt_date = `${tmp_year}`
            if(tmp_month.length > 0)
              txt_date += `-${tmp_month}`
            if(tmp_date.length > 0)
              txt_date += `-${tmp_date}`
              
            let tmp_item = {
              key                   : item.key,
              date                  : txt_date,
              from_date_ts          : item.fromDateTS,
              to_date_ts            : item.toDateTS,
              service_amount        : item.serviceAmount,
              product_amount        : item.productAmount,
              prepaid_card_amount   : item.prepaidCardAmount,
              prepaid_service_amount: item.prepaidServiceAmount,
              total_amount          : item.serviceAmount + item.productAmount + item.prepaidCardAmount + item.prepaidServiceAmount
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getServiceSalesReportAsync(query){
    let query_map = {
      fromDateTs              : query.from_date_ts,
      toDateTs                : query.to_date_ts,
      reportByType            : query.report_by_type,
      staffId                 : query.staff_id,
      shopId                  : query.shop_id
    }
    let url_read_service_sales = ''
    if(query.date_type == common_options.date_type.date)
      url_read_service_sales = url_read_service_sales__date
    if(query.date_type == common_options.date_type.month)
      url_read_service_sales = url_read_service_sales__month_range
    if(query.date_type == common_options.date_type.date_range)
      url_read_service_sales = url_read_service_sales__date_range
    try{
      let response = await this.http.post(url_read_service_sales, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.serviceSalesItems != null){
          let total_amount =  _.sumBy(response.data.result.serviceSalesItems, x=>x.amount)
          for(let item of response.data.result.serviceSalesItems){
            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              name     : item.key,
              quantity : item.quantity,
              amount   : item.amount,
              ratio    : tmp_ratio
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
  

  async getServiceSalesByItemReportAsync(query){
    let query_map = {
      fromDateTs              : query.from_date_ts,
      toDateTs                : query.to_date_ts,
      categoryId              : query.category_id,
      serviceId               : query.service_id,
      reportByType            : query.report_by_type,
      shopId                  : query.shop_id
    }
    let url_read_service_sales_by_item = ''
    if(query.date_type == common_options.date_type.date)
      url_read_service_sales_by_item = url_read_service_sales_by_item__date
    if(query.date_type == common_options.date_type.month)
      url_read_service_sales_by_item = url_read_service_sales_by_item__month
    if(query.date_type == common_options.date_type.date_range)
      url_read_service_sales_by_item = url_read_service_sales_by_item__date_range
    
    try{
      let response = await this.http.post(url_read_service_sales_by_item, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          let total_amount = _.sumBy(response.data.result, x=>x.amount)
          for(let item of response.data.result){
            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              name     : item.itemName,
              quantity : item.quantity,
              amount   : item.amount,
              ratio    : tmp_ratio
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getServiceSalesByMonthReportAsync(query){
    let query_map = {
      fromDateTs              : query.from_date_ts,
      toDateTs                : query.to_date_ts,
      categoryId              : query.category_id,
      serviceId               : query.service_id,
      staffId                 : query.staff_id,
      shopId                  : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_service_sales_by_months, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.serviceSalesByMonths != null){
          let total_amount = _.sumBy(response.data.result.serviceSalesByMonths, x=>x.amount)
          for(let item of response.data.result.serviceSalesByMonths){
            let tmp_key = item.monthOfYear.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let txt_month = `${tmp_year}-${tmp_month}`

            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              month    : txt_month,
              quantity : item.quantity,
              amount   : item.amount,
              ratio    : tmp_ratio
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getServiceSalesBySalesTypeReportAsync(query){
    let query_map = {
      fromDateTs              : query.from_date_ts,
      toDateTs                : query.to_date_ts,
      categoryId              : query.category_id,
      serviceId               : query.service_id,
      staffId                 : query.staff_id,
      prepaidSalesCountingType: query.prepaid_sales_counting_type,
      excludePointsDeduction  : query.exclude_points_deduction,
      salesTypeIds            : query.sales_type_ids,
      shopId                  : query.shop_id
    }
    let url_read_service_sales_by_sales_types = ''
    if(query.date_type == common_options.date_type.date)
      url_read_service_sales_by_sales_types = url_read_service_sales_by_sales_types__date
    if(query.date_type == common_options.date_type.month)
      url_read_service_sales_by_sales_types = url_read_service_sales_by_sales_types__month
    if(query.date_type == common_options.date_type.date_range)
      url_read_service_sales_by_sales_types = url_read_service_sales_by_sales_types__date_range

    try{
      let response = await this.http.post(url_read_service_sales_by_sales_types, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          for(let item of response.data.result){
            let tmp_staff = {
              staff_id  : item.staffId,
              staff_name: item.staff
            }
            let tmp_types = []
            for(let type of item.reportByTypes){
              let tmp_type = {
                sales_type_id: type.typeId,
                quantity     : type.quantity,
                amount       : type.amount
              }
              tmp_types.push(tmp_type)
            }

            let tmp_item = {
              staff      : tmp_staff,
              sales_types: tmp_types
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getProductSalesByMonthReportAsync(query){
    let query_map = {
      fromDateTs              : query.from_date_ts,
      toDateTs                : query.to_date_ts,
      categoryId              : query.product_category_id,
      productId               : query.product_id,
      staffId                 : query.staff_id,
      shopId                  : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_product_sales_by_months, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.productSalesByMonths != null){
          let total_amount = _.sumBy(response.data.result.productSalesByMonths, x=>x.amount)
          for(let item of response.data.result.productSalesByMonths){
            let tmp_key = item.monthOfYear.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let txt_month = `${tmp_year}-${tmp_month}`

            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              month    : txt_month,
              quantity : item.quantity,
              amount   : item.amount,
              ratio    : tmp_ratio
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getProductSalesByItemReportAsync(query){
    let query_map = {
      fromDateTs              : query.from_date_ts,
      toDateTs                : query.to_date_ts,
      reportByType            : query.report_by_type,
      shopId                  : query.shop_id
    }
    let url_read_product_sales_by_item = ''
    if(query.date_type == common_options.date_type.date)
      url_read_product_sales_by_item = url_read_product_sales_by_item__date
    if(query.date_type == common_options.date_type.month)
      url_read_product_sales_by_item = url_read_product_sales_by_item__month_range
    if(query.date_type == common_options.date_type.date_range)
      url_read_product_sales_by_item = url_read_product_sales_by_item__date_range
    try{
      let response = await this.http.post(url_read_product_sales_by_item, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.productSalesByItems != null){
          let total_amount = _.sumBy(response.data.result.productSalesByItems, x=>x.amount)
          for(let item of response.data.result.productSalesByItems){
            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.amount / total_amount * 100

            let tmp_item = {
              name     : item.key,
              quantity : item.quantity,
              amount   : item.amount,
              ratio    : tmp_ratio
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getSalesByDiscountCategoryReportAsync(query){
    let query_map = {
      fromDateTS: query.from_date_ts,
      toDateTS  : query.to_date_ts,
      staffId   : query.staff_id,
      shopId    : query.shop_id
    }
    let url_read_sales_by_discount_category = ''
    if(query.date_type == common_options.date_type.date)
      url_read_sales_by_discount_category = url_read_sales_by_discount_category__date
    if(query.date_type == common_options.date_type.month)
      url_read_sales_by_discount_category = url_read_sales_by_discount_category__month
    if(query.date_type == common_options.date_type.date_range)
      url_read_sales_by_discount_category = url_read_sales_by_discount_category__date_range

    try{
      let response = await this.http.post(url_read_sales_by_discount_category, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          let total_amount = _.sumBy(response.data.result, x=>x.discountAmount)
          
          for(let item of response.data.result){
            let tmp_ratio = 0
            if(total_amount!=0)
              tmp_ratio = item.discountAmount / total_amount * 100

            let tmp_item = {
              discount_category: item.discountCategory,
              quantity         : item.qty,
              discount_amount  : item.discountAmount,
              ratio            : tmp_ratio
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getSalesByRepeatClientsReportAsync(query){
    let query_map = {
      reportByType: query.report_by_type,
      fromDateTS  : query.from_date_ts,
      toDateTS    : query.to_date_ts,
      shopId      : query.shop_id
    }
    let url_read_sales_by_repeat_clients = ''
    if(query.date_type == common_options.date_type.date)
      url_read_sales_by_repeat_clients = url_read_sales_by_repeat_clients__date
    if(query.date_type == common_options.date_type.month)
      url_read_sales_by_repeat_clients = url_read_sales_by_repeat_clients__month
    if(query.date_type == common_options.date_type.date_range)
      url_read_sales_by_repeat_clients = url_read_sales_by_repeat_clients__date_range

    try{
      let response = await this.http.post(url_read_sales_by_repeat_clients, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        if(response.data.result != null && response.data.result.reportItems != null){
          let tmp_items = []
          let col_total_quantity_new          = 0
          let col_total_amount_new            = 0
          let col_total_quantity_repeat       = 0
          let col_total_amount_repeat         = 0
          let col_total_quantity_unregistered = 0
          let col_total_amount_unregistered   = 0
          for(let i in response.data.result.reportItems){
            let item = response.data.result.reportItems[i]
            let tmp_item = {
              item_type: item.itemType,
              key      : convertHtmlToTxt(item.key),
              quantity : item.quantity,
              amount   : item.amount
            }
            if(i == 0){
              tmp_items.push({
                key: tmp_item.key,
                types: [tmp_item]
              })
            }
            else {
              let same_key = tmp_items.filter(i => i.key == tmp_item.key)
              if(same_key.length == 0){
                tmp_items.push({
                  key: tmp_item.key,
                  types: [tmp_item]
                })
              }
              else {
                same_key[0].types.push(tmp_item)
              }
            }
            // client_type_enum
            //   unregistered : 0
            //   new          : 1
            //   repeat       : 2
            if(tmp_item.item_type == 0){
              col_total_quantity_unregistered += tmp_item.quantity
              col_total_amount_unregistered   += tmp_item.amount
            }
            if(tmp_item.item_type == 1){
              col_total_quantity_new += tmp_item.quantity
              col_total_amount_new   += tmp_item.amount
            }
            if(tmp_item.item_type == 2){
              col_total_quantity_repeat += tmp_item.quantity
              col_total_amount_repeat   += tmp_item.amount
            }
          }
          if(tmp_items.length > 0){
            tmp_items.push({
              key : 'TOTAL',
              types: [
                {
                  item_type: 1,
                  quantity : col_total_quantity_new,
                  amount   : col_total_amount_new
                },
                {
                  item_type: 2,
                  quantity : col_total_quantity_repeat,
                  amount   : col_total_amount_repeat
                },
                {
                  item_type: 0,
                  quantity : col_total_quantity_unregistered,
                  amount   : col_total_amount_unregistered
                }
              ]
            })
            for(let tmp_item of tmp_items){
              tmp_item.types.push({
                item_type: tmp_items.item_type,
                key      : tmp_items.key,
                quantity : tmp_item.types.reduce((total, item) => total + item.quantity, 0),
                amount   : tmp_item.types.reduce((total, item) => total + item.amount, 0)
              })
            }
          }
          this.result.data = tmp_items
        }
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getIncomeStatementReportAsync(query){
    let query_map = {
      fromDateTS: query.from_date_ts,
      toDateTS  : query.to_date_ts,
      shopId    : query.shop_id
    }
    let url_read_income_statement = ''
    if(query.date_type == common_options.date_type.date)
      url_read_income_statement = url_read_income_statement__date
    if(query.date_type == common_options.date_type.month)
      url_read_income_statement = url_read_income_statement__month
    if(query.date_type == common_options.date_type.date_range)
      url_read_income_statement = url_read_income_statement__date_range

    try{
      let response = await this.http.post(url_read_income_statement, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        if(response.data.result != null && response.data.result.income != null && response.data.result.expenditure != null){
          let key = 0
          let tmp_incomes = []
          for(let income of response.data.result.income){
            let tmp_income = {
              name  : income.itemName,
              amount: income.amount,
              key   : key
            }
            tmp_incomes.push(tmp_income)
            key++
          }
          
          let tmp_expenditures = []
          for(let income of response.data.result.expenditure){
            let tmp_expenditure = {
              name  : income.itemName,
              amount: income.amount,
              key   : key
            }
            tmp_expenditures.push(tmp_expenditure)
            key++
          }
          this.result.data = {
            incomes     : tmp_incomes,
            expenditures: tmp_expenditures
          }
        }
      }
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
  
  async getBookingDepositSummaryReportAsync(query){
    let query_map = {
      fromDateTS  : query.from_date_ts,
      toDateTS    : query.to_date_ts,
      reportByType: query.report_by_type,
      shopId      : query.shop_id
    }
    let url_read_booking_deposit_summary = ''
    if(query.date_type == common_options.date_type.date)
      url_read_booking_deposit_summary = url_read_booking_deposit_summary__date
    if(query.date_type == common_options.date_type.month)
      url_read_booking_deposit_summary = url_read_booking_deposit_summary__month
    if(query.date_type == common_options.date_type.date_range)
      url_read_booking_deposit_summary = url_read_booking_deposit_summary__date_range
    try{
      let response = await this.http.post(url_read_booking_deposit_summary, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          let total_deposit_quantity = 0
          let total_deposit_amount   = 0
          let total_refund_quantity  = 0
          let total_refund_amount    = 0
          let total_total_amount     = 0
          for(let item of response.data.result){
            let tmp_item = {}
            // report_by_type_enum
            //   deposit       : 1
            //   added_to_sales: 2
            if(query.report_by_typ == 1){
              tmp_item = {
                payment_method_name : item.paymentMethodName,
                deposit_quantity    : item.depositQuantity,
                deposit_amount      : item.depositAmount,
                refund_quantity     : item.refundQuantity,
                refund_amount       : item.refundAmount,
                total_amount        : item.depositAmount - item.refundAmount
              }
              total_deposit_quantity += tmp_item.deposit_quantity
              total_deposit_amount   += tmp_item.deposit_amount
              total_refund_quantity  += tmp_item.refund_quantity
              total_refund_amount    += tmp_item.refund_amount
              total_total_amount     += tmp_item.total_amount
            }
            if(query.report_by_typ == 1){
              tmp_item = {
                payment_method_name : item.paymentMethodName,
                deposit_quantity    : item.depositQuantity,
                deposit_amount      : item.depositAmount
              }
              total_deposit_quantity += tmp_item.deposit_quantity
              total_deposit_amount   += tmp_item.deposit_amount
              total_refund_quantity  += tmp_item.refund_quantity
            }
            tmp_items.push(tmp_item)
          }
          let tmp_item_total = {
            payment_method_name : 'TOTAL',
            deposit_quantity    : total_deposit_quantity,
            deposit_amount      : total_deposit_amount,
            refund_quantity     : total_refund_quantity,
            refund_amount       : total_refund_amount,
            total_amount        : total_total_amount
          }
          tmp_items.push(tmp_item_total)
          this.result.data = tmp_items
        }
        this.result.data = tmp_items
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getClientsSummaryReportAsync(query){
    let query_map = {
      fromDateTS: query.from_date_ts,
      toDateTS  : query.to_date_ts,
      shopId    : query.shop_id
    }
    let url_read_clients_summary = ''
    if(query.date_type == common_options.date_type.date)
      url_read_clients_summary = url_read_clients_summary__date
    if(query.date_type == common_options.date_type.month)
      url_read_clients_summary = url_read_clients_summary__month
    if(query.date_type == common_options.date_type.date_range)
      url_read_clients_summary = url_read_clients_summary__date_range

    try{
      let response = await this.http.post(url_read_clients_summary, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        if(response.data.result != null){
          let tmp_service_sales_clients = response.data.result.serviceSalesClients
          let tmp_prepaid_sales_clients = response.data.result.prepaidSalesClients
          let tmp_all_clients           = response.data.result.allClients
          let tmp_service_sales_clients_total = tmp_service_sales_clients.newClients + tmp_service_sales_clients.repeatClients
          this.result.data = {
            service_sales_clients: {
              new_clients       : tmp_service_sales_clients.newClients,
              repeat_clients    : tmp_service_sales_clients.repeatClients,
              total_clients     : tmp_service_sales_clients_total,
              deduction_clients : tmp_service_sales_clients.deductionClients,
              all_clients       : tmp_service_sales_clients_total + tmp_service_sales_clients.deductionClients
            },
            prepaid_sales_clients: {
              new_clients   : tmp_prepaid_sales_clients.newClients,
              repeat_clients: tmp_prepaid_sales_clients.repeatClients,
              total_clients : tmp_prepaid_sales_clients.newClients + tmp_prepaid_sales_clients.repeatClients
            },
            all_clients: {
              all_clients                          : tmp_all_clients.allClients,
              all_prepaid_clients                  : tmp_all_clients.allPrepaidClients,
              all_prepaid_clients_visited_in_2_week: tmp_all_clients.allPrepaidClientsVisitedInTwoWeeks,
            }
          }
        }
      }
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getNewClientsRepeatReportAsync(query){
    let query_map = {
      fromDateTS              : query.from_date_ts,
      toDateTS                : query.to_date_ts,
      shopId                  : query.shop_id
    }
    try{
      let response = await this.http.post(url_new_client_repeat_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          let total_row_new_clients = 0
          let total_row_repeat_infos = []
          for(let item of response.data.result.reportItems){
            total_row_new_clients += item.totalNewClients
            let tmp_repeat_infos = []
            for(let i in item.repeatInfos){
              let repeat_info = item.repeatInfos[i]
              let tmp_repeat_info = {
                year_month    : repeat_info.repeatOfYearMonth,
                repeat_clients: repeat_info.totalRepeatClients
              }
              tmp_repeat_infos.push(tmp_repeat_info)
              // total row
              if(total_row_repeat_infos.length == 0){
                total_row_repeat_infos.push(_.cloneDeep(tmp_repeat_info))
              }
              else {
                let same_repeat_info = total_row_repeat_infos.filter(ri => ri.year_month == tmp_repeat_info.year_month)
                if(same_repeat_info.length == 0){
                  total_row_repeat_infos.push(_.cloneDeep(tmp_repeat_info))
                }
                else {
                  same_repeat_info[0].repeat_clients += tmp_repeat_info.repeat_clients
                }
              }
            }
            // total col
            let total_col_repeat_info = {
              year_month    : 0,
              repeat_clients: tmp_repeat_infos.reduce((total, item) => total + item.repeat_clients, 0)
            }
            tmp_repeat_infos.push(total_col_repeat_info)

            let tmp_item = {
              staff_name  : item.staffName,
              new_clients : item.totalNewClients,
              repeat_infos: tmp_repeat_infos,
            }
            tmp_items.push(tmp_item)
          }
          if(tmp_items.length > 0){
            total_row_repeat_infos.push({
              year_month    : 0,
              repeat_clients: total_row_repeat_infos.reduce((total, item) => total + item.repeat_clients, 0)
            })
            let tmp_item_total = {
              staff_name  : 'TOTAL',
              new_clients : total_row_new_clients,
              repeat_infos: total_row_repeat_infos,
            }
            tmp_items.push(tmp_item_total)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
  
  async getNewClientsByMonthReportAsync(query){
    let query_map = {
      referralSourceId        : query.referral_source_id,
      fromDateTS              : query.from_date_ts,
      toDateTS                : query.to_date_ts,
      shopId                  : query.shop_id
    }
    try{
      let response = await this.http.post(url_new_client_by_months_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.reportItems != null){
          for(let item of response.data.result.reportItems){
            let tmp_key = item.yearAndMonth.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let txt_month = `${tmp_year}-${tmp_month}`

            let tmp_item = {
              month           : txt_month,
              number_of_client: item.numberOfClients,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getNewClientsByReferralSource(query){
    let query_map = {
      fromDateTS              : query.from_date.value,
      toDateTS                : query.to_date.value,
      shopId                  : query.shop_id
    }
    let url_new_client_by_referral_source_report = ''
    if(query.date_type == common_options.date_type.month)
      url_new_client_by_referral_source_report = url_new_client_by_referral_source__month_range
    if(query.date_type == common_options.date_type.date_range)
      url_new_client_by_referral_source_report = url_new_client_by_referral_source__date_range

    try{
      let response = await this.http.post(url_new_client_by_referral_source_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.referralSources != null){
          for(let item of response.data.result.referralSources){
            let tmp_item = {
              referral_source_id    : item.referralSourceId,
              referral_source_name  : item.referralSourceName,
              total_client          : item.totalClient,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }

    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  // BookingsByDate
  async getBookingsByDateReportAsync(query){
    let query_map = {
      fromDateTS              : query.from_date_ts,
      toDateTS                : query.to_date_ts,
      bookingsSource          : query.bookings_source,
      shopId                  : query.shop_id
    }

    try{
      let response = await this.http.post(url_bookings_by_date, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.items != null){
          for(let item of response.data.result.items){
            let tmp_key = item.reportDate.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let tmp_date = tmp_key.slice(6,8)
            let txt_date = `${tmp_year}`
            if(tmp_month.length > 0)
              txt_date += `-${tmp_month}`
            if(tmp_date.length > 0)
              txt_date += `-${tmp_date}`
              
            let tmp_item = {
              date              : txt_date,
              total             : item.totalBookings,
              cancel            : item.totalCanceledBookings,
              no_show           : item.totalNoShowedBookings,
              cancel_percentage : item.totalCanceledBookings / item.totalBookings * 100,
              no_show_percentage: item.totalNoShowedBookings / item.totalBookings * 100
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getBookingsByMonthReportAsync(query){
    let query_map = {
      fromDateTS              : query.from_date_ts,
      toDateTS                : query.to_date_ts,
      bookingsSource          : query.bookings_source,
      shopId                  : query.shop_id
    }

    try{
      let response = await this.http.post(url_bookings_by_month, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.items != null){
          for(let item of response.data.result.items){
            let tmp_key = item.reportMonth.toString()
            let tmp_year = tmp_key.slice(0,4)
            let tmp_month = tmp_key.slice(4,6)
            let txt_month = `${tmp_year}`
            if(tmp_month.length > 0)
              txt_month += `-${tmp_month}`
              
            let tmp_item = {
              month             : txt_month,
              total             : item.totalBookings,
              cancel            : item.totalCanceledBookings,
              no_show           : item.totalNoShowedBookings,
              cancel_percentage : item.totalCanceledBookings / item.totalBookings * 100,
              no_show_percentage: item.totalNoShowedBookings / item.totalBookings * 100
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getDetailedAnalysisOfBookingsReportAsync(query){
    let query_map = {
      fromDateTS                : query.from_date_ts,
      toDateTS                  : query.to_date_ts,
      shopId                    : query.shop_id,

      // by report 
      reportMonthTS             : query.report_month_ts,
      reportTimeSlotInterval    : query.report_time_slot_interval,
      includedBookingsStatus    : query.included_bookings_status
    }
    let url_detailed_analysis_of_bookings = ''
    if(query.date_type == common_options.date_type.month){
      if(query.report_by_type == bookings_options.booking_report_by_type.resource)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__month__resource
      if(query.report_by_type == bookings_options.booking_report_by_type.day_of_week)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__month__day
      if(query.report_by_type == bookings_options.booking_report_by_type.hour_of_day)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__month__hour
    }
    if(query.date_type == common_options.date_type.date_range){
      if(query.report_by_type == bookings_options.booking_report_by_type.resource)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__date_range__resource
      if(query.report_by_type == bookings_options.booking_report_by_type.day_of_week)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__date_range__day
      if(query.report_by_type == bookings_options.booking_report_by_type.hour_of_day)
        url_detailed_analysis_of_bookings = url_detailed_analysis_of_bookings__date_range__hour
    }
    try{
      let response = await this.http.post(url_detailed_analysis_of_bookings, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null && response.data.result.items != null){
          for(let item of response.data.result.items){
            let tmp_name = ''
            if(query.report_by_type == bookings_options.booking_report_by_type.resource)
              tmp_name = item.performingResource.resourceName
            if(query.report_by_type == bookings_options.booking_report_by_type.day_of_week)
              tmp_name = item.dayOfWeek
            if(query.report_by_type == bookings_options.booking_report_by_type.hour_of_day)
              tmp_name = item.hourOfDay

            let tmp_item = {
              name              : tmp_name,
              number_of_bookings: item.numbersOfBookings,
            }
            tmp_items.push(tmp_item)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  // PrepaidCards
  async getPrepaidCardsReportAsync(query){
    let query_map = {
      pageSize  : query.page_size,
      pageNumber: query.page_number,
      shopId    : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_prepaid_cards_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ReportPrepaidCardViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          items        : tmp_items,
          pagination   : mapPagingFromApi(response.data.result.pagingInfo),
          total_balance: response.data.result.totalBalance
        }
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  // PrepaidCardSummary
  async getPrepaidCardSummaryReportAsync(query){
    let query_map = {
      pageSize  : query.page_size,
      pageNumber: query.page_number,
      shopId    : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_prepaid_card_summary_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ReportPrepaidCardSummaryViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          items: tmp_items,
          pagination: mapPagingFromApi(response.data.result.pagingInfo),
          summary: {
            total_clients         : response.data.result.summary.totalClients,
            total_remaining_amount: response.data.result.summary.totalRemainingAmount
          }
        }
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  // PrepaidServices
  async getPrepaidServicesReportAsync(query){
    let query_map = {
      pageSize  : query.page_size,
      pageNumber: query.page_number,
      shopId    : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_prepaid_services_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ReportPrepaidServiceViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          items: tmp_items,
          pagination: mapPagingFromApi(response.data.result.pagingInfo),
          total_remaining_amount: response.data.result.totalRemainingAmount
        }
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  // LoyaltyPoints
  async getLoyaltyPointsReportAsync(query){
    let query_map = {
      pageSize  : query.page_size,
      pageNumber: query.page_number,
      shopId    : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_loyalty_points_report, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ReportLoyaltyPointViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          items: tmp_items,
          pagination: mapPagingFromApi(response.data.result.pagingInfo),
          summary: {
            total_client: response.data.result.summary.totalClient,
            total_points: response.data.result.summary.totalPoints
          }
        }
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  // SalesTotal
  async getSalesTotalReportAsync(query){
    let params = {
      fromDateTS : query.from_date.value,
      toDateTS   : query.to_date.value,
      staffId    : query.staff_id,
      shopId     : query.shop_id
    }
    let url_read_sales_total_report = ''
    if(query.date_type  == common_options.date_type.date)
      url_read_sales_total_report = url_read_sales_total_report__date
    if(query.date_type  == common_options.date_type.month)
      url_read_sales_total_report = url_read_sales_total_report__month
    if(query.date_type  == common_options.date_type.date_range)
      url_read_sales_total_report = url_read_sales_total_report__date_range
    try{
      let response               = await this.http.post(url_read_sales_total_report,params)
      this.result.is_ok          = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_sales_total   = []
        let tmp_payment_total = []
        let tmp_item_total = {}
        let tmp_item_refund = {}
        let tmp_item_net_sales_total = {}
        let tmp_detail_sales_total = []
        if(response.data.result.salesTotal){
          let total_sales_quantity = 0
          let total_sales_amount   = 0
          let total_refund_quantity= 0
          let total_refund_amount  = 0
          for(let item of response.data.result.salesTotal){
            let tmp_item_vm = new SalesTotalViewModel()
            tmp_item_vm.mapFieldsFromApi(item)
            tmp_sales_total.push(tmp_item_vm)

            total_sales_quantity += tmp_item_vm.fields.sales.quantity
            total_sales_amount   += tmp_item_vm.fields.sales.amount
            total_refund_quantity+= tmp_item_vm.fields.refund.quantity
            total_refund_amount  += tmp_item_vm.fields.refund.amount
          }
          tmp_item_total = new SalesTotalViewModel()
          tmp_item_total.fields.sales_item      = 'TOTAL'
          tmp_item_total.fields.sales.quantity  = total_sales_quantity
          tmp_item_total.fields.sales.amount    = total_sales_amount

          tmp_item_refund = new SalesTotalViewModel()
          tmp_item_refund.fields.sales_item      = 'REFUND'
          tmp_item_refund.fields.refund.quantity = total_refund_quantity
          tmp_item_refund.fields.refund.amount   = total_refund_amount

          tmp_item_net_sales_total = new SalesTotalViewModel()
          tmp_item_net_sales_total.fields.sales_item     = 'NET_SALES_TOTAL'
          tmp_item_net_sales_total.fields.sales.quantity = tmp_item_total.fields.sales.quantity + tmp_item_refund.fields.refund.quantity
          tmp_item_net_sales_total.fields.sales.amount   = tmp_item_total.fields.sales.amount + tmp_item_refund.fields.refund.amount

          if(tmp_sales_total.length > 0)
            tmp_sales_total.push(tmp_item_total, tmp_item_refund, tmp_item_net_sales_total)

          //Detail sales total
          let detail_sales_total_view_model = new DetailSalesTotalViewModel()
          tmp_detail_sales_total = detail_sales_total_view_model.mapFieldFromApi(response.data.result.salesTotal)
        }
        if(response.data.result.paymentTotal){
          let total_sales_amount   = 0
          let total_refund_amount  = 0
          let total_outstanding    = 0
          let total_all            = 0
          for(let item of response.data.result.paymentTotal.items){
            let tmp_item_vm = new PaymentTotalViewModel()
            tmp_item_vm.mapFieldsFromApi(item)
            tmp_payment_total.push(tmp_item_vm)

            total_sales_amount   += tmp_item_vm.fields.sales_amount
            total_refund_amount  += tmp_item_vm.fields.refund_amount
            total_outstanding    += tmp_item_vm.fields.outstanding
            total_all            += tmp_item_vm.fields.total
          }
          tmp_item_total = new PaymentTotalViewModel()
          tmp_item_total.fields.payment_method_name = 'TOTAL'
          tmp_item_total.fields.sales_amount        = total_sales_amount
          tmp_item_total.fields.refund_amount       = total_refund_amount
          tmp_item_total.fields.outstanding         = total_outstanding
          tmp_item_total.fields.total               = total_all
          if(tmp_payment_total.length > 0)
            tmp_payment_total.push(tmp_item_total)
        }
        this.result.data = {
          detail_sales_total: tmp_detail_sales_total,
          sales_total        : tmp_sales_total,
          payment_total      : tmp_payment_total
        }
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getSalesTotalByStaffReportAsync(query){
    let params = {
      fromDateTS : query.from_date_ts,
      toDateTS   : query.to_date_ts,
      shopId     : query.shop_id
    }
    let url_read_sales_total_by_staff_report = ''
    if(query.date_type  == common_options.date_type.date)
      url_read_sales_total_by_staff_report = url_read_sales_total_by_staff_report__date
    if(query.date_type  == common_options.date_type.month)
      url_read_sales_total_by_staff_report = url_read_sales_total_by_staff_report__month
    if(query.date_type  == common_options.date_type.date_range)
      url_read_sales_total_by_staff_report = url_read_sales_total_by_staff_report__date_range
    try{
      let response               = await this.http.post(url_read_sales_total_by_staff_report, params)
      this.result.is_ok          = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          let tmp_item_total_data = {
            staffName: '',
            services: {
              salesAmount   : 0,
              salesQuantity : 0,
              refundAmount  : 0,
              refundQuantity: 0
            },
            products: {
              salesAmount   : 0,
              salesQuantity : 0,
              refundAmount  : 0,
              refundQuantity: 0
            },
            prepaidCards: {
              salesAmount   : 0,
              salesQuantity : 0,
              refundAmount  : 0,
              refundQuantity: 0
            },
            prepaidServices: {
              salesAmount   : 0,
              salesQuantity : 0,
              refundAmount  : 0,
              refundQuantity: 0
            }
          }
          for(let item of response.data.result){
            let tmp_item_vm = new SalesByStaffViewModel()
            tmp_item_vm.mapFieldsFromApi(item)
            tmp_items.push(tmp_item_vm)

            tmp_item_total_data.services.salesAmount           += tmp_item_vm.fields.services.sales_amount
            tmp_item_total_data.services.salesQuantity         += tmp_item_vm.fields.services.sales_quantity
            tmp_item_total_data.services.refundAmount          += tmp_item_vm.fields.services.refund_amount
            tmp_item_total_data.services.refundQuantity        += tmp_item_vm.fields.services.refund_quantity

            tmp_item_total_data.products.salesAmount           += tmp_item_vm.fields.products.sales_amount
            tmp_item_total_data.products.salesQuantity         += tmp_item_vm.fields.products.sales_quantity
            tmp_item_total_data.products.refundAmount          += tmp_item_vm.fields.products.refund_amount
            tmp_item_total_data.products.refundQuantity        += tmp_item_vm.fields.products.refund_quantity

            tmp_item_total_data.prepaidCards.salesAmount      += tmp_item_vm.fields.prepaid_cards.sales_amount
            tmp_item_total_data.prepaidCards.salesQuantity    += tmp_item_vm.fields.prepaid_cards.sales_quantity
            tmp_item_total_data.prepaidCards.refundAmount     += tmp_item_vm.fields.prepaid_cards.refund_amount
            tmp_item_total_data.prepaidCards.refundQuantity   += tmp_item_vm.fields.prepaid_cards.refund_quantity

            tmp_item_total_data.prepaidServices.salesAmount   += tmp_item_vm.fields.prepaid_services.sales_amount
            tmp_item_total_data.prepaidServices.salesQuantity += tmp_item_vm.fields.prepaid_services.sales_quantity
            tmp_item_total_data.prepaidServices.refundAmount  += tmp_item_vm.fields.prepaid_services.refund_amount
            tmp_item_total_data.prepaidServices.refundQuantity+= tmp_item_vm.fields.prepaid_services.refund_quantity
          }
          tmp_item_total_data.staffName = 'TOTAL'
          let tmp_item_total = new SalesByStaffViewModel()
          tmp_item_total.mapFieldsFromApi(tmp_item_total_data)
          tmp_items = [...tmp_items, tmp_item_total]
        }
        this.result.data = tmp_items
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getSalesTotalByItemReportAsync(query){
    let params = {
      fromDateTS  : query.from_date_ts,
      toDateTS    : query.to_date_ts,
      reportByType: query.display_by_type,
      staffId     : query.staff_id,
      shopId      : query.shop_id
    }
    let url_read_sales_total_by_item_report = ''
    if(query.sales_item_type == sales_options.sales_goods_type.service){
      if(query.date_type  == common_options.date_type.date)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_service_report__date
      if(query.date_type  == common_options.date_type.month)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_service_report__month
      if(query.date_type  == common_options.date_type.date_range)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_service_report__date_range
    }
    if(query.sales_item_type == sales_options.sales_goods_type.product){
      if(query.date_type  == common_options.date_type.date)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_product_report__date
      if(query.date_type  == common_options.date_type.month)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_product_report__month
      if(query.date_type  == common_options.date_type.date_range)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_product_report__date_range
    }
    if(query.sales_item_type == sales_options.sales_goods_type.prepaid_card){
      if(query.date_type  == common_options.date_type.date)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_prepaid_card_report__date
      if(query.date_type  == common_options.date_type.month)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_prepaid_card_report__month
      if(query.date_type  == common_options.date_type.date_range)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_prepaid_card_report__date_range
    }
    if(query.sales_item_type == sales_options.sales_goods_type.prepaid_service){
      if(query.date_type  == common_options.date_type.date)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_prepaid_service_report__date
      if(query.date_type  == common_options.date_type.month)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_prepaid_service_report__month
      if(query.date_type  == common_options.date_type.date_range)
        url_read_sales_total_by_item_report = url_read_sales_total_by_item_prepaid_service_report__date_range
    }
    try{
      let response               = await this.http.post(url_read_sales_total_by_item_report, params)
      this.result.is_ok          = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_items = []
        if(response.data.result != null){
          if(query.sales_item_type == sales_options.sales_goods_type.service){
            let tmp_total_sales_quantity            = 0
            let tmp_total_sales_amount              = 0
            let tmp_total_refund_quantity           = 0
            let tmp_total_refund_amount             = 0
            let tmp_total_balance_deduction_quantity= 0
            let tmp_total_balance_deduction_amount  = 0
            let tmp_total_service_deduction_quantity= 0
            let tmp_total_service_deduction_amount  = 0
            let tmp_total_total_quantity            = 0
            let tmp_total_total_amount              = 0
            let tmp_total_points_deduction          = 0
            for(let item of response.data.result){
              let tmp_item_vm = new SalesByItemServiceViewModel()
              tmp_item_vm.mapFieldsFromApi(item)
              tmp_items.push(tmp_item_vm)

              tmp_total_sales_quantity            += tmp_item_vm.fields.sales.quantity
              tmp_total_sales_amount              += tmp_item_vm.fields.sales.amount
              tmp_total_refund_quantity           += tmp_item_vm.fields.refund.quantity
              tmp_total_refund_amount             += tmp_item_vm.fields.refund.amount
              tmp_total_balance_deduction_quantity+= tmp_item_vm.fields.balance_deduction.quantity
              tmp_total_balance_deduction_amount  += tmp_item_vm.fields.balance_deduction.amount
              tmp_total_service_deduction_quantity+= tmp_item_vm.fields.service_deduction.quantity
              tmp_total_service_deduction_amount  += tmp_item_vm.fields.service_deduction.amount
              tmp_total_total_quantity            += tmp_item_vm.fields.total.quantity
              tmp_total_total_amount              += tmp_item_vm.fields.total.amount
              tmp_total_points_deduction          += tmp_item_vm.fields.points_deduction
            }
            let tmp_item_total = new SalesByItemServiceViewModel()
            let tmp_average_unit_price = 0
            if(tmp_total_total_quantity > 0)
              tmp_average_unit_price = tmp_total_total_amount / tmp_total_total_quantity

            tmp_item_total.fields.category_name             = 'TOTAL'
            tmp_item_total.fields.service_name              = ''
            tmp_item_total.fields.sales.quantity            = tmp_total_sales_quantity
            tmp_item_total.fields.sales.amount              = tmp_total_sales_amount
            tmp_item_total.fields.refund.quantity           = tmp_total_refund_quantity
            tmp_item_total.fields.refund.amount             = tmp_total_refund_amount
            tmp_item_total.fields.balance_deduction.quantity= tmp_total_balance_deduction_quantity
            tmp_item_total.fields.balance_deduction.amount  = tmp_total_balance_deduction_amount
            tmp_item_total.fields.service_deduction.quantity= tmp_total_service_deduction_quantity
            tmp_item_total.fields.service_deduction.amount  = tmp_total_service_deduction_amount
            tmp_item_total.fields.total.quantity            = tmp_total_total_quantity
            tmp_item_total.fields.total.amount              = tmp_total_total_amount
            tmp_item_total.fields.average_unit_price        = tmp_average_unit_price
            tmp_item_total.fields.points_deduction          = tmp_total_points_deduction
            tmp_items.push(tmp_item_total)
          }
          if(query.sales_item_type == sales_options.sales_goods_type.product){
            let total_sales_quantity  = 0
            let total_sales_amount    = 0
            let total_refund_quantity = 0
            let total_refund_amount   = 0
            let total_supplier_price  = 0
            let total_purchase_amount = 0
            let total_sales_profit    = 0
            for(let item of response.data.result){
              let tmp_item_vm = new SalesByItemProductViewModel()
              tmp_item_vm.mapFieldsFromApi(item)
              tmp_items.push(tmp_item_vm)

              total_sales_quantity  += tmp_item_vm.fields.sales.quantity
              total_sales_amount    += tmp_item_vm.fields.sales.amount
              total_refund_quantity += tmp_item_vm.fields.refund.quantity
              total_refund_amount   += tmp_item_vm.fields.refund.amount
              total_supplier_price  += tmp_item_vm.fields.supplier_price
              total_purchase_amount += tmp_item_vm.fields.purchase_amount
              total_sales_profit    += tmp_item_vm.fields.sales_profit
            }
            let tmp_item_total = new SalesByItemProductViewModel()
            tmp_item_total.fields.product_code   = ''
            tmp_item_total.fields.product_name   = 'TOTAL'
            tmp_item_total.fields.sales.quantity = total_sales_quantity
            tmp_item_total.fields.sales.amount   = total_sales_amount
            tmp_item_total.fields.refund.quantity= total_refund_quantity
            tmp_item_total.fields.refund.amount  = total_refund_amount
            tmp_item_total.fields.supplier_price = total_supplier_price / response.data.result.length
            tmp_item_total.fields.purchase_amount= total_purchase_amount
            tmp_item_total.fields.sales_profit   = total_sales_profit
            tmp_items.push(tmp_item_total)
          }
          if(query.sales_item_type == sales_options.sales_goods_type.prepaid_card){
            let total_sales_quantity  = 0
            let total_sales_amount    = 0
            let total_refund_quantity = 0
            let total_refund_amount   = 0
            for(let item of response.data.result){
              let tmp_item_vm = new SalesByItemPrepaidCardViewModel()
              tmp_item_vm.mapFieldsFromApi(item)
              tmp_items.push(tmp_item_vm)

              total_sales_quantity  += tmp_item_vm.fields.sales.quantity
              total_sales_amount    += tmp_item_vm.fields.sales.amount
              total_refund_quantity += tmp_item_vm.fields.refund.quantity
              total_refund_amount   += tmp_item_vm.fields.refund.amount
            }
            let tmp_item_total = new SalesByItemPrepaidCardViewModel()
            tmp_item_total.fields.prepaid_card_name = 'TOTAL'
            tmp_item_total.fields.sales.quantity    = total_sales_quantity
            tmp_item_total.fields.sales.amount      = total_sales_amount
            tmp_item_total.fields.refund.quantity   = total_refund_quantity
            tmp_item_total.fields.refund.amount     = total_refund_amount
            tmp_item_total.fields.total             = total_sales_amount - total_refund_amount
            tmp_items.push(tmp_item_total)
          }
          if(query.sales_item_type == sales_options.sales_goods_type.prepaid_service){
            let total_sales_quantity                   = 0
            let total_sales_amount                     = 0
            let total_service_deduction_quantity       = 0
            let total_service_deduction_amount         = 0
            let total_service_deduction_refund_quantity= 0
            let total_service_deduction_refund_amount  = 0
            let total_points_deduction          = 0
            for(let item of response.data.result){
              let tmp_item_vm = new SalesByItemPrepaidServiceViewModel()
              tmp_item_vm.mapFieldsFromApi(item)
              tmp_items.push(tmp_item_vm)

              total_sales_quantity                    += tmp_item_vm.fields.sales.quantity
              total_sales_amount                      += tmp_item_vm.fields.sales.amount
              total_service_deduction_quantity        += tmp_item_vm.fields.service_deduction.quantity
              total_service_deduction_amount          += tmp_item_vm.fields.service_deduction.amount
              total_service_deduction_refund_quantity += tmp_item_vm.fields.service_deduction_refund.quantity
              total_service_deduction_refund_amount   += tmp_item_vm.fields.service_deduction_refund.amount
              total_points_deduction                  += tmp_item_vm.fields.points_deduction
            }
            let tmp_item_total = new SalesByItemPrepaidServiceViewModel()
            tmp_item_total.fields.category_name                    = 'TOTAL'
            tmp_item_total.fields.prepaid_service_name             = ''
            tmp_item_total.fields.sales.quantity                   = total_sales_quantity
            tmp_item_total.fields.sales.amount                     = total_sales_amount
            tmp_item_total.fields.service_deduction.quantity       = total_service_deduction_quantity
            tmp_item_total.fields.service_deduction.amount         = total_service_deduction_amount
            tmp_item_total.fields.service_deduction_refund.quantity= total_service_deduction_refund_quantity
            tmp_item_total.fields.service_deduction_refund.amount  = total_service_deduction_refund_amount
            tmp_item_total.fields.points_deduction                 = total_points_deduction
            tmp_items.push(tmp_item_total)
          }
        }
        this.result.data = tmp_items
      }
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}