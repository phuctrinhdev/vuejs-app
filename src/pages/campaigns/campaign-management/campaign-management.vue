<template>
  <main class="app-content">
    <section class="contents-style common-style campaign-management">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('menu.campaign-management') }}</h3>
        </article>
        <div class="section-part">
          <!-- table data -->
          <b-row>
            <div class="mb-2 col-12">
              <span class="float-left">
                {{ $t('clients.all-campaign').replace('{0}', table_data.pagination.total_items) }}
              </span>
              <b-button class="float-right" @click="onActionCampaign(options.form_actions.add)">
                {{ $t('clients.add-campaign') }}
              </b-button>
            </div>
            <div class="col-12 table table-data form-wrapper">
              <view-table :data="table_data" @change-page="onChangePage">
                <template slot="campaign_period" slot-scope="{ row }">
                  {{ row.campaign_period_from }} ~ {{ row.campaign_period_to }}
                </template>
                <template slot="campaign_total_target_clients" slot-scope="{ row }">
                  <template v-if="!is_campaign_sent_message(row)">
                    <b-button class="btn-add-campaign" @click="onClickAddTargetClients(row)">{{ $t('general.add') }}</b-button>
                  </template>
                  <template v-else>
                    <div @click="onClickViewTargetClients(row)">
                      <p>{{ row.campaign_total_target_clients }}</p>
                      <span>{{ row.campaign_sent_message_date }}</span>
                    </div>
                  </template>
                </template>
                <template slot="edit" slot-scope="{ row }">
                  <b-button class="btn-edit-campaign" @click="onActionCampaign(options.form_actions.edit, row)">{{ $t('general.edit') }}</b-button>
                </template>
                <template slot="report" slot-scope="{ row }">
                  <template v-if="row.campaign_total_target_clients != 0 && row.campaign_sent_message_date != 0">
                    <b-button class="btn-view-report" @click="onViewReport">{{ $t('general.view') }}</b-button>
                  </template>
                </template>
              </view-table>
            </div>
          </b-row>
        </div>
        <div class="section-part">
          {{ $t('clients.target-clients-lists-are-kept-for-6-months') }}
        </div>
      </div>
    </section>

    <campaign-action @reload-page="onReloadPage" @update-page="onUpdatePage"/>

    <!-- Client management modal -->
    <b-modal 
      id="client-management-modal" 
      :title="$t('menu.client-management')"
      :no-close-on-backdrop="true"
      hide-footer
      class="client-management-modal">
      <client-management :campaign_type="campaign_type" :campaign="campaign"/>
    </b-modal>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import component_base from '../../../components/common/component-base/component-base.vue'
import view_table from '../../../components/common/view-table/view-table'
import client_management from '../../clients/client-management/client-management.vue'
import campaign_action from '../../../components/campaigns/campaign-management/campaign-action'
import { options } from '../../../helpers/options'
import CampaignViewModel from '../../../view-model/campaigns/campaign-view-model'

export default {
  components: {
    'view-table': view_table,
    'client-management': client_management,
    'campaign-action': campaign_action
  },
  extends: component_base,
  data(){
    return {
      options,
      table_data: {
        fields: [
          { field: 'campaign_title', label: 'boards.title', sortable: false },
          { field: 'campaign_period', label: 'clients.period', sortable: false, expand: true },
          { field: 'campaign_total_target_clients', label: this.number_of_target_clients_messaging_date_time, sortable: false, expand: true },
          { field: 'edit', label: 'general.edit', sortable: false, expand: true },
          { field: 'report', label: 'report.report', sortable: false, expand: true }
        ],
        rows:[],
        groups: [
          { name: 'shared', rows: [] },
          { name: 'unshared', rows: [] }
        ],
        pagination:{
          total_pages: 1,
          total_items: 1
        },
        options: {
          pagination: true
        },
      },
      form_options: {
        delete: true
      },
      campaign_type: options.campaign_management.campaign_type.add, 
      campaign: new CampaignViewModel(),
      page_number: 1,
    }
  },
  computed: {
    ...mapGetters('campaign', {
      campaigns_data: 'getCampaigns'
    }),
    number_of_target_clients_messaging_date_time(){
      return this.$t('clients.number-of-target-clients') + ' / ' + this.$t('clients.messaging-date-time')
    }
  },
  mounted(){
    this.loadTableData()
  },
  methods: {
    ...mapActions('campaign', [
      'getCampaignsDataAsync',
      'setCampaignActionData'
    ]),
    async loadTableData() {
      this.preLoader()
      await this.getCampaignsDataAsync()

      if(this.campaigns_data.is_ok){
        this.table_data.rows = this.campaigns_data.data.items
        this.table_data.pagination = this.campaigns_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(this.campaigns_data.error_messages)

      this.preLoader(false)
    },
    // modal action
    onActionCampaign(action, campaign = {}){
      this.campaign_action = {
        action: action,
        data: campaign
      }
      this.setCampaignActionData(this.campaign_action)
      this.showDialogById('campaign-action-modal')
    },
    onClickAddTargetClients(campaign){
      this.campaign = campaign
      this.campaign_type = options.campaign_management.campaign_type.add
      this.showDialogById('client-management-modal')
    },
    onClickViewTargetClients(campaign){
      this.campaign = campaign
      this.campaign_type = options.campaign_management.campaign_type.view_target_clients
      this.showDialogById('client-management-modal')
    },
    onViewReport(){
      this.$router.push('campaign-report')
    },
    onChangePage(page_num){
      this.page_number = page_num
      this.loadTableData()
    },
    is_campaign_sent_message(row){
      if(row.campaign_total_target_clients == 0 && row.campaign_sent_message_date == 0) return false
      return true
    },
    // event success
    onReloadPage(){
      this.loadTableData()
    },
    onUpdatePage(campaign){
      if(this.campaign_action.data.status != campaign.status) this.loadTableData()
      else this.updateProductCategoriesData(campaign)
    },
  }
}
</script>

<style lang="scss">
@import './campaign-management.scss'
</style>