<template>
  <div class="client-search">
    <div class="row client-filter">
      <div class="col-12 col-sm-9 col-md-8 form-wrapper">
        <b-form>
          <div class="search-keyword clearfix">
            <b-dropdown>
              <b-dropdown-item v-for="(condition, index) in client_search_condition_options" :key="index" 
                               @click="onSelectClientSearchCondition(condition)">{{ $t(condition.text) }}</b-dropdown-item>
            </b-dropdown>
            <div class="form-group">
              <b-form-input ref="client_search_input" 
                            v-model="table_filter.search_keyword" 
                            :placeholder="$t(client_search_condition_placeholder)" 
                            @input="onInputClientSearch"/>
              <span v-show="table_filter.search_keyword.length > 0" @click="onClearSearch">x</span>
            </div>
            <button class="btn-submit" @click.prevent="onClickSearchButton"><i class="btn-search-white"/></button>
          </div>
          <div v-if="chain_id > 0 && share_client==true" class="search-all-branchs">
            <b-form-checkbox v-model="table_filter.search_in_branches" :value="true" :unchecked-value="false"
                             @input="onSelectSearchAllBranches">
              <span class="full-text">{{ $t('bookings.search-in-all-branches') }}</span>
              <span class="short-text">{{ $t('bookings.search-branches') }}</span>
            </b-form-checkbox>
          </div>
        </b-form>
      </div>
      <div class="col-12 col-sm-3 col-md-4">
        <ul class="client-action">
          <li><a class="btn btn-large" @click="onActionClient(options.form_actions.add)">{{ $t('bookings.add-client') }}</a></li>
        </ul>
      </div>
      <div class="col-12"><div class="divider"/></div>
    </div>

    <div v-show="table_filter.search_keyword.length > 0 && show_client_result" class="row client-result">
      <p class="table-intro">{{ $t('client-information.total') }} {{ table_data.rows.length }} {{ $t('clients.client') }} <i>{{ $t('clients.click-row-to-select-client') }}</i></p>
      <view-table :data="table_data" @change-page="onChangePage">
        <template slot="branch_number" slot-scope="{ row }">
          <div class="text-center note-tooltip">
            <div :id="'shop-name-tooltip' + row.id" class="text-ellip">{{ row.branch_number }}</div>
            <b-tooltip :target="'shop-name-tooltip' + row.id" class="tooltip" placement="bottom">
              {{ row.shop_name }}
            </b-tooltip>
          </div>
        </template>
        <template slot="client_name" slot-scope="{ row }">
          <a @click="onSelectClient(row)">{{ row.client_name }}</a>
        </template>
        <template slot="notes" slot-scope="{ row }">
          <div class="text-center note-tooltip">
            <div :id="'tooltip' + row.id" class="text-ellip">{{ row.notes }}</div>
            <b-tooltip :target="'tooltip' + row.id" class="tooltip" placement="bottom">
              {{ row.notes }}
            </b-tooltip>
          </div>  
        </template>
      </view-table>
    </div>
    <client-action v-if="action_visible" @reload-page="onReloadPage"/>
  </div>
</template>

<script>
// Utils
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { options }                from '../../../../helpers/options'
import { CLIENTS_ENUMS }          from '../../../../config/constant'
import ClientApi                  from '../../../../api/clients/client-api'
import ClientViewModel from '../../../../view-model/clients/client-view-model'
import ClientEnvironmentSetupApi  from '../../../../api/clients/client-environment-setup-api'
import ClientsCache                     from '../../../../helpers/cache/clients-cache'
import { getHideClientInfoPermission, hideMobilePhone, formatDate, convertTimeStampToDate } from '../../../../helpers/common'

// Components
import view_table                 from '../../../../components/common/view-table/view-table'
import component_base             from '../../../../components/common/component-base/component-base'
import client_action               from '../../../../components/clients/client-action/client-action.vue'

export default {
  components: {
    'view-table': view_table,
    'client-action': client_action,
  },
  extends: component_base,
  props: {
    is_client_search_condition_default: {
      type: Boolean,
      default: false
    },
    action_visible: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      options,

      client_environment_setup_api: new ClientEnvironmentSetupApi(),
      client_api: new ClientApi(),
      show_client_result: false,
      share_client: false,
      chain_id: 0,
      // client table
      table_data: {
        fields: [
          { field: 'branch_number',               label: 'general.location',           width: '8%',  sortable: false, expand: true, thClass: 'location' },
          { field: 'client_name',                 label: 'clients.client-name',        width: '20%', sortable: false, thClass: 'client-name', expand: true, tdClass: 'client-name' },
          { field: 'mobile_phone',                label: 'clients.mobile-phone',       width: '15%', sortable: false, thClass: 'mobile-phone' },
          { field: 'birthday',                    label: 'clients.birthday',           width: '10%', sortable: false, thClass: 'birthday' },
          { field: 'preferred_staff_name',        label: 'bookings.preferred-staff',   width: '15%', sortable: false, thClass: 'client-referral' },
          { field: 'recent_visit_date',           label: 'bookings.recent-visit-date', width: '15%', sortable: false, expand: false, thClass: 'recent-visit' },
          { field: 'notes',                       label: 'general.notes',              width: '20%', sortable: false, expand: true, thClass: 'notes' }
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true
        }
      },
      table_filter: {
        search_condition: options.clients_enums.client_search_condition_type.name_or_phone,
        search_keyword: '',
        search_in_branches: false,
        shop_id: 0,
        page_size: options.pagination.default,
        page_number: 1,
        page: CLIENTS_ENUMS.PAGE.ADD_BOOKING
      },
      client_search_condition_options: [
        { value: options.clients_enums.client_search_condition_type.name_or_phone,  text: 'environment-setup.client-name-or-mobile' },
        { value: options.clients_enums.client_search_condition_type.name_or_number, text: 'environment-setup.client-name-or-member-no' },
        { value: options.clients_enums.client_search_condition_type.notes,          text: 'environment-setup.notes' }
      ], 
      client_search_condition_option_note: {
        value: options.clients_enums.client_search_condition_type.notes,
        text: 'general.notes'
      },
      client_search_condition_placeholder: '',

      estimated_time_options: [],
      
      clients_setup: {},
      clients_cache: new ClientsCache()
    }
  },
  computed: {
    ...mapGetters('client', {
      x_clients: 'getClients'
    }),
  },
  async created(){
    this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
    if(this.isNullObject(this.clients_setup))
      this.showMissingClientsSetupAlert()
    else{
      this.share_client = this.shop_data.chain_sharing_settings.share_client
      this.chain_id = this.shop_data.chain_id
      this.shop_id= this.shop_data.shop_id
      if(this.is_client_search_condition_default){
        let result = await this.client_environment_setup_api.getClientEnvironmentSetupsAsync(this.shop_data.shop_id)
        if(result.is_ok){
          if(result.data.client_search_condition == options.clients_enums.client_search_condition_type.notes){
            this.table_filter.search_in_branches = false
            this.onSelectSearchAllBranches()
          }
          let tmp_client_search_condition = _.find(this.client_search_condition_options, { 'value': result.data.client_search_condition })
          this.onSelectClientSearchCondition(tmp_client_search_condition)
        }
        else {
          this.showAlert(result.error_messages)
        }
      }
    }
  },
  methods: {
    ...mapActions('client', [
      'getClientsDataAsync',
      'setClientActionDataAsync'
    ]),
    ...mapMutations('client', [
      'setBookingClient',
    ]),
    onSelectClientSearchCondition(condition){
      this.table_filter.search_condition = condition.value
      this.client_search_condition_placeholder = condition.text
    },
    onInputClientSearch(value){
      if(value.length == 0) this.onClearSearch()
    },
    onSelectSearchAllBranches(){
      if(this.table_filter.search_in_branches){
        this.client_search_condition_options = this.client_search_condition_options.filter(o => {
          return o.value != options.clients_enums.client_search_condition_type.notes
        })
        if(this.table_filter.search_condition == options.clients_enums.client_search_condition_type.notes){
          this.onSelectClientSearchCondition(this.client_search_condition_options[0])
        }
      }
      else {
        this.client_search_condition_options.push(this.client_search_condition_option_note)
        this.client_search_condition_options = _.uniqBy(this.client_search_condition_options, 'value')
      }
      this.onClickSearchButton()
    },
    async loadClients(){
      this.table_filter.shop_id = this.shop_data.shop_id
      this.preLoader()
      let result = await this.client_api.getClientsByValuesAsync(this.table_filter)
      this.preLoader(false)
      if(result.is_ok){
        for(let i in result.data.items){
          let client = result.data.items[i]
          let mobile_phone = ''
          let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, client.registration_date)

          if(!isHideClientInfo)
          {
            if(client.mobile_number != null) mobile_phone += client.mobile_number
            if(client.mobile_number2 != null && client.mobile_number2!='') mobile_phone += ', ' + client.mobile_number2
            if(client.phone_number != null && client.mobile_number2!='') mobile_phone += ' / ' + client.phone_number
            client.mobile_phone = mobile_phone
          }
          else{
            if(client.mobile_number != null) mobile_phone += hideMobilePhone(client.mobile_number)
            if(client.mobile_number2 != null && client.mobile_number2!='') mobile_phone += ', ' + hideMobilePhone(client.mobile_number2)
            if(client.phone_number != null && client.mobile_number2!='') mobile_phone += ' / ' + hideMobilePhone(client.phone_number)
            client.mobile_phone = mobile_phone
          }
          if(client.birth_year>0 || client.birth_month >0 || client.birth_dd >0)
          {
            let birthday = client.birth_year + '-' + client.birth_month + '-' + client.birth_dd
            client.birthday = moment(birthday, 'YYYY-MM-DD').format(options.standard_date_format.default)
          }
          if(client.recent_visit_date != 0){
            client.recent_visit_date = formatDate(moment(convertTimeStampToDate(client.recent_visit_date, true)))
          }
          if(client.recent_visit_date == 0){
            client.recent_visit_date = null
          }
        }
        this.table_data.rows = result.data.items
        this.table_data.pagination = result.data.pagination

        // processing clients result
        if(result.data.items.length == 1 && this.table_filter.page_number == 1){
          this.onSelectClient(result.data.items[0])
        }
        else {
          this.$emit('click-search-client')
          this.show_client_result = true
        }

        // reset booking_client from client vuex store after search client success
        this.setBookingClient(new ClientViewModel().fields)
      }
      else this.showAlert(result.error_messages)
    },
    async onClickSearchButton(){
      if(this.table_filter.search_keyword.length > 0){
        this.table_filter.page_number = 1
        await this.loadClients()
      }
    },
    onReloadPage(client){
      this.onSelectClient(client)
    },
    onSelectClient(client){
      this.$emit('select-client', client)
      this.onClearSearch()
    },
    onClearSearch(){
      this.$emit('clear-search-client')
      this.table_filter.search_keyword = ''
      this.show_client_result = false
      this.table_data.rows = []
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadClients()
    },
    onActionClient(action, client_id = 0){
      let client_action = {
        action: action,
        client_id: client_id,
        shop_id: this.shop_data.shop_id
      }
      this.setClientActionDataAsync(client_action).then(() => {
        this.showDialogById('action-client-modal')
      })
    }
  }
}
</script>

<style lang='scss'>
@import './client-search.scss';
</style>