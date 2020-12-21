import ViewModel from '../view-model.js'


export default class FamilyViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      shop_id: 0,
      relationship: null,
      family_point: 0,
      client_name: '',
      client_id: 0
    }
  }
  getValidations(){
    let validations = {  
      family_point: {
        rules: {
          numeric: '',
          decimalLength: {
            decimal_value: 1
          },
          maxValue: {
            max_value: 9999999999.9
          },
          minValue: {
            min_value: 0
          }
        }
      },
      relationship: {
        rules: {
          maxLength: {
            max_value: 30
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