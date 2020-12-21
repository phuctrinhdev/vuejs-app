<script>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { formatMoney } from '../../../helpers/common'

export default {
  extends: Bar,
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
        else {
          dataset.borderColor = '#f87979'
          dataset.backgroundColor = '#f87979'
        }

        if(!dataset.fill) dataset.fill = false
        if(!dataset.lineTension) dataset.lineTension = 0
        if(!dataset.pointRadius) dataset.pointRadius = 5
        if(!dataset.pointHoverRadius) dataset.pointHoverRadius = 5
      }

      return tmp_chart_data
    },
    chart_options() {
      let options = this.options
      // let tmp_cols_number  = this.chart_data.labels.length
      let tmp_parts_of_col = this.chart_data.datasets.length

      let tmp_options = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false,
        },
        layout: {
          padding: {
            top: 25
          }
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value) {
                let tmp = ''
                if(value == 0 && Math.abs(value) >= 100)
                  tmp = formatMoney(value,0)
                else
                  tmp = formatMoney(value,2)
                return tmp
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
            formatter: function(value, values) {
              let tmp_value = formatMoney(value,0)
              if(options != null && options.custom_stacked){
                tmp_value = ''
                if(values.datasetIndex == tmp_parts_of_col - 1){
                  tmp_value = options.custom_data[values.dataIndex]
                }
              }
              return tmp_value
            }
          }
        }
      }
      if(options != null){
        tmp_options = Object.assign(tmp_options, options)

        if(options.custom_stacked){
          tmp_options.scales.xAxes.push({stacked: true})
          tmp_options.scales.yAxes[0].stacked = true
        }
      }
      return tmp_options
    }
  },
  mounted () {
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chart_data, this.chart_options)
  }
}
</script>