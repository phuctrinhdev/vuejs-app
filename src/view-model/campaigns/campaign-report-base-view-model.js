import ViewModel from '../view-model'
export default class CampaignReportBaseViewModel extends ViewModel {
  constructor() {
    super()

    this.fields = {
      report_id: null,
      campaign_id: null,
      report_type: null,
    }
  }

  mapFieldsBaseFromApi(api_data) {
    const { id, reportType, campaignId } = api_data

    this.fields.report_id = id
    this.fields.report_type = reportType
    this.fields.campaign_id = campaignId
  }

  mapFieldsBaseToApi(ui_data) {
    return {
      id: ui_data.report_id, 
      reportType: ui_data.report_type, 
      campaignId: ui_data.campaign_id
    }
  }
}
