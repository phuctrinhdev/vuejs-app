<template>
  <main class="app-content">
    <section class="contents-style common-style campaign-report-page">
      <div class="inner">
        <div class="setup-top clearfix">
          <h3>{{ $t('campaign-report.title') }}</h3>
          <ul class="btn-group clearfix flr">
            <li><a class="btn secondary">{{ $t('general.print') }}</a></li>
          </ul>
        </div>

        <b-container fluid class="campaign-report-page__section">
          <b-row>
            <b-col cols="12" lg="10">
              <div
                :class="[
                  'report-settings campaign-report-page__report-settings',
                  {'report-settings--block': is_view_report_camparison_analysis}
                ]"
              >
                <div class="report-settings__type">
                  <label>{{ $t('campaign-report.report-type') }}</label>
                  <b-form-select
                    v-model="selected_report_type"
                    :disabled="has_campaign_report"
                  >
                    <option
                      v-for="(report_type_option, index) in report_type_select"
                      :key="index"
                      :value="report_type_option.value"
                    >{{ report_type_option.text }}</option>
                  </b-form-select>
                </div>
                <div v-if="is_view_report_camparison_analysis" class="comparison-period report-settings__comparison-period">
                  <label>{{ $t('campaign-report.comparison-period') }}</label>
                  <input-date-range
                    v-if="!has_campaign_report"
                    ref="input_date_range"
                    :label="false"
                    @mounted="onMountedInputDateRange"
                    @input-to-date="setComparisonPeriodToDate"
                    @input-from-date="setComparisonPeriodFromDate"
                    @input-default-to-date="setEmptyInputDateRangeToDate"
                    @input-default-from-date="setEmptyInputDateRangeFromDate"
                  />
                  <p v-else><span>{{ formatDate(campaign_results.comparison_period_from) }}</span> ~ <span>{{ formatDate(campaign_results.comparison_period_to) }}</span></p>
                </div>
              </div>
            </b-col>
            <b-col cols="12" lg="2" class="campaign-report-page__action">
              <a v-if="has_campaign_report" class="btn secondary" @click="onClickDeleteReport">{{ $t('general.delete') }}</a>
              <a v-else class="btn secondary" @click="onClickCreateReport">{{ $t('campaign-report.create-report') }}</a>
            </b-col>
          </b-row>
        </b-container>

        <section class="campaign-report-page__section campaign-summary campaign-report-page__campaign-summary">
          <span class="campaign-summary__title">{{ x_campaign_action_data.campaign_title }}</span>
          <div class="campaign-summary__period">
            <label>{{ $t('campaign-report.period') }}:</label>
            <span>{{ formatDate(x_campaign_action_data.campaign_period_from) }}</span> ~ <span>{{ formatDate(x_campaign_action_data.campaign_period_to) }}</span>
            <b-dropdown>
              <b-row class="form-group">
                <b-col sm="4"><label>{{ $t('campaign-report.target-clients') }}</label></b-col>
                <b-col sm="8">{{ x_campaign_action_data.campaign_total_target_clients }}</b-col>
              </b-row>
              <b-row class="form-group">
                <b-col sm="4"><label>{{ $t('campaign-report.descriptions') }}</label></b-col>
                <b-col sm="8">
                  <textarea v-model="x_campaign_action_data.campaign_description" class="note noresize w100p" readonly />
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4"><label>{{ $t('campaign-report.messages') }}</label></b-col>
                <b-col sm="8">
                  <textarea v-model="x_campaign_action_data.campaign_sent_message" class="note noresize w100p" readonly />
                </b-col>
              </b-row>
            </b-dropdown>
          </div>
          <div class="results campaign-summary__results">
            <span class="results__title">{{ $t('campaign-report.campaign-results') }}</span>
            <template v-if="has_campaign_report">
              <campaign-report-basic v-if="is_view_report_basic" :data="campaign_results" />
              <campaign-report-clients-analysis v-if="is_view_report_client_analysis" :data="campaign_results" />
              <campaign-report-period-comparison-analysis v-if="is_view_report_camparison_analysis" :data="campaign_results" />
            </template>
            <p v-else class="results__empty">{{ $t('campaign-report.empty-results') }}</p>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script>
// Utils
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import { common_options } from '../../../helpers/options/common-options'
import CamapaignReportApi from '../../../api/campaigns/campaign-report-api'
import { campaigns_options } from '../../../helpers/options/campaigns-options'
import { formatDate, convertDateToTimeStamp, convertDateFromLocalToTimezone } from '../../../helpers/common'

// Components
import component_base from '../../../components/common/component-base/component-base'
import input_date_range from '../../../components/common/form/input/input-date-range/input-date-range'
import CampaignReportBaseViewModel from '../../../view-model/campaigns/campaign-report-base-view-model'
import campaign_report_basic from '../../../components/campaigns/campaign-report-basic/campaign-report-basic'
import campaign_report_clients_analysis from '../../../components/campaigns/campaign-report-clients-analysis/campaign-report-clients-analysis'
import campaign_report_period_comparison_analysis from '../../../components/campaigns/campaign-report-period-comparison-analysis/campaign-report-period-comparison-analysis'

export default {
  components: {
    'input-date-range': input_date_range,
    'campaign-report-basic': campaign_report_basic,
    'campaign-report-clients-analysis': campaign_report_clients_analysis,
    'campaign-report-period-comparison-analysis': campaign_report_period_comparison_analysis
  },
  extends: component_base,
  data() {
    return {
      campaigns_options,
      campaign_results: {},
      comparison_period: {
        to_date: {
          text: null,
          value: null,
        },
        from_date: {
          text: null,
          value: null,
        }
      },
      
      selected_report_type: campaigns_options.report_type.basic,
      camapaign_report_api: new CamapaignReportApi()
    }
  },
  computed: {
    ...mapGetters('campaign', {
      x_campaign_action: 'getCampaignAction'
    }),
    report_type_select() {
      return [
        { value: campaigns_options.report_type.basic, text: this.$t('campaign-report.report-basic') },
        { value: campaigns_options.report_type.client_analysis, text: this.$t('campaign-report.report-clients-analysis') },
        { value: campaigns_options.report_type.period_camparison_analysis, text: this.$t('campaign-report.report-period-comparison-analysis') },
      ]
    },
    x_campaign_action_data() {
      return this.x_campaign_action.data || {}
    },
    has_compaign(){
      return this.x_campaign_action_data && this.x_campaign_action_data.campaign_id > 0
    },
    has_campaign_report(){
      return this.x_campaign_action_data && this.x_campaign_action_data.campaign_report_id > 0
    },
    can_view_campaign_report(){
      return this.x_campaign_action_data
          && this.x_campaign_action.action == common_options.form_actions.view
    },
    is_view_report_basic(){
      return this.can_view_campaign_report
          && this.selected_report_type == campaigns_options.report_type.basic
    },
    is_view_report_client_analysis(){
      return this.can_view_campaign_report
          && this.selected_report_type == campaigns_options.report_type.client_analysis
    },
    is_view_report_camparison_analysis(){
      return this.can_view_campaign_report
          && this.selected_report_type == campaigns_options.report_type.period_camparison_analysis
    },
    comparison_period_empty(){
      return this.$t('campaign-report.comparison-period-empty')
    },
    comparison_period_invalid(){
      return this.$t('campaign-report.comparison-period-invalid')
    } 
  },
  created() {
    // init example data (fake action click view report from campaign management)
    let tmp_campaign_action = {
      action: common_options.form_actions.view,
      data: {
        campaign_id: 1,
        campaign_title: 'Summer vacation 30% discounts promotion',
        campaign_period_to: '2020-10-15T06:22:58.4559329',
        campaign_period_from: '2020-09-15T03:14:45.1745295',
        campaign_description: 'This is a first campaign to Dormant clients... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, perspiciatis, quae, dignissimos, necessitatibus consequatur incidunt ab laboriosam commodi culpa sint nobis eaque fugit tempore esse cupiditate ipsam temporibus voluptate at.',
        campaign_sent_message: 'Hi Everyone. This is my shop... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, perspiciatis, quae, dignissimos, necessitatibus consequatur incidunt ab laboriosam commodi culpa sint nobis eaque fugit tempore esse cupiditate ipsam temporibus voluptate at.',
        campaign_report_id: 0,
        campaign_total_target_clients: 300
      }
    }
    this.setCampaignAction(tmp_campaign_action)

    if (!this.can_view_campaign_report) {
      this.$router.push('/campaign-management')
    } else if (this.has_campaign_report) {
      this.getCampaignReportAsync()
    }
  },
  methods: {
    formatDate,
    ...mapMutations('campaign', [
      'setCampaignAction'
    ]),

    // report setting
    onMountedInputDateRange() {
      // set init input date range
      let to_date_ts = null
      let to_date_zone = null
      let from_date_ts = null
      let from_date_zone = null

      if (this.has_campaign_report) {
        to_date_zone = convertDateFromLocalToTimezone(this.x_campaign_action_data.period_to)
        to_date_ts = convertDateToTimeStamp(to_date_zone)
        from_date_zone = convertDateFromLocalToTimezone(this.x_campaign_action_data.period_from)
        from_date_ts = convertDateToTimeStamp(from_date_zone)
      }

      this.setInputDateRangeValue({
        to_date: {
          text: to_date_zone,
          value: to_date_ts
        },
        from_date: {
          text: from_date_zone,
          value: from_date_ts
        }
      })
    },
    setComparisonPeriodToDate(date_range) {
      this.setInputDateRangeValue({
        ...this.comparison_period,
        to_date: date_range.value.to_date
      })
    },
    setComparisonPeriodFromDate(date_range) {
      this.setInputDateRangeValue({
        ...this.comparison_period,
        from_date: date_range.value.from_date
      })
    },
    setEmptyInputDateRangeToDate() {
      this.setInputDateRangeValue({
        ...this.comparison_period,
        to_date: {
          text: null,
          value: null,
        }
      })
    },
    setEmptyInputDateRangeFromDate() {
      this.setInputDateRangeValue({
        ...this.comparison_period,
        from_date: {
          text: null,
          value: null,
        }
      })
    },
    setInputDateRangeValue(next_value) {
      this.comparison_period = next_value
      const input_date_range_result = this.$refs.input_date_range && this.$refs.input_date_range.result
      if (input_date_range_result) {
        input_date_range_result.value = cloneDeep(this.comparison_period)
      }
    },

    // view
    async getCampaignReportAsync() {
      this.preLoader()
      const response = await this.camapaign_report_api.getCampaignReportAsync({ id: this.x_campaign_action_data.campaign_report_id, fake_type: 1 })
      this.preLoader(false)

      if(response.is_ok){
        this.selected_report_type = response.data.report_type
        this.campaign_results = response.data
      }
      else{
        this.showAlert(response.error_messages)
      }
    },

    // create
    onClickCreateReport() {
      if (this.isValidCampaignReportSetting()) {
        this.createCampaignReportAsync()
      }
    },
    isValidCampaignReportSetting() {
      let is_valid = true
      
      if(this.is_view_report_camparison_analysis){
        // check existing
        const input_date_range_result = this.$refs.input_date_range && this.$refs.input_date_range.result
        const to_date_value = input_date_range_result.value.to_date && input_date_range_result.value.to_date.value
        const from_date_value = input_date_range_result.value.from_date && input_date_range_result.value.from_date.value

        // rules
        const is_empty_error = !to_date_value || !from_date_value
        const is_invalid_date_range = moment(to_date_value).isBefore(moment(from_date_value))

        if (is_empty_error) {
          this.showAlert([this.comparison_period_empty])
          return
        }
        if (is_invalid_date_range) {
          this.showAlert([this.comparison_period_invalid])
          return
        }
      }
      return is_valid
    },
    async createCampaignReportAsync() {
      this.preLoader()
      const send_data = new CampaignReportBaseViewModel().fields
      send_data.campaign_id = this.x_campaign_action_data.campaign_id
      send_data.report_type = this.selected_report_type
      const response = await this.camapaign_report_api.createCampaignReportAsync(send_data)
      this.preLoader(false)

      if (response.is_ok) {
        this.selected_report_type = response.data.report_type
        this.campaign_results = response.data

        const tmp_campaign_action = {
          ...this.x_campaign_action,
          data: {
            ...this.x_campaign_action_data,
            campaign_report_id: response.data.report_id
          }
        }
        this.setCampaignAction(tmp_campaign_action)
      }
      else{
        this.showAlert(response.error_messages)
      }
    },

    // delete
    async onClickDeleteReport() {
      this.preLoader()
      const send_data = new CampaignReportBaseViewModel().fields
      send_data.campaign_id = this.x_campaign_action_data.campaign_id
      send_data.report_type = this.selected_report_type
      const response = await this.camapaign_report_api.deleteCampaignReportAsync(send_data)
      this.preLoader(false)

      if (response.is_ok) {
        this.campaign_results = {}

        const tmp_campaign_action = {
          ...this.x_campaign_action,
          data: {
            ...this.x_campaign_action_data,
            campaign_report_id: null
          }
        }
        this.setCampaignAction(tmp_campaign_action)
      }
      else{
        this.showAlert(response.error_messages)
      }
    }
  },
}
</script>

<style lang="scss">
@import './campaign-report.scss';
</style>
