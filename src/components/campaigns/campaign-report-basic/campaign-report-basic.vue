<template>
  <div class="campaign-report-basic">
    <b-row>
      <b-col lg="6">
        <div class="campaign-report-basic__clients-analysis">
          <label class="campaign-report-basic__title">{{ $t('campaign-report.report-results.clients-analysis') }}</label>
          <ul class="campaign-report-basic__list-item">
            <li>
              <span>{{ $t('campaign-report.report-results.target-clients') }}</span>
              <span>{{ data.target_clients }}</span>
            </li>
            <li>
              <span>{{ $t('campaign-report.report-results.visited-target-clients') }}</span>
              <span>{{ data.visited_target_clients }}</span>
            </li>
            <li><span>→ {{ $t('campaign-report.report-results.percentage-visited', [data.percentage_visited_target_clients]) }}</span></li>
          </ul>
          <ul class="campaign-report-basic__list-item">
            <li>
              <span>{{ $t('campaign-report.report-results.new-clients') }}</span>
              <span>{{ data.new_clients }}</span>
            </li>
          </ul>
        </div>
      </b-col>
      <b-col lg="6">
        <div class="campaign-report-basic__sales-analysis">
          <label class="campaign-report-basic__title">{{ $t('campaign-report.report-results.sales-analysis') }}</label>
          <ul class="campaign-report-basic__list-item">
            <li>
              <span>{{ $t('campaign-report.report-results.target-clients-sales') }}</span>
              <span>{{ formatMoney(data.sales_target_clients_total, 0) }}</span>
            </li>
            <li>
              <span>- {{ $t('menu.services') }}</span>
              <span>{{ formatMoney(data.sales_services, 0) }}</span>
            </li>
            <li>
              <span>- {{ $t('menu.products') }}</span>
              <span>{{ formatMoney(data.sales_products, 0) }}</span>
            </li>
            <li>
              <span>- {{ $t('menu.prepaid-cards') }}</span>
              <span>{{ formatMoney(data.sales_prepaid_cards, 0) }}</span>
            </li>
            <li>
              <span>- {{ $t('services.prepaid-services') }}</span>
              <span>{{ formatMoney(data.sales_prepaid_services, 0) }}</span>
            </li>
          </ul>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
//Utils
import { formatMoney } from '../../../helpers/common'

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    formatMoney
  }
}
</script>

<style lang="scss">
@import './campaign-report-basic.scss';
</style>
