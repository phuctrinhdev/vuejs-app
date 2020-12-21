import ViewModel from '../view-model.js'
import { GOODS_STATUS, GOODS_TYPE } from '../../config/constant' 

export default class PackageViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id: 0, 
      name: '', 
      total_amount: 0,
      status: GOODS_STATUS.ACTIVE,
      items: [],
      shared: true,
      is_delete: false,
      shop_id: 0
    }
  }
  getValidations(){
    let validations = { 
      name: {
        label:'packages.packages-name',
        rules: {
          require: '' ,
          maxLength: {
            max_value: 40
          } 
        }
      },
      items: {
        label:'packages.items',
        rules: {  
          customRule: {
            message: [],
            process(model) {  
              let count = model.items.length
              let flag = true
              if(count<=0 && model.is_delete == false){  
                this.message.push({
                  message: 'validate_messages.require'
                })
                if(flag) flag =false
              }
              //"Items is required."
              count = model.items.filter(t=>t.item_type == GOODS_TYPE.SERVICE).length
              if(count>6){  
                this.message.push({   
                  message: 'validate_messages.package_service'
                })
                if(flag) flag =false
              }
              count = model.items.filter(t=>t.item_type == GOODS_TYPE.PRODUCT).length
              if(count>6){ 
                this.message.push({ 
                  message: 'validate_messages.package_product'
                })
                if(flag) flag =false
              }
              count = model.items.filter(t=>t.item_type == GOODS_TYPE.PREPAID_CARD).length
              if(count>1){ 
                this.message.push({ 
                  message: 'validate_messages.package_prepaid_card'
                })
                if(flag) flag =false
              }
              count = model.items.filter(t=>t.item_type == GOODS_TYPE.PREPAID_SERVICE).length
              if(count>8){ 
                this.message.push({ 
                  message: 'validate_messages.package_prepaid_service'
                })
                if(flag) flag =false
              }
              return flag
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