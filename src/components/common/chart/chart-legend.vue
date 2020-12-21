<template>
  <div :class="{ 'chart-pie': chart_type==options.chart_type.pie }" class="chart-legend-wrapper">
    <ul>
      <li v-for="(legend, i) in legends" :key="i">
        <div class="legend">
          <span :style="{ 'background': legend.color }" class="legend-box"/>
          <span class="legend-label">{{ legend.label }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'

export default {
  props: {
    chart_data: {
      type    : Object,
      default : () => []
    },
    chart_type: {
      type    : Number,
      default : options.chart_type.line
    },
  },
  data() {
    return {
      options,
    }
  },
  computed: {
    legends(){
      let tmp_legends = []
      if(this.chart_type != options.chart_type.pie){
        for(let dataset of this.chart_data.datasets){
          let tmp_legend = {
            label: dataset.label,
            color: dataset.color
          }
          tmp_legends.push(tmp_legend)
        }
      }
      else {
        if(this.chart_data.datasets.length > 0){
          for(let i in this.chart_data.labels){
            let tmp_legend = {
              label: this.chart_data.labels[i],
              color: this.chart_data.datasets[0].color[i]
            }
            tmp_legends.push(tmp_legend)
          }
        }
      }
      return tmp_legends
    }
  }
}
</script>

<style lang="scss">
.chart-legend-wrapper {
  &.chart-pie {
    ul {
      li {
        min-width: 150px;
      }
    }
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: -5px;
    li {
      padding-right: 15px;
      margin-bottom: 5px;
      &:last-child {
        padding-right: 0;
      }
      .legend {
        display: flex;
        justify-content: center;
      }
      .legend-box {
        width: 40px;
        height: 13px;
        background: $gray;
      }
      .legend-label {
        height: 15px;
        margin-left: 5px;
        line-height: 12px;
        font-size: 12px;
        font-weight: 900;
        color: #757575;
      }
    }
  }
}
</style>