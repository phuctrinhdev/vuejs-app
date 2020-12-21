<template>
  <main class="app-content">
    <section class="content sales-page">
      <div class="inner">
        <client-search ref="client_search"
                       :is_client_search_condition_default="true"
                       @click-search-client="onClickSearchClient" 
                       @select-client="onSelectClient"
                       @clear-search-client="onClearSearchClientForm"/>
        <div v-show="show_sales_content" class="sales-content">
          <div class="row client-unregistered">
            <div class="col-12 col-md-6">
              <div class="intro">
                <p>{{ $t('sales.client-not-select-info1') }}</p>
                <p>{{ $t('sales.client-not-select-info2') }}</p>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="add-sales">
                <div class="btn-group">
                  <div class="btn btn-large" @click="onActionSalesMixin(options.form_actions.add)">{{ $t('sales.add-sales') }}</div>
                  <div class="btn btn-large" @click="onActionRefund(options.form_actions.add)">{{ $t('sales.add-refund') }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="row unregistered-sales-today">
            <div class="col-12">
              <div class="sales-data">
                <div class="intro">{{ sales_today_intro }}</div>
                <sales-table @show-deleted="onShowDeleted" 
                             @change-page="onChangePage"
                             @sales-added="reloadUnregisteredSalesTodayAsync"
                             @sales-edited="reloadUnregisteredSalesTodayAsync"
                             @sales-deleted="reloadUnregisteredSalesTodayAsync"
                             @refund-added="reloadUnregisteredSalesTodayAsync"
                             @refund-deleted="reloadUnregisteredSalesTodayAsync"
                             @outstanding-deleted="reloadUnregisteredSalesTodayAsync"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <client-action @reload-page="onReloadPage" @update-page="onUpdatePage"/> -->
  </main>
</template>

<script>
// Utils
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import { options }        from '../../../helpers/options'
import SalesCache         from '../../../helpers/cache/sales-cache'
import { sales_options }  from '../../../helpers/options/sales-options'
import SalesViewModel     from '../../../view-model/sales/sales/sales-view-model'

// Mixins
import staff_mixin                from '../../../helpers/mixins/staff-mixin'
import sales_mixin                from '../../../helpers/mixins/sales-mixin'
import refund_mixin               from '../../../helpers/mixins/refund-mixin'

// Components
import sales_table                from '../../../components/sales/sales-table/sales-table.vue'
import component_base             from '../../../components/common/component-base/component-base'
import client_action              from '../../../components/clients/client-action/client-action.vue'
import client_search              from '../../../components/bookings/bookings/client-search/client-search'


import { convertDateToTimeStamp,
  formatMoney, 
  convertTimeStampToDate }        from '../../../helpers/common'

export default {
  components: {
    'client-action': client_action,
    'client-search': client_search,

    'sales-table': sales_table,
  },
  extends: component_base,
  mixins: [staff_mixin, sales_mixin, refund_mixin],
  data() {
    return {
      options,
      sales_options,

      sales_cache: new SalesCache(),
      sales_setup: {},

      sales_filter: {
        client_id       : 0,
        from_date_ts    : convertDateToTimeStamp(new Date(), true),
        to_date_ts      : convertDateToTimeStamp(moment(new Date()).add(1, 'day').toDate(), true),
        include_deleted : false,
        page_size       : options.pagination.default,
        page_number     : 1,
        shop_id         : 0,
        client_shop_id  : 0
      },

      show_sales_content: true,
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_sales_list: 'getSalesList'
    }),
    ...mapGetters('booking', {
      x_booking_action: 'getBookingAction'
    }),
    sales_today_intro(){
      let intro = this.$i18n.t('sales.sales-today-intro')
      intro = intro.replace('{records}', this.x_sales_list.pagination.total_items)
      return intro
    }
  },
  async created(){
    this.$nextTick(() => {
      // cusor focus to client_search_input
      this.$refs.client_search.$refs.client_search_input.$el.focus()
    })

    // clear client in store
    this.setClientInformation({})
    
    this.preLoader()
    await this.loadStaffOptions()
    await this.loadSalesFromCheckoutBooking()
    await this.loadUnregisteredSalesTodayAsync()
    this.preLoader(false)
  },
  beforeRouteLeave(to, from, next) {
    this.resetState()
    next()
  },
  methods: {
    ...mapMutations('client', [
      'setBookingClient',
      'setClientInformation',
    ]),
    ...mapMutations('sales',[
      'setClientIdUsingSales',
      'setClientShopIdUsingSales',
      'setSalesList',
    ]),
    ...mapMutations('booking',[
      'resetState'
    ]),
    ...mapMutations('staff',[
      'setStaffOptions',
    ]),
    moment,
    formatMoney,
    convertTimeStampToDate,

    // searching
    onClickSearchClient(){
      this.show_sales_content = false
    },
    onSelectClient(client){
      this.show_sales_content = true
      this.setBookingClient(client)
      this.setClientIdUsingSales(client.id)
      this.setClientShopIdUsingSales(client.shop_id)
      this.$router.push('/client-sales')
    },
    onClearSearchClientForm(){
      this.show_sales_content = true
    },

    // load staff options
    async loadStaffOptions(){
      let result = await this.getStaffsAsyncMixin()
      if(result.is_ok)
        this.setStaffOptions(result.data.items)
      else this.showAlert(result.error_messages)
    },

    // sales from checkout booking
    async loadSalesFromCheckoutBooking(){
      if(this.x_booking_action.data.id > 0){
        let tmp_sales = new SalesViewModel()
        
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
          this.showDialogById('sales-action-modal')
        }
        else {
          this.showAlert(error_messages)
        }
      }
    },

    // sales listing
    async loadUnregisteredSalesTodayAsync(){
      this.sales_filter.from_date_ts  = convertDateToTimeStamp(new Date(), true)
      this.sales_filter.to_date_ts    = convertDateToTimeStamp(moment(new Date()).add(1, 'day').toDate(), true) - 1
      this.sales_filter.shop_id       = this.shop_data.shop_id
      this.sales_filter.client_shop_id= this.shop_data.shop_id

      this.preLoader()
      let result = await this.sales_api.getSalesHistoryByClientAsync(this.sales_filter)
      this.preLoader(false)

      if(result.is_ok){
        this.setSalesList(result.data)
      }
      else 
        this.showAlert(result.error_messages)
    },
    async onShowDeleted(include_deleted){
      this.sales_filter.include_deleted = include_deleted
      this.sales_filter.page_number = 1
      await this.loadUnregisteredSalesTodayAsync()
    },
    async onChangePage(page_number){
      this.sales_filter.page_number = page_number
      await this.loadUnregisteredSalesTodayAsync()
    },

    // finished sales action
    async reloadUnregisteredSalesTodayAsync(){
      this.sales_filter.page_number = 1
      await this.loadUnregisteredSalesTodayAsync()
    }
  }
}
</script>

<style lang='scss'>
@import './sales.scss';
</style>
