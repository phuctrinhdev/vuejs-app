<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('menu.clients') }}</h3>
          <ul class="btn-group clearfix flr">
            <li><a class="btn secondary" @click="onActionClient(options.form_actions.add)">{{ $t('clients.client-add') }}</a></li>
          </ul>
        </article>
        <div class="section-part">         
          <div class="top-text clearfix mb10">
            <span class="fll">
              {{ $t('clients.all').replace('{0}', table_data.pagination.total_items) }}
            </span>
            <span class="flr color-red">
              {{ $t('clients.click-name-edit') }}
            </span>
          </div>
          <div class="slide-x large">
            <clients-table :data="table_data" @change-page="onChangePage">
              <template slot="client_name" slot-scope="{ row }">
                <span @click="onClientInfo(row)">
                  {{ (row.client_name) }}
                </span>
              </template>
              <template slot="mobile_phone" slot-scope="{ row }">
                <template v-if="row.phone_number != null && row.mobile_number != null">
                  {{ formatHideInfoCol(row.mobile_number, row.registration_date) }}
                  <br> / {{ formatHideInfoCol(row.phone_number, row.registration_date) }}
                </template>
                <template v-else-if="row.mobile_number != null">
                  {{ formatHideInfoCol(row.mobile_number, row.registration_date) }}
                </template>
                <template v-else-if="row.phone_number != null">
                  {{ formatHideInfoCol(row.phone_number, row.registration_date) }}
                </template>
              </template>
              <template slot="notes" slot-scope="{ row }">
                <div class="text-center note-tooltip">
                  <b-col>
                    <b-button :id="'tooltip' + row.id" class="text-ellip" variant="outline-success">{{ row.notes }}</b-button>
                  </b-col>
                  <b-tooltip :target="'tooltip' + row.id" class="tooltip" placement="bottom">
                    {{ row.notes }}
                  </b-tooltip>
                </div>  
              </template>
              <template slot="edit" slot-scope="{ row }">
                <a class="btn secondary" @click="onActionClient(options.form_actions.edit, row.id)">{{ $t('general.edit') }}</a> 
              </template>
              <template slot="calendar" slot-scope="{ row }">
                <a class="btn secondary" @click="onClickViewCalendarByClient(row)">➝</a>
              </template>
              <template slot="sales" slot-scope="{ row }">
                <a class="btn secondary" @click="goToSales(row)">➝</a>
              </template>
            </clients-table>
          </div>
        </div>
      </div>
    </section> 

    <!-- modal action -->
    <client-action v-if="action_visible" @reload-page="onReloadPage" @update-page="onUpdatePage"  
                   @hidden="action_visible=false"/>

    <div v-if="info_visible" class="common-style">
      <b-modal id="client-information-modal"
               :title="client_information_title"
               :no-close-on-backdrop="true"
               hide-footer
               size="llg"
               class="client-information-modal"
               @show="showInfoModal()">
        <client-information ref="clientInformation" :client_id="client_info_id" />
      </b-modal>
    </div>
  </main>
</template>

<script>
// Utils
import _ from 'lodash'
import { mapGetters, mapActions, mapMutations }  from 'vuex'
import { options }                 from '../../../helpers/options'
import ClientsCache                     from '../../../helpers/cache/clients-cache'
import { formatMoney, convertDateFromUtcToTimezone, formatDate, hideMobilePhone, getHideClientInfoPermission } from '../../../helpers/common'

// Components
import component_base              from '../../../components/common/component-base/component-base'
import client_action               from '../../../components/clients/client-action/client-action.vue'
import clients_btn                 from '../../../components/common/button/common-btn/common-btn.vue'
import clients_table               from '../../../components/clients/clients-table/clients-table.vue'
import client_information          from '../../../components/clients/client-information/client-information.vue'

export default {
  components: {
    'clients-btn': clients_btn,
    'client-action': client_action,
    'clients-table': clients_table,
    'client-information': client_information,
  },
  extends: component_base,
  data() {
    return {
      options,

      // table
      table_data: {
        fields: [
          { field: 'registration_date',  label: 'general.registered-date', width: '18%', sortable: false, expand: false, formatFn: this.formatDateCol },
          { field: 'client_name',        label: 'clients.client-name',     width: '14%', sortable: false, expand: true },
          { field: 'mobile_phone',       label: 'clients.mobile-phone',    width: '14%', sortable: false, expand: true },
          { field: 'total_sales_amount', label: 'clients.total-sales',     width: '15%', sortable: false, expand: false, formatFn: this.formatMoneyCol },
          { field: 'notes',              label: 'clients.notes',           width: '15%', sortable: false, expand: true },
          { field: 'edit',               label: 'general.edit',            width: '8%',  sortable: false, expand: true },
          { field: 'calendar',           label: 'header-block.calendar',   width: '8%',  sortable: false, expand: true },
          { field: 'sales',              label: 'header-block.sales',      width: '8%',  sortable: false, expand: true },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: true
        }
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0
      },

      // modal action
      action_visible: false,
      info_visible: false,
      client_info_id: 0,
      client_information_title: '',

      clients_setup: {},
      clients_cache: new ClientsCache(),
    }
  },
  computed: {
    ...mapGetters('client', {
      clients_data: 'getClients'
    }),
  },
  async created(){
    this.initClientSetup()
  },
  mounted() {
    this.action_visible=false
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableData()
  },
  methods: {
    ...mapActions('client', [
      'getClientsDataAsync',
      'updateClientData',
      'setClientActionDataAsync'
    ]),
    ...mapMutations('sales',[
      'setClientIdUsingSales',
      'setClientShopIdUsingSales'
    ]),
    ...mapMutations('client', [
      'setBookingClient',
    ]),
    async initClientSetup(){
      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup))
        this.showMissingClientsSetupAlert()
    },
    // table
    async loadTableData() {
      this.preLoader()
      await this.getClientsDataAsync(this.table_filter)

      if(this.clients_data.is_ok){
        this.table_data.rows = this.clients_data.data.items
        this.table_data.pagination = this.clients_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(this.clients_data.error_messages)

      this.preLoader(false)
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },
    formatMoneyCol(number){
      return formatMoney(number, 2)
    },
    formatDateCol(date){
      return formatDate(convertDateFromUtcToTimezone(date, this.shop_data.timezone))
    },
    // modal action
    onActionClient(action, client_id = 0){
      this.action_visible = true
      let client_action = {
        action: action,
        client_id: client_id,
        shop_id: this.shop_data.shop_id
      }
      this.setClientActionDataAsync(client_action).then(() => {
        this.showDialogById('action-client-modal')
      })
    },
    onClientInfo(row) {
      this.info_visible = true
      this.client_info_id = row.id
      this.setClientShopIdUsingSales(row.shop_id)
      this.$nextTick(function(){
        this.showDialogById('client-information-modal')
      })
    },
    goToSales(client)
    {
      this.setClientShopIdUsingSales(client.shop_id)
      this.setClientIdUsingSales(client.id)
      this.$router.push('/client-sales')
    },
    // event success
    onReloadPage(){
      if(((this.table_filter.page_number - 1) * 10) == this.table_data.pagination.total_items - 1) // only delete
        this.table_filter.page_number -= 1
      this.loadTableData()
      this.action_visible=false
    },
    // different form Goods
    onUpdatePage(client){
      this.updateClientData(client)
      this.action_visible=false
    },
    showInfoModal(){
      this.client_information_title = this.$i18n.t('client-information.title')
      this.$refs.clientInformation.onLoadForm()
    },
    formatHideInfoCol(mobile, registration_date){
      if(!_.isEmpty(this.clients_setup))
      {
        let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, registration_date)
        if(isHideClientInfo) mobile= hideMobilePhone(mobile)
      }
      return mobile
    },
    onClickViewCalendarByClient(client) {
      this.setBookingClient(client)
      this.$router.push('/calendar')
    }
  }
}
</script>

<style lang="scss">
@import './clients.scss';
</style>