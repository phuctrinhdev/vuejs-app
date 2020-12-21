import ViewModel from '../view-model'

export default class BoardViewModeal extends ViewModel {
  constructor(){
    super()

    this.fields = {
      notice_id           : 0,
      board_id            : 0,
      country_code        : null,
      shop_id             : null,
      chain_id            : null,
      solution_id         : null,
      board_code          : null,
      title               : null,
      contents            : null,
      master_only_reading : false,

      post_on_top         : false,
      solution_ids        : null,
      business_type_codes : null,

      depth               : 0,
      parent_id           : null,

      files               : []
    }
  }
  getValidations(){
    let validations = {
      title: {
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      contents: {
        rules: {
          require: ''
        }
      } 
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}