import Validator from './validator.js'

export default class ViewModel {
  constructor(){
    this.fields = {}
  }
  setFields(fields_data){
    this.fields = Object.assign(this.fields, fields_data)
  }
  getFields(){
    return this.fields
  }
  isValid(validations) {
    let messages = []
    let validator_instance = new Validator()
    validator_instance.setModel(this.fields)
    messages = validator_instance.validate(validations)
    return messages
  }
  updateShopData(shop_data){
    Object.assign(this.fields, shop_data)
  }
}