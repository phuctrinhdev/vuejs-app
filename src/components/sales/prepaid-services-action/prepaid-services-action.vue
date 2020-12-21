<template>
  <div class="prepaid-services-action-wrapper">
    <b-modal id="prepaid-services-action-modal"
             :title="$t('sales-prepaid-service-tab.edit-prepaid-service')"
             :no-close-on-backdrop="true"
             hide-footer
             class="prepaid-services-action-modal"
             @show="onLoadForm()"
             @hide="onCancel()">    
      <div class="form-wrapper">
        <div class="update-type-wrapper">
          <radio-group v-model="prepaid_service_vd.updating_type" :options="update_type_options" :buttons="false"
                       @input="onChangeUpdatingType()"/>
        </div>

        <!-- REMAINING TAB-->
        <div v-if="prepaid_service_vd.updating_type == sales_options.prepaid_service_history_type_enum.quantity_edit" class="remaining-wrapper">
          <div class="form-group row current-remaining">
            <div class="col-12 col-sm-5">
              <label>{{ $t('sales-prepaid-service-tab.current-remaining') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <input v-model="prepaid_service_vd.current_remaining" type="text" name="current_remaining" 
                     disabled>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-12 col-sm-5">
              <label>{{ $t('sales-prepaid-service-tab.new-remaining') }}</label>
            </div>
            <div class="col-12 col-sm-7 new-remaining">
              <input v-model="prepaid_service_vd.new_remaining" :disabled="prepaid_service_vd.is_remaining_no_limit" type="text">
            </div>
          </div>
          <div class="form-group row">
            <div class="col-12 offset-sm-5 col-sm-7">
              <b-form-checkbox
                v-model="prepaid_service_vd.is_remaining_no_limit"
                class="no-limit">
                {{ $t('sales-prepaid-service-tab.no-limit') }}
              </b-form-checkbox>
            </div>
          </div>
        </div>

        <!-- EXPIRY DATE TAB -->
        <div v-if="prepaid_service_vd.updating_type == sales_options.prepaid_service_history_type_enum.expiry_date_edit" class="expiry-date">
          <div class="row form-group current-expiry-date">
            <div class="col-12 col-sm-5">
              <label>{{ $t('sales-prepaid-service-tab.current-expiry-date') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <input v-model="prepaid_service_vd.current_expiry" :disabled="true">
            </div>
          </div>
          <div class="row form-group">
            <div class="col-12 col-sm-5">
              <label>{{ $t('sales-prepaid-service-tab.new-expiry-date') }}</label>
            </div>
            <div class="col-12 col-sm-7 new-expiry-date">
              <template v-if="!prepaid_service_vd.is_expiry_date_no_limit">
                <v-date-picker
                  v-model="prepaid_service_vd.new_expiry"
                  :popover="{ placement: 'bottom' }"
                  :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                  :input-props="{ placeholder: '' }"
                  class="date-picker"/>
              </template>
              <template v-else>
                <input v-model="prepaid_service_vd.new_expiry"
                       disabled
                       name="new_expiry_date"
                       type="text">
              </template>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-12 offset-sm-5 col-sm-7">
              <b-form-checkbox
                v-model="prepaid_service_vd.is_expiry_date_no_limit">
                {{ $t('sales-prepaid-service-tab.no-limit') }}
              </b-form-checkbox>
            </div>
          </div>
        </div>
      </div>

      <!-- BEGIN ERROR -->
      <error-box :errors="errors"/>

      <!-- BEGIN FOOTER -->
      <footer class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </footer>

    </b-modal>
  </div>
</template>

<script>
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'
import PrepaidServicesActionViewData from './prepaid-services-action-view-data.js'
import PrepaidServicesAPI            from '../../../api/sales/prepaid-services-api'
import component_base                from '../../../components/common/component-base/component-base'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import { sales_options }             from '../../../helpers/options/sales-options'
import { mapGetters, mapMutations }  from 'vuex'
import { setupCalendar, DatePicker}  from 'v-calendar'
export default {
  components:{
    'radio-group'     : radio_group,
    'v-date-picker'   : DatePicker,
    'btn-action-group': btn_action_group,
    'error-box'       : error_box
  },
  extends : component_base,
  data(){
    return {
      sales_options,
      form_options                 : {
        delete: false
      },

      prepaid_services_api         : new PrepaidServicesAPI(),
      prepaid_service_vd           : {},
      errors                       : [],
      
    }
  },
  computed:{
    ...mapGetters('sales_prepaid_services',{
      x_prepaid_services_action : 'getPrepaidServicesAction',
      x_prepaid_services        : 'getPrepaidServices'
    }),
    ...mapGetters('client', {
      x_client_information: 'getClientInformation'
    }),
    ...mapGetters('user',{
      x_user_information : 'getUser'
    }),
    update_type_options(){
      let type_options = [
        { value : sales_options.prepaid_service_history_type_enum.quantity_edit ,   text : 'sales-prepaid-service-tab.remaining'},
        { value : sales_options.prepaid_service_history_type_enum.expiry_date_edit, text : 'sales-prepaid-service-tab.expiry-date'}
      ]
      return type_options
    },
    no_limit_text(){
      return this.$i18n.t('sales-prepaid-service-tab.no-limit')
    }
  },
  created(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
  },
  methods:{
    ...mapMutations('sales_prepaid_services',[
      'setPrepaidServices',
      'setPrepaidServicesAction',
      'updatePrepaidService'
    ]),
    hideModal(){
      this.hideDialogById('prepaid-services-action-modal')
    },
    onCancel(){
      this.hideModal()
      this.$parent.is_load = false
    },
    onLoadForm(){
      this.errors = []
      this.prepaid_service_vd = new PrepaidServicesActionViewData(this.x_prepaid_services_action)
    },

    async onConfirm(){
      this.errors = this.prepaid_service_vd.isValid()
      if(this.errors.length == 0){
        let model = this.prepaid_service_vd.mapToUpdatePrepaidServiceVm(this.shop_data,this.x_client_information.data,this.x_user_information)
        
        this.preLoader()
        let response = await this.prepaid_services_api.updatePrepaidServicesAsync(model)
        this.preLoader(false)

        if (response.is_ok){
          this.updatePrepaidService(response.data.getFields())
          this.$emit('reload-page')
          this.hideModal()
        }
        else{
          this.errors = response.error_messages
        }
      }
    },

    onChangeUpdatingType(){
      this.prepaid_service_vd.setDefaultValue(this.x_prepaid_services_action)
      this.errors = []
    }
  }
}
</script>

<style lang="scss">
@import './prepaid-services-action.scss';
</style>
