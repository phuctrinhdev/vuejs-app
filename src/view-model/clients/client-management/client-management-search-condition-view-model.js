import ViewModel from '../../view-model'
import { options } from '../../../helpers/options'
import { convertDateToTimeStamp } from '../../../helpers/common'

export default class ClientManagementSearchConditionViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      search_condition_type: 1,
      number_of_no_visit_days: null,
      from_date_ts: -1,
      to_date_ts: -1,
      service_category_id: -1,
      service_id: -1,
      product_category_id: -1,
      product_id: -1,
      sales_amount_from: null,
      sales_amount_to: null,
      include_product: 0,
      sales_date_type: 1,
      expiry_from_date_ts: -1,
      expiry_to_date_ts: -1,
      balance_from: null,
      balance_to: null,
      prepaid_card_id: -1,
      quantity_from: null,
      quantity_to: null,
      member_type: -1,
      is_first_visit_date: 0,
      recommender_type: 1,
      client_name: '',
      client_mobile_number: '',
      client_name_or_mobile_number: '',
      is_unlimited: false
    }
  }

  mapFieldToApi(data){
    let query = {
      searchConditionType: data.search_condition_type,
      searchCondition: {}
    }
    switch (data.search_condition_type) {
      case options.client_management.target_type_options.all_clients:
        query.searchCondition = { allClients: {} }
        break
      case options.client_management.target_type_options.dormant_clients:
        query.searchCondition = { 
          dormantClients: {
            numberOfNoVisitDays: this.calcNumberOfNoVisitDays(data.number_of_no_visit_days)
          }
        }
        break
      case options.client_management.target_type_options.clients_by_sales_service:
        query.searchCondition = { 
          clientsBySalesService: {
            fromDateTS: data.from_date_ts,
            toDateTS: data.to_date_ts,
            categoryId: data.service_category_id,
            serviceId: data.service_id
          }
        }
        break
      case options.client_management.target_type_options.clients_by_sales_product:
        query.searchCondition = { 
          clientsBySalesProduct: {
            fromDateTS: data.from_date_ts,
            toDateTS: data.to_date_ts,
            categoryId: data.product_category_id,
            productId: data.product_id
          }
        }
        break
      case options.client_management.target_type_options.clients_by_sales_amount:
        query.searchCondition = { 
          clientsBySalesAmount: {
            fromDateTS: data.from_date_ts,
            toDateTS: data.to_date_ts,
            salesAmountFrom: this.convertField(data.sales_amount_from),
            salesAmountTo: this.convertField(data.sales_amount_to),
            includeProduct: data.include_product ? 1 : 0
          }
        }
        break
      case options.client_management.target_type_options.clients_by_prepaid_cards:
        query.searchCondition = { 
          clientsByPrepaidCards: {
            salesDateType: data.sales_date_type,
            fromDateTS: data.sales_date_type == 2 ? data.from_date_ts : -1,
            toDateTS: data.sales_date_type == 2 ? data.to_date_ts : -1,
            expiryFromDateTS: !data.is_unlimited ? data.expiry_from_date_ts : -1,
            expiryToDateTS: !data.is_unlimited ? data.expiry_to_date_ts : -1,
            balanceFrom: this.convertField(data.balance_from),
            balanceTo: this.convertField(data.balance_to),
            prepaidCardId: data.prepaid_card_id
          }
        }
        break
      case options.client_management.target_type_options.clients_by_prepaid_services:
        query.searchCondition = { 
          clientsByPrepaidService: {
            salesDateType: data.sales_date_type,
            fromDateTS: data.sales_date_type == 2 ? data.from_date_ts : -1,
            toDateTS: data.sales_date_type == 2 ? data.to_date_ts : -1,
            expiryFromDateTS: !data.is_unlimited ? data.expiry_from_date_ts : -1,
            expiryToDateTS: !data.is_unlimited ? data.expiry_to_date_ts : -1,
            quantityFrom: this.convertField(data.quantity_from),
            quantityTo: this.convertField(data.quantity_to),
            serviceCategoryId: data.service_category_id,
            serviceId: data.service_id
          }
        }
        break
      case options.client_management.target_type_options.birthday_clients:
        query.searchCondition = { 
          birthdayClients: {
            fromDateTS: data.from_date_ts,
            toDateTS: data.to_date_ts,
            memberType: data.member_type
          }
        }
        break
      case options.client_management.target_type_options.recommended_clients:
        query.searchCondition = { 
          recommendedClients: {
            isFirstVisitDate: data.is_first_visit_date,
            fromDateTS: data.from_date_ts,
            toDateTS: data.to_date_ts,
            recommenderType: data.recommender_type,
            clientName: data.client_name_or_mobile_number,
            clientMobileNumber: data.client_name_or_mobile_number
          }
        }
        break
    }
    return query
  }

  convertField(field){
    if(field != null && field != '') return field
    return -1
  }

  calcNumberOfNoVisitDays(number_of_no_visit_days){
    if(number_of_no_visit_days == null || number_of_no_visit_days == '') return -1
    let current_date = new Date().getTime()
    return convertDateToTimeStamp(current_date) - (number_of_no_visit_days * options.seconds_of_24h)
  }

  getValidations(){
    let validations = {
      sales_amount_from: {
        rules: {
          customRule: {
            message: 'clients.sales-amount-must-have-from-value-smaller-than-to-value',
            process(model){
              if(model.sales_amount_to == null || model.sales_amount_to == ''){
                return true
              } else if(parseInt(model.sales_amount_from) < parseInt(model.sales_amount_to)){
                return true
              }
              return false
            }
          }
        }
      },
      balance_from: {
        rules: {
          customRule: {
            message: 'clients.balance-from-value-is-must-smaller-than-balance-to',
            process(model){
              if(model.balance_to == null || model.balance_to == ''){
                return true
              } else if(parseInt(model.balance_from) < parseInt(model.balance_to)){
                return true
              }
              return false
            }
          }
        }
      },
      quantity_from: {
        rules: {
          customRule: {
            message: 'clients.quatity-from-value-is-must-smaller-than-quantity-to',
            process(model){
              if(model.quantity_to == null || model.quantity_to == ''){
                return true
              } else if(parseInt(model.quantity_from) < parseInt(model.quantity_to)){
                return true
              }
              return false
            }
          }
        }
      },
    }
    return validations
  }

  isValid(){
    return super.isValid(this.getValidations())
  }
}