import Http                                                   from '../../helpers/http'
import { getServiceUrl }                                      from '../../helpers/api-url-generator'
import { SERVICE_TYPES, CLIENTS_ENUMS, SERVICE_EXTEND_TYPES } from '../../config/constant'
import SalesClientAccountChangePointViewModel                 from '../../view-model/sales/sales-client-account/sales-client-account-change-point-view-model'
import { mapPagingToApi, 
  mapPagingFromApi, 
  convertTimeStampToDate }                   from '../../helpers/common' 

// family in sales part
const url_aggr_client      = getServiceUrl(SERVICE_TYPES.CLIENT_AGGR, 1)
const url_read             = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_FAMILY_READ, 1)
const url_command          = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_FAMILY_CMD, 1)

let url_read_family_member        = url_read               + CLIENTS_ENUMS.CLIENT_TYPE.FAMILY_MEMBER
let url_read_family_member_list   = url_read_family_member + SERVICE_EXTEND_TYPES.LIST
let url_read_family_member_search = url_aggr_client        + SERVICE_EXTEND_TYPES.SALES_CLIENT_SEARCH_WITH_FAMILY

let url_create_family        = url_command + CLIENTS_ENUMS.CLIENT_TYPE.FAMILY
let url_update_family_point  = url_command + CLIENTS_ENUMS.CLIENT_TYPE.CHANGE_FAMILY_POINT
let url_action_family_member = url_command + CLIENTS_ENUMS.CLIENT_TYPE.FAMILY_MEMBER

const map_change_family_point = 'mapChangeFamilyPointFromApi'
const map_family_member       = 'mapFamilyMemberFromApi'
const map_delete_family       = 'mapDeleteFamilymemberFromApi'

// client in sales part 
const url_cmd_sales_client = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_CMD, 1)
let url_cmd_sales_client_change_point = url_cmd_sales_client + SERVICE_EXTEND_TYPES.SALES_CLIENT_CHANGE_POINT

export default class ClientFamilyApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapCreateFamilyToApi(model){
    return {
      clientId                : model.client_id,
      targetClientId          : model.target_client_id,
      clientName              : model.client_name,
      clientMobileNumber      : model.client_mobile_number,
      clientPhoneNumber       : model.client_phone_number,
      targetClientName        : model.target_client_name,
      targetClientMobileNumber: model.target_client_mobile_number,
      targetClientPhoneNumber : model.target_client_phone_number,
      relationship            : model.relationship,
      createdById             : model.created_by_id,
      createdByName           : model.created_by_name,
      sessionToken            : model.session_token,
      shopLocation            : model.shop_location,
      shopId                  : model.shop_id,
    }
  }

  mapChangeFamilyPointToApi(model){
    return {
      familyId            : model.family_id,
      familyLoyaltyPoints : model.family_point,
      createdById         : model.created_by_id,
      createdByname       : model.created_by_name,
      sessionToken        : model.session_token,
      shopLocation        : model.shop_location,
      shopId              : model.shop_id,
    }
  }
  mapChangeFamilyPointFromApi(model){
    return {
      family_id         : model.familyId,
      family_point      : model.familyPoint,
      shop_id           : model.shopId,
      modification_date : model.modificationDate,
    }
  }

  mapFamilyMemberListFromApi(model){
    return {
      family_id      : model.familyId,
      family_point   : model.familyPoint,
      family_balance : model.familyBalance
    }
  }

  mapAddFamilyMemberToApi(model){
    return {
      familyId          : model.family_id,
      clientId          : model.client_id,
      clientName        : model.client_name,
      clientMobileNumber: model.client_mobile_number,
      clientPhoneNumber : model.client_phone_number,
      relationship      : model.relationship,
      createdById       : model.created_by_id,
      createdByName     : model.created_by_name,
      sessionToken      : model.session_token,
      shopLocation      : model.shop_location,
      shopId            : model.shop_id,
    }
  }
  mapUpdateFamilyMemberToApi(model){
    return {
      familyId       : model.family_id,
      familyMemberId : model.family_member_id,
      relationship   : model.relationship,
      updatedById    : model.updated_by_id,
      updatedByName  : model.updated_by_name,
      sessionToken   : model.session_token,
      shopLocation   : model.shop_location,
      shopId         : model.shop_id
    }
  }
  mapFamilyMemberFromApi(model){
    return {
      family_member_id    : model.familyMemberId,
      family_id           : model.familyId,
      relationship        : model.relationship,
      client_id           : model.clientId,
      registration_date   : convertTimeStampToDate(model.clientRegistrationDateTS),
      registration_date_ts: model.clientRegistrationDateTS,
      modification_date   : model.modificationDate,
      shop_id             : model.shopId,
      client_name         : model.clientName,
      mobile_number       : model.mobileNumber,
      mobile_number2      : model.mobileNumber2,
      phone_number        : model.phoneNumber,
      birth_year          : model.birthYear,
      birth_month         : model.birthMonth,
      birth_dd            : model.birthDD
    }
  }
  
  mapDeleteFamilyMemberToApi(model){
    return {
      familyId           : model.family_id,
      familyMemberId     : model.family_member_id,
      familyLoyaltyPoints: model.family_loyalty_points,

      createdById        : model.created_by_id,
      createdByname      : model.created_by_name,
      sessionToken       : model.session_token,
      shopLocation       : model.shop_location,
      shopId             : model.shop_id,
    }
  }
  mapDeleteFamilymemberFromApi(model){
    return {
      family_id        : model.familyId,
      family_member_id : model.familyMemberId,
      family_point     : model.familyPoint,
      shop_id          : model.shopId,
    }
  }

  setResult(response, mapType){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(mapType == map_family_member)
      if(response.data.isOK) this.result.data = this.mapFamilyMemberFromApi(response.data.result)
    if(mapType == map_change_family_point)
      if(response.data.isOK) this.result.data = this.mapChangeFamilyPointFromApi(response.data.result)
    if(mapType == map_delete_family)
      if(response.data.isOK) this.result.data = this.mapDeleteFamilymemberFromApi(response.data.result)
  }

  // family
  async createFamilyAsync(data){
    try {
      let data_send = this.mapCreateFamilyToApi(data)
      const response = await this.http.post(url_create_family, data_send)
      this.setResult(response, map_family_member)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateFamilyPointAsync(data) {
    let data_send = this.mapChangeFamilyPointToApi(data)

    try {
      const response = await this.http.post(url_update_family_point, data_send)
      this.setResult(response, map_change_family_point)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  // family member
  async getFamilyMemberSearchAsync(data) {
    try {
      let send_data = mapPagingToApi(data)
      send_data.searchValue = data.search_value
      send_data.searchValue2 = data.search_value2
      const response = await this.http.post(url_read_family_member_search, send_data)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapFamilyMemberFromApi(response.data.result.items[item])) // todo change
        }
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo) 
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getFamilyMemberListAsync(query) {
    try {
      let query_map = mapPagingToApi(query)
      if(query.family_id == null) query.family_id = 0
      query_map.familyId = query.family_id

      const response = await this.http.post(url_read_family_member_list, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        mapData.family_info = this.mapFamilyMemberListFromApi(response.data.result)
        for(let item in response.data.result.items){
          mapData.items.push(this.mapFamilyMemberFromApi(response.data.result.items[item]))
        }
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo) 
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getFamilyMemberAsync(data) {
    try {
      let send_data = {
        shopId: data.shop_id,
        familyMemberId: data.family_member_id
      }
      const response = await this.http.post(url_read_family_member, send_data)
      this.result.action = data.action
      this.setResult(response, map_family_member)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async addFamilyMemberAsync(data){
    try {
      let data_send = this.mapAddFamilyMemberToApi(data)
      const response = await this.http.post(url_action_family_member, data_send)
      this.setResult(response, map_family_member)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateFamilyMemberAsync(data){
    try {
      let data_send = this.mapUpdateFamilyMemberToApi(data)
      const response = await this.http.put(url_action_family_member, data_send)
      this.setResult(response, map_family_member)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteFamilyMemberAsync(data){
    try {
      let data_send = this.mapDeleteFamilyMemberToApi(data)
      const response = await this.http.delete(url_action_family_member, data_send)
      this.setResult(response, map_delete_family)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  // client account
  async updateSalesClientAccountChangePointAsync(sales_client_account_change_point_vm) {
    let data_send = sales_client_account_change_point_vm.mapFieldsToApi()

    try {
      const response = await this.http.put(url_cmd_sales_client_change_point, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok){
        let sales_client_account_change_point_vm = new SalesClientAccountChangePointViewModel()
        sales_client_account_change_point_vm.mapFieldsFromApi(response.data.result)
        this.result.data = sales_client_account_change_point_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}