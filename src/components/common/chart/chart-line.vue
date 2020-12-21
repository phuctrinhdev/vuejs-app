<script>
import { Line } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { 
  formatMoney,
  // formatMoneyForReport
} from '../../../helpers/common'

export default {
  extends: Line,
  props: {
    data: {
      type: Object,
      default: () => []
    }, 
    options: {
      type: Object,
      default: () => null
    },
    is_decimal_data: {
      type: Boolean,
      default: () => true
    }
  },
  data(){
    return {
      layout_padding_right: 30
    }
  },
  computed: {
    chart_data(){
      let tmp_chart_data = this.data
      this.calLayoutPaddingRight(tmp_chart_data)
      
      for(let dataset of tmp_chart_data.datasets){
        if(dataset.color) {
          dataset.borderColor = dataset.color
          dataset.backgroundColor = dataset.color
        }
        else {
          dataset.borderColor = '#f87979'
          dataset.backgroundColor = '#f87979'
        }

        if(dataset.fill == undefined) dataset.fill = false
        if(dataset.lineTension == undefined) dataset.lineTension = 0
        if(dataset.pointRadius == undefined) dataset.pointRadius = 4
        if(dataset.pointHoverRadius == undefined) dataset.pointHoverRadius = 4
      }

      return tmp_chart_data
    },
    chart_options() {
      let tmp_is_decimal_data = this.is_decimal_data
      let tmp_options = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        },
        layout: {
          padding: {
            top: 10,
            right: this.layout_padding_right,
          },
        },
        legend: {
          display: false,
          labels: {
            padding: 10,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                let tmp_value = value
                let tmp_value_max = Math.max(...values)
                let tmp = ''

                if(tmp_value_max == 0 || Math.abs(tmp_value_max) >= 10)
                  tmp = formatMoney(tmp_value,0)
                else {
                  tmp = formatMoney(tmp_value,2)
                }
                return tmp
              }
            }
          }]
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'right',
            padding: 3,
            font: {
              size: 10,
              style: 'bold'
            },
            formatter: function(value) {
              let tmp = ''
              if(value == 0 || Math.abs(value) >= 100)
                tmp = formatMoney(value,0)
              else{
                if(tmp_is_decimal_data)
                  tmp = formatMoney(value,2)
                else
                  tmp = formatMoney(value,0)
              }
              return tmp
            }
          }
        }
      }
      if(this.options != null)
        tmp_options = Object.assign(tmp_options, this.options)
      return tmp_options
    }
  },
  mounted () {
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chart_data, this.chart_options)
  },
  methods: {
    calLayoutPaddingRight(chart_data){
      if(chart_data.datasets.length > 0){
        let tmp_dataset       = chart_data.datasets[0].data
        let number_end        = tmp_dataset[tmp_dataset.length - 1]
        let number_end_length = number_end.toString().length
        for(let i=1; i <= 12; i++){
          if(number_end_length == i){
            this.layout_padding_right = 30 + (i * 4.5)
            break
          }
        }
      }
    }
  }
}
</script>