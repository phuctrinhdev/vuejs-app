import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

//Menu
//const url_command = getServiceUrl(SERVICE_TYPES.ADMINS.MENU_CMD, 1) // Command API URL, Version
const url_read = getServiceUrl(SERVICE_TYPES.ADMINS.MENU_READ, 1) // Read API URL, Version

let url_user_role = url_read + SERVICE_EXTEND_TYPES.USER_ROLE

export default class MenuApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapFieldFromApi(model){
    let menu_access = null

    if(model.menuAccess != null){
      menu_access = {
        deny_business_type_codes : model.menuAccess.denyBusinessTypeCodes,
        deny_country_codes       : model.menuAccess.denyCountryCodes,
        deny_service_type_codes  : model.menuAccess.denyServiceTypeCodes,
        user_role_codes          : model.menuAccess.userRoleCodes
      }
    }
    return {
      menu_access      : menu_access,
      menu_code        : model.menuCode,
      menu_id          : model.menuId,
      menu_level       : model.menuLevel,
      menu_name        : model.menuName,
      order_no         : model.orderNo,
      parent_menu_code : model.parentMenuCode,
      solution_id      : model.solutionId,
    }
  }

  setResult(response, mapFunc){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    mapFunc = mapFunc || this.mapFieldFromApi
    if(response.data.isOK)
      this.result.data = mapFunc(response.data.result)
  }

  async getUseMenuDataAsync(query) { // todo update
    try {
      let query_map = {
        countryCode: query.country_code,
        serviceTypeCode: query.service_type_code,
        businessTypeCode: query.business_type_code,
        userRoleCode: query.user_role_code,
        shopUserRoleId: query.shop_user_role_id,
        solutionId: query.solution_id
      }
      const response = await this.http.post(url_user_role, query_map)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok)
        this.result.data = response.data.result
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}