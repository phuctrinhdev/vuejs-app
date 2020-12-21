<template>
  <div class="client-information-tab-card">
    <b-card :class="{ 'mobile': type == options.page_modal_check.modal }" no-body>
      <b-tabs v-model="tab_index" card>   
        
        <b-tab :title="$i18n.t('sales-invoice-tab.sales-history')"
               @click="onViewTableContent(sales_options.client_tabs_type_enum.sales_history)">
          <div v-if="is_sales_history_tab_selected" class="client-sales-table">
            <div class="intro">{{ client_sales_table_intro }}</div>
            <sales-table ref="sales_table"
                         :is_attached_sales_action="false"
                         @created-sales-table="onCreatedSalesTable"
                         @show-deleted="onShowDeleted"
                         @change-page="onChangePageSalesHistory"
                         @sales-added="reloadRelatedPagesAsync"
                         @sales-edited="reloadRelatedPagesAsync"
                         @sales-deleted="reloadRelatedPagesAsync"
                         @refund-added="reloadRelatedPagesAsync"
                         @refund-deleted="reloadRelatedPagesAsync"
                         @outstanding-deleted="reloadRelatedPagesAsync"/>
          </div>
        </b-tab>

        <b-tab :title="$i18n.t('sales-booking-tab.bookings')"
               @click="onViewTableContent(sales_options.client_tabs_type_enum.bookings)">
          <div class="client-bookings cl-info-inner pc">
            <sales-bookings v-if="is_bookings_tab_selected"/>
          </div>
        </b-tab>

        <b-tab :title="$i18n.t('sales-prepaid-card-tab.prepaid-cards')"
               @click="onViewTableContent(sales_options.client_tabs_type_enum.prepaid_cards)">
          <b-card no-body class="nopadding-card">
            <b-tabs class="client-info-inner-card mt10" pills card>
              <b-tab :title="$i18n.t('sales-prepaid-card-tab.prepaid-cards')" 
                     :active="tab_index == sales_options.client_tabs_type_enum.prepaid_cards - 1"
                     @click="onViewTableContent(sales_options.client_tabs_type_enum.prepaid_cards)">
                <sales-prepaid-cards v-if="is_prepaid_card_tab_selected" ref="sales_prepaid_cards"/>
              </b-tab>
              <b-tab :title="$i18n.t('sales-prepaid-card-tab.history')"
                     @click="onViewTableContent(sales_options.client_tabs_type_enum.prepaid_cards_history)">
                <sales-prepaid-cards-history v-if="is_prepaid_card_history_tab_selected" ref="sales_prepaid_cards_history"/>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-tab>

        <b-tab :title="$i18n.t('sales-prepaid-service-tab.prepaid-services')"
               @click="onViewTableContent(sales_options.client_tabs_type_enum.prepaid_services)">
          <b-card no-body class="nopadding-card">
            <b-tabs class="client-info-inner-card mt10" pills card>
              <b-tab :title="$i18n.t('sales-prepaid-service-tab.prepaid-services')" 
                     :active="tab_index == sales_options.client_tabs_type_enum.prepaid_services - 2"
                     @click="onViewTableContent(sales_options.client_tabs_type_enum.prepaid_services)">
                <sales-prepaid-services v-if="is_prepaid_service_tab_selected" ref="sales_prepaid_services"/>
              </b-tab>
              <b-tab :title="$i18n.t('sales-prepaid-service-tab.history')"
                     @click="onViewTableContent(sales_options.client_tabs_type_enum.prepaid_services_history)">
                <sales-prepaid-services-history v-if="is_prepaid_service_history_tab_selected" ref="sales_prepaid_services_history"/>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-tab>

        <b-tab :title="$i18n.t('sales-message-tab.title')"
               @click="onViewTableContent(sales_options.client_tabs_type_enum.messages)">
          <div class="cl-info-inner pc">
            <client-messages-history v-if="is_message_tab_selected"/>
          </div>

          <!-- <div class="cl-info-inner mobile">
            <table class="normal">
              <thead>
                <tr>
                  <th>
                    <div>
                      <a class="btn secondary">{{ $t('sales-message-tab.send-message') }}</a>
                      <a class="btn secondary">{{ $t('sales-message-tab.delete') }}</a>
                      <p class="color-gray mt5">
                        {{ $t('sales-message-tab.all') }}
                      </p>
                      <p class="color-gray">
                        {{ $t('sales-message-tab.sender-number') }} : 00099998888
                      </p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="show-mobile-text-box">
                      <p>05-01-2018 17:00</p>
                      <p>S</p>
                      <span class="show-more-text">&gt;</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="show-mobile-text-box">
                      <p>05-01-2018 17:00</p>
                      <p>M</p>
                      <span class="show-more-text">&gt;</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="show-mobile-text-box">
                      <p>05-01-2018 17:00</p>
                      <p>S</p>
                      <span class="show-more-text">&gt;</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="show-mobile-text-box">
                      <p>05-01-2018 17:00</p>
                      <p>M</p>
                      <span class="show-more-text">&gt;</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> -->
        </b-tab>

        <b-tab :title="$i18n.t('sales-photo-tab.title')"
               @click="onViewTableContent(sales_options.client_tabs_type_enum.photos)">
          <client-photos v-if="is_photo_tab_selected"/>
        </b-tab>
      </b-tabs>
    </b-card>
    
    <!-- BEGIN MODAL -->
    <sales-action @added="reloadRelatedPagesAsync(true)" @edited="reloadRelatedPagesAsync(true)"/>
    <refund-action @added="reloadRelatedPagesAsync(true)"/>

    <photo-show-modal/>
    <!-- END MODAL -->

  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { options }                    from '../../../helpers/options'
import { sales_options }              from '../../../helpers/options/sales-options'
import { PAGE_MODAL_CHECK }           from '../../../config/constant'
import SalesCache                     from '../../../helpers/cache/sales-cache'
import SalesViewModel                 from '../../../view-model/sales/sales/sales-view-model'
import sales_mixin                    from '../../../helpers/mixins/sales-mixin'
import client_info_mixin              from '../../../helpers/mixins/client-info-mixin'

import sales_table                    from '../../../components/sales/sales-table/sales-table.vue'
import sales_action                   from '../../../components/sales/sales-action/sales-action.vue'
import refund_action                  from '../../../components/sales/refund-action/refund-action.vue'
import sales_prepaid_cards            from '../../sales/sales-prepaid-cards/sales-prepaid-cards.vue'
import sales_prepaid_cards_history    from '../../sales/sales-prepaid-cards-history/sales-prepaid-cards-history.vue'
import sales_prepaid_services         from '../../sales/sales-prepaid-services/sales-prepaid-services.vue'
import sales_prepaid_services_history from '../../sales/sales-prepaid-service-histories/sales-prepaid-service-histories.vue'
import client_messages_history        from '../../../components/messages/client-messages-history/client-messages-history'
import photo_show_modal               from '../../../components/clients/client-information/photo-show-modal.vue'
import component_base                 from '../../common/component-base/component-base'
import sales_bookings                 from '../../sales/sales-bookings/sales-bookings'
import client_photos                  from '../client-photos/client-photos'
import {
  convertDateToTimeStamp,
  convertDateToTimezone
}                                  from '../../../helpers/common'

export default {
  components: {
    'sales-table': sales_table,
    'sales-action': sales_action,
    'refund-action': refund_action,
    'sales-prepaid-cards':sales_prepaid_cards,
    'sales-prepaid-cards-history': sales_prepaid_cards_history,
    'sales-prepaid-services':sales_prepaid_services,
    'sales-prepaid-services-history':sales_prepaid_services_history,
    'client-messages-history': client_messages_history,
    'photo-show-modal': photo_show_modal,
    'sales-bookings': sales_bookings,
    'client-photos': client_photos
  },
  extends: component_base,
  mixins: [sales_mixin, client_info_mixin],
  props: {
    type: {
      type: Number,
      default: PAGE_MODAL_CHECK.MODAL
    },
  },
  data(){
    return {
      options,
      sales_options,

      sales_cache: new SalesCache(),
      sales_setup: {},

      // tabs
      tab_index: 0,
      is_sales_history_tab_selected           : false,
      is_bookings_tab_selected                : false,
      is_prepaid_card_tab_selected            : false,
      is_prepaid_card_history_tab_selected    : false,
      is_prepaid_service_tab_selected         : false,
      is_prepaid_service_history_tab_selected : false,
      is_message_tab_selected                 : false,
      is_photo_tab_selected                   : false,
  
      // sales history
      sales_filter: {
        client_id       : 0,
        from_date_ts    : 1,
        to_date_ts      : convertDateToTimeStamp(new Date(), true),
        include_deleted : false,
        page_size       : options.pagination.default,
        page_number     : 1,
        shop_id         : 0,
        client_shop_id  : 0
      },
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('sales', {
      x_sales_list: 'getSalesList',
      x_active_tab_name : 'getActiveTabName'
    }),
    ...mapGetters('booking', {
      x_booking_list: 'getBookingList',
      x_booking_action: 'getBookingAction'
    }),
    ...mapGetters('sales_prepaid_card',{
      x_prepaid_cards_filter : 'getSalesPrepaidCardsFilter'
    }),
    ...mapGetters('sales_prepaid_card_history',{
      x_prepaid_card_histories_filter : 'getPrepaidCardHistoriesFilter'
    }),
    ...mapGetters('sales_prepaid_services',{
      x_prepaid_services_filter : 'getPrepaidServicesFilter'
    }),
    ...mapGetters('sales_prepaid_service_history',{
      x_prepaid_service_histories_filter : 'getPrepaidServiceHistoriesFilter'
    }),
    ...mapGetters('client_message_history',{
      x_client_message_histories_filter : 'getClientMessageHistoriesFilter'
    }),
    client_sales_table_intro(){
      let intro = this.$i18n.t('sales.all-records-of-sales-table')
      intro = intro.replace('{records}', this.x_sales_list.pagination.total_items)
      return intro
    },
  },
  async created(){
    this.initTabs()

    // checkout booking
    if(this.x_booking_action.data.id > 0){
      let tmp_sales = new SalesViewModel()

      this.preLoader()
      let error_messages = await tmp_sales.mapFieldsFromCheckoutBooking(this.x_booking_action.data)
      if(error_messages.length == 0){
        let sales_action = {
          action: options.form_actions.add,
          data: tmp_sales.getFields(),
          options: {
            sales_goods_type: sales_options.sales_goods_type.service
          }
        }
        this.setSalesAction(sales_action)

        this.$nextTick(() => {
          this.showDialogById('sales-action-modal')
        })
      }
      else {
        this.showAlert(error_messages)
      }
      this.preLoader(false)
    }
  },
  methods: {
    ...mapActions('client', [
      'getClientInformationDataAsync'
    ]),
    ...mapMutations('sales',[
      'setSalesList',
      'setSalesAction',
      'setActiveTabName'
    ]),

    // TABS
    async initTabs(){
      this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }

      switch(this.sales_setup.sales_general_setup.client_sales_information_default){
        case sales_options.client_sales_information_default_type_enum.sales_history:
          this.onViewTableContent(sales_options.client_tabs_type_enum.sales_history)
          this.tab_index = 0
          break
        case sales_options.client_sales_information_default_type_enum.bookings: 
          this.onViewTableContent(sales_options.client_tabs_type_enum.bookings)
          this.tab_index = 1
          break
        case sales_options.client_sales_information_default_type_enum.prepaid_cards:
          this.onViewTableContent(sales_options.client_tabs_type_enum.prepaid_cards)
          this.tab_index = 2
          break
        case sales_options.client_sales_information_default_type_enum.prepaid_services:
          this.onViewTableContent(sales_options.client_tabs_type_enum.prepaid_services)
          this.tab_index = 3
          break
        case sales_options.client_sales_information_default_type_enum.messages:
          this.onViewTableContent(sales_options.client_tabs_type_enum.messages)
          this.tab_index = 4
          break
        case sales_options.client_sales_information_default_type_enum.photos:
          this.onViewTableContent(sales_options.client_tabs_type_enum.photos)
          this.tab_index = 5
          break
      }
    },
    onViewTableContent(tab_content){
      this.is_sales_history_tab_selected           = false
      this.is_bookings_tab_selected                = false
      this.is_prepaid_card_tab_selected            = false
      this.is_prepaid_card_history_tab_selected    = false
      this.is_prepaid_service_tab_selected         = false
      this.is_prepaid_service_history_tab_selected = false
      this.is_message_tab_selected                 = false
      this.is_photo_tab_selected                   = false
      
      switch(tab_content){
        case sales_options.client_tabs_type_enum.sales_history:
          this.is_sales_history_tab_selected = true
          this.setActiveTabName = sales_options.client_tabs_type_enum.sales_history
          this.sales_filter.include_deleted = false
          if(this.$refs.sales_table)
            this.$refs.sales_table.is_show_deleted = false
          break
        case sales_options.client_tabs_type_enum.bookings: 
          this.is_bookings_tab_selected = true
          this.setActiveTabName = sales_options.client_tabs_type_enum.bookings
          break
        case sales_options.client_tabs_type_enum.prepaid_cards:
          this.is_prepaid_card_tab_selected = true
          this.setActiveTabName = sales_options.client_tabs_type_enum.prepaid_cards
          break
        case sales_options.client_tabs_type_enum.prepaid_cards_history:
          this.is_prepaid_card_history_tab_selected = true
          this.setActiveTabName = sales_options.client_tabs_type_enum.prepaid_cards_history
          break
        case sales_options.client_tabs_type_enum.prepaid_services:
          this.is_prepaid_service_tab_selected = true
          this.setActiveTabName = sales_options.client_tabs_type_enum.prepaid_services
          break
        case sales_options.client_tabs_type_enum.prepaid_services_history:
          this.is_prepaid_service_history_tab_selected = true
          this.setActiveTabName = sales_options.client_tabs_type_enum.prepaid_services_history
          break
        case sales_options.client_tabs_type_enum.messages:
          this.is_message_tab_selected = true
          this.setActiveTabName        = sales_options.client_tabs_type_enum.messages
          break
        case sales_options.client_tabs_type_enum.photos:
          this.is_photo_tab_selected = true
          this.setActiveTabName      = sales_options.client_tabs_type_enum.photos
          break
      }
    },

    // sales listing
    async loadClientSalesHistoryAsync(page_number){
      let tmp_to_date = moment(convertDateToTimezone(new Date())).add(1, 'day').format(options.standard_date_format.ymd)
      this.sales_filter.to_date_ts    = convertDateToTimeStamp(tmp_to_date) - 1
      this.sales_filter.client_id     = this.x_client.data.id
      this.sales_filter.page_number   = page_number
      this.sales_filter.shop_id       = this.shop_data.shop_id
      this.sales_filter.client_shop_id= this.x_client.data.shop_id
      
      this.preLoader()
      let result = await this.sales_api.getSalesHistoryByClientAsync(this.sales_filter)
      this.preLoader(false)
      
      if(result.is_ok){
        this.setSalesList(result.data)
      }
      else {
        this.showAlert(result.error_messages)
      }
    },

    async onCreatedSalesTable(){
      await this.loadClientSalesHistoryAsync(1)
    },
    async onShowDeleted(include_deleted){
      this.sales_filter.include_deleted = include_deleted
      await this.loadClientSalesHistoryAsync(1)
    },
    async onChangePageSalesHistory(page_number){
      await this.loadClientSalesHistoryAsync(page_number)
    },

    async reloadRelatedPagesAsync(is_change_sales_history){
      // reload client
      setTimeout(()=>{
        this.getClientInformationDataAsync({shop_id  : this.shop_data.shop_id, client_id: this.x_client.data.id})
        if(!this.x_client.is_ok) this.showAlert(this.x_client.error_messages) 
      },3000)

      // reload client account
      await this.$parent.loadClientAccountAsync()

      // change to sales history tab when sales-action, refund-action & outstanding-action
      if(is_change_sales_history){
        this.tab_index = 0
        this.onViewTableContent(sales_options.client_tabs_type_enum.sales_history)
      }
      
      // reload sales history
      this.loadClientSalesHistoryAsync(1)
    },
    // PHOTOS
    onPhotoShow() {
      this.showDialogById('photo-show-modal')
    },
  }
}
</script>