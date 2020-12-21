import ServicesBaseAPI             from '../services-base-api'
import { getServiceUrl }           from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES }  from '../../config/constant'
//import { mapPagingFromApi }        from '../../helpers/common' 
import MessageSetupBookingViewModel from '../../view-model/message-autos/message-setup-booking/message-setup-booking-view-model'

const url_command = getServiceUrl(SERVICE_TYPES.MESSAGE_AUTOS.MESSAGE_SETUP_BOOKING_CMD, 1)
const url_read = url_command + SERVICE_EXTEND_TYPES.READ
const url_read_list = url_command + SERVICE_EXTEND_TYPES.READ + SERVICE_EXTEND_TYPES.LIST

export default class MessageSetupBookingApi extends ServicesBaseAPI {
  constructor() {
    super()
  }

  async getMessageSetupBookingsAsync(query) {
    let query_map = {
      shopId: query
    }
    try {
      const response = await this.http.post(url_read_list, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }        
        for(let i in response.data.result.items){          
          let vm = new MessageSetupBookingViewModel()
          vm.mapFieldsFromApi(response.data.result.items[i])
          mapData.items.push(vm)
        }
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async getMessageSetupBookingListAsync(query) {
    let query_map = {
      shopId : query.shop_id, 
      messageSetupBookingType : query.setup_type
    }
    try {
      let response = await this.http.post(url_read, query_map)
      this.setResult(response, () => {
        let mapData = {
          items: []
        }
        if(response.data.result.items.length > 0){
          for(let item in response.data.result.items){
            let vmodel = new MessageSetupBookingViewModel()
            vmodel.mapFieldsFromApi(response.data.result.items[item])
            mapData.items.push(vmodel)
          }
        }else{
          let vmodel = new MessageSetupBookingViewModel()
          mapData.items.push(vmodel)
        }
        this.result.data = mapData
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async createMessageSetupBookingAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.post(url_command, params)
      this.setResult(response, () => {
        let vmodel = new MessageSetupBookingViewModel()
        vmodel.mapFieldsFromApi(response.data.result)
        this.result.data = vmodel
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateMessageSetupBookingAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = await this.http.put(url_command, params)
      this.setResult(response, () => {
        let vmodel = new MessageSetupBookingViewModel()
        vmodel.mapFieldsFromApi(response.data.result)
        this.result.data = vmodel
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
  async deleteMessageSetupBookingAsync(model) {
    let params = model.mapDeleteFieldsToApi()
    try {
      let response = await this.http.delete(url_command, params)
      this.setResult(response, () => {
        let vmodel = new MessageSetupBookingViewModel()
        vmodel.mapFieldsFromApi(response.data.result)
        this.result.data = vmodel
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
}