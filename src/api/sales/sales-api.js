import Http                                    from '../../helpers/http'
import i18n                                    from '../../translate/translate'
import { getServiceUrl }                       from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi }                    from '../../helpers/common'

import SalesViewModel        from '../../view-model/sales/sales/sales-view-model'
import SalesBriefViewModel   from '../../view-model/sales/sales/sales-brief-view-model'
import SalesDeleteViewModel  from '../../view-model/sales/sales/sales-delete-view-model'

import SalesGeneralSetupViewModel         from '../../view-model/sales/sales-general-setup-view-model'
import DataProtectionAndSecurityViewModel from '../../view-model/sales/data-protection-and-security-view-model'
import PaymentMethodViewModel             from '../../view-model/sales/payment-method-view-model'
import SalesTypeViewModel                 from '../../view-model/sales/sales-type-view-model'
import DiscountCategoryViewModel          from '../../view-model/sales/discount-category-view-model'
import LoyaltyPointsSetupsViewModel       from '../../view-model/sales/loyalty-points-setups-view-model'
import BookingToalViewModel               from '../../view-model/bookings/booking-total/booking-total-view-model'
import ClientTotalViewModel               from '../../view-model/clients/client-total/client-total-view-model'
import SalesTotalBoardHomeViewModel       from '../../view-model/sales/report/sales-total/sales-total-board-home-view-model'

const url_read_sales_setup      = getServiceUrl(SERVICE_TYPES.SALES_SETUP_READ, 1)
const url_read_all_sales_setups = url_read_sales_setup + SERVICE_EXTEND_TYPES.ALL_SALES_SETUP_LIVE

const url_read    = getServiceUrl(SERVICE_TYPES.SALES_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.SALES_CMD, 1)
const url_aggr    = getServiceUrl(SERVICE_TYPES.SALES_AGGR, 1)

const url_read_sales_live                     = url_read + SERVICE_EXTEND_TYPES.SALES_LIVE
const url_read_sales_by_id_live               = url_read + SERVICE_EXTEND_TYPES.SALES_BY_ID_LIVE
const url_read_sales_histories_live           = url_read + SERVICE_EXTEND_TYPES.SALES_HISTORIES_LIVE
const url_read_sales_by_booking_id_live       = url_read + SERVICE_EXTEND_TYPES.SALES_BY_BOOKING_ID_LIVE
const url_read_sales_histories_by_client      = url_read + SERVICE_EXTEND_TYPES.SALES_HISTORIES_BY_CLIENT
const url_read_sales_histories_by_create_user = url_read + SERVICE_EXTEND_TYPES.SALES_HISTORIES_BY_CREATE_USER
// let url_read_sales_by_time_report           = url_read    + SERVICE_EXTEND_TYPES.SALES_BY_TIME_REPORT


let url_cmd_sales_add_by_checkout_booking   = url_aggr    + SERVICE_EXTEND_TYPES.SALES_ADD_BY_CHECKOUT_BOOKING
let url_cmd_sales_notes                     = url_command + SERVICE_EXTEND_TYPES.SALES_NOTES
let url_aggr_sales_board_home               = url_aggr    + '/BoardHome'

export default class SalesApi {
  constructor(){
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapParamToApi(query){
    return {
      pageSize: query.page_size,
      pageNumber: query.page_number,
      shopId: query.shop_id,
      status: query.status
    }
  }
  mapParamFromApi(pagination){
    return {
      page_number : pagination.pageNumber,
      page_size   : pagination.pageSize,
      total_items : pagination.totalItems,
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

  async getAllSalesSetupsAsync(query){
    let query_data = {
      status: query.status,
      shopId: query.shop_id
    }

    try {
      const response = await this.http.post(url_read_all_sales_setups, query_data)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let result = {
          sales_general_setup     : {},
          sales_data_setup        : {},
          payment_method_setup    : {},
          sales_type_setup        : {},
          discount_category_setup : {},
          loyalty_points_setups   : {}
        }

        if(response.data.result.salesGeneralSetup != null){
          let sales_general_setup_vm = new SalesGeneralSetupViewModel()
          sales_general_setup_vm.mapFieldsFromApi(response.data.result.salesGeneralSetup)
          result.sales_general_setup = sales_general_setup_vm.getFields()
        }
        else {
          this.result.error_messages.push(i18n.t('sales.sales-general-not-setup-yet'))
        }

        if(response.data.result.salesDataProtectionAndSecuritySetup != null){
          let sales_data_setup_vm = new DataProtectionAndSecurityViewModel()
          sales_data_setup_vm.mapFieldsFromApi(response.data.result.salesDataProtectionAndSecuritySetup)
          result.sales_data_setup = sales_data_setup_vm.getFields()
        }
        else {
          this.result.error_messages.push(i18n.t('sales.data-protection-and-security-not-setup-yet'))
        }

        if(response.data.result.paymentMethodSetups.length > 0){
          let payment_method_setup_vm = new PaymentMethodViewModel()
          result.payment_method_setup = payment_method_setup_vm.mapPaymentMethodsFromApi(response.data.result.paymentMethodSetups)
        }
        else {
          this.result.error_messages.push(i18n.t('sales.payment-methods-not-setup-yet'))
        }

        if(response.data.result.salesTypeSetups.length > 0){
          let sales_type_setup_vm = new SalesTypeViewModel()
          result.sales_type_setup = sales_type_setup_vm.mapSalesTypesFromApi(response.data.result.salesTypeSetups)
        }
        else {
          this.result.error_messages.push(i18n.t('sales.sales-types-not-setup-yet'))
        }

        if(response.data.result.discountCategorySetups.length > 0){
          let discount_category_setup_vm = new DiscountCategoryViewModel()
          result.discount_category_setup = discount_category_setup_vm.mapDiscountCategorysFromApi(response.data.result.discountCategorySetups)
        }
        else {
          this.result.error_messages.push(i18n.t('sales.discount-categories-not-setup-yet'))
        }

        if(response.data.result.loyaltyPointsSetups.length > 0){
          let loyalty_points_setups_vm = new LoyaltyPointsSetupsViewModel()
          loyalty_points_setups_vm.mapFieldsFromApi(response.data.result.loyaltyPointsSetups)
          result.loyalty_points_setups = loyalty_points_setups_vm.getFields()
        }
        else {
          this.result.error_messages.push(i18n.t('sales.loyalty-points-not-setup-yet'))
        }

        if(this.result.error_messages.length > 0){
          this.result.is_ok = false
          this.result.error_messages = [i18n.t('sales.missing-sales-setup'), ...this.result.error_messages]
        }
        
        this.result.data = result
      }
    }
    catch(e){ 
      return this.http.loadError(e)
    }
    return this.result
  }

  async getSalesLiveAsync(query){
    let query_map = {
      salesNumber: query.sales_number,
      status     : query.status,
      shopId     : query.shop_id
    }
    let result = await this.getSalesByUrlAndQueryAsync(url_read_sales_live,query_map)
    return result
  }

  async getSalesByIdLiveAsync(query){
    let query_map = {
      salesId    : query.sales_id,
      shopId     : query.shop_id
    }
    let result = await this.getSalesByUrlAndQueryAsync(url_read_sales_by_id_live,query_map)
    return result
  }

  async getSalesByBookingIdLiveAsync(query){
    const query_map = {
      shopId: query.shop_id,
      bookingId: query.booking_id,
    }
    const result = await this.getSalesByUrlAndQueryAsync(url_read_sales_by_booking_id_live, query_map)
    return result
  }

  async getSalesByUrlAndQueryAsync(url,query){
    try {
      const response = await this.http.post(url, query)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let tmp_sales = new SalesViewModel()
        tmp_sales.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_sales.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }


  async getSalesHistoryByClientAsync(query) {
    let query_map = {
      clientId      : query.client_id,
      fromDateTS    : query.from_date_ts,
      toDateTS      : query.to_date_ts,
      includeDeleted: query.include_deleted,
      pageSize      : query.page_size,
      pageNumber    : query.page_number,
      shopId        : query.shop_id,
      clientShopId  : query.client_shop_id,
    }
    let result = await this.getSalesHistoriesByUrlAndQueryAsync(url_read_sales_histories_by_client,query_map)
    return result
  }

  async getSalesHistoriesByCreateUserAsync(query){
    let params = {
      fromDateTS  : query.from_date.value,
      toDateTS    : query.to_date.value,
      createdById : query.user_id,
      pageSize    : query.page_size,
      pageNumber  : query.page_number,
      shopId      : query.shop_id
    }
    let result = await this.getSalesHistoriesByUrlAndQueryAsync(url_read_sales_histories_by_create_user,params)
    return result
  }

  async getSalesHistoriesLiveAsync(query){
    let params = {
      dateType              : query.date_type,
      fromDateTS            : query.from_date.value,
      toDateTS              : query.to_date.value,
      includeService        : query.include_service,
      includeProduct        : query.include_product,
      includePrepaidCard    : query.include_prepaid_card,
      includePrepaidService : query.include_prepaid_service,
      includeOutstanding    : query.include_outstanding,
      includeDeleted        : query.include_deleted,
      paymentMethodId       : query.payment_method_id,
      staffId               : query.staff_id,
      pageSize              : query.page_size,
      pageNumber            : query.page_number,
      shopId                : query.shop_id,
      clientShopId          : query.client_shop_id,
    }
    let result = await this.getSalesHistoriesByUrlAndQueryAsync(url_read_sales_histories_live,params)
    return result
  }

  async getSalesHistoriesByUrlAndQueryAsync(url,query){
    try{
      let response = await this.http.post(url,query)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let map_data = {
          total_amount: response.data.result.totalAmount,
          items: [],
          pagination: {}
        }
        for(let item of response.data.result.items){
          let tmp_sales_brief = new SalesBriefViewModel()
          tmp_sales_brief.mapFieldsFromApi(item)
          map_data.items.push(tmp_sales_brief.getFields())
        }
        map_data.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        map_data.pagination.total_amount = response.data.result.totalAmount
        this.result.data = map_data
      }
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async addSalesAsync(sales_vm) {
    let url_add_sales = url_command
    if(sales_vm.fields.booking_id > 0){
      url_add_sales = url_cmd_sales_add_by_checkout_booking
    }

    let data_send = sales_vm.mapFieldsToApi()
    try {
      const response = await this.http.post(url_add_sales, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        let sales_vm = new SalesViewModel()
        sales_vm.mapFieldsFromApi(response.data.result)
        this.result.data = sales_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateSalesAsync(sales_vm){
    let data_send = sales_vm.mapFieldsToApi()
    try {
      const response = await this.http.put(url_command, data_send)
      
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        let sales_vm = new SalesViewModel()
        sales_vm.mapFieldsFromApi(response.data.result)
        this.result.data = sales_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateSalesNotesAsync(sales_notes){
    let data_send = {
      clientId    : sales_notes.client_id,
      salesNumber : sales_notes.sales_number,
      notes       : sales_notes.notes,
      sessionToken: sales_notes.session_token,
      shopLocation: sales_notes.shop_location,
      shopId      : sales_notes.shop_id
    }

    try {
      const response = await this.http.put(url_cmd_sales_notes, data_send)
      
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        let sales_notes = {
          client_id     : response.data.result.clientId,
          sales_number  : response.data.result.salesNumber,
          notes         : response.data.result.notes,
          session_token : response.data.result.sessionToken,
          shop_location : response.data.result.shopLocation,
          shop_id       : response.data.result.shopId,
        }
        this.result.data = sales_notes
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteSalesAsync(sales_delete_vm) {
    let data_send = sales_delete_vm.mapFieldsToApi()
    try {
      const response = await this.http.delete(url_command, data_send)

      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        let sales_delete_vm = new SalesDeleteViewModel()
        sales_delete_vm.mapFieldsFromApi(response.data.result)
        this.result.data = sales_delete_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getBoardOfSalesTodayAsync(query){
    try {
      let queryMapping = {
        fromDate: query.from_date,
        toDate: query.to_date,
        currentTime: query.current_time,
        shopId: query.shop_id
      }
      const response = await this.http.post(url_aggr_sales_board_home, queryMapping)

      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        // Sale total board home view model
        let sales_total_board_home_view_model = new SalesTotalBoardHomeViewModel()
        sales_total_board_home_view_model.mapFieldFromApi(response.data.result.salesTotal)
        //Booking total view model
        let booking_total_view_model = new BookingToalViewModel()
        booking_total_view_model.mapFieldsFromApi(response.data.result.bookingTotal)
        //Client total view model
        let client_total_view_model = new ClientTotalViewModel()
        client_total_view_model.mapFieldsFromApi(response.data.result.clientTotal)
        
        this.result.data = {
          sales_today_data   : sales_total_board_home_view_model.getFields(),
          booking_today_data: booking_total_view_model.getFields(),
          client_today_data: client_total_view_model.getFields()
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}