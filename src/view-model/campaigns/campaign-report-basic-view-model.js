import CampaignReportBaseViewModel from './campaign-report-base-view-model'

export default class CampaignReportBasicViewModel extends CampaignReportBaseViewModel {
  constructor() {
    super()

    this.fields = {
      // clients_analysis
      target_clients: null,
      visited_target_clients: null,
      percentage_visited_target_clients: null,
      new_clients: null,

      // sales_analysis
      sales_target_clients_total: null,
      sales_services: null,
      sales_products: null,
      sales_prepaid_cards: null,
      sales_prepaid_services: null,
    }
  }

  mapFieldsFromApi(api_data) {
    this.mapFieldsBaseFromApi(api_data)
    const {
      targetClients,
      visitedTargetClients,
      percentageVisitedTargetClients,
      newClients,
      salesTargetClientsTotal,
      salesServices,
      salesProducts,
      salesPrepaidCards,
      salesPrepaidServices,
    } = api_data

    this.fields = {
      ...this.fields,
      target_clients: targetClients,
      visited_target_clients: visitedTargetClients,
      percentage_visited_target_clients: percentageVisitedTargetClients,
      new_clients: newClients,
      sales_target_clients_total: salesTargetClientsTotal,
      sales_services: salesServices,
      sales_products: salesProducts,
      sales_prepaid_cards: salesPrepaidCards,
      sales_prepaid_services: salesPrepaidServices,
    }
  }
}