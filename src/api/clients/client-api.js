import Http                                 from '../../helpers/http'
import { getServiceUrl }                    from '../../helpers/api-url-generator'
import { CLIENTS_ENUMS, SERVICE_TYPES }     from '../../config/constant'
import { 
  mapPagingToApi, 
  mapPagingFromApi,
  getClientHeaderParameters
} from '../../helpers/common' 

const url_read    = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_READ, 1) // Read API URL, Version
const url_command = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_CMD, 1) // Command API URL, Version
const url_aggr    = getServiceUrl(SERVICE_TYPES.CLIENT_AGGR, 1) //aggregator API URL, Version

let url_client_delete_completely  = url_command + CLIENTS_ENUMS.CLIENT_TYPE.DELETE_COMPLETELY
let url_client_update_status      = url_command + CLIENTS_ENUMS.CLIENT_TYPE.UPDATE_STATUS
let url_client_update_note        = url_command + CLIENTS_ENUMS.CLIENT_TYPE.UPDATE_NOTE
let url_client_update_change_point= url_command + CLIENTS_ENUMS.CLIENT_TYPE.CHANGE_POINT

let url_client_active               = url_read + CLIENTS_ENUMS.CLIENT_TYPE.ACTIVE
let url_client_duplicated           = url_read + CLIENTS_ENUMS.CLIENT_TYPE.DUPLICATED
let url_client_duplicated_by_values = url_read + CLIENTS_ENUMS.CLIENT_TYPE.DUPLICATED_BY_VALUE
let url_client_deleted              = url_read + CLIENTS_ENUMS.CLIENT_TYPE.DELETED
let url_next_member_number          = url_read + CLIENTS_ENUMS.CLIENT_TYPE.NEXT_MEMBER_NUMBER
let url_client_shop_info            = url_read + CLIENTS_ENUMS.CLIENT_TYPE.CLIENT_SHOP_INFO
let url_client_connectable          = url_read + CLIENTS_ENUMS.CLIENT_TYPE.CONNECTABLE


let url_client_get            = url_aggr + CLIENTS_ENUMS.CLIENT_TYPE.GETCLIENT
let url_client_aggr_shop_info = url_aggr + CLIENTS_ENUMS.CLIENT_TYPE.SHOP_INFO
// let url_client_update         = url_aggr + CLIENTS_ENUMS.CLIENT_TYPE.UPDATE_CLIENT // aggr api not update param yet
let url_client_update_delete  = url_aggr + CLIENTS_ENUMS.CLIENT_TYPE.UPDATE_CLIENT_TO_DELETED
let url_client_update         = url_command

let url_client_search         = url_aggr + CLIENTS_ENUMS.CLIENT_TYPE.SEARCH // url_client_search return result wrong
// let url_client_search         = url_read + CLIENTS_ENUMS.CLIENT_TYPE.SEARCH


const map_deleted          = 'mapDeletedFieldFromApi'
const map_duplicated_value ='mapDuplicatedByValueFieldFromApi'
const map_duplicated       = 'mapDuplicatedFieldFromApi'
const map_active           = 'mapActiveFieldFromApi'
const map_all              = 'mapAllFieldFromApi'
const map_next_number      = 'nextMemberNumber'
const map_search           = 'mapSearchFieldFromApi'

const map_sales_clients = 'mapSalesClientsFromApi'
const map_change_points = 'mapChangePointFromApi'
const map_update_client       = 'mapUpdatedClientFromApi'
const map_update_client_notes = 'mapUpdatedClientNotesFromApi'

export default class ClientApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  getUserClaims(){
    return {
      userClaims: getClientHeaderParameters()
    }
  }

  mapFieldToApi(model){
    return {
      shopId                 : model.shop_id, 
      clientName             : model.client_name,
      mobileNumber           : model.mobile_number,
      mobileNumber2          : model.mobile_number2,
      phoneNumber            : model.phone_number,
      notes                  : model.notes,
      memberType             : model.member_type,
      memberNumber           : model.member_number,
      allowedMessageType     : model.allowed_message_type,
      email                  : model.email,
      sex                    : model.sex,
      birthdayType           : model.birthday_type,
      birthYear              : model.birth_year,
      birthMonth             : model.birth_month,
      birthDD                : model.birth_dd,
      clientRatingId         : model.client_rating_id,
      clientGroupId          : model.client_group_id,
      clientReferralSourceId : model.client_referral_source_id,
      recommenderId          : model.recommender_id,
      postcode               : model.postcode,
      address1               : model.address1,
      address2               : model.address2,
      preferredStaffId       : model.preferred_staff_id,
      sessionToken           : model.session_token,
      shopLocation           : model.shop_location,
      country                : model.country
    }
  }

  mapUpdateStatusFieldToApi(model){
    return {
      clientIds   : model.client_ids,
      status      : model.status,
      sessionToken  : model.session_token,
      shopLocation  : model.shop_location,
      shopId      : model.shop_id
    }
  }

  mapUpdateChangePointFieldToApi(model){
    return {
      clientId : model.id,
      points   : model.points,
      shopId   : model.shop_id
    }
  }

  mapUpdateNoteFieldToApi(model){
    return {
      clientId    : model.client_id,
      shopId      : model.shop_id,
      notes       : model.notes
    }
  }

  mapDeleteFieldToApi(model){
    return {
      clientIds   : model.client_ids,
      shopId      : model.shop_id,
      sessionToken: model.session_token,
      shopLocation: model.shop_location,
      country     : model.country
    }
  }

  mapActiveFieldFromApi(model){
    return {
      id                 : model.clientId,
      shop_id            : model.shopId,
      client_name        : model.clientName,
      member_number      : model.memberNumber,
      mobile_number      : model.mobileNumber,
      mobile_number2     : model.mobileNumber2,
      phone_number       : model.phoneNumber,
      notes              : model.notes,
      total_sales_amount : model.totalSalesAmount,
      registration_date  : model.registrationDate
    }
  }

  mapSearchFieldFromApi(model){
    return {
      id                : model.clientId,
      client_name       : model.clientName,
      member_number     : model.memberNumber,
      mobile_number     : model.mobileNumber,
      mobile_number2    : model.mobileNumber2,
      phone_number      : model.phoneNumber,
      notes             : model.notes,
      birth_dd          : model.birthDD,
      birth_month       : model.birthMonth,
      birth_year        : model.birthYear,
      birthday_type     : model.birthdayType,
      preferred_staff_id: model.preferredStaffId,
      recent_visit_date : model.recentVisitDateTimeTS,
      shop_id           : model.shopId,
      registration_date : model.registrationDate,
      branch_number     : model.branchNumber,
      shop_name         : model.shopName,
      preferred_staff_name : model.preferredStaffName
    }
  }

  mapDuplicatedFieldFromApi(model){
    return {
      id                 : model.clientId,
      shop_id            : model.shopId,
      client_name        : model.clientName,
      member_number      : model.memberNumber,
      first_visit_date   : model.firstVisitDateTimeTS,
      total_sales_amount : model.totalSalesAmount,
      recent_visit_date  : model.recentVisitDateTimeTS,
      mobile_number      : model.mobileNumber,
      mobile_number2     : model.mobileNumber2,
      phone_number       : model.phoneNumber,
      registration_date  : model.registrationDate,
      modification_date  : model.modificationDate
    }
  }

  mapDeletedFieldFromApi(model){
    return {
      id                 : model.clientId,
      shop_id            : model.shopId,
      client_name        : model.clientName,
      deleted_date       : model.deletedDate,
      member_number      : model.memberNumber,
      mobile_number      : model.mobileNumber,
      mobile_number2     : model.mobileNumber2,
      phone_number       : model.phoneNumber,
      registration_date  : model.registrationDate,
      modification_date  : model.modificationDate,
      total_sales_amount : model.totalSalesAmount,
      recent_visit_date  : model.recentVisitDateTimeTS
    }
  }

  mapDuplicatedByValueFieldFromApi(model){
    return {
      id                 : model.clientId,
      shop_id            : model.shopId,
      client_name        : model.clientName,
      mobile_number      : model.mobileNumber,
      mobile_number2     : model.mobileNumber2,
      phone_number       : model.phoneNumber,
      registration_date  : model.registrationDate,
      modification_date  : model.modificationDate,
    }
  }

  mapAllFieldFromApi(model){
    return {
      id                          : model.clientId,
      shop_id                     : model.shopId,
      client_name                 : model.clientName,
      mobile_number               : model.mobileNumber,
      mobile_number2              : model.mobileNumber2,
      phone_number                : model.phoneNumber,
      notes                       : model.notes,
      registration_date           : model.registrationDate,
      member_type                 : model.memberType,
      member_number               : model.memberNumber,
      allowed_message_type        : model.allowedMessageType,
      email                       : model.email,
      sex                         : model.sex,
      birthday_type               : model.birthdayType,
      birth_year                  : model.birthYear,
      birth_month                 : model.birthMonth,
      birth_dd                    : model.birthDD,
      client_rating_id            : model.clientRatingId,
      client_rating_name          : model.clientRatingName,
      client_group_id             : model.clientGroupId,
      client_group_name           : model.clientGroupName,
      client_referral_source_id   : model.clientReferralSourceId,
      client_referral_source_name : model.clientReferralSourceName,
      recommender_id              : model.recommenderId,
      recommender_name            : model.recommenderName,
      postcode                    : model.postcode,
      address1                    : model.address1,
      address2                    : model.address2,
      preferred_staff_id          : model.preferredStaffId,
      preferred_staff_name        : model.preferredStaffName,
      balance                     : model.balance,
      outstanding                 : model.outstanding,
      points                      : model.points,
      family_id                   : model.familyId,
      family_point                : model.familyPoint,
      family_balance              : model.familyBalance, // todo
      total_sales_amount          : model.totalSalesAmount,
      average_sales_amount        : model.averageSalesAmount,
      branch_number               : model.branchNumber,
      shop_name                   : model.shopName,

      first_visit_date            : model.firstVisitDateTimeTS,
      recent_visit_date           : model.recentVisitDateTimeTS,
      number_of_visit             : model.numberOfVisit,
      avatar                      : model.avatar
    }
  }

  mapAllCmdReturnFromApi(model){
    return {
      id                          : model.clientId,
      shop_id                     : model.shopId,
      client_name                 : model.clientName,
      mobile_number               : model.mobileNumber,
      mobile_number2              : model.mobileNumber2,
      phone_number                : model.phoneNumber,
      notes                       : model.notes,
      registration_date           : model.registrationDate,
      member_type                 : model.memberType,
      member_number               : model.memberNumber,
      allowed_message_type        : model.allowedMessageType,
      email                       : model.email,
      sex                         : model.sex,
      birthday_type               : model.birthdayType,
      birth_year                  : model.birthYear,
      birth_month                 : model.birthMonth,
      birth_dd                    : model.birthDD,
      client_rating_id            : model.clientRatingId,
      client_group_id             : model.clientGroupId,
      client_referral_source_id   : model.clientReferralSourceId,
      recommender_id              : model.recommenderId,
      postcode                    : model.postcode,
      address1                    : model.address1,
      address2                    : model.address2,
      preferred_staff_id          : model.preferredStaffId,
    }
  }

  mapClientCodeFromApi(model){
    if(model.clientGroupId != null){
      return {
        id   : model.clientGroupId,
        name : model.itemName
      }
    }
    else if(model.clientRatingId != null){
      return {
        id   : model.clientRatingId,
        name : model.itemName
      }
    }
    else if(model.clientReferralSourceId != null){
      return {
        id   : model.clientReferralSourceId,
        name : model.itemName
      }
    }
    else if(model.staffId != null){
      return {
        id   : model.staffId,
        aliasname : model.aliasName
      }
    }
  }
  
  mapEnvironmentFromApi(model){
    return {
      id                         : model.clientEnvironmentSetupId,
      member_number_setup        : model.memberNumberSetup,
      contact_info_to_manager    : model.contactInfoToManager,
      contact_info_to_staff      : model.contactInfoToStaff,
      allow_edit_client          : model.allowEditClient,
      allow_delete_client        : model.allowDeleteClient,
      client_search_condition    : model.clientSearchCondition
    }    
  }

  mapFieldSetupFromApi(model){
    return {
      id              : model.clientFieldSetupId,
      address         : model.address,
      referral_source : model.referralSource,
      birthday        : model.birthday,
      client_group    : model.clientGroup,
      client_rating   : model.clientRating,
      email           : model.email,
      member          : model.member,
      mobile_number2  : model.mobileNumber2,
      phone_number    : model.phoneNumber,
      preferred_staff : model.preferredStaff,
      recommender     : model.recommender,
      sex             : model.sex,
    }
  }

  mapSalesClientsFromApi(model){
    return {
      loc                  : model.location,
      shop_id              : model.shopId,
      client_id            : model.clientId,
      client_name          : model.clientName,
      mobile_number        : model.mobileNumber,
      mobile_number2       : model.mobileNumber2,
      phone_number         : model.phoneNumber,
      birth_year           : model.birthYear,
      birth_month          : model.birthMonth,
      birth_dd             : model.birthDD,
      preferred_staff_name : model.preferredStaffName,
      recommender_name     : model.recommenderName,
      recent_visit_date    : model.recentVisitDateTimeTS,
      notes                : model.notes
    }
  }

  mapChangePointFromApi(model){
    return {
      modification_date : model.modificationDate,
      client_id         : model.clientId,
      points            : model.points,
      shop_id           : model.shopId,
    }
  }

  nullToZero(data){
    if(data.birthDD == null || data.birthDD == '')
      data.birthDD = '0'
    if(data.birthMonth == null || data.birthMonth == '')
      data.birthMonth = '0'
    if(data.birthYear == null || data.birthYear == '')
      data.birthYear = '0'

    return data
  }

  setResult(response, mapType){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok          = response.data.isOK
    if(this.result.is_ok){
      switch(mapType){
        case map_all:
          this.result.data = this.mapAllFieldFromApi(response.data.result)
          break
        case map_active:
          this.result.data = this.mapActiveFieldFromApi(response.data.result)
          break
        case map_next_number:
          this.result.data = response.data.result
          break
        case map_change_points:
          this.result.data = this.mapChangePointFromApi(response.data.result)
          break
        case map_update_client:
          this.result.data = this.mapAllCmdReturnFromApi(response.data.result)
          break
        case map_update_client_notes:
          this.result.data = this.mapAllCmdReturnFromApi(response.data.result.updateClient)
          break
      }
    }
  }

  setListResult(response, mapType){
    this.result.is_ok = response.data.isOK
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    if(this.result.is_ok) {
      let mapData = {
        items: [],
        pagination: {}
      }
      for(let item in response.data.result.items){
        if(mapType == map_active)
          mapData.items.push(this.mapActiveFieldFromApi(response.data.result.items[item]))
        if(mapType == map_search)
          mapData.items.push(this.mapSearchFieldFromApi(response.data.result.items[item]))
        if(mapType == map_duplicated_value)
          mapData.items.push(this.mapDuplicatedByValueFieldFromApi(response.data.result.items[item]))
        if(mapType == map_duplicated)
          mapData.items.push(this.mapDuplicatedFieldFromApi(response.data.result.items[item]))
        if(mapType == map_deleted)
          mapData.items.push(this.mapDeletedFieldFromApi(response.data.result.items[item]))
        if(mapType == map_sales_clients)
          mapData.items.push(this.mapSalesClientsFromApi(response.data.result.items[item]))
      }
      mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
      this.result.data = mapData
    }
  }

  async getClientsAsync(query) {
    try {
      let query_map = mapPagingToApi(query)
      const response = await this.http.post(url_client_active, query_map)
      this.setListResult(response, map_active)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getClientsByValuesAsync(query) {
    let query_map = {
      searchCondition : query.search_condition,
      searchValue     : query.search_keyword,
      //shopIds         : query.shop_ids,
      searchInBranches: query.search_in_branches,
      pageSize        : query.page_size,
      pageNumber      : query.page_number,
      shopId          : query.shop_id
    }

    try {
      const response = await this.http.post(url_client_search, query_map)
      if(query.page == CLIENTS_ENUMS.PAGE.RECOMMEND_CLIENTS || query.page == CLIENTS_ENUMS.PAGE.ADD_BOOKING)
        this.setListResult(response, map_search)
      else
        this.setListResult(response, map_sales_clients)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async getClientsByNameAndMobileAsync(query) {
    let query_map = {
      clientName  : query.client_name,
      mobileNumber: query.mobile_number,
      shopId      : query.shop_id
    }

    try {
      const response = await this.http.post(url_client_connectable, query_map)
      this.setListResult(response, map_search)
      this.result.data.pagination = {
        ...this.result.data.pagination,
        total_items: response.data.result.totalItems
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getClientAsync(data) {
    try {
      let send_data = {
        clientId: data.client_id,
        shopId: data.shop_id
      }
      const response = await this.http.post(url_client_get, send_data)
      this.result.action = data.action
      this.setResult(response, map_all)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getNextMemberNumberAsync(shop_id) {
    let send_data = {
      shopId: shop_id
    }

    try {
      const response = await this.http.post(url_next_member_number, send_data)
      this.setResult(response, map_next_number)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async addClientAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.post(url_command, Object.assign(data_send, this.nullToZero(data_send)), this.getUserClaims())
      this.setResult(response, map_all)
      if(this.result.is_ok) {
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateClientAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.clientId = data.id
    try {
      const response = await this.http.put(url_client_update, Object.assign(data_send, this.nullToZero(data_send)), this.getUserClaims())
      this.setResult(response, map_update_client)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
        delete this.result.data.registration_date
        delete this.result.data.total_sales_amount
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deletedClientsAsync(data){
    let data_send = this.mapDeleteFieldToApi(data)

    try {
      const response = await this.http.delete(url_client_delete_completely, data_send, this.getUserClaims())
      this.setResult(response, null)
      this.result.data = {}
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateNoteAsync(data) {
    let data_send = this.mapUpdateNoteFieldToApi(data)

    try {
      const response = await this.http.put(url_client_update_note, data_send)
      this.setResult(response, map_update_client_notes)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
        delete this.result.data.registration_date
        delete this.result.data.total_sales_amount
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateToDeletedClientAsync(data) {
    try {
      const response = await this.http.post(url_client_update_delete, data)
      this.setResult(response, null)
      this.result.data = {}
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getDuplicatedClientsAsync(query){
    try{
      let query_map = mapPagingToApi(query) // don't need status
      query_map.searchCondition = query.search_condition

      const response = await this.http.post(url_client_duplicated, query_map)
      this.setListResult(response, map_duplicated)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getDuplicatedClientsByValueAsync(query) {
    try {
      let query_map = mapPagingToApi(query) // don't need status
      query_map.clientId = query.client_id
      query_map.searchCondition = query.search_condition
      query_map.searchValue = query.search_value
      query_map.searchValue2 = query.search_value2

      const response = await this.http.post(url_client_duplicated_by_values, query_map)
      this.setListResult(response, map_duplicated_value)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateClientStatusAsync(data) {
    let data_send = this.mapUpdateStatusFieldToApi(data)
    try {
      const response = await this.http.post(url_client_update_status, data_send)
      this.setResult(response, null)
      this.result.data = {}
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateClientChangePointAsync(data) {
    let data_send = this.mapUpdateChangePointFieldToApi(data)
    try {
      const response = await this.http.put(url_client_update_change_point, data_send)
      this.setResult(response, map_change_points)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getDeletedClientsAsync(query){
    try{
      let query_map = mapPagingToApi(query) // don't need status
      query_map.searchValue = query.search_value

      const response = await this.http.post(url_client_deleted, query_map)
      this.setListResult(response, map_deleted)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getClientShopInfoAggAsync(data){
    let data_send = {
      shopId: data
    }

    try{
      const response = await this.http.post(url_client_aggr_shop_info, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let mapData = {
          client_groups: [],
          client_ratings: [],
          referral_sources: [],
          field_setups: {},
          environments: {},
          staff_active: []
        }
        for(let item in response.data.result.clientGroup){
          mapData.client_groups.push(this.mapClientCodeFromApi(response.data.result.clientGroup[item]))
        }
        for(let item in response.data.result.clientRating){
          mapData.client_ratings.push(this.mapClientCodeFromApi(response.data.result.clientRating[item]))
        }
        for(let item in response.data.result.clientReferralSource){
          mapData.referral_sources.push(this.mapClientCodeFromApi(response.data.result.clientReferralSource[item]))
        }
        for(let item in response.data.result.staffActive){
          mapData.staff_active.push(this.mapClientCodeFromApi(response.data.result.staffActive[item]))
        }
        mapData.field_setups = this.mapFieldSetupFromApi(response.data.result.clientFieldSetup) 
        mapData.environments = this.mapEnvironmentFromApi(response.data.result.clientEnvironment)
        
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getClientShopInfoAsync(data){
    let data_send = {
      shopId: data
    }

    try{
      const response = await this.http.post(url_client_shop_info, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let mapData = {
          client_groups: [],
          client_ratings: [],
          referral_sources: [],
          field_setups: {},
          environments: {}
        }
        for(let item in response.data.result.clientGroup){
          mapData.client_groups.push(this.mapClientCodeFromApi(response.data.result.clientGroup[item]))
        }
        for(let item in response.data.result.clientRating){
          mapData.client_ratings.push(this.mapClientCodeFromApi(response.data.result.clientRating[item]))
        }
        for(let item in response.data.result.clientReferralSource){
          mapData.referral_sources.push(this.mapClientCodeFromApi(response.data.result.clientReferralSource[item]))
        }
        
        mapData.field_setups = this.mapFieldSetupFromApi(response.data.result.clientFieldSetup) 
        mapData.environments = this.mapEnvironmentFromApi(response.data.result.clientEnvironment)
        
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}