<template>
  <main>
    <div class="common-style">
      <form class="form-wrapper clearfix">
        <div class="slide-x small">
          <table class="normal">
            <tbody>
              <tr>
                <td colspan="6">
                  <div class="clearfix">
                    <span class="fll" style="font-size: 20px;">{{ client_name }} {{ $t('cid-call-receive.customer') }} {{ call_number }} </span>
                    <span class="flr" style="font-size: 20px;">{{ formatDateCol(registration_date, true) }}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td rowspan="6" colspan="2">
                  <img src="../../../template/images/common/cid-sample.jpg" alt="cid-sample">
                </td>
                <td class="bg-th">{{ $t('cid-call-receive.client-number') }}</td>
                <td class="wd-td">{{ client.fields.member_number }} 
                  <span v-if="client_own_shop_id != shop_data.shop_id && client_own_shop_id!=0">({{ client_own_shop_name }})</span>
                  <span v-else/>
                </td>
                <td class="bg-th">{{ $t('cid-call-receive.birthday') }}</td>
                <td class="wd-td">{{ client_birthday }}</td>
              </tr>
              <tr>
                <td class="bg-th">{{ $t('cid-call-receive.client-rating') }}</td>
                <td>{{ client.fields.client_rating_name }}</td>
                <td class="bg-th">{{ $t('cid-call-receive.preferred-staff') }}</td>
                <td>{{ client.fields.preferred_staff_name }}</td>
              </tr>
              <tr>
                <td class="bg-th">{{ $t('cid-call-receive.total-visit') }}</td>
                <td>{{ client.fields.number_of_visit }}</td>
                <td class="bg-th">{{ $t('cid-call-receive.registration-date') }}</td>
                <td>{{ formatDateCol(client.fields.registration_date, false) }}</td>
              </tr>
              <tr>
                <td class="bg-th">{{ $t('cid-call-receive.recent-visit') }}</td>
                <td>{{ formatTimeStampToDate(client.fields.recent_visit_date) }}</td>
                <td class="bg-th">{{ $t('cid-call-receive.balance') }}</td>
                <td>{{ client.fields.balance }}</td>
              </tr>
              <tr>
                <td class="bg-th">{{ $t('cid-call-receive.booking') }}</td>
                <td colspan="3">
                  {{ $t('cid-call-receive.booking-info') }} {{ total_bookings }}, <strong class="color-red">{{ $t('cid-call-receive.noshow') }} {{ total_no_show_bookings }}</strong>
                </td>
              </tr>
              <tr>
                <td class="bg-th">{{ $t('cid-call-receive.memo') }}</td>
                <td colspan="3">
                  <textarea v-model="client.fields.notes" class="note noresize w100p" cols="30" 
                            rows="10" disabled/>
                </td>
              </tr>
              <tr>
                <td colspan="6">
                  <div class="btn-action-group">
                    <b-button v-if="client_id==0" :disabled="type=='sample'" class="btn2"  
                              @click="addNewClient">{{ $t('cid-call-receive.register-client') }}</b-button>
                    <b-button :disabled="type=='sample'" class="btn2" @click="showClientInfo">{{ $t('cid-call-receive.client-detail') }}</b-button>
                    <b-button :disabled="type=='sample'" class="btn2" @click="goToBooking">{{ $t('cid-call-receive.add-booking') }}</b-button>
                    <b-button class="btn2" @click="hideModal()">{{ $t('cid-call-receive.close') }}</b-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import CIDReceivingHistoryApi from '../../../api/cid/cid-receiving-history-api' 
import ClientApi              from '../../../api/clients/client-api'
import BookingApi             from '../../../api/bookings/booking-api'
import component_base from '../../../components/common/component-base/component-base'
import ClientViewModel          from '../../../view-model/clients/client-view-model'
import moment from 'moment'
import { options }                from '../../../helpers/options'
import { isMobile }               from '../../../helpers/common'
import { formatDateBySetting, convertDateFromUtcToTimezone, convertTimeStampToDate  } from '../../../helpers/common'
import ShopInfoApi          from '../../../api/account/shop-info-api'

export default {
  components: {
  },
  extends: component_base,
  data() {
    return {
      options,
      client_name:'',
      call_number:'',
      registration_date: '',
      client_api: new ClientApi(),      
      client: new ClientViewModel(),
      client_birthday: '',
      total_bookings: 0,
      total_no_show_bookings: 0,
      type: '',
      client_id: 0,
      client_own_shop_id: 0,
      client_own_shop_name: '',
      cid_id: 0

    }

  },
  created(){
    var title = this.$i18n.t('cid-call-receive.title')
    document.title = title
    this.call_number = this.$route.query.cid_len
    this.type = this.$route.query.type
    if(window.ActiveXObject || 'ActiveXObject' in window)
    {
      window.addEventListener('keydown', this.onkey)
      document.onkeydown = this.onkey
    }
  },
  mounted(){
    this.onLoadForm()
  },
  methods: {
    onkey: function() {
      if (event.keyCode == 116) {
        return false
      }
      else if(event.ctrlKey && (event.keyCode==78 || event.keyCode == 82 || event.keyCode == 116))
      {
        return false
      }
    },
    async onLoadForm(){
      if(this.type!='sample')
      {
        let query={
          shop_id: this.shop_data.shop_id,
          call_number: this.call_number
        }
        this.preLoader(true)
        let cid_receiving_history_api = new CIDReceivingHistoryApi()
        let result = await cid_receiving_history_api.addCIDReceivingHistoryAsync(query)
        this.preLoader(false)
        if(result.is_ok) {
          this.client_name = result.data.client_name
          this.registration_date = result.data.registration_date
          if(result.data.client_id != null || result.data.client_id > 0)
          {
            this.client_id=result.data.client_id
            this.client_own_shop_id = result.data.client_own_shop_id
            this.getClientById(result.data.client_id, result.data.client_own_shop_id)
            this.getFromBookingsSummaryByClient(result.data.client_id, result.data.client_own_shop_id)
            if(this.client_own_shop_id != this.shop_data.shop_id)
              this.getShopName(this.client_own_shop_id)
          }
          else
          {
            if(isMobile(this.call_number))
              this.client.fields.mobile_number = this.call_number
            this.client_name = this.$i18n.t('cid-call-receive.unregistered')
          } 
          this.cid_id = result.data.cid_receiving_history_id
          window.opener.document.getElementById('client_id').value = result.data.client_id
          window.opener.document.getElementById('client_own_shop_id').value = result.data.client_own_shop_id
        }
      }
      else this.setSampleData()
    },
    setSampleData(){
      this.client_name = '홍길동'
      this.call_number = '01011112222'
      this.client.fields = {
        member_number       : 1,
        notes               : null,
        balance             : 10000,       
        first_visit_date    : 1599701662,
        recent_visit_date   : 1599701662,
        number_of_visit     : 10,        
        preferred_staff_name        : 'staff Kim'
      }
      this.client_own_shop_id = 0
      let date = new Date()
      this.registration_date = date
    },
    async getClientById(client_id, client_own_shop_id){
      let client_query = {
        client_id: client_id,
        shop_id: client_own_shop_id
      }
      let response = await this.client_api.getClientAsync(client_query)
      this.client.fields = Object.assign({}, response.data)
      if(this.client.fields.birth_year>0 || this.client.fields.birth_month >0 || this.client.fields.birth_dd >0)
      {
        let birthday = this.client.fields.birth_year + '-' + this.client.fields.birth_month + '-' + this.client.fields.birth_dd
        this.client_birthday = moment(birthday, 'YYYY-MM-DD').format(this.shop_data.format_date)

      }
      this.client_name = this.client.fields.client_name
    },
    async getFromBookingsSummaryByClient(client_id, client_own_shop_id){
      let query = {
        client_id: client_id,
        shop_id: client_own_shop_id
      }
      let booking_api = new BookingApi()
      let result = await booking_api.getBookingsSummaryByClient(query)
      this.total_bookings = result.data.total_bookings
      this.total_no_show_bookings = result.data.total_no_show_bookings

    },
    async getShopName(client_own_shop_id){
      this.shop_names = []
      let shop_ids =[]
      shop_ids.push(client_own_shop_id)      
      let shop_info_api = new ShopInfoApi()
      let result = await shop_info_api.getShopNames(shop_ids)
      this.client_own_shop_name = result.data.items[0].shop_name
    },
    formatDateCol(date, has_time){
      return formatDateBySetting(convertDateFromUtcToTimezone(date, this.shop_data.timezone), has_time)    
    },
    formatTimeStampToDate(ts) {
      if(ts>0)
        return moment(convertTimeStampToDate(ts,true)).format(this.shop_data.format_date)
      else ts
    },
    showClientInfo(){
      var GlobalElementId = []
      GlobalElementId ['client-info'] = window.opener.document.getElementById('client-info')
      GlobalElementId ['client-info'].click()
      this.hideModal()
    },
    hideModal() {
      window.close()
    },
    addNewClient(){
      window.opener.document.getElementById('call_number').value = this.call_number
      window.opener.document.getElementById('cid_id').value = this.cid_id
      var GlobalElementId = []
      GlobalElementId ['add-client'] = window.opener.document.getElementById('add-client')
      GlobalElementId ['add-client'].click()
      this.hideModal()
    },
    goToBooking(){
      this.client.fields.is_from_cid_popup = true
      window.opener.postMessage(this.client.fields, '*')
      this.hideModal()
    },
  }
}
</script>
<style lang='scss' scoped>
@import './cid-receive-call-popup.scss';
</style>