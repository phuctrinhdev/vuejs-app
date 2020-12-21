<template>
  <footer class="footer">
    <h2 class="logo-transparent"><a :href="footer_data.logo_link"/></h2>
    <p class="copyright">{{ $t('general.copyright') }}</p>
    <div class="timezone">
      <ul>
        <my-clock :type="'UTC'" :timezone="'+00:00'"/>
        <my-clock :type="'Setting'" :timezone="shop_data.timezone"/>
        <my-clock :type="'Local'" :timezone="local_timezone"/>
      </ul>
    </div>
  </footer>
</template>

<script>
import vue from 'vue'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { options } from '../../../helpers/options'
import component_base from '../../../components/common/component-base/component-base'
import {
  convertMinutesToHours,
} from '../../../helpers/common'

const MyClock = vue.component('my-clock', {
  template: `
    <div class="clock">
      <li>
        <b><span class="type">{{ type }}</span> <span class="zone">({{ timezone }})</span></b>: 
        <span>{{ date }}</span>,
        <span>{{ time }}</span>
      </li>
    </div>
  `,
  props: {
    type: {
      type: String,
      default: ''
    },
    timezone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options,
      date: 'empty', 
      time: 'empty', 
      interval: null
    }
  },
  beforeDestroy(){
    clearInterval(this.interval)
  },
  methods: {
    moment,
    updateClock(){
      var d = new Date()
      d = moment(d).utcOffset(this.timezone)
      let tmp_month = d.month() + 1
      
      let year   = d.year()
      let month  = tmp_month  >= 10 ? tmp_month  : '0' + tmp_month
      let date   = d.date()   >= 10 ? d.date()   : '0' + d.date()
      let hour   = d.hour()   >= 10 ? d.hour()   : '0' + d.hour()
      let minute = d.minute() >= 10 ? d.minute() : '0' + d.minute()
      let second = d.second() >= 10 ? d.second() : '0' + d.second()

      this.date = year + '/' + month + '/' + date
      this.time = hour + ':' + minute + ':' + second
    }
  },
  mounted(){
    this.updateClock()
    this.interval = setInterval(function () {
      this.updateClock()
    }.bind(this), 1000)
  },
})

export default {
  components: {
    'my-clock': MyClock
  },
  extends: component_base,
  data(){
    return {
      local_timezone: ''
    }
  },
  computed: {
    ...mapGetters('footer_block', {
      footer_data: 'getFooter'
    })
  },
  mounted(){
    let tmp_local_timezone_minutes = moment(new Date()).utcOffset()
    if(tmp_local_timezone_minutes < 0) {
      tmp_local_timezone_minutes = -tmp_local_timezone_minutes
      this.local_timezone = '-' + convertMinutesToHours(tmp_local_timezone_minutes)
    }
    else
      this.local_timezone = '+' + convertMinutesToHours(tmp_local_timezone_minutes)
  }
}
</script>

<style lang='scss'>
@import './footer-block.scss';
</style>