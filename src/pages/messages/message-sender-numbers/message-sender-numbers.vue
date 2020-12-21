<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('messages.sender-number-setup') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part">
              <span class="badge badge-info badge-pill search-part">{{ $t('messages.automatic-send-number') }}</span> 
              <select v-model="sender_auto_phone_id" class="custom-select">
                <option v-for="(row, idx) in table_data.rows" :key="idx" :value="row.id">{{ row.sender_phone }}</option>
              </select> 
            </li>
            <li>
              <button class="btn secondary small mt5" @click="onSetAsAuto">{{ $t('messages.setup') }}</button>              
            </li>
          </ul>
        </div>
        <div class="section-search-part clearfix">
          <div class="clearfix mb5">
            <button class="btn secondary flr" @click="onAdd">{{ $t('messages.register') }}</button>
          </div>
          <table class="normal mb5">
            <thead>
              <tr>
                <th>{{ $t('messages.sender-number') }}</th>
                <th>{{ $t('messages.automatic-send') }}</th>
                <th>{{ $t('general.delete') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item) in table_data.rows">
                <tr :key="item.text_sender_phone_id">
                  <td>{{ item.sender_phone }}</td>
                  <td>
                    {{ formatAutoSender(item.is_auto_sender) }}
                    <!-- <button v-if="item.is_auto_sender==false" class="btn secondary" @click="onSetAsAuto2(item)">자동번호로</button> -->
                  </td>
                  <td>
                    <button v-if="item.is_auto_sender==false" class="btn secondary" @click="onDelete(item)">{{ $t('general.delete') }}</button>                        
                  </td>
                </tr>
              </template>
              <tr v-if="table_data.rows.length <= 0">
                <td colspan="11">{{ $t('general.table-empty') }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="table_filter.country_code == country.KR" class="bd caller-id-setup-info">
            <h4 class="mb10 fw-bold">■ 안내</h4>
            <dl>
              <dt class="mb5">문자메세지를 보내기 위해서는 '발신번호'를 사전에 등록해야 합니다.</dt>
              <dd>- 발신번호란 문자 수신 단말기(휴대폰 등)에 표시되는 번호입니다.</dd>
              <dd>- 발신번호는 10개까지 등록할 수 있습니다. ('발신번호 등록'버튼을 눌러주세요)</dd>
              <dd>- 발신번호 등록시 인증이 필요합니다. (휴대폰 인증, ARS(자동응답전화)인증 또는 서류인증)</dd>
              <dd>- 자동발신번호 : 생일문자, 예약, 판매, 자동문자발송에 사용할 번호를 등록된 발신번호 중 택 1 하세요.</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
    <sender-number-action @reload-page="loadTableData()"/>
  </main>
</template>

<script>
import { options }    from '../../../helpers/options'
import { COUNTRY }    from '../../../config/constant'
import component_base from '../../../components/common/component-base/component-base'
import sender_number_action   from '../../../components/messages/sender-number-action/sender-number-action'
import TextSenderPhoneApi     from '../../../api/messages/text-sender-phone-api'

export default {
  components: {
    'sender-number-action':sender_number_action,
  },
  extends: component_base,
  data() {
    return {
      options : options,
      table_data: {
        rows:[],
        pagination:{
          total_pages: 1
        },
      },
      table_filter: {
        page_size    : options.pagination.default,
        page_number  : 1,
        country_code : null,
        shop_id      : 0,
        user_id      : null,        
      },
      sender_auto_phone_id:'',
      country: COUNTRY,
    }
  },  
  beforeMount(){
    this.table_filter.country_code = this.shop_data.country
    this.table_filter.shop_id = this.shop_data.shop_id
    this.table_filter.user_id = this.x_user.user_name
    this.loadTableData()
  },
  methods: {
    async loadTableData(){
      this.sender_auto_phone_id = 0
      this.preLoader()
      let api = new TextSenderPhoneApi()
      let data = Object.assign({}, this.table_filter)
      let result = await api.getTextSenderPhonesByShopAsync(data)
      if(result.is_ok){
        this.table_data.rows = result.data.items
        if (result.data.items.length > 0 ){
          var found= result.data.items.find( x => x.is_auto_sender == true)
          if (found != null) {
            this.sender_auto_phone_id = found.id
          }
        }
      } else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    onAdd() {
      if (this.table_filter.country_code == COUNTRY.KR) {
        this.$router.push({ name: 'message-sender-number-add'} )
      }
      else {
        this.showDialogById('sender-number-action-modal')
      }
    },
    async onDelete(row){
      let data_send ={
        shop_id : row.shop_id,
        id : row.id,
        user_id: this.table_filter.user_id
      }
      let api = new TextSenderPhoneApi()
      this.preLoader()
      let result= await api.deleteTextSenderPhoneAsync(data_send)
      this.preLoader(false)
      if(result.is_ok) {
        this.loadTableData()
      } else this.showAlert(result.error_messages)      
    },
    async onSetAsAuto(){
      if (this.sender_auto_phone_id > 0 ){
        let data_send ={          
          id : this.sender_auto_phone_id,
          shop_id : this.table_filter.shop_id,
          user_id: this.table_filter.user_id
        }        
        let api = new TextSenderPhoneApi()
        this.preLoader()
        let result= await api.updateTextSenderPhoneAsAutoSenderAsync(data_send)
        this.preLoader(false)
        if(result.is_ok) {
          this.loadTableData()
        } else this.showAlert(result.error_messages)
      }
    },
    formatAutoSender(isAutoSender) {
      const msg = this.$t('messages.automatic-send-number')
      return isAutoSender ? msg : '-'
    }
  }
}
</script>

<style lang="scss">
@import './message-sender-numbers.scss';
</style>