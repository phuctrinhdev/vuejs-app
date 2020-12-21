<template>
  <b-modal 
    :id="modal_id"
    :class="modal_id"
    :title="form_title"
    :no-close-on-backdrop="true"
    hide-footer
    @show="onLoadForm()"
    @hide="onCancel()">
    <b-row class="form-group">
      <label class="col-3 col-form-label">{{ $t('clients.campaign-title') }}<em class="text-danger">*</em></label>
      <b-col cols="9">
        <b-form-input v-model="campaign.fields.campaign_title"/>
      </b-col>
    </b-row>
    <b-row class="form-group">
      <label class="col-3 col-form-label">{{ $t('clients.campaign-period') }}<em class="text-danger">*</em></label>
      <b-col cols="9">
        <input-date-range
          ref="input_date_range" 
          :label="false"
          class="select-date-range"/>
      </b-col>
    </b-row>
    <b-row class="form-group">
      <label class="col-3 col-form-label">{{ $t('general.description') }}</label>
      <b-col cols="9">
        <b-form-textarea
          v-model="campaign.fields.campaign_description"
          rows="4"
          max-rows="10"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <error-box :errors="campaign_errors"/>
      </b-col>
    </b-row>
    <div class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template>
<script>
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import input_date_range from '../../common/form/input/input-date-range/input-date-range.vue'
import component_base from '../../common/component-base/component-base'
import error_box from '../../common/form/error-box/error-box.vue'
import { mapGetters } from 'vuex'
import { options } from '../../../helpers/options'
import CampaignViewModel from '../../../view-model/campaigns/campaign-view-model'
import CampaignManagementApi from '../../../api/campaigns/campaign-management-api'

export default {
  components: {
    'btn-action-group': btn_action_group,
    'input-date-range': input_date_range,
    'error-box': error_box
  },
  extends: component_base,
  data(){
    return {
      options,
      modal_id: 'campaign-action-modal',
      form_options: {
        delete: false,
        confirm: true
      },
      campaign_errors: [],
      form_title: '',
      campaign: new CampaignViewModel()
    }
  },
  computed: {
    ...mapGetters('campaign',{
      action_data: 'getCampaignAction'
    })
  },
  methods: {
    hideModal() {
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      if(this.action_data.action == options.form_actions.add){
        this.form_title = this.$i18n.t('clients.add-campaign')
        this.form_options.delete = false
        this.campaign = new CampaignViewModel()
      }
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('clients.edit-campaign')
        this.form_options.delete = true
        this.campaign.fields = Object.assign({}, this.action_data.data)
      }
      this.campaign_errors = []
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addCampaignAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateCampaignAsync', 'update-page')
      }
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){
      this.campaign.fields = Object.assign(this.campaign.fields, this.shop_data)

      // validate
      this.campaign_errors = this.campaign.isValid() 
      if(this.campaign_errors.length == 0) {
        this.preLoader()
        let campaign_api = new CampaignManagementApi() 
        let result = await campaign_api[api_action](this.campaign.fields)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result, success_action)
        else this.campaign_errors = result.error_messages
      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else {
        this.campaign_errors = result.error_messages
      } 
    }
  }
}
</script>
<style lang="scss">
@import './campaign-action.scss'
</style>