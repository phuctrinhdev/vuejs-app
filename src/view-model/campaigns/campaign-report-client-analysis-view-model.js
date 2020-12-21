import CampaignReportBaseViewModel from './campaign-report-base-view-model'

export default class CampaignReportClientAnalysisViewModel extends CampaignReportBaseViewModel {
  constructor() {
    super()

    this.fields = {
      visited_target_clients: null,
      visited_target_clients_total: null,
      visited_target_clients_ratio: null,
      visited_non_target_clients: null,
      visited_non_target_clients_total: null,
      visited_non_target_clients_ratio: null,
    }
  }

  mapFieldsFromApi(api_data) {
    this.mapFieldsBaseFromApi(api_data)
    const {
      visitedTargetClients,
      visitedTargetClientsTotal,
      visitedTargetClientsRatio,
      visitedNonTargetClients,
      visitedNonTargetClientsTotal,
      visitedNonTargetClientsRatio,
    } = api_data

    this.fields = {
      ...this.fields,
      visited_target_clients: visitedTargetClients,
      visited_target_clients_total: visitedTargetClientsTotal,
      visited_target_clients_ratio: visitedTargetClientsRatio,
      visited_non_target_clients: visitedNonTargetClients,
      visited_non_target_clients_total: visitedNonTargetClientsTotal,
      visited_non_target_clients_ratio: visitedNonTargetClientsRatio,
    }
  }
}
