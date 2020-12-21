import ViewModel from '../view-model.js'
import { CLIENTS_ENUMS } from '../../config/constant.js'


export default class ClientEnvironmentSetupViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      shop_id: 0,
      client_search_condition: CLIENTS_ENUMS.CLIENT_SEARCH_CONDITION,
      contact_info_to_manager: CLIENTS_ENUMS.CONTACT_INFO_HIDING_TYPE,
      contact_info_to_staff: CLIENTS_ENUMS.CONTACT_INFO_HIDING_TYPE,
      allow_edit_client: CLIENTS_ENUMS.CLIENT_EDIT_PERMISSION_TYPE,
      allow_delete_client: CLIENTS_ENUMS.CLIENT_EDIT_PERMISSION_TYPE,
      member_number_setup: CLIENTS_ENUMS.MEMBER_NUMBER_TYPE,
    }
  }
  getValidations() {
    let validations = {}
    return validations
  }

  mapFieldsFromApi(data,shop_id){
    if(!data) return
    this.fields.shop_id                 = shop_id
    this.fields.client_search_condition = data.clientSearchCondition
    this.fields.contact_info_to_manager = data.contactInfoToManager
    this.fields.contact_info_to_staff   = data.contactInfoToStaff
    this.fields.allow_edit_client       = data.allowEditClient
    this.fields.allow_delete_client     = data.allowDeleteClient
    this.fields.member_number_setup     = data.memberNumberSetup
  }

  isValid() {
    return super.isValid(this.getValidations())
  }
}