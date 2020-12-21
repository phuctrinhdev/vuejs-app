import ViewModel      from '../../view-model'
import { options }    from '../../../helpers/options'

export default class MessageSetupPostVisitViewModel extends ViewModel {
  
  constructor() {
    super()
    this.fields = {
      // Master
      master_id        : 0,
      shop_id          : 0,
      country_code     : null,
      category_ids     : [],
      category_names   : null,

      // Detail
      detail_id        : 0,
      visit_type       : options.messages_enums.visit_type.by_sales_category,
      send_days_after  : 0,
      send_time_after  : 0,
      visit_count_type : options.messages_enums.visit_count_type.none,
      status           : options.common_status.inactive,
      contents         : '',
      message_type     : options.messages_enums.message_type.sms,
    
      detail_list : [] // Delete...?
    }
  }

  mapDetailFieldsFromApi(data) {
    if(!data) return
    
    this.fields.detail_id        = data.messageSetupPostVisitDetailId
    this.fields.visit_type       = data.visitType
    this.fields.send_days_after  = data.sendDaysAfter
    this.fields.send_time_after  = data.sendTimeAfter
    this.fields.visit_count_type = data.visitCountType
    this.fields.message_type     = data.messageType
    this.fields.status           = data.status
    this.fields.contents         = data.contents
  }

  mapDetailFieldsToApi(){
    return {
      messageSetupPostVisitMasterId : this.fields.master_id,    
      messageSetupPostVisitDetailId : this.fields.detail_id,
      visitType      : this.fields.visit_type,
      sendDaysAfter  : this.fields.send_days_after,    
      sendTimeAfter  : this.fields.send_time_after,
      visitCountType : this.fields.visit_count_type,    
      messageType    : this.fields.message_type,
      status         : this.fields.status,    
      contents       : this.fields.contents
    }
  }

  mapCreateMasterFieldsToApi(){
    return {
      shopId         : this.fields.shop_id,
      countryCode    : this.fields.country_code,
      categoryIds    : this.fields.category_ids,
      visitType      : this.fields.visit_type,
      sendDaysAfter  : this.fields.send_days_after,    
      sendTimeAfter  : this.fields.send_time_after,
      visitCountType : this.fields.visit_count_type,    
      messageType    : this.fields.message_type,
      status         : this.fields.status,    
      contents       : this.fields.contents,
    }
  }

  mapDeleteDetailFieldsToApi(){
    return {
      messageSetupPostVisitMasterId : this.fields.master_id,    
      messageSetupPostVisitDetailId : this.fields.detail_id,
    }
  }

  mapMasterFieldsFromApi(data) {
    if(!data) return
    
    this.fields.master_id     = data.messageSetupPostVisitMasterId
    this.fields.country_code  = data.countryCode
    this.fields.shop_id       = data.shopId
    this.fields.category_ids  = data.categoryIds // String
  }

  mapCreateMasterFieldsFromApi(data) {
    if(!data) return
    
    this.fields.master_id     = data.id
    this.fields.country_code  = data.countryCode
    this.fields.shop_id       = data.shopId
    this.fields.category_ids  = data.categoryIds // String
  }

  mapMasterFieldsToApi() {
    return {
      categoryIds : this.fields.category_ids, // List
      countryCode : this.fields.country_code,
      shopId      : this.fields.shop_id,
    }
  }
  
  getValidationRules() {
    let validations = {
      contents: {
        rules: {
          require: '',
          maxLength: {
            max_value: 2000
          }
        }
      },
      visit_count_type: {
        rules: {
          customRule: {
            process(model) {
              this.message = 'validate_messages.select-visit-type-count'
              if(model.visit_count_type == options.messages_enums.visit_count_type.none &&
                  model.visit_type == options.messages_enums.visit_type.by_sales) return false
              else return true
            }
          }
        }
      }
    }
    return validations
  }

  isValid(){
    return super.isValid(this.getValidationRules())
  }  
}
