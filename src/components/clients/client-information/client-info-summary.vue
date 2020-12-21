<template>
  <main class="client-information-wrapper">
    <!-- Pc -->
    <div v-if="client_info_collapsed" class="info-box-top clearfix pc client-info-collapsed">
      <div class="client-name">{{ client.fields.client_name }}</div>
      <div class="info">
        <div class="royalty-points">
          <span>{{ $t('client-information.loyalty-points') }} :</span>
          <span>{{ formatMoney(sales_client_account.getPoints(), 0) }}</span>
        </div>
        <div class="balance">
          <span>{{ $t('client-information.balance') }} :</span>
          <span>{{ formatMoney(sales_client_account.fields.balance, 0) }}</span>
          <span v-if="sales_client_account.fields.family_id > 0">
            ({{ $t('client-information.family') }} {{ formatMoney(sales_client_account.fields.family_balance, 0) }})
          </span>
        </div>
        <div class="total-sales">
          <span>{{ $t('client-information.total-sales') }} :</span>
          <span>{{ formatMoney(sales_client_account.fields.total_sales, 0) }}</span>
        </div>
        <div class="outstanding ">
          <span>{{ $t('client-information.outstanding') }} : </span>
          <span class="sales-outstand">{{ formatMoney(sales_client_account.fields.outstanding, 0) }}</span>
        </div>
      </div>
    </div>
    <div v-else class="info-box-top clearfix pc">
      <!-- client left -->
      <div :class="{ 'modal-box': type == options.page_modal_check.modal, 'is-mobile-client-info': is_mobile_client_info, 'is-mobile-client-sales': is_mobile_client_sales }" 
           class="box box1 fll">
        <div class="client-name-info clearfix">
          <client-avatar/>
          <div class="fll client-text">
            <p class="name">
              <span class="fw-bold">{{ client.fields.client_name }}</span>
              <b-badge class="custom-tag yellow" pill>{{ client.fields.client_rating_name }}</b-badge>
              <b-badge id="popover-client-account" pill variant="info">i</b-badge>
              <b-popover target="popover-client-account" triggers="hover" class="popover-client-account">
                <span>client_id : {{ sales_client_account.fields.client_id }}</span><br>
                <span>registration_date_ts : {{ sales_client_account.fields.registration_date_ts }}  ({{ formatDateTime(sales_client_account.fields.registration_date) }})</span><br>
                <span>first_visit_date_time_ts : {{ sales_client_account.fields.first_visit_date_time_ts }}  ({{ formatDateTime(sales_client_account.fields.first_visit_date_time) }})</span><br>
                <span>recent_visit_date_ts : {{ sales_client_account.fields.recent_visit }}  ({{ formatDateTime(sales_client_account.fields.recent_visit_date_time) }})</span><br>
                <span>recent_visit_sales_id : {{ sales_client_account.fields.recent_visit_sales_id }}</span><br>
                <span>number_of_visit : {{ sales_client_account.fields.number_of_visit }}</span><br>
                <span>number_of_recommendations : {{ sales_client_account.fields.number_of_recommendations }}</span><br>
              </b-popover>
            </p>
            <p v-if="share_client==true && client.fields.shop_id != shop_data.shop_id" class="mb15">
              <span class="color-blue">({{ client.fields.shop_name }})</span>
            </p>
            <p>
              {{ $t('client-information.mobile-phone') }}: <span class="fw-bold">{{ hiddenClientInformation(client.fields.mobile_number) }} </span>
              <template v-if="client.fields.mobile_number != null">
                <span class="call-w-icon" @click="onSendCall"/>
                <span class="message-w-icon" @click="onSendMessage"/>
              </template>
            </p>
            <p v-if="client.fields.phone_number != null">
              {{ $t('client-information.telephone') }}: <span class="fw-bold">{{ hiddenClientInformation(client.fields.phone_number) }}</span>
              <span class="call-w-icon"/>
            </p>
            <p>{{ $t('client-information.no') }} : {{ client.fields.member_number }}</p>
            <p>{{ $t('client-information.preferred-staff') }} : {{ client.fields.preferred_staff_name }}</p>
            <p>{{ $t('client-information.birth-date') }} :
              <template v-if="client.fields.birth_dd != 0">
                {{ addDateZero(client.fields.birth_month) }}-{{ addDateZero(client.fields.birth_dd) }}
                <template v-if="client.fields.birthday_type == CLIENTS_ENUMS.BIRTHDAY_TYPE.SOLAR">
                  ({{ $t('clients.solar') }})
                </template>
                <template v-else>
                  ({{ $t('clients.lunar') }})
                </template>
              </template>
            </p>
          </div>
        </div>
        <div id="client-note-box" :class="{ 'not-client-of-current-shop': !is_client_of_current_shop }" class="note-box" 
             @click="onNoteRegister()">
          <p id="tooltip" class="multiple-line-ellipsis color-gray">
            {{ client.fields.notes }}
          </p>
          <b-tooltip v-if="client.fields.notes && client.fields.notes.length > 100" target="tooltip"
                     placement="bottom" container="client-note-box" no-fade 
                     class="note-tooltip-box">{{ client.fields.notes }}</b-tooltip>
        </div>
        <div v-if="type == options.page_modal_check.page" class="edit-family-button-box">
          <p><a v-if="isDataOfCurrentShop(client.fields)" class="btn secondary mt10 edit-btn" 
                @click="onClientAction(options.form_actions.edit, client.fields.id)">{{ $t('general.edit') }}</a></p>
          <p><a class="btn secondary mt10 family-btn" @click="onFamilyActon(client.fields.family_id)">{{ $t('client-information.family') }}</a></p>
        </div>
        <div class="bottom view-mobile">
          <a class="add-sales" @click="onActionSalesMixin(options.form_actions.add)">{{ $t('sales.add-sales') }}</a>
          <a class="add-refund" @click="onActionRefund(options.form_actions.add)">{{ $t('sales.add-refund') }}</a>
        </div>
      </div>

      <!-- client right -->
      <div :class="{ 'is-mobile-client-info': is_mobile_client_info, 'is-mobile-client-sales': is_mobile_client_sales }" 
           class="box box2 fll por">
        <div class="sales-info">
          <dl>
            <dd>
              <span class="total-sales"> 
                {{ $t('client-information.total-sales') }} : <strong>{{ formatMoney(sales_client_account.fields.total_sales, 0) }} </strong>
              </span>
            </dd>
            <dd>
              <span>{{ $t('client-information.loyalty-points') }} :</span>
              <span>{{ formatMoney(sales_client_account.getPoints(), 0) }}</span>
              <a v-if="can_edit_points" class="action" @click="onActionLoyaltyPoints()">{{ $t('general.edit') }}</a>
            </dd>
            <dd>
              <span>{{ $t('client-information.balance') }} :</span>
              <span>{{ formatMoney(sales_client_account.fields.balance, 0) }}</span>
              <span v-if="sales_client_account.fields.family_id > 0">
                ({{ $t('client-information.family') }} {{ formatMoney(sales_client_account.fields.family_balance, 0) }})
              </span>
            </dd>
            <dd>
              <span>{{ $t('client-information.outstanding') }} : </span>
              <span class="sales-outstand">{{ formatMoney(sales_client_account.fields.outstanding, 0) }}</span>
              <a v-if="can_add_outstanding_payment" class="action" @click="onActionOutstandingPayment()">{{ $t('client-information.payment') }}</a>
            </dd>
            <dd> {{ $t('client-information.booking-info') }} </dd>
          </dl>
          <div class="result">
            <span class="total">{{ $t('home.total') }} {{ formatMoney(booking_summary.fields.total_bookings,0) }}</span>
            <span class="no-show">{{ $t('home.no-show') }} {{ formatMoney(booking_summary.fields.total_no_show_bookings,0) }}</span>
          </div>
          <div class="bottom">
            <a class="add-sales" @click="onActionSalesMixin(options.form_actions.add)">{{ $t('sales.add-sales') }}</a>
            <a class="add-refund" @click="onActionRefund(options.form_actions.add)">{{ $t('sales.add-refund') }}</a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Button -->
    <div class="sales-info-btns">
      <div v-if="type == options.page_modal_check.page" class="remove-client" @click="onRemoveClient">X</div>
      <div :class="{expand : client_info_collapsed}" class="btn-info collapse-client-info-btn view-pc" 
           @click="onCollapseClientInfo"><span class="triangle"/></div>
      <div class="btn-info show-client-sales-info view-mobile" @click="onMobileViewClientInfo"><span class="triangle"/></div>
    </div>

    <!-- Modal -->
    <client-action v-if="action_visiable" @reload-page="onUpdatedClient" @hidden="action_visiable=false"/> 
    <!-- @update-page="onUpdatedClient" -->
    <family-action v-if="type == options.page_modal_check.page" @finished-family-action="onFinishedFamilyAction"/>
    <note-register-action :data="note"/>

    <loyalty-points-action :client_id="client.fields.id" @updated-loyalty-points="onUpdatedLoyaltyPoints"/>
    <outstanding-payment-action @added-outstanding="onAddedOutstanding"/>
    <send-call-modal :call_number="call_number"/>
  </main>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import client_info_mixin                   from '../../../helpers/mixins/client-info-mixin'
import client_action                       from '../../../components/clients/client-action/client-action.vue'
import ClientViewModel                     from '../../../view-model/clients/client-view-model.js'
import note_register_action                from '../../../components/clients/client-information/note-register.vue'
import loyalty_points_action               from '../../../components/clients/client-information/loyalty-points-action.vue'
import family_action                       from '../../../components/clients/family/family-action.vue'
import sales_mixin                         from '../../../helpers/mixins/sales-mixin'
import refund_mixin                        from '../../../helpers/mixins/refund-mixin'
import outstanding_payment_action          from '../../sales/outstanding-payment-action/outstanding-payment-action.vue'
import component_base                      from '../../common/component-base/component-base'
import { PAGE_MODAL_CHECK, CLIENTS_ENUMS } from '../../../config/constant'
import { options }                         from '../../../helpers/options'
import { common_options }                  from '../../../helpers/options/common-options'
import ClientAccountViewModel              from '../../../view-model/sales/outstanding/client-account-view-model'
import sales_client_account_mixin          from '../../../helpers/mixins/sales-client-account-mixin'
import ClientsCache                 from '../../../helpers/cache/clients-cache'
import send_call_modal from '../../../components/common/header-block/cid-send-call-action.vue'
import client_avatar from '../client-avatar/client-avatar'
import { formatMoney,
  guid,
  addDateZero ,
  emptyValue, getHideClientInfoPermission, hideMobilePhone 
} from '../../../helpers/common'

export default {
  components: {
    'client-action'              : client_action,
    'note-register-action'       : note_register_action,
    'family-action'              : family_action,
    'loyalty-points-action'      : loyalty_points_action,
    'outstanding-payment-action' : outstanding_payment_action,
    'send-call-modal'            : send_call_modal,
    'client-avatar'              : client_avatar
  },
  extends: component_base,
  mixins: [client_info_mixin, sales_mixin, refund_mixin, sales_client_account_mixin],
  props: {
    type: {
      type: Number,
      default: PAGE_MODAL_CHECK.MODAL
    }
  },
  data(){
    return {
      options,
      common_options,
      CLIENTS_ENUMS,
      
      client                  : new ClientViewModel(),
      avatar_key              : guid(),
      
      note                    : {},
      img_no                  : 0,
      form_showed             : false,
      client_info_collapsed   : false,
      share_client            : false,

      clients_cache: new ClientsCache(),
      clients_setup: {},

      is_mobile_client_info: true,
      is_mobile_client_sales: false,

      call_number: '',
      action_visiable: false
    }
  },
  computed:{
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    is_existing_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    is_client_of_current_shop(){
      return this.is_existing_client && this.shop_data.shop_id == this.x_client.data.shop_id
    },
    can_edit_points(){
      return this.is_client_of_current_shop && this.sales_client_account.getPoints() != 0
    },
    can_add_outstanding_payment(){
      return this.is_client_of_current_shop && this.sales_client_account.fields.outstanding != 0
    },
  },
  watch: {
    'x_client.data'(){
      this.initClientSetup()
      this.setData()
    },
  },
 
  methods: {
    ...mapActions('client', [
      'setClientActionDataAsync',
      'getClientInformationDataAsync'
    ]),
    ...mapMutations('client', [
      'setClientInformation',
    ]),
    ...mapMutations('client_photo',[
      'setClientAvatarAction'
    ]),
    ...mapMutations('sales_client_account',[
      'setClientAccountAction'
    ]),
    emptyValue,
    formatMoney,
    addDateZero,
    
    async initClientSetup(){
      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup))
        this.showMissingClientsSetupAlert()
    },
    async setData(){
      this.client.fields = this.x_client.data
      this.note = {
        client_id : this.client.fields.id,
        shop_id   : this.x_client.data.shop_id,
        type      : this.type
      }
      this.share_client = this.shop_data.chain_sharing_settings.share_client
      this.shop_id      = this.shop_data.shop_id

      // client account & booking summary
      await this.$parent.loadClientAccountAsync()
      await this.loadBookingsSummaryByClient(this.client.fields.id)
    },
    
    // Client
    async onClientAction(action, client_id = 0){
      this.action_visiable=true
      let client_action = {
        action    : action,
        client_id : client_id,
        shop_id   : this.shop_data.shop_id
      }
      this.preLoader(true)
      await this.setClientActionDataAsync(client_action).then(() => {
        this.showDialogById('action-client-modal')
      })
      this.preLoader(false)
    },
    async onUpdatedClient(){
      await this.$parent.setClientData()
    },
    onRemoveClient(){
      this.$router.push('sales')
      this.setClientInformation({})
    },
    onNoteRegister() {
      if(this.is_client_of_current_shop)
        this.showDialogById('note-register-modal')
    },
    onCollapseClientInfo(){
      this.client_info_collapsed = !this.client_info_collapsed
    },
    onMobileViewClientInfo(){
      this.is_mobile_client_info = !this.is_mobile_client_info
      this.is_mobile_client_sales = !this.is_mobile_client_sales
    },
    
    // Family
    onFamilyActon() {
      this.showDialogById('family-action-modal')
    },
    async onFinishedFamilyAction(){
      await this.$parent.loadClientAccountAsync()
    },

    // Points
    onActionLoyaltyPoints() {
      this.showDialogById('loyalty-points-modal')
    },
    async onUpdatedLoyaltyPoints(){
      await this.$parent.loadClientAccountAsync()
    },

    // outstanding
    onActionOutstandingPayment(){
      let tmp_client = this.x_client.data
      let tmp_client_account_vm = new ClientAccountViewModel()
      
      tmp_client_account_vm.setFields({
        id             : 0,
        client_id      : tmp_client.id,
        client_name    : tmp_client.client_name,
        phone_number   : tmp_client.phone_number,
        mobile_number  : tmp_client.mobile_number,
        recent_visit   : 0,
        family_id      : tmp_client.family_id,
        loyalty_points : this.sales_client_account.getPoints(),
        outstanding    : this.sales_client_account.fields.outstanding,
        shop_id        : tmp_client.shop_id
      })
      
      let client_account_action = {
        action: common_options.form_actions.add, 
        data  : tmp_client_account_vm.getFields()
      }

      this.setClientAccountAction(client_account_action)
      this.showDialogById('outstanding-payment-action-modal')
    },
    async onAddedOutstanding(data){
      this.$emit('added-outstanding', data)
    },

    // other UI
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },
    initImg(){
      this.img_no = 0
    },
    isTrue(){
      if (this.client.fields.shop_id == this.shop_id)
        return true
      else return false
    },
    hiddenClientInformation(mobile){
      if(!_.isEmpty(this.clients_setup)){
        let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, this.x_client.data.registration_date)
        if(isHideClientInfo) mobile = this.hideInfoByPermission()
      }
      return mobile
    },
    hideInfoByPermission(){
      return hideMobilePhone(this.client.fields.mobile_number)
    },
    onSendMessage(){
      this.$router.push({ name: 'send-messages', params: { type: options.messages_enums.send_page.client, client_id: this.client.fields.id }})
    },
    onSendCall(){
      this.call_number = this.client.fields.mobile_number
      this.$nextTick(() => {
        this.showDialogById('cid-send-call-modal')
      })
    },

    // format
    formatDateTime(date){
      if(date != null && date != 0)
        return moment(date).format(options.standard_date_format.ymdh)
    }, 
  }
}
</script>
