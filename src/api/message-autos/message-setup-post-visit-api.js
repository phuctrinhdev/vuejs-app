import ServicesBaseAPI     from '../services-base-api'
import { getServiceUrl }   from '../../helpers/api-url-generator'
import { SERVICE_TYPES
  , SERVICE_EXTEND_TYPES } from '../../config/constant'
import MessageSetupPostVisitGeneralViewModel from '../../view-model/message-autos/message-setup-post-visit/message-setup-post-visit-general-view-model'
import MessageSetupPostVisitViewModel from '../../view-model/message-autos/message-setup-post-visit/message-setup-post-visit-view-model'

const url_command = getServiceUrl(SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_POST_VISIT_CMD, 1)
const url_read    = url_command + SERVICE_EXTEND_TYPES.READ

const url_command_general  = url_command + SERVICE_EXTEND_TYPES.GENERAL
const url_command_master   = url_command + SERVICE_EXTEND_TYPES.MASTER
const url_command_detail   = url_command + SERVICE_EXTEND_TYPES.DETAIL

const url_read_general     = url_read + SERVICE_EXTEND_TYPES.GENERAL
const url_read_master_list = url_read + SERVICE_EXTEND_TYPES.MASTER + SERVICE_EXTEND_TYPES.LIST
const url_read_master      = url_read + SERVICE_EXTEND_TYPES.MASTER
const url_read_detail      = url_read + SERVICE_EXTEND_TYPES.DETAIL

export default class MessageSetupPostVisitApi extends ServicesBaseAPI {
  constructor() {
    super()
  }

  async createMessageSetupPostVisitGeneralAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.post(url_command_general, params)
      this.setResult(response, () => {
        let message_setup_post_visit_general = new MessageSetupPostVisitGeneralViewModel()
        message_setup_post_visit_general.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_post_visit_general
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateMessageSetupPostVisitGeneralAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.put(url_command_general, params)
      this.setResult(response, () => {
        let message_setup_post_visit_general = new MessageSetupPostVisitGeneralViewModel()
        message_setup_post_visit_general.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_post_visit_general
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getMessageSetupPostVisitGeneralAsync(query) {
    let query_map = {
      shopId : query.shop_id
    }
    try {
      let response = await this.http.post(url_read_general, query_map)
      this.setResult(response, () => {
        let message_setup_post_visit_general = new MessageSetupPostVisitGeneralViewModel()
        message_setup_post_visit_general.mapFieldsFromApi(response.data.result)
        this.result.action = query.action
        this.result.data = message_setup_post_visit_general
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getMessageSetupPostVisitMastersAsync(query) {
    let query_map = {
      shopId : query
    }
    try {
      let response = await this.http.post(url_read_master_list, query_map)
      this.setResult(response, () => {
        let mapData = {
          items: []
        }
        for(let item in response.data.result.items){
          let message_setup_post_visit = new MessageSetupPostVisitViewModel()
          message_setup_post_visit.mapMasterFieldsFromApi(response.data.result.items[item])
          message_setup_post_visit.mapDetailFieldsFromApi(response.data.result.items[item])
          mapData.items.push(message_setup_post_visit)
        }
        this.result.data = mapData
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getMessageSetupPostVisitMasterAsync(query) {
    let query_map = {
      messageSetupPostVisitMasterId : query
    }
    try {
      let response = await this.http.post(url_read_master, query_map)
      this.setResult(response, () => {
        let mapData = {
          master : {},
          items  : []
        }
        let message_setup_post_visit_master = new MessageSetupPostVisitViewModel()
        message_setup_post_visit_master.mapMasterFieldsFromApi(response.data.result)
        mapData.master = message_setup_post_visit_master

        for(let item in response.data.result.items){
          let message_setup_post_visit_detail = new MessageSetupPostVisitViewModel()
          message_setup_post_visit_detail.mapDetailFieldsFromApi(response.data.result.items[item])
          mapData.items.push(message_setup_post_visit_detail)
        }
        this.result.data = mapData
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getMessageSetupPostVisitDetailAsync(query) {
    let query_map = {
      messageSetupPostVisitDetailId : query
    }
    try {
      let response = await this.http.post(url_read_detail, query_map)
      this.setResult(response, () => {
        let message_setup_post_visit_detail = new MessageSetupPostVisitViewModel()
        message_setup_post_visit_detail.mapDetailFieldsFromApi(response.data.result)
        this.result.data = message_setup_post_visit_detail
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async createMessageSetupPostVisitDetailAsync(model) {
    let params = model.mapDetailFieldsToApi()
    try {
      let response = await this.http.post(url_command_detail, params)
      this.setResult(response, () => {
        let message_setup_post_visit_detail = new MessageSetupPostVisitViewModel()
        message_setup_post_visit_detail.mapDetailFieldsFromApi(response.data.result)
        this.result.data = message_setup_post_visit_detail
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateMessageSetupPostVisitDetailAsync(model) {
    let params = model.mapDetailFieldsToApi()
    try {
      let response = await this.http.put(url_command_detail, params)
      this.setResult(response, () => {
        let message_setup_post_visit_detail = new MessageSetupPostVisitViewModel()
        message_setup_post_visit_detail.mapDetailFieldsFromApi(response.data.result)
        this.result.data = message_setup_post_visit_detail
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async deleteMessageSetupPostVisitDetailAsync(model) {
    let params = model.mapDeleteDetailFieldsToApi()
    try {
      let response = await this.http.delete(url_command_detail, params)
      this.setResult(response, () => {
        let message_setup_post_visit_detail = new MessageSetupPostVisitViewModel()
        message_setup_post_visit_detail.mapDetailFieldsFromApi(response.data.result)
        this.result.data = message_setup_post_visit_detail
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async createMessageSetupPostVisitMasterAsync(model) {
    let params = model.mapCreateMasterFieldsToApi()
    try {
      let response = await this.http.post(url_command_master, params)
      this.setResult(response, () => {
        let message_setup_post_visit_master = new MessageSetupPostVisitViewModel()
        message_setup_post_visit_master.mapCreateMasterFieldsFromApi(response.data.result.messageSetupPostVisitMaster)
        this.result.data = message_setup_post_visit_master
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
}