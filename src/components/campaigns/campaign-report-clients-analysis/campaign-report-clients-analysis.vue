<template>
  <div class="campaign-report-clients-analysis">
    <label class="campaign-report-clients-analysis__title">{{ $t('campaign-report.report-results.visited-clients') }}</label>
    <div class="table-responsive table-visited-clients-ratio">
      <table class="normal table b-table">
        <thead>
          <tr>
            <th>{{ $t('menu.clients') }}</th>
            <th>{{ $t('campaign-report.report-results.non-target') }}</th>
            <th>{{ $t('campaign-report.report-results.target') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ $t('campaign-report.report-results.visited-total') }}</td>
            <td>{{ data.visited_non_target_clients }}/{{ data.visited_non_target_clients_total }}</td>
            <td>{{ data.visited_target_clients }}/{{ data.visited_target_clients_total }}</td>
          </tr>
          <tr>
            <td>{{ $t('campaign-report.report-results.ratio') }}</td>
            <td>{{ data.visited_non_target_clients_ratio }}%</td>
            <td>{{ data.visited_target_clients_ratio }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <chart-bar
      :key="$i18n.locale"
      :data="chart_data"
      :options="chart_options"
    />
  </div>
</template>

<script>
//Utils
import { options } from '../../../helpers/options'

// Components
import chart_bar from '../../common/chart/chart-bar'

export default {
  components: {
    'chart-bar': chart_bar,
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
              callback: function(value) {
                return `${value}%`
              }
            },
          }]
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            font: {
              size: 10,
              style: 'bold'
            },
          }
        }
      }
    }
  },
  computed: {
    chart_data() {
      return {
        labels  : [this.$t('campaign-report.report-results.target'), this.$t('campaign-report.report-results.non-target')],
        datasets: [
          {
            backgroundColor: ['#84b8dd', '#fad496'],
            borderColor: ['#84b8dd', '#fad496'],
            color: ['#84b8dd', '#fad496'],
            data: [this.data.visited_target_clients_ratio, this.data.visited_non_target_clients_ratio],
          }
        ],
      }
    },
  },
}
</script>

<style lang="scss">
@import './campaign-report-clients-analysis.scss';
</style>

