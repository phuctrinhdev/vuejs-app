
import ViewModel from '../../view-model'
import ClientViewModel from '../client-view-model'
import SalesUtils from '../../../helpers/utils/sales-utils'
export default class ClientManagementViewModel extends ViewModel{
  constructor(){
    super()
    this.fields =  new ClientViewModel()
  }

  mapFieldFromApi(data){
    let tmp_recent_visit_date = ''
    if(data.recentVisitDateTimeTS > 0){
      tmp_recent_visit_date = this.formatDateYMD(data.recentVisitDateTimeTS)
    }
    let tmp_first_visit_date = ''
    if(data.recentVisitDateTimeTS > 0){
      tmp_first_visit_date = this.formatDateYMD(data.firstVisitDateTimeTS)
    }
    let tmp_birthday = `${data.birthYear}-${data.birthMonth}-`
    if(data.birthDD < 10) data.birthDD = `0${data.birthDD}`
    tmp_birthday += data.birthDD
    
    this.fields = {
      id: data.clientId,
      preferred_staff_name: data.preferredStaffName,
      client_name: data.clientName,
      member_number: data.memberNumber,
      mobile_number: data.mobileNumber,
      notes: data.notes,
      recent_visit_date: tmp_recent_visit_date,
      birthday: tmp_birthday,
      client_rating_name: data.clientRatingName,
      client_referral_source_name: data.clientReferralSourceName,
      total_sales: data.totalSalesAmount,
      balance: data.balance,
      loyalty_points: data.loyaltyPoints,
      prepaid_cards: this.mapFieldPrepaidCardFromApi(data.prepaidCards),
      prepaid_services: this.mapFieldPrepaidServiceFromApi(data.prepaidServices),
      first_visit_date: tmp_first_visit_date,
      recommender_name: data.recommenderName,
      recommender_mobile_number: data.recommenderMobileNumber,

      // viewing only
      vgtSelected: true
    }
    return this.fields
  }

  mapFieldPrepaidCardFromApi(prepaid_card){
    return prepaid_card.map(e => {
      return {
        balance: e.balance,
        name: e.name,
        expiry_date: this.formatDateYMD(e.expiryDateTS)
      }
    })
  }

  mapFieldPrepaidServiceFromApi(prepaid_service){
    return prepaid_service.map(e => {
      return {
        quantity: e.quantity,
        name: e.name,
        expiry_date: this.formatDateYMD(e.expiryDateTS)
      }
    })
  }

  formatDateYMD(date_ts){
    return SalesUtils.formatNoLimitDateTs(date_ts)
  }
}