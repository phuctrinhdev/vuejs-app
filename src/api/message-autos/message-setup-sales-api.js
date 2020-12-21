import ServicesBaseAPI              from '../services-base-api'
import { getServiceUrl }            from '../../helpers/api-url-generator'
import { SERVICE_TYPES
  , SERVICE_EXTEND_TYPES }          from '../../config/constant'
import MessageSetupSalesViewModel   from '../../view-model/message-autos/message-setup-sales/message-setup-sales-view-model'

const url_command = getServiceUrl(SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_SALES_CMD, 1)
const url_read    = url_command + SERVICE_EXTEND_TYPES.READ

const url_list = url_read + SERVICE_EXTEND_TYPES.LIST
const url_expiry_date = url_command + SERVICE_EXTEND_TYPES.EXPIRY_DATE

export default class MessageSetupSalesApi extends ServicesBaseAPI {
  constructor() {
    super()
  }

  async getMessageSetupSalesListAsync(query) {
    let query_map = {
      shopId : query
    }
    try {
      let response = await this.http.post(url_list, query_map)
      this.setResult(response, () => {
        let mapData = {
          items: []
        }
        for(let item in response.data.result.items){
          let message_setup_client = new MessageSetupSalesViewModel()
          message_setup_client.mapFieldsFromApi(response.data.result.items[item])
          mapData.items.push(message_setup_client)
        }
        this.result.data = mapData
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getMessageSetupSalesAsync(query) {
    let query_map = {
      shopId : query.shop_id, 
      messageSetupSalesType : query.setup_type
    }
    try {
      let response = await this.http.post(url_read, query_map)
      this.setResult(response, () => {
        let mapData = {
          items: []
        }
        if(response.data.result.items.length > 0){
          for(let item in response.data.result.items){
            let message_setup_client = new MessageSetupSalesViewModel()
            message_setup_client.mapFieldsFromApi(response.data.result.items[item])
            mapData.items.push(message_setup_client)
          }
        }else{
          let message_setup_client = new MessageSetupSalesViewModel()
          mapData.items.push(message_setup_client)
        }
        this.result.data = mapData
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async createMessageSetupSalesAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.post(url_command, params)
      this.setResult(response, () => {
        let message_setup_sales = new MessageSetupSalesViewModel()
        message_setup_sales.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_sales
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateMessageSetupSalesAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.put(url_command, params)
      this.setResult(response, () => {
        let message_setup_sales = new MessageSetupSalesViewModel()
        message_setup_sales.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_sales
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async deleteMessageSetupSalesAsync(model) {
    let params = model.mapDeleteFieldsToApi()
    try {
      let response = await this.http.delete(url_command, params)
      this.setResult(response, () => {
        let message_setup_sales = new MessageSetupSalesViewModel()
        message_setup_sales.mapFieldsFromApi(response.data.result)
        this.result.data = message_setup_sales
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async createMessageSetupSalesToExpiryDateAsync(model) {
    let params = {
      messageSetupSales : [ model[0].mapFieldsToApi(), model[1].mapFieldsToApi(), model[2].mapFieldsToApi() ]
    }
    try {
      let response = await this.http.post(url_expiry_date, params)
      this.setResult(response, () => {
        let mapData = {
          items: []
        }
        for(let item in response.data.result.messageSetupSales){
          let message_setup_client = new MessageSetupSalesViewModel()
          message_setup_client.mapFieldsFromApi(response.data.result.messageSetupSales[item])
          mapData.items.push(message_setup_client)
        }
        this.result.data = mapData
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateMessageSetupSalesToExpiryDateAsync(model) {
    let params = {
      messageSetupSales : [ model[0].mapFieldsToApi(), model[1].mapFieldsToApi(), model[2].mapFieldsToApi() ]
    }
    try {
      let response = await this.http.put(url_expiry_date, params)
      this.setResult(response, () => {
        let mapData = {
          items: []
        }
        for(let item in response.data.result.messageSetupSales){
          let message_setup_client = new MessageSetupSalesViewModel()
          message_setup_client.mapFieldsFromApi(response.data.result.messageSetupSales[item])
          mapData.items.push(message_setup_client)
        }
        this.result.data = mapData
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async deleteMessageSetupSalesToExpiryDateAsync(model) {
    let params = {
      messageSetupSalesIds : model.ids,
      shopId               : model.shop_id
    }
    try {
      let response = await this.http.delete(url_expiry_date, params)
      this.setResult(response, () => {
        let mapData = {
          items: []
        }
        for(let item in response.data.result){
          let message_setup_client = new MessageSetupSalesViewModel()
          message_setup_client.mapFieldsFromApi(response.data.result[item])
          mapData.items.push(message_setup_client)
        }
        this.result.data = mapData
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
}