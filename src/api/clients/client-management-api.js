import Http from '../../helpers/http'
import ClientManagementViewModel from '../../view-model/clients/client-management/client-management-view-model'
import { mapPagingFromApi  } from '../../helpers/common'
import ClientManagementFilterViewModel from '../../view-model/clients/client-management/client-management-filter-view-model'
import ClientManagementSearchConditionViewModel from '../../view-model/clients/client-management/client-management-search-condition-view-model'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'

const url_aggr = getServiceUrl(SERVICE_TYPES.CLIENT_AGGR,1)
const identities_url_read    = getServiceUrl(SERVICE_TYPES.IDENTITIES.USER_ACCOUNT_READ, 1)

let url_aggr_search_client_management = url_aggr + '/SearchClientsManagement'
let url_aggr_change_client_rating     = url_aggr + '/UpdateClientsRating'
let url_auth_check_user_master   = identities_url_read + '/CheckUserMaster'
url_auth_check_user_master = url_auth_check_user_master.replace('UserAccount', 'Auth')

export default class ClientManagementApi{
  constructor(){
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  async getClientsByFilterAsync(data){
    try {
      let query = {
        shopId: data.shop_id,
        pageSize: data.page_size,
        pageNumber: data.page_number,
        clientBasicInfoFilter: {
        },
        saleClientsSearchCondition: {}
      }
      let client_management_filter_view_model = new ClientManagementFilterViewModel()
      query.clientBasicInfoFilter = client_management_filter_view_model.mapFieldToApi(data.filter.fields)
      query.clientBasicInfoFilter.shopId = query.shopId
      query.clientBasicInfoFilter.pageSize = query.pageSize
      query.clientBasicInfoFilter.pageNumber = query.pageNumber
      let client_management_search_condition_view_model = new ClientManagementSearchConditionViewModel()
      query.saleClientsSearchCondition = client_management_search_condition_view_model.mapFieldToApi(data.search_condition.fields)
      let response = await this.http.post(url_aggr_search_client_management, query)
      
      if(response.data.isOK){
        this.result.is_ok = true

        let tmp_data = {
          items: [],
          pagination: {
            page_number: 1,
            page_size  : 10,
            total_items: 0,
            total_pages: 1
          },
          total_client_ids: []
        }
        if(response.data.result != null){
          for(let item of response.data.result.items){
            let client_management_view_model = new ClientManagementViewModel()
            tmp_data.items.push(client_management_view_model.mapFieldFromApi(item))
          }
          tmp_data.pagination = mapPagingFromApi(response.data.result.pagingInfo)
          tmp_data.total_client_ids = response.data.result.totalClientIds
        }

        this.result.data = tmp_data
      }
      else{
        this.result.error_messages = response.data.errorMessages
      }
      return this.result
    }
    catch (error) {
      return this.http.loadError(error)
    }
  }

  async changeClientsRatingAsync(query) {
    let params = {
      clientIds     : query.client_ids,
      clientRatingId: query.client_rating_id,
      sessionToken  : query.session_token,
      shopId        : query.shop_id,
      shopLocation  : query.shop_location,
    }
    try {
      const response = await this.http.post(url_aggr_change_client_rating, params)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        this.result.data = {
          client_ids      : response.data.result.clientIds,
          client_rating_id: response.data.result.clientRatingId
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async checkUserMasterAsync(query) {
    let params = {
      userId  : query.user_id,
      password: query.password,
      shopId  : query.shop_id,
    }
    try {
      const response = await this.http.post(url_auth_check_user_master, params)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        this.result.data = response.data.result
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

}