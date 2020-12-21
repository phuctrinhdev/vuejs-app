<template>
  <div class="sales-prepaid-card-action-wrapper">
    <b-modal id="sales-prepaid-card-action-modal"
             :title="$t('sales-prepaid-card-tab.edit-prepaid-card')"
             :no-close-on-backdrop="true"
             hide-footer
             class="sales-prepaid-card-action-modal"
             @show="onLoadForm()"
             @hide="onCancel()">

      <!-- BEGIN CONTENT -->
      <div class="form-wrapper">
        <div class="update-type-wrapper">
          <b-form-group label="Radios using options">
            <b-form-radio-group v-model="prepaid_card_vd.updating_type"
                                :options="update_type_options"
                                :buttons="false"
                                @input="onChangeUpdatingType()"/>
          </b-form-group>

        </div>
        <!-- BEGIN BALANCE TAB -->
        <div v-if="prepaid_card_vd.updating_type == sales_options.prepaid_card_history_type_enum.balance_edited">
          <div class="row form-group">
            <div class="col-12 col-sm-5">
              <label>{{ $t('sales-prepaid-card-tab.current-balance') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <input v-model="prepaid_card_vd.current_balance" :disabled="true" type="text">
            </div>
          </div>
          <div class="row form-group">
            <div class="col-12 col-sm-5">
              <label>{{ $t('sales-prepaid-card-tab.new-balance') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <input v-model="prepaid_card_vd.new_balance" type="text">
            </div>
          </div>
        </div>
        <!-- END BALANCE TAB -->

        <!-- BEGIN EXPIRY DATE TAB -->
        <div v-if="prepaid_card_vd.updating_type == sales_options.prepaid_card_history_type_enum.expiry_date_edited">
          <div class="row form-group">
            <div class="col-12 col-sm-5">
              <label>{{ $t('sales-prepaid-card-tab.current-expiry-date') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <input v-model="prepaid_card_vd.current_expiry" disabled class="current-expiry-date">
            </div>
          </div>
          <div class="row form-group">
            <div class="col-12 col-sm-5">
              <label>{{ $t('sales-prepaid-card-tab.new-expiry-date') }}</label>
            </div>
            <div class="col-12 col-sm-7 new-expiry-date">
              <template v-if="!prepaid_card_vd.is_no_limit">
                <v-date-picker v-model="prepaid_card_vd.new_expiry"
                               :popover="{ placement: 'bottom' }"
                               :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                               :input-props="{ placeholder: '' }"/>
              </template>
              <template v-else>
                <input v-model="prepaid_card_vd.new_expiry" type="text">
              </template>
              <div v-if="prepaid_card_vd.is_no_limit" class="view-only"/>
            </div>
          </div>
          <div class="row form-group">
            <div class="col-12 offset-sm-5 col-sm-7">
              <b-form-checkbox v-model="prepaid_card_vd.is_no_limit">
                {{ $t('sales-prepaid-card-tab.no-limit') }}
              </b-form-checkbox>
            </div>
          </div>
        </div>
        <!-- END EXPIRY DATE TAB -->
      </div>
      <!-- END CONTENT -->

      <!-- BEGIN ERROR -->
      <error-box :errors="errors"/>
      <!-- END ERROR -->

      <!-- BEGIN FOOTER -->
      <footer class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </footer>
      <!-- END FOOTER -->

    </b-modal>
  </div>
</template>

<script>
const EDITED_PREPAID_CARD_EVENT_NAME = 'edited-prepaid-card'

import PrepaidCardActionViewData     from './sales-prepaid-card-action-view-data.js'
import PrepaidCardsAPI               from '../../../api/sales/prepaid-cards-api'
import component_base                from '../../../components/common/component-base/component-base'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'
import { sales_options }             from '../../../helpers/options/sales-options'
import { mapGetters, mapActions }    from 'vuex'
import { setupCalendar, DatePicker}  from 'v-calendar'
import { options }                   from '../../../helpers/options.js'

export default {
  components: {
    'radio-group'     : radio_group,
    'v-date-picker'   : DatePicker,
    'error-box'       : error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      sales_options,
      prepaid_cards_api   : {},
      form_options        : {},
      prepaid_card_vd     : {},
      errors              : []
    }
  },
  computed:{
    ...mapGetters('sales_prepaid_card', {
      x_prepaid_card_action: 'getSalesPrepaidCardAction'
    }),
    ...mapGetters('client', {
      x_client_information: 'getClientInformation'
    }),
    ...mapGetters('user',{
      x_user_information : 'getUser'
    }),
    update_type_options(){
      let type_options = [
        { value    : sales_options.prepaid_card_history_type_enum.balance_edited,
          text     : this.$i18n.t('sales-prepaid-card-tab.balance'),
          disabled : this.x_prepaid_card_action.data.prepaid_card_type ==
          options.prepaid_card_type.discount_card
        },
        {
          value    : sales_options.prepaid_card_history_type_enum.expiry_date_edited,
          text     : this.$i18n.t('sales-prepaid-card-tab.expiry-date'),
          disabled : false
        }
      ]
      return type_options
    }
  },
  created(){
    this.prepaid_card_history_type = sales_options.prepaid_card_history_type_enum.balance_edited
    this.prepaid_cards_api = new PrepaidCardsAPI()
    this.form_options      = { delete: false }

    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
  },
  methods: {
    ...mapActions('sales_prepaid_card',[
      'updateSalesPrepaidCardData'
    ]),

    onLoadForm(){
      this.errors = []
      this.prepaid_card_vd = new PrepaidCardActionViewData(this.x_prepaid_card_action)
    },
    async onConfirm() {
      this.errors = this.prepaid_card_vd.isValid()
      if(this.errors.length == 0){
        let update_prepaid_card_vm = this.prepaid_card_vd.mapToUpdatePrepaidCardViewModel(this.shop_data,this.x_client_information.data,this.x_user_information)
        this.preLoader()
        let response = await this.prepaid_cards_api.updatePrepaidCardAsync(update_prepaid_card_vm)
        this.preLoader(false)
        if (response.is_ok){
          this.updateSalesPrepaidCardData(response.data.getFields())
          this.$emit(EDITED_PREPAID_CARD_EVENT_NAME)
          this.hideModal()
        }else{
          this.errors = response.error_messages
        }
      }
    },

    onChangeUpdatingType(){
      this.prepaid_card_vd.setDefaultValue(this.x_prepaid_card_action)
      this.errors = []
    },

    hideModal(){
      this.hideDialogById('sales-prepaid-card-action-modal')
    },
    onCancel(){
      this.hideModal()
    }
  }
}
</script>

<style lang="scss">
@import './sales-prepaid-card-action.scss';
</style>
