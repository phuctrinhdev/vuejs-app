import Http from '../../helpers/http'
import CampaignViewModel from '../../view-model/campaigns/campaign-view-model'

export default class CampaignManagementApi{
  constructor(){
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  async getCampaignsDataAsync(){
    try {
      this.result.is_ok = true
      let response = [
        {
          id: 1,
          title: 'Campaign 1',
          periodFrom: 1601277178,
          periodTo: 1601277199,
          targetClients: 0,
          description: 'Description 1',
          sentMessageDate: 0 
        },
        {
          id: 2,
          title: 'Campaign 2',
          periodFrom: 1601277178,
          periodTo: 1601277199,
          targetClients: 444,
          description: 'Description 2',
          sentMessageDate: 0 
        },
        {
          id: 3,
          title: 'Campaign 3',
          periodFrom: 1601277178,
          periodTo: 1601277199,
          targetClients: 999,
          description: 'Description 3',
          sentMessageDate: 1601283137 
        },
      ]
      let campaign_view_model = new CampaignViewModel()
      this.result.data.items = campaign_view_model.mapFieldFromApi(response)
      this.result.data.pagination = {
        page_number: 1,
        page_size: 10,
        total_items: 3,
        total_pages: 1
      }
    } catch (error){
      return this.http.loadError(error)
    }
    return this.result
  }

  async addCampaignAsync(data) {
    let campaign_view_model = new CampaignViewModel()
    let data_send = campaign_view_model.mapFieldToApi(data)
    // Need to define url_command
    let url_command = ''
    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateCampaignAsync(data) {
    let campaign_view_model = new CampaignViewModel()
    let data_send = campaign_view_model.mapFieldToApi(data)
    // Need to define url_command
    let url_command = ''
    try {
      const response = await this.http.put(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }
}