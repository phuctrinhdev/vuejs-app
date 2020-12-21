<template>
  <div class="campaign-report-period-comparison-analysis">
    <b-row>
      <b-col lg="6">
        <div class="campaign-report-period-comparison-analysis__visited-clients">
          <label class="campaign-report-period-comparison-analysis__title">{{ $t('campaign-report.report-results.visited-clients') }}</label>
          <div class="table-responsive">
            <table class="normal table b-table">
              <thead>
                <tr>
                  <th>{{ $t('campaign-report.report-results.campaign') }}</th>
                  <th>{{ $t('campaign-report.report-results.non-campaign') }}</th>
                  <th>{{ $t('campaign-report.report-results.increase') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ data.visited_clients_campaign }}</td>
                  <td>{{ data.visited_clients_non_campaign }}</td>
                  <td>{{ data.visited_clients_campaign_increase }} <span v-if="data.visited_clients_campaign_increase_percentage">(+{{ data.visited_clients_campaign_increase_percentage }}%)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <chart-bar
            :key="$i18n.locale"
            :data="client_chart_data"
            :options="chart_options"
          />
        </div>
      </b-col>
      <b-col lg="6">
        <div class="campaign-report-period-comparison-analysis__returned-dormant-clients">
          <label class="campaign-report-period-comparison-analysis__title">{{ $t('home.total-sales') }}</label>
          <div class="table-responsive">
            <table class="normal table b-table">
              <thead>
                <tr>
                  <th>{{ $t('report.sales-item') }}</th>
                  <th>{{ $t('campaign-report.report-results.campaign') }}</th>
                  <th>{{ $t('campaign-report.report-results.non-campaign') }}</th>
                  <th>{{ $t('campaign-report.report-results.increase') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ $t('menu.services') }}</td>
                  <td>{{ formatMoney(data.sales_campaign_services, 0) }}</td>
                  <td>{{ formatMoney(data.sales_non_campaign_services, 0) }}</td>
                  <td>{{ formatMoney(data.sales_increase_services, 0) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('menu.products') }}</td>
                  <td>{{ formatMoney(data.sales_campaign_products, 0) }}</td>
                  <td>{{ formatMoney(data.sales_non_campaign_products, 0) }}</td>
                  <td>{{ formatMoney(data.sales_increase_products, 0) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('menu.prepaid-cards') }}</td>
                  <td>{{ formatMoney(data.sales_campaign_prepaid_cards, 0) }}</td>
                  <td>{{ formatMoney(data.sales_non_campaign_prepaid_cards, 0) }}</td>
                  <td>{{ formatMoney(data.sales_increase_prepaid_cards, 0) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('services.prepaid-services') }}</td>
                  <td>{{ formatMoney(data.sales_campaign_prepaid_services, 0) }}</td>
                  <td>{{ formatMoney(data.sales_non_campaign_prepaid_services, 0) }}</td>
                  <td>{{ formatMoney(data.sales_increase_prepaid_services, 0) }}</td>
                </tr>
                <tr>
                  <td>{{ $t('general.total') }}</td>
                  <td>{{ formatMoney(data.sales_campaign_total, 0) }}</td>
                  <td>{{ formatMoney(data.sales_non_campaign_total, 0) }}</td>
                  <td>{{ formatMoney(data.sales_increase_total, 0) }} <span v-if="data.sales_increase_total_percentage">(+{{ data.sales_increase_total_percentage }}%)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <chart-bar
            :key="$i18n.locale"
            :data="sales_chart_data"
            :options="chart_options"
          />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
//Utils
import { options } from '../../../helpers/options'
import { formatMoney } from '../../../helpers/common'

// Components
import chart_bar from '../../common/chart/chart-bar'

export default {
  components: {
    'chart-bar': chart_bar
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      options,
      chart_options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }]
        },
      }
    }
  },
  computed: {
    client_chart_data() {
      return {
        labels  : [this.$t('campaign-report.report-results.campaign'), this.$t('campaign-report.report-results.non-campaign')],
        datasets: [
          {
            backgroundColor: ['#84b8dd', '#fad496'],
            borderColor: ['#84b8dd', '#fad496'],
            color: ['#84b8dd', '#fad496'],
            data: [this.data.visited_clients_campaign, this.data.visited_clients_non_campaign],
          }
        ],
      }
    },
    sales_chart_data() {
      return {
        labels  : [this.$t('campaign-report.report-results.campaign'), this.$t('campaign-report.report-results.non-campaign')],
        datasets: [
          {
            backgroundColor: ['#84b8dd', '#fad496'],
            borderColor: ['#84b8dd', '#fad496'],
            color: ['#84b8dd', '#fad496'],
            data: [this.data.sales_campaign_total, this.data.sales_non_campaign_total],
          }
        ],
      }
    }
  },
  methods: {
    formatMoney
  }
}
</script>

<style lang="scss">
@import './campaign-report-period-comparison-analysis.scss';
</style>

