import _                         from 'lodash'
import store                     from '../../../store/store'
import { options }               from '../../../helpers/options'
import { sales_options }         from '../../../helpers/options/sales-options'
import SalesBaseViewModel        from './sales-base-view-model'
import SalesItemViewModel        from '../sales-item/sales-item-view-model'
import SalesItemStaffViewModel   from '../sales-item/sales-item-staff-view-model'
import ServiceApi                from '../../../api/goods/service-api'
import SalesBriefViewModel       from './sales-brief-view-model.js'
import ClientPrepaidServicesApi  from '../../../api/sales/prepaid-services-api'

import {
  // convertTimeStampPlusLocalzone,
  // convertTimeStampMinusSettingzone,
  guid,
  convertDateToTimezone, 
  cache_session,
  isNullObject 
} from '../../../helpers/common'

export default class SalesViewModel extends SalesBaseViewModel {
  constructor(){
    super() 

    this.fields.client_mobile_number                = ''
    this.fields.client_rating_id                    = 0
    this.fields.client_rating_name                  = ''
    this.fields.client_sex                          = 1
    this.fields.member_number                       = ''
    this.fields.family_id                           = 0
    this.fields.sales_items                         = []

    this.fields.points_type                         = 0
    this.fields.booking_id                          = 0
    this.fields.booking_deposit_amount              = 0
    this.fields.booking_deposit_payment_method_id   = 0
    this.fields.booking_deposit_payment_method_name = 0
    this.fields.balance_deduction                   = 0
    this.fields.earned_points                       = 0
    this.fields.balance_moves                       = []
    
    this.fields.session_token                       = ''
    this.fields.status                              = 0
  }

  // Mapper
  mapFieldsFromApi(api_data){
    let tmp_balance_deduction = 0
    let tmp_sales_items = []
    if(api_data.salesItems){
      for(let i in api_data.salesItems){
        let tmp_sales_item = new SalesItemViewModel()
        tmp_sales_item.mapFieldsFromApi(api_data.salesItems[i])
        tmp_sales_items.push(tmp_sales_item.getFields())
        tmp_balance_deduction += Number(api_data.salesItems[i].deductionAmount)
      }
    }
    
    let tmp_balance_moves = []
    if(api_data.balanceMoves){
      for(let i in api_data.balanceMoves){
        let tmp_balance_move = this.mapBalanceMoveFromApi(api_data.balanceMoves[i])
        tmp_balance_moves.push(tmp_balance_move)
      }
    }
    
    this.mapFieldsBaseFromApi(api_data)
    
    this.fields.client_name                         = api_data.clientName
    this.fields.client_mobile_number                = api_data.clientMobileNumber
    this.fields.client_rating_id                    = api_data.clientRatingId
    this.fields.client_rating_name                  = api_data.clientRatingName
    this.fields.client_sex                          = api_data.sex
    this.fields.member_number                       = api_data.memberNumber
    this.fields.family_id                           = api_data.familyId
    this.fields.sales_items                         = tmp_sales_items

    this.fields.points_type                         = api_data.pointsType
    this.fields.booking_id                          = api_data.bookingId
    this.fields.booking_deposit_amount              = api_data.bookingDepositAmount
    this.fields.booking_deposit_payment_method_id   = api_data.bookingDepositPaymentMethodId
    this.fields.booking_deposit_payment_method_name = api_data.bookingDepositPaymentMethodName
    this.fields.balance_deduction                   = tmp_balance_deduction
    this.fields.earned_points                       = api_data.earnedPoints
    this.fields.balance_moves                       = tmp_balance_moves

    this.fields.session_token                       = api_data.sessionToken
    this.fields.status                              = api_data.status
    this.fields.created_by_id                       = api_data.createdById
    this.fields.created_by_name                     = api_data.createdByName
    this.fields.created_date_time_ts                = api_data.createdDateTimeTS
    this.fields.edited_by_id                        = api_data.editedById
    this.fields.edited_by_name                      = api_data.editedByName
    this.fields.edited_date_time_ts                 = api_data.editedDateTimeTS
    this.fields.edited_sales_id                     = api_data.editedSalesId
    this.fields.deleted_by_id                       = api_data.deletedById
    this.fields.deleted_by_name                     = api_data.deletedByName
    this.fields.deleted_date_time_ts                = api_data.deletedDateTimeTS
  }
  mapFieldsToApi(){
    let tmp_sales_items = []
    for(let i in this.fields.sales_items){
      let tmp_sales_item = new SalesItemViewModel().mapFieldsToApi(this.fields.sales_items[i])
      tmp_sales_items.push(tmp_sales_item)
    }

    let tmp_balance_moves = []
    for(let i in this.fields.balance_moves){
      let tmp_balance_move = this.mapBalanceMoveToApi(this.fields.balance_moves[i])
      tmp_balance_moves.push(tmp_balance_move)
    }
    
    let sales = this.mapFieldsBaseToApi(this.fields)
    
    sales.clientName                      = this.fields.client_name
    sales.clientMobileNumber              = this.fields.client_mobile_number
    sales.clientRatingId                  = this.fields.client_rating_id
    sales.clientRatingName                = this.fields.client_rating_name
    sales.sex                             = this.fields.client_sex
    sales.memberNumber                    = this.fields.member_number
    sales.familyId                        = this.fields.family_id
    sales.salesItems                      = tmp_sales_items

    sales.pointsType                      = this.fields.points_type
    sales.bookingId                       = this.fields.booking_id
    sales.bookingDepositAmount            = this.fields.booking_deposit_amount
    sales.bookingDepositPaymentMethodId   = this.fields.booking_deposit_payment_method_id
    sales.bookingDepositPaymentMethodName = this.fields.booking_deposit_payment_method_name
    sales.balanceDeduction                = this.fields.balance_deduction
    sales.earnedPoints                    = this.fields.earned_points
    sales.balanceMoves                    = tmp_balance_moves

    sales.sessionToken                    = this.fields.session_token
    
    sales.status                          = this.fields.status
    sales.createdById                     = this.fields.created_by_id
    sales.createdByName                   = this.fields.created_by_name
    sales.createdDateTimeTS               = this.fields.created_date_time_ts
    sales.editedById                      = this.fields.edited_by_id
    sales.editedByName                    = this.fields.edited_by_name
    sales.editedDateTimeTS                = this.fields.edited_date_time_ts
    sales.editedSalesId                   = this.fields.edited_sales_id
    sales.deletedById                     = this.fields.deleted_by_id
    sales.deletedByName                   = this.fields.deleted_by_name
    sales.deletedDateTimeTS               = this.fields.deleted_date_time_ts
    
    return sales
  }
  mapToSalesBriefViewModel(){
    let tmp_status      = this.fields.status
    let tmp_sales_items = this.fields.sales_items 

    let sales_brief_vm     = new SalesBriefViewModel()
    sales_brief_vm.fields  = Object.assign({},this.fields)

    sales_brief_vm.fields.ref_status = tmp_status
    sales_brief_vm.fields.items      = tmp_sales_items

    delete sales_brief_vm.fields.family_id            
    delete sales_brief_vm.fields.client_mobile_number  
    delete sales_brief_vm.fields.sales_items          

    delete sales_brief_vm.fields.points_type           
    delete sales_brief_vm.fields.booking_id            
    delete sales_brief_vm.fields.booking_deposit_amount
    delete sales_brief_vm.fields.balance_deduction    
    delete sales_brief_vm.fields.earned_points        
    delete sales_brief_vm.fields.balance_moves         
    
    delete sales_brief_vm.fields.session_token       
    delete sales_brief_vm.fields.status         
    return sales_brief_vm
  }
  mapBalanceMoveFromApi(api_balance_move){
    return {
      from_client_prepaid_card_id : api_balance_move.fromClientPrepaidCardId,
      move_balance                : api_balance_move.moveBalance,
      to_client_prepaid_card_id   : api_balance_move.toClientPrepaidCardId,
      to_prepaid_card_guid        : api_balance_move.toPrepaidCardGuid
    }
  }
  mapBalanceMoveToApi(ui_data){
    return  {
      fromClientPrepaidCardId : ui_data.from_client_prepaid_card_id,
      moveBalance             : ui_data.move_balance,
      toClientPrepaidCardId   : ui_data.to_client_prepaid_card_id,
      toPrepaidCardGuid       : ui_data.to_prepaid_card_guid
    }
  }
  async mapFieldsFromCheckoutBooking(booking){
    let user   = store.getters['user/getUser']
    let shop   = store.getters['user/getShop']
    
    let tmp_sales_items = []
    let tmp_total_amount = 0
    let error_messages = []
    if(booking.booked_items.length > 0 && booking.booked_items[0].service_id > 0){
      let query = {
        shop_id: shop.shop_id,
        booked_item_ids: booking.booked_items.map(i => i.service_id)
      }
      let service_api = new ServiceApi()
      let result = await service_api.getServicesByIdsAsync(query)
      
      if(result.is_ok){
        let booking_setup = await cache_session.getBookingSetupCache(shop.shop_id)
        if(!isNullObject(booking_setup)){
          // deduct prepaid service
          let client_prepaid_services = []
          if(booking.client_id > 0){
            let data_filter = {
              client_id             : booking.client_id,
              show_expired          : false,
              include_family_service: true,
              page_size             : options.pagination.max,
              page_number           : 1,
              shop_id               : booking.shop_id
            }
            let client_prepaid_services_api = new ClientPrepaidServicesApi()
            let response = await client_prepaid_services_api.getPrepaidServicesAsync(data_filter)
            if(response.is_ok){
              client_prepaid_services = response.data.items
            }
            else {
              return response.error_messages
            }
          }
          
          // booked-item
          for(let booked_item of booking.booked_items){
            if(booked_item.service_id > 0){
              let tmp_service = _.find(result.data, { 'id': booked_item.service_id })
              if(tmp_service != undefined){
                let tmp_sales_item = new SalesItemViewModel()
                tmp_sales_item.setFields({
                  goods_type       : sales_options.sales_goods_type.service,
                  goods_category_id: tmp_service.category,
                  goods_id         : booked_item.service_id,
                  goods_name       : booked_item.service_name,
                  unit_price       : tmp_service.price,
                  amount           : tmp_service.price,
                  staffs           : this.getSalesItemStaffsFromBookedItem(booking_setup, booked_item.booking_resource_setup_id, tmp_service.price),
                })

                // mapDeductPrepaidServicesToSalesItems
                if(booked_item.deducted_prepaid_goods_ref > 0){
                  let deducted_prepaid_goods = client_prepaid_services.filter(ps => ps.client_prepaid_service_id == booked_item.deducted_prepaid_goods_ref)
                  if(deducted_prepaid_goods.length > 0){
                    let deduct_prepaid_service = deducted_prepaid_goods[0]
                    if(deduct_prepaid_service.quantity == -1 || deduct_prepaid_service.quantity > 0){
                      this.mapDeductPrepaidServicesToSalesItemsFromBooking(tmp_sales_item, deduct_prepaid_service)
                      if(deduct_prepaid_service.quantity > 0){
                        deduct_prepaid_service.quantity -= 1
                      }
                      tmp_sales_item.fields.staffs = this.getSalesItemStaffsFromBookedItem(
                        booking_setup, 
                        booked_item.booking_resource_setup_id, 
                        deduct_prepaid_service.related_service_unit_price
                      )
                    }
                  }
                }

                tmp_sales_items.push(tmp_sales_item.getFields())
                tmp_total_amount += tmp_service.price
              }
            }
          }
  
          // booking deposit
          let tmp_booking_deposit_payment_method_id = 0
          let tmp_booking_deposit_payment_method_name = ''
          let tmp_booking_deposit_amount = 0
          if(booking.booking_deposit.deposit_type == options.deposit_type.paid){
            tmp_booking_deposit_payment_method_id   = booking.booking_deposit.payment_method_id
            tmp_booking_deposit_payment_method_name = booking.booking_deposit.payment_method_name
            tmp_booking_deposit_amount              = booking.booking_deposit.amount
          }
  
          let tmp_outstanding = tmp_total_amount - tmp_booking_deposit_amount
  
          this.fields.sales_id                            = 0
          this.fields.sales_number                        = ''
          this.fields.client_id                           = booking.client_id
          this.fields.client_phone_number                 = ''
          this.fields.client_mobile_number                = booking.client_mobile_number
          this.fields.client_mobile_number2               = ''
  
          this.fields.payments                            = [],
          this.fields.total_amount                        = tmp_total_amount,
          this.fields.deduction_points                    = 0,
          this.fields.outstanding                         = tmp_outstanding,
            
          this.fields.notes                               = '',
          this.fields.invoice_date_time_ts                = convertDateToTimezone(new Date()),
          this.fields.shop_location                       = shop.shop_location,
          this.fields.shop_id                             = shop.shop_id
  
          this.fields.client_name                         = booking.client_name
          this.fields.client_mobile_number                = booking.client_mobile_number
          this.fields.family_id                           = 0
          this.fields.sales_items                         = tmp_sales_items
  
          this.fields.points_type                         = 0
          this.fields.booking_id                          = booking.id
          this.fields.booking_deposit_amount              = tmp_booking_deposit_amount
          this.fields.booking_deposit_payment_method_id   = tmp_booking_deposit_payment_method_id
          this.fields.booking_deposit_payment_method_name = tmp_booking_deposit_payment_method_name
          this.fields.earned_points                       = 0
          this.fields.balance_moves                       = []
  
          this.fields.session_token                       = user.session_token
  
          this.fields.status                              = 0
          this.fields.created_by_id                       = 0
          this.fields.created_by_name                     = 0
          this.fields.created_date_time_ts                = 0
          this.fields.edited_by_id                        = 0
          this.fields.edited_by_name                      = 0
          this.fields.edited_date_time_ts                 = 0
          this.fields.edited_sales_id                     = 0
          this.fields.deleted_by_id                       = 0
          this.fields.deleted_by_name                     = 0
          this.fields.deleted_date_time_ts                = 0
        }
      }
      else {
        error_messages = result.error_messages
      }
    }
    return error_messages
  }
  mapDeductPrepaidServicesToSalesItemsFromBooking(tmp_sales_item, deduct_prepaid_service){
    tmp_sales_item.fields.goods_type          = sales_options.sales_goods_type.prepaid_service
    tmp_sales_item.fields.goods_category_id   = deduct_prepaid_service.service_category_id
    tmp_sales_item.fields.goods_category_name = deduct_prepaid_service.service_category_name
    tmp_sales_item.fields.goods_id            = deduct_prepaid_service.related_service_id
    tmp_sales_item.fields.goods_name          = deduct_prepaid_service.related_service_name
    tmp_sales_item.fields.unit_price          = deduct_prepaid_service.related_service_unit_price
    tmp_sales_item.fields.amount              = 0 // When DeductionType is PrepaidService, The Amount's value must be zero
    tmp_sales_item.fields.key                 = deduct_prepaid_service.key

    tmp_sales_item.fields.prepaid_goods_guid                = guid()
    tmp_sales_item.fields.deduction_type                    = sales_options.deduction_type.prepaid_service
    tmp_sales_item.fields.deducted_prepaid_goods_ref_name   = deduct_prepaid_service.prepaid_service_name
    tmp_sales_item.fields.deducted_prepaid_goods_ref        = 0
    tmp_sales_item.fields.deducted_by_prepaid_goods_guid    = ''
    tmp_sales_item.fields.related_service_id                = deduct_prepaid_service.related_service_id
    tmp_sales_item.fields.related_service_name              = deduct_prepaid_service.related_service_name // only viewing in Deduct Prepaid Service Tab

    if(deduct_prepaid_service.client_prepaid_service_id > 0)
      tmp_sales_item.fields.deducted_prepaid_goods_ref      = deduct_prepaid_service.client_prepaid_service_id // deducted from existing prepaid service
    else
      tmp_sales_item.fields.deducted_by_prepaid_goods_guid  = deduct_prepaid_service.client_prepaid_service_id
    return tmp_sales_item
  }
  setClientInfo(client){
    this.fields.client_id             = client.client_id
    this.fields.family_id             = client.family_id
    this.fields.client_name           = client.client_name
    this.fields.client_mobile_number  = client.mobile_number 
    this.fields.client_mobile_number2 = client.mobile_number2 
    this.fields.client_phone_number   = client.phone_number
  }

  // validate
  getValidations(){
    let validations = {
      total_amount: {
        label : 'sales.total-amount',
        rules : {
          customRule : {
            message : 'validate_messages._default',
            process(model){
              for(let sales_item of model.sales_items){
                if(sales_item.staffs.length > 0){
                  let tmp_item_amount = sales_item.amount
                  if(sales_item.goods_type == sales_options.sales_goods_type.prepaid_service 
                  && sales_item.deduction_type == sales_options.deduction_type.prepaid_service){
                    tmp_item_amount = sales_item.quantity * sales_item.unit_price
                  }

                  let split_sales_total = sales_item.staffs.reduce((sum, staff) => sum + Number(staff.amount), 0)
                  if(tmp_item_amount != split_sales_total){
                    this.message = 'sales.sales-item-amount-not-equal-staffs-amount'
                    return false
                  }
                }
              }
              return true
            }
          }
        }
      },
      notes: {
        rules: {
          maxLength: {
            max_value:500
          }
        }
      },
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }


  // ultils
  getSalesItemStaffsFromBookedItem(booking_setup, booking_resource_setup_id, service_price){
    let tmp_staffs = []
    if(booking_resource_setup_id > 0){
      let tmp_resources = booking_setup.booking_resources_setup.items
      let tmp_resource = _.find(tmp_resources, { id: booking_resource_setup_id })

      if(tmp_resource != undefined && tmp_resource.resource_id > 0){
        let tmp_staff = new SalesItemStaffViewModel()
        tmp_staff.setFields({
          staff_id  : tmp_resource.resource_id,
          staff_name: tmp_resource.resource_name,
          amount    : service_price,
        })
        tmp_staffs.push(tmp_staff.getFields())
      }
    }
    
    return tmp_staffs
  }
  calEarnLoyaltyPoints(points_setup, decimal){
    let tmp_earned_points = 0
    let tmp_payments      = _.cloneDeep(this.fields.payments)
    let tmp_sales_items   = _.cloneDeep(this.fields.sales_items)

    if(tmp_payments.length > 0 && tmp_sales_items.length > 0){
      for(let payment of tmp_payments){
        if(payment.payment_amount <= 0) break
        for(let sales_item of tmp_sales_items){
          let point_setup = _.find(points_setup.loyalty_points_setups,x=>x.goods_type == sales_item.goods_type && x.is_apply == true)
          if (point_setup !== undefined){
            let points_setup_item = _.find(point_setup.loyalty_points_setup_items, x=>x.payment_method_setup_id == payment.payment_method_id)
            if (points_setup_item !== undefined){
              if(sales_item.amount > 0 && payment.payment_amount > 0){
                let tmp_amount = sales_item.amount - (Number(sales_item.deduction_amount) + sales_item.deduction_points)
                let tmp_payment_amount = payment.payment_amount
                payment.payment_amount = tmp_payment_amount - tmp_amount
                if(tmp_amount == 0) continue
                if(payment.payment_amount >= 0){
                  tmp_earned_points += tmp_amount * points_setup_item.percentage / 100                  
                }else{
                  tmp_earned_points += tmp_payment_amount * points_setup_item.percentage / 100
                }
              }
            } 
          }
        }
      }
    }
    
    let factor = Math.pow(10, decimal)
    this.fields.earned_points = Math.round(tmp_earned_points * factor) / factor
  }
}