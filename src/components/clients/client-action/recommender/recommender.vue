<template>
  <div>
    <b-modal id="search-recommender-modal" 
             :title="$t('recommender.title')"
             :no-close-on-backdrop="true"
             hide-footer
             size="md"
             class="search-recommender-modal" 
             @show="onLoadForm()"
             @hidden="hideModal()">
      <div class="common-style">
        <div class="top-search-box mb10">
          <input v-model="search_keyword"
                 type="text" class="w80p" maxlength="50"
                 @keyup.enter="onSearch">  
          <button class="btn secondary mobile-respon" @click="onSearch">{{ $t('general.search') }}</button>
        </div>
        <div class="text-box mb5 clearfix">
          <span class="fll">{{ $t('clients.all').replace('{0}', table_data.total_count) }}</span>
          <span class="flr color-red">{{ $t('recommender.guide') }}</span>
        </div>
        <div class="slide-x small">
          <clients-table :data="table_data" @change-page="onChangePage" @click-rows="onClickRows"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="onCancel()">{{ $t('general.cancel') }}</button> 
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import clients_table from '../../../../components/clients/clients-table/clients-table.vue'
import component_base    from '../../../../components/common/component-base/component-base'
import { CLIENTS_ENUMS } from '../../../../config/constant'
import ClientApi from '../../../../api/clients/client-api'
import { formatDate, convertDateFromUtcToTimezone } from '../../../../helpers/common'

export default {
  components: {
    'clients-table': clients_table
  },
  extends: component_base,
  props: {
    client_id: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      table_data: {
        fields: [
          { field: 'client_name',       label: 'clients.client-name',     width: '25%', sortable: false },
          { field: 'mobile_number',     label: 'clients.mobile-number',   width: '25%', sortable: false },
          { field: 'phone_number',      label: 'clients.phone-number',    width: '25%', sortable: false },
          { field: 'registration_date', label: 'general.registered-date', width: '25%', sortable: false, formatFn: this.formatDateCol }
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: true
        },
        total_count: 0,
        user_id: 0 // todo
      },
      table_filter: {
        search_condition: CLIENTS_ENUMS.CLIENT_SEARCH_TYPE.NAME_MOBILE_PHONE,
        search_keyword: '',
        search_in_branches: false,
        shop_id: 0,
        page_size: 5,
        page_number: 1,
        page: CLIENTS_ENUMS.PAGE.RECOMMEND_CLIENTS
      },
      search_keyword: '',
      client_api: {},
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
  },
  mounted(){
    this.client_api = new ClientApi()
    this.table_filter.shop_id = this.shop_data.shop_id
  }, 
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    onCancel(){
      this.hideModal()
    }, 
    hideModal(){
      this.table_filter.search_keyword = ''
      this.table_filter.page_number = 1
      this.hideDialogById('search-recommender-modal')
    },
    onLoadForm(){
      this.search_keyword = ''
      this.preLoader()
      this.loadTableData()
      this.preLoader(false)
    },
    async loadTableData(){
      let result = await this.client_api.getClientsByValuesAsync(this.table_filter)
      if(result.is_ok){
        if(result.data.items.find(x => x.id == this.client_id))
          result.data.items[(result.data.items.map(x => x.id).indexOf(this.client_id))].client_name += this.$i18n.t('recommender.me')
        this.table_data.rows = result.data.items
        this.table_data.pagination = result.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
        this.table_data.total_count = this.table_data.pagination.total_items
        this.table_data.user_id = this.client_id
      }
      else this.showAlert(result.error_messages)
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },
    onClickRows(rows) {
      this.$emit('add-recommender', rows )
      this.hideModal()
    },
    onSearch(){
      this.table_filter.search_keyword = this.search_keyword
      this.onChangePage(1)
    },
    formatDateCol(date){
      return formatDate(convertDateFromUtcToTimezone(date, this.shop_data.timezone), this.shop_data.format_date)  
    },
  }
}
</script>