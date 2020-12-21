import { convertDateToTimeStamp } from '../../../helpers/common'
import { options } from '../../../helpers/options'
import ViewModel from '../../view-model'

export default class ClientManagementFilterViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      is_checked_preferred_staff: false,
      is_checked_member_type: false,
      is_checked_member_number: false,
      is_checked_sex: false,
      is_checked_birthday: false,
      is_checked_referral_source: false,
      is_checked_client_rating: false,
      is_checked_client_group: false,
      is_checked_address: false,
      is_checked_notes: false,
      is_checked_first_visit_date: false,
      is_checked_recent_visit_date: false,
      is_checked_total_sales: false,
      is_checked_total_number_of_visit: false,
      is_checked_loyalty_points: false,
      is_checked_balance: false,
      is_checked_average_revenue_per_sales: false,
      is_checked_number_of_recommendations: false,

      recent_visit_date_type: 0,
      preferred_staff_id: -1,
      member_type: -1,
      member_number_from: null,
      member_number_to: null,
      sex: 0,
      birth_date_from: null,
      birth_date_to: null,
      birth_month_from: null,
      birth_month_to: null,
      referral_source_id: -1,
      client_rating_id: -1,
      client_group_id: -1,
      address: '',
      notes: '',
      first_visit_from_date_time_ts: -1,
      first_visit_to_date_time_ts: -1,
      recent_visit_from_date_time_ts: -1,
      recent_visit_to_date_time_ts: -1,
      total_sales_amount_from: null,
      total_sales_amount_to: null,
      number_of_visit_from: null,
      number_of_visit_to: null,
      loyalty_points_from: null,
      loyalty_points_to: null,
      balance_from: null,
      balance_to: null,
      average_sales_amount_from: null,
      average_sales_amount_to: null,
      number_of_recommendations_from: null,
      number_of_recommendations_to: null,
      days_not_visited_more_than: null,
      days_visisted_for_last: null
    }
  }

  mapFieldToApi(data){
    return {
      referralSourceId: this.checkDataDeactive(data.is_checked_referral_source, data.referral_source_id),
      preferredStaffId: this.checkDataDeactive(data.is_checked_preferred_staff, data.preferred_staff_id),
      clientRatingId: this.checkDataDeactive(data.is_checked_client_rating, data.client_rating_id),
      clientGroupId: this.checkDataDeactive(data.is_checked_client_group, data.client_group_id),
      memberNumberFrom: this.checkDataDeactive(data.is_checked_member_number, data.member_number_from),
      memberNumberTo: this.checkDataDeactive(data.is_checked_member_number, data.member_number_to),
      memberType: this.checkDataDeactive(data.is_checked_member_type, data.member_type),
      sex: this.checkSexDataDeactive(data.is_checked_sex, data.sex),
      address: data.is_checked_address ? data.address : '',
      birthDDFrom: this.checkDataDeactive(data.is_checked_birthday, data.birth_date_from),
      birthDDTo: this.checkDataDeactive(data.is_checked_birthday, data.birth_date_to),
      birthMonthFrom: this.checkDataDeactive(data.is_checked_birthday, data.birth_month_from),
      birthMonthTo: this.checkDataDeactive(data.is_checked_birthday, data.birth_month_to),
      firstVisitFromDateTimeTS: this.checkDataDeactive(data.is_checked_first_visit_date, data.first_visit_from_date_time_ts),
      firstVisitToDateTimeTS: this.checkDataDeactive(data.is_checked_first_visit_date, data.first_visit_to_date_time_ts),
      recentVisitFromDateTimeTS: this.checkRecentVisitFromDateTimeTS(data),
      recentVisitToDateTimeTS: this.checkRecentVisitToDateTimeTS(data),
      loyaltyPointsFrom: this.checkDataDeactive(data.is_checked_loyalty_points, data.loyalty_points_from),
      loyaltyPointsTo: this.checkDataDeactive(data.is_checked_loyalty_points, data.loyalty_points_to),
      balanceFrom: this.checkDataDeactive(data.is_checked_balance, data.balance_from),
      balanceTo: this.checkDataDeactive(data.is_checked_balance, data.balance_to),
      averageSalesAmountFrom: this.checkDataDeactive(data.is_checked_average_revenue_per_sales, data.average_sales_amount_from),
      averageSalesAmountTo: this.checkDataDeactive(data.is_checked_average_revenue_per_sales, data.average_sales_amount_to),
      numberOfRecommendationsFrom: this.checkDataDeactive(data.is_checked_number_of_recommendations, data.number_of_recommendations_from),
      numberOfRecommendationsTo: this.checkDataDeactive(data.is_checked_number_of_recommendations, data.number_of_recommendations_to),
      totalSalesAmountFrom: this.checkDataDeactive(data.is_checked_total_sales, data.total_sales_amount_from),
      totalSalesAmountTo: this.checkDataDeactive(data.is_checked_total_sales, data.total_sales_amount_to),
      numberOfVisitFrom: this.checkDataDeactive(data.is_checked_total_number_of_visit, data.number_of_visit_from),
      numberOfVisitTo: this.checkDataDeactive(data.is_checked_total_number_of_visit, data.number_of_visit_to),
      notes: data.is_checked_notes ? data.notes : '',
      daysNotVisitedMoreThan: this.checkDaysNotVisitedMoreThan(data),
      daysVisistedForLast: this.checkDaysVisistedForLast(data)
    }
  }

  checkDataDeactive(checked, value){
    if(value == null || value == '') return -1
    if(!checked) return - 1
    return value
  }

  getValidations(){
    let validations = {
      member_number_from: {
        rules: {
          customRule: {
            message: 'clients.member-number-from-value-is-must-smaller-than-member-number-to',
            process(model){
              if(model.member_number_to == null || model.member_number_to == ''){
                return true
              } else if(parseInt(model.member_number_from) < parseInt(model.member_number_to)){
                return true
              }
              return false
            }
          }
        }
      },
      birth_date_from: {
        rules: {
          numeric: '',
          between: {
            min_value: 1,
            max_value: 31
          }
        }
      },
      birth_date_to: {
        rules: {
          numeric: '',
          between: {
            min_value: 1,
            max_value: 31
          }
        }
      },
      birth_month_from: {
        rules: {
          numeric: '',
          between: {
            min_value: 1,
            max_value: 12
          }
        }
      },
      birth_month_to: {
        rules: {
          numeric: '',
          between: {
            min_value: 1,
            max_value: 12
          }
        }
      },
      loyalty_points_from: {
        rules: {
          customRule: {
            message: 'clients.loyalty-points-from-value-is-must-smaller-than-loyalty-points-to',
            process(model){
              if(model.loyalty_points_to == null || model.loyalty_points_to == ''){
                return true
              } else if(model.loyalty_points_from < model.loyalty_points_to){
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
      average_sales_amount_from: {
        rules: {
          customRule: {
            message: 'clients.average-revenue-per-sales-from-value-is-must-smaller-than-average-revenue-per-sales-to',
            process(model){
              if(model.average_sales_amount_to == null || model.average_sales_amount_to == ''){
                return true
              } else if(parseInt(model.average_sales_amount_from) < parseInt(model.average_sales_amount_to)){
                return true
              }
              return false
            }
          }
        }
      },
      number_of_recommendations_from: {
        rules: {
          customRule: {
            message: 'clients.number-of-recommendations-must-have-from-value-smaller-than-to-value',
            process(model){
              if(model.number_of_recommendations_to == null || model.number_of_recommendations_to == ''){
                return true
              } else if(parseInt(model.number_of_recommendations_from) < parseInt(model.number_of_recommendations_to)){
                return true
              }
              return false
            }
          }
        }
      },
      total_sales_amount_from: {
        rules: {
          customRule: {
            message: 'clients.total-sales-must-have-from-value-smaller-than-to-value',
            process(model){
              if(model.total_sales_amount_to == null || model.total_sales_amount_to == ''){
                return true
              } else if(parseInt(model.total_sales_amount_from) < parseInt(model.total_sales_amount_to)){
                return true
              }
              return false
            }
          }
        }
      },
      number_of_visit_from: {
        rules: {
          customRule: {
            message: 'clients.total-number-of-visit-must-have-from-value-smaller-than-to-value',
            process(model){
              if(model.number_of_visit_to == null || model.number_of_visit_to == ''){
                return true
              } else if(parseInt(model.number_of_visit_from) < parseInt(model.number_of_visit_to)){
                return true
              }
              return false
            }
          }
        }
      }
    }

    return validations
  }

  isValid(){
    return super.isValid(this.getValidations())
  }

  checkSexDataDeactive(checked, value){
    if(!checked) return 0
    return value
  }

  checkRecentVisitFromDateTimeTS(data){
    if(!data.is_checked_recent_visit_date) return -1
    if(data.is_checked_recent_visit_date && data.recent_visit_date_type == options.client_management.recent_visit_date_type.date_range){
      return data.recent_visit_from_date_time_ts
    } else
      return -1
  }

  checkRecentVisitToDateTimeTS(data){
    if(!data.is_checked_recent_visit_date) return -1
    if(data.is_checked_recent_visit_date && data.recent_visit_date_type == options.client_management.recent_visit_date_type.date_range){
      return data.recent_visit_to_date_time_ts
    } else
      return -1
  }

  checkDaysNotVisitedMoreThan(data){
    if(!data.is_checked_recent_visit_date) return -1
    if(data.is_checked_recent_visit_date &&
      data.recent_visit_date_type == options.client_management.recent_visit_date_type.not_visited_more_than &&
      data.days_not_visited_more_than != '' &&
      data.days_not_visited_more_than != null
    ){
      let current_date = new Date().getTime()
      return convertDateToTimeStamp(current_date) - (data.days_not_visited_more_than * options.seconds_of_24h)
    } else
      return -1
  }

  checkDaysVisistedForLast(data){
    if(!data.is_checked_recent_visit_date) return -1
    if(data.is_checked_recent_visit_date && 
      data.recent_visit_date_type == options.client_management.recent_visit_date_type.visited_for_last &&
      data.days_visisted_for_last != '' &&
      data.days_visisted_for_last != null
    ){
      let current_date = new Date().getTime()
      return convertDateToTimeStamp(current_date) - (data.days_visisted_for_last * options.seconds_of_24h)
    } else
      return -1
  }
}