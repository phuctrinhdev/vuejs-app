import LoyaltyPointsSetupsViewModel from '../../../view-model/sales/loyalty-points-setups-view-model'

export default class LoyaltyPointsSetupsViewData extends LoyaltyPointsSetupsViewModel {
  constructor(){
    super()

    this.fields.payment_methods = []
  }
  updateViewDataFromModelData(){
    let tmp_payment_methods = []
    for(let setup of this.fields.loyalty_points_setups){
      if(setup.is_apply){
        for(let payment_method of setup.loyalty_points_setup_items){
          let tmp_payment_method = {
            payment_method_id    : payment_method.payment_method_setup_id,
            payment_method_name  : payment_method.payment_method_name,
            percentages: []
          }
          tmp_payment_methods.push(tmp_payment_method)
        }
        break
      }
    }
    

    for(let setup of this.fields.loyalty_points_setups){
      for(let payment_method of setup.loyalty_points_setup_items){
        for(let tmp_payment_method of tmp_payment_methods){
          if(tmp_payment_method.payment_method_id == payment_method.payment_method_setup_id){
            tmp_payment_method.percentages.push(payment_method.percentage)
          }
        }
      }
    }

    this.fields.payment_methods = tmp_payment_methods
  }
  updateModelDataFromViewData(){
    for(let i in this.fields.payment_methods){
      let tmp_payment_method = this.fields.payment_methods[i]
      for(let j in this.fields.loyalty_points_setups){
        let goods_setup = this.fields.loyalty_points_setups[j]
        for(let payment_method of goods_setup.loyalty_points_setup_items){
          if(payment_method.payment_method_setup_id == tmp_payment_method.payment_method_id){
            payment_method.percentage = tmp_payment_method.percentages[j]
            
            if(payment_method.percentage == null || payment_method.percentage == undefined || payment_method.percentage == '')
              payment_method.percentage = 0
          }
        }
      }
    }
  }
}