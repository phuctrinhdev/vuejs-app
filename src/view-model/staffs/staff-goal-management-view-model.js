import ViewModel             from '../view-model'

export default class StaffGoalManagementViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      staff_id                        : 0,
      staff_name                      : '',
      service_achieved_amount         : 0,
      service_goal_amount             : 0,
      product_achieved_amount         : 0,
      product_goal_amount             : 0,
      prepaid_card_achieved_amount    : 0,
      prepaid_card_goal_amount        : 0,
      prepaid_service_achieved_amount : 0,
      prepaid_service_goal_amount     : 0,
      all_achieved_amount             : 0,
      all_goal_amount                 : 0,

      // ui only
      service_percent                 : 0,
      product_percent                 : 0,
      prepaid_card_percent            : 0,
      prepaid_service_percent         : 0,
      all_percent                     : 0
    }
  }

  mapFieldsFromApi(api_data){
    this.fields.staff_id                        = api_data.staffId
    this.fields.staff_name                      = api_data.staffName
    this.fields.service_achieved_amount         = api_data.serviceAchievedAmount
    this.fields.service_goal_amount             = api_data.serviceGoalAmount
    this.fields.product_achieved_amount         = api_data.productAchievedAmount
    this.fields.product_goal_amount             = api_data.productGoalAmount
    this.fields.prepaid_card_achieved_amount    = api_data.prepaidCardAchievedAmount
    this.fields.prepaid_card_goal_amount        = api_data.prepaidCardGoalAmount
    this.fields.prepaid_service_achieved_amount = api_data.prepaidServiceAchievedAmount
    this.fields.prepaid_service_goal_amount     = api_data.prepaidServiceGoalAmount

    this.calAllAndPercent()
  }
  calAllAndPercent(){
    let tmp_all_achieved_amount = this.fields.service_achieved_amount 
                                + this.fields.product_achieved_amount 
                                + this.fields.prepaid_card_achieved_amount 
                                + this.fields.prepaid_service_achieved_amount
    let tmp_all_goal_amount = this.fields.service_goal_amount
                            + this.fields.product_goal_amount
                            + this.fields.prepaid_card_goal_amount
                            + this.fields.prepaid_service_goal_amount
    let tmp_service_percent = 0
    if(this.fields.service_goal_amount > 0)
      tmp_service_percent = this.fields.service_achieved_amount / this.fields.service_goal_amount
      
    let tmp_product_percent = 0
    if(this.fields.product_goal_amount > 0)
      tmp_product_percent = this.fields.product_achieved_amount / this.fields.product_goal_amount

    let tmp_prepaid_card_percent = 0
    if(this.fields.prepaid_card_goal_amount > 0)
      tmp_prepaid_card_percent = this.fields.prepaid_card_achieved_amount / this.fields.prepaid_card_goal_amount

    let tmp_prepaid_service_percent = 0
    if(this.fields.prepaid_service_goal_amount > 0)
      tmp_prepaid_service_percent = this.fields.prepaid_service_achieved_amount / this.fields.prepaid_service_goal_amount

    let tmp_all_percent = 0
    if(tmp_all_goal_amount > 0)
      tmp_all_percent = tmp_all_achieved_amount / tmp_all_goal_amount

    this.fields.all_achieved_amount             = tmp_all_achieved_amount
    this.fields.all_goal_amount                 = tmp_all_goal_amount
    this.fields.service_percent                 = tmp_service_percent
    this.fields.product_percent                 = tmp_product_percent
    this.fields.prepaid_card_percent            = tmp_prepaid_card_percent
    this.fields.prepaid_service_percent         = tmp_prepaid_service_percent
    this.fields.all_percent                     = tmp_all_percent
  }
}