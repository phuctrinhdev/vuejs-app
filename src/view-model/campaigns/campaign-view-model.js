import ViewModel from '../view-model'
import moment from 'moment'
import { convertTimeStampToDate } from '../../helpers/common'
import { options } from '../../helpers/options'
export default class CampaignViewModel extends ViewModel {
  constructor() {
    super()

    this.fields = {
      campaign_id       : 0,
      campaign_title    : '',
      campaign_report_id: 0,
      campaign_period_to: '',
      campaign_period_from: '',
      campaign_description: '',
      campaign_sent_message: '',
      campaign_total_target_clients: 0,
      campaign_sent_message_date: 0
    }
  }

  mapFieldFromApi(api_data){
    return api_data.map(e => {
      return {
        campaign_id: e.id,
        campaign_title: e.title,
        campaign_period_from: this.formatPeriodDate(e.periodFrom),
        campaign_period_to: this.formatPeriodDate(e.periodTo),
        campaign_total_target_clients: e.targetClients,
        campaign_description: e.description,
        campaign_sent_message_date: e.sentMessageDate != 0 ? this.formatSentMessageDate(e.sentMessageDate) : 0
      }
    })
  }

  mapFieldToApi(model){
    return {
      title: model.campaign_title,
      periodFrom: model.campaign_period_from,
      periodTo: model.campaign_period_to,
      description: model.campaign_description,
    }
  }

  formatPeriodDate(date){
    return moment(convertTimeStampToDate(date,true)).format(options.standard_date_format.ymd)
  }

  formatSentMessageDate(date){
    return moment(convertTimeStampToDate(date,true)).format(options.standard_date_format.ymdh)
  }

  getValidations(){
    let validations = {
      campaign_title: {
        label:'clients.campaign-title',
        rules: {
          require: ''
        }
      }
    }
    return validations
  }

  isValid(){
    return super.isValid(this.getValidations())
  }
}