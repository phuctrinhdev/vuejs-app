import ViewModel from '../../view-model'
import { convertTimeStampToDate, convertTimeStampMinusLocalzone } from '../../../helpers/common'
export default class ClientAccountViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      // client
      id                        : 0,
      client_id                 : 0,
      client_name               : '',
      client_rating_id          : 0,
      client_rating_name        : 0,
      phone_number              : '',
      mobile_number             : '',
      mobile_number2            : '',
      shop_id                   : 0,

      // finance
      loyalty_points            : 0,
      balance                   : 0,
      outstanding               : 0,
      family_id                 : 0,
      family_loyalty_points     : 0,
      family_balance            : 0,
      
      // sales
      total_sales               : 0,
      average_sales_amount      : 0,
      
      // marketing
      registration_date_ts      : 0,
      first_visit_date_ts       : 0,
      recent_visit              : 0,
      recent_visit_sales_id     : 0,
      number_of_visit           : 0,
      number_of_recommendations : 0,
    }
  }
  
  mapFieldsFromApi(api_data){
    if(!api_data) return 

    let tmp_registration_date = null
    if(api_data.registrationDateTS !== null && api_data.registrationDateTS !== 0)
      tmp_registration_date = convertTimeStampToDate(convertTimeStampMinusLocalzone(api_data.registrationDateTS))

    let tmp_first_visit_date_time = null
    if(api_data.firstVisitDateTimeTS != null && api_data.firstVisitDateTimeTS != 0)
      tmp_first_visit_date_time = convertTimeStampToDate(convertTimeStampMinusLocalzone(api_data.firstVisitDateTimeTS))

    let tmp_recent_visit_date_time = null
    if(api_data.recentVisitDateTimeTS != null && api_data.recentVisitDateTimeTS != 0)
      tmp_recent_visit_date_time = convertTimeStampToDate(convertTimeStampMinusLocalzone(api_data.recentVisitDateTimeTS))

    this.fields.id                        = api_data.id
    this.fields.client_id                 = api_data.clientId
    this.fields.client_name               = api_data.clientName
    this.fields.client_rating_id          = api_data.clientRatingId
    this.fields.client_rating_name        = api_data.clientRatingName
    this.fields.phone_number              = api_data.phoneNumber
    this.fields.mobile_number             = api_data.mobileNumber
    this.fields.mobile_number2            = api_data.mobileNumber2
    this.fields.shop_id                   = api_data.shopId

    this.fields.loyalty_points            = api_data.loyaltyPoints
    this.fields.balance                   = api_data.balance
    this.fields.outstanding               = api_data.outstanding
    this.fields.family_id                 = api_data.familyId
    this.fields.family_loyalty_points     = api_data.familyLoyaltyPoints
    this.fields.family_balance            = api_data.familyBalance

    this.fields.total_sales               = api_data.totalSalesAmount
    this.fields.average_sales_amount      = api_data.averageSalesAmount
      
    // marketing
    this.fields.registration_date_ts      = api_data.registrationDateTS
    this.fields.registration_date         = tmp_registration_date
    this.fields.first_visit_date_time_ts  = api_data.firstVisitDateTimeTS
    this.fields.first_visit_date_time     = tmp_first_visit_date_time
    this.fields.recent_visit              = api_data.recentVisitDateTimeTS
    this.fields.recent_visit_date_time    = tmp_recent_visit_date_time
    this.fields.recent_visit_sales_id     = api_data.recentVisitSalesId
    this.fields.number_of_visit           = api_data.numberOfVisit
    this.fields.number_of_recommendations = api_data.numberOfRecommendations
  }
  mapFieldsToClientInfo(){
    return {
      id             : this.fields.client_id,
      loyalty_points : this.fields.loyalty_points,
      outstanding    : this.fields.outstanding
    }
  }
  getPoints(){
    let tmp_points = this.fields.loyalty_points
    if(this.fields.family_id > 0)
      tmp_points = this.fields.family_loyalty_points
    return tmp_points
  }
  getBalance(){
    let tmp_balance = this.fields.balance
    if(this.fields.family_id > 0)
      tmp_balance = this.fields.family_balance
    return tmp_balance
  }
}