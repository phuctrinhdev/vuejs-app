import ViewModel             from '../view-model'

export default class StaffGoalSetupViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      apply_year_month  : 0,
      staff_goal_setups : [],
      shop_id           : 0
    }
  }

  mapFieldsFromApi(api_data){
    let tmp_staff_goal_setups = []
    for(let staff_goal of api_data.staffGoalSetups){
      tmp_staff_goal_setups.push(this.mapStaffGoalFromApi(staff_goal))
    }
    this.fields.apply_year_month  = api_data.applyYearMonth
    this.fields.staff_goal_setups = tmp_staff_goal_setups
    this.fields.shop_id           = api_data.shopId
  }
  mapFieldsToApi(){
    let tmp_staff_goal_setups = []
    for(let staff_goal of this.fields.staff_goal_setups){
      tmp_staff_goal_setups.push(this.mapStaffGoalToApi(staff_goal))
    }
    return {
      applyYearMonth        : this.fields.apply_year_month,
      staffGoalSetups       : tmp_staff_goal_setups,
      shopId                : this.fields.shop_id
    }
  }

  mapStaffGoalFromApi(api_data){
    return {
      staff_id              : api_data.staffId,
      staff_name            : api_data.staffName,
      product_amount        : api_data.productAmount,
      service_amount        : api_data.serviceAmount,
      prepaid_service_amount: api_data.prepaidServiceAmount,
      prepaid_card_amount   : api_data.prepaidCardAmount
    }
  }
  mapStaffGoalToApi(ui_data){
    return {
      staffId               : ui_data.staff_id,
      staffName             : ui_data.staff_name,
      productAmount         : ui_data.product_amount,
      serviceAmount         : ui_data.service_amount,
      prepaidServiceAmount  : ui_data.prepaid_service_amount,
      prepaidCardAmount     : ui_data.prepaid_card_amount
    }
  }

  mapStaffGoalFromPreviousMonth(staff_goals){
    this.fields.staff_goal_setups = staff_goals
  }

  isValid(){
    let validations = {
      staff_goal_setups: {
        label: 'staff-goal.staff-goal-setup',
        rules: {
          customRule: {
            message: 'validate_messages.require',
            process(model) {
              let tmp_staff_goals = model.staff_goal_setups

              for(let staff_goal of tmp_staff_goals){
                // duplicate staffs
                let tmp_same_staff_goals = tmp_staff_goals.filter(s => s.staff_id == staff_goal.staff_id)
                if(tmp_same_staff_goals.length > 1){
                  this.message = 'staff-goal.warn-staff-goal-setups-duplicate-staffs'
                  return false
                }
                if(staff_goal.prepaid_card_amount > 0
                || staff_goal.prepaid_service_amount > 0
                || staff_goal.product_amount > 0
                || staff_goal.service_amount > 0){
                  if(staff_goal.prepaid_card_amount > 999999999999
                  || staff_goal.prepaid_service_amount > 999999999999
                  || staff_goal.product_amount > 999999999999
                  || staff_goal.service_amount > 999999999999){
                    this.message = 'staff-goal.warn-staff-goal-amount-max-length'
                    return false
                  }
                }
                else {
                  this.message = 'staff-goal.warn-staff-goal-setups-has-staff-no-input'
                  return false
                }
              }
              return true
            }
          }
        }
      },
    }
    return super.isValid(validations)
  }
}
