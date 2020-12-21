<script>
import { Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
// import { formatMoney } from '../../../helpers/common'

export default {
  extends: Pie,
  props: {
    data: {
      type: Object,
      default: () => []
    }, 
    options: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    chart_data(){
      let tmp_chart_data = this.data
      for(let dataset of tmp_chart_data.datasets){
        if(dataset.color) {
          dataset.borderColor = dataset.color
          dataset.backgroundColor = dataset.color
        }

        if(!dataset.fill) dataset.fill = false
        if(!dataset.lineTension) dataset.lineTension = 0
        if(!dataset.pointRadius) dataset.pointRadius = 5
        if(!dataset.pointHoverRadius) dataset.pointHoverRadius = 5
        dataset.borderWidth = 1
      }

      return tmp_chart_data
    },
    chart_options() {
      let tmp_options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10
          }
        },
        legend: {
          display: false,
        },
      }
      if(this.options != null)
        tmp_options = Object.assign(tmp_options, this.options)
      return tmp_options
    }
  },
  mounted () {
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chart_data, this.chart_options)
  }
}
</script>