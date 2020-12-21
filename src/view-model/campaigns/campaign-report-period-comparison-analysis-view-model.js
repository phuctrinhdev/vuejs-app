import CampaignReportBaseViewModel from './campaign-report-base-view-model'

export default class CampaignReportPeriodComparisonAnalysisViewModel extends CampaignReportBaseViewModel {
  constructor() {
    super()

    this.fields = {
      comparison_period_from: null,
      comparison_period_to: null,
      // visited clients
      visited_clients_campaign: null,
      visited_clients_non_campaign: null,
      visited_clients_campaign_increase: null,
      visited_clients_campaign_increase_percentage: null,
      // sales campaign
      sales_campaign_total: null,
      sales_campaign_services: null,
      sales_campaign_products: null,
      sales_campaign_prepaid_cards: null,
      sales_campaign_prepaid_services: null,
      // sales non campaign
      sales_non_campaign_total: null,
      sales_non_campaign_services: null,
      sales_non_campaign_products: null,
      sales_non_campaign_prepaid_cards: null,
      sales_non_campaign_prepaid_services: null,
      // sales increase
      sales_increase_total: null,
      sales_increase_services: null,
      sales_increase_products: null,
      sales_increase_prepaid_cards: null,
      sales_increase_prepaid_services: null,
      sales_increase_total_percentage: null,
    }
  }

  mapFieldsFromApi(api_data) {
    this.mapFieldsBaseFromApi(api_data)
    const {
      comparisonPeriodFrom,
      comparisonPeriodTo,
      // visited clients
      visitedClientsNonCampaign,
      visitedClientsCampaign,
      visitedClientsCampaignIncrease,
      visitedClientsCampaignIncreasePercentage,
      // sales campaign
      salesCampaignTotal,
      salesCampaignServices,
      salesCampaignProducts,
      salesCampaignPrepaidCards,
      salesCampaignPrepaidServices,
      // sales non campaign
      salesNonCampaignTotal,
      salesNonCampaignServices,
      salesNonCampaignProducts,
      salesNonCampaignPrepaidCards,
      salesNonCampaignPrepaidServices,
      // sales increase
      salesIncreaseTotal,
      salesIncreaseServices,
      salesIncreaseProducts,
      salesIncreasePrepaidCards,
      salesIncreasePrepaidServices,
      salesIncreaseTotalPercentage,
    } = api_data

    this.fields = {
      ...this.fields,
      comparison_period_from: comparisonPeriodFrom,
      comparison_period_to: comparisonPeriodTo,
      // visited clients
      visited_clients_campaign: visitedClientsCampaign,
      visited_clients_non_campaign: visitedClientsNonCampaign,
      visited_clients_campaign_increase: visitedClientsCampaignIncrease,
      visited_clients_campaign_increase_percentage: visitedClientsCampaignIncreasePercentage,
      // sales campaign
      sales_campaign_total: salesCampaignTotal,
      sales_campaign_services: salesCampaignServices,
      sales_campaign_products: salesCampaignProducts,
      sales_campaign_prepaid_cards: salesCampaignPrepaidCards,
      sales_campaign_prepaid_services: salesCampaignPrepaidServices,
      // sales non campaign
      sales_non_campaign_total: salesNonCampaignTotal,
      sales_non_campaign_services: salesNonCampaignServices,
      sales_non_campaign_products: salesNonCampaignProducts,
      sales_non_campaign_prepaid_cards: salesNonCampaignPrepaidCards,
      sales_non_campaign_prepaid_services: salesNonCampaignPrepaidServices,
      // sales increase
      sales_increase_total: salesIncreaseTotal,
      sales_increase_services: salesIncreaseServices,
      sales_increase_products: salesIncreaseProducts,
      sales_increase_prepaid_cards: salesIncreasePrepaidCards,
      sales_increase_prepaid_services: salesIncreasePrepaidServices,
      sales_increase_total_percentage: salesIncreaseTotalPercentage
    }
  }
}
