<template>
  <div>
    <b-modal id="check-duplication-modal" 
             :title="$t('duplicated-clients.title')"
             :no-close-on-backdrop="true"
             hide-footer
             size="md"
             class="check-duplication-modal" 
             @show="onLoadForm()" >
      <div class="common-style">
        <p class="color-red">
          * {{ $t('duplicated-clients.all').replace('{0}', table_data.total_count) }}
        </p>
        <div class="slide-y">
          <clients-table :data="table_data">
            <template slot="mobile_number" slot-scope="{ row }">
              {{ formatHideInfoCol(row.mobile_number, row.registration_date) }}
            </template>
            <template slot="phone_number" slot-scope="{ row }">
              {{ formatHideInfoCol(row.phone_number, row.registration_date) }}
            </template>
            <template slot="registration_date" slot-scope="{ row, props }">
              {{ props.formattedRow.registration_date }}
            </template>
          </clients-table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="onCancel()">{{ $t('general.cancel') }}</button> 
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import clients_table from '../../../../components/clients/clients-table/clients-table.vue'
import component_base    from '../../../../components/common/component-base/component-base'
import { formatDate, getHideClientInfoPermission, hideMobilePhone } from '../../../../helpers/common' 
import { options } from '../../../../helpers/options'
import ClientApi from '../../../../api/clients/client-api.js'
import ClientsCache                     from '../../../../helpers/cache/clients-cache'
import _ from 'lodash'

export default {
  components: {
    'clients-table': clients_table,
  },
  extends: component_base,
  props: {
    search_value: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      table_data: {
        fields: [
          { field: 'client_name',       label: 'clients.client-name',     width: '25%', sortable: false },
          { field: 'mobile_number',     label: 'clients.mobile-number',   width: '25%', sortable: false, expand: true },
          { field: 'phone_number',      label: 'clients.phone-number',    width: '25%', sortable: false, expand: true },
          { field: 'registration_date', label: 'general.registered-date', width: '25%', sortable: false, expand: true, formatFn: this.formatDateCol }
        ],
        rows:[],
        options: {
          drag: false,
          pagination: false
        },
        total_count: 0
      },
      table_filter: {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0
      },
      clients_data: {},
      clients_setup: {},
      clients_cache: new ClientsCache()
    }
  },
  async created(){
    this.initClientSetup()
  },
  mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
  }, 
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    async initClientSetup(){
      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup))
        this.showMissingClientsSetupAlert()
    },
    onCancel(){
      this.hideModal()
    }, 
    hideModal(){
      this.hideDialogById('check-duplication-modal')
    },
    async onLoadForm(){
      this.preLoader()
      let client_api = new ClientApi()
      let result = await client_api.getDuplicatedClientsByValueAsync(Object.assign(this.table_filter, this.search_value))
      this.clients_data = Object.assign({}, result)

      if(this.clients_data.is_ok){
        this.table_data.rows = this.clients_data.data.items
        this.table_data.total_count = this.clients_data.data.pagination.total_items
      }
      else this.showAlert(this.clients_data.error_messages)

      this.preLoader(false)
    },
    formatDateCol(date){
      return formatDate(date)
    },
    formatHideInfoCol(mobile, registration_date){
      if(!_.isEmpty(this.clients_setup))
      {
        let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, registration_date)
        if(isHideClientInfo) mobile= hideMobilePhone(mobile)
      }
      return mobile
    }
  }
}
</script>
<style lang="scss">
@import '../client-action.scss';
</style>