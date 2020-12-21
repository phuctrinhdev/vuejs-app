import Http from '../../helpers/http'
// import { getServiceUrl } from '../../helpers/api-url-generator'
// import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { campaigns_options } from '../../helpers/options/campaigns-options'
import CampaignReportBasicViewModel from '../../view-model/campaigns/campaign-report-basic-view-model'
import CampaignReportClientAnalysisViewModel from '../../view-model/campaigns/campaign-report-client-analysis-view-model'
import CampaignReportPeriodComparisonAnalysisViewModel from '../../view-model/campaigns/campaign-report-period-comparison-analysis-view-model'

// const url_read = getServiceUrl(SERVICE_TYPES.CAMPAIGN_READ, 1)
// const url_command = getServiceUrl(SERVICE_TYPES.CAMPAIGN_CMD, 1)

// const url_read_campaign_report = url_read + SERVICE_EXTEND_TYPES.CAMPAIGN_REPORT
// const url_create_campaign_report = url_command + SERVICE_EXTEND_TYPES.CAMPAIGN_REPORT_CREATE

// fake data
const getFakeReponse = report_type => {
  const fake_response = {
    data: {
      isOK: true,
      errorMessages: [],
      result: {}
    }
  }

  const return_data = {
    id: 1,
    campaignId: 1,
    reportType: report_type,
  }

  if (report_type === 1) {
    fake_response.data.result = {
      ...return_data,
      targetClients: 300,
      visitedTargetClients: 100,
      percentageVisitedTargetClients: 33,
      newClients: 35,
      salesTargetClientsTotal: 7500000,
      salesServices: 2500000,
      salesProducts: 500,
      salesPrepaidCards: 3000000,
      salesPrepaidServices: 100000,
    }
  }

  if (report_type === 2) {
    fake_response.data.result = {
      ...return_data,
      visitedTargetClients: 100,
      visitedTargetClientsTotal: 300,
      visitedTargetClientsRatio: 33.3,
      visitedNonTargetClients: 600,
      visitedNonTargetClientsTotal: 3000,
      visitedNonTargetClientsRatio: 20,
    }
  }

  if (report_type === 3) {
    fake_response.data.result = {
      ...return_data,
      comparisonPeriodTo: '2020-09-25T06:22:58.4559329',
      comparisonPeriodFrom: '2020-09-10T03:14:45.1745295',
      // visited clients
      visitedClientsNonCampaign: 500,
      visitedClientsCampaign: 700,
      visitedClientsCampaignIncrease: 200,
      visitedClientsCampaignIncreasePercentage: 40,
      // sales campaign
      salesCampaignTotal: 35000000,
      salesCampaignServices: null,
      salesCampaignProducts: null,
      salesCampaignPrepaidCards: null,
      salesCampaignPrepaidServices: null,
      // sales non campaign
      salesNonCampaignTotal: 28000000,
      salesNonCampaignServices: null,
      salesNonCampaignProducts: null,
      salesNonCampaignPrepaidCards: null,
      salesNonCampaignPrepaidServices: null,
      // sales increase
      salesIncreaseTotal: 7000000,
      salesIncreaseServices: null,
      salesIncreaseProducts: null,
      salesIncreasePrepaidCards: null,
      salesIncreasePrepaidServices: null,
      salesIncreaseTotalPercentage: 25
    }
  }

  return fake_response
}

export default class CampaignReportApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  getReportViewModelFromResponseData(response) {
    const responst_report_type = response.data.result.reportType

    switch (responst_report_type) {
      case campaigns_options.report_type.basic:
        return new CampaignReportBasicViewModel()
      case campaigns_options.report_type.client_analysis:
        return new CampaignReportClientAnalysisViewModel()
      case campaigns_options.report_type.period_camparison_analysis:
        return new CampaignReportPeriodComparisonAnalysisViewModel()
      default:
        return
    }
  }

  async createCampaignReportAsync(campaign_report_vm) {
    // const data_send = campaign_report_vm.mapFieldsToApi()
    try {
      // const response = await this.http.post(url_create_campaign_report, data_send)
      const response = getFakeReponse(campaign_report_vm.report_type)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if (this.result.is_ok) {
        const campaign_report_vm = this.getReportViewModelFromResponseData(response)
        campaign_report_vm.mapFieldsFromApi(response.data.result)
        this.result.data = campaign_report_vm.getFields()
      }
    }
    catch (e) {
      return this.http.loadError(e)
    }
    return this.result
  }


  async deleteCampaignReportAsync(campaign_report_vm) {
    // let data_send = campaign_report_vm.mapFieldsToApi()
    try {
      // const response = await this.http.delete(url_command, data_send)
      const response = getFakeReponse(campaign_report_vm.report_type)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        const campaign_report_vm = this.getReportViewModelFromResponseData(response)
        campaign_report_vm.mapFieldsFromApi(response.data.result)
        this.result.data = campaign_report_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getCampaignReportAsync(query) {
    try {
      // const response = await this.http.post(url_read_campaign_report, query)
      const response = getFakeReponse(query.fake_type)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if (this.result.is_ok) {
        const campaign_report_vm = this.getReportViewModelFromResponseData(response)
        campaign_report_vm.mapFieldsFromApi(response.data.result)
        this.result.data = campaign_report_vm.getFields()
      }
    }
    catch (e) {
      return this.http.loadError(e)
    }
    return this.result
  }
}
