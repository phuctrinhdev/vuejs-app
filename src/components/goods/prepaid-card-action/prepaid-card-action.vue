<template>
  <div>
    <b-modal id="action-prepaid-card-modal"
             ref="formModal"
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             class="action-prepaid-card-modal"
             @show="onLoadForm()">

      <!-- BEGIN CONTENT -->
      <form ref="form" class="form-wrapper">
        <b-tabs content-class="mt-3" class="box-tap">
          <div class="row form-group prepaid-card-type">
            <div class="col-12 col-sm-5">
              <label>{{ $t('prepaid-cards.prepaid-card-type') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <radio-group v-model="prepaid_card.fields.prepaid_card_type"
                           :options="prepaid_card_type_options" 
                           :disabled="!allow_edit"
                           @input="onChangePrepaidCardType"/>
            </div>
          </div>
          <div class="row form-group">
            <div class="col-12 col-sm-5">
              <label class="require">{{ $t('prepaid-cards.prepaid-card-name') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <b-form-input v-model="prepaid_card.fields.name" :disabled="!allow_edit" type="text" />
            </div>
          </div>
          <div class="row form-group">
            <div class="col-12 col-sm-5">
              <label class="require">{{ $t('prepaid-cards.sales-price') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <input-money v-model="prepaid_card.fields.price" :disabled="!allow_edit"/>
            </div>
          </div>

          <template v-if="prepaid_card.fields.prepaid_card_type == options.prepaid_card_type.deposit_card">
            <div class="row form-group">
              <div class="col-12 col-sm-5">
                <label class="require">{{ $t('prepaid-cards.charge-amount') }}</label>
              </div>
              <div class="col-12 col-sm-7">
                <input-money v-model="prepaid_card.fields.charge_amount" :disabled="!allow_edit"/>
              </div>
            </div>
          </template>

          <div class="row form-group salary-sales">
            <div class="col-12 col-sm-5">
              <label class="requir center">{{ $t('prepaid-cards.salary-sales') }}</label>
            </div>
            <div class="col-12 col-sm-7 row">
              <div class="col-8 col-sm-7">
                <input-money v-model="prepaid_card.fields.salary_sales_value" :disabled="!allow_edit"/>
              </div>
              <div class="col-12 col-sm-5 radio-group">
                <radio-group v-model="prepaid_card.fields.salary_sales_type" :options="options.option_salary_type" :buttons="true" 
                             :disabled="!allow_edit"/>
              </div>
            </div>
          </div>
          <div class="row form-group validity">
            <div class="col-12 col-sm-5">
              <label class="requir center require">{{ $t('prepaid-cards.validity') }}</label>
            </div>
            <div class="col-12 col-sm-7 row">
              <div class="col-8 col-sm-7">
                <input-money v-model="prepaid_card.fields.validity" :readonly="no_limit" :disabled="!allow_edit"/>
              </div>
              <div class="col-12 col-sm-5 radio-group">
                <radio-group v-model="prepaid_card.fields.validity_type" :options="options.option_validity_type" 
                             :disabled="no_limit || !allow_edit" :buttons="true"/>
              </div>
              <div class="col-12 col-sm-7">
                <b-form-checkbox v-model="no_limit" :disabled="!allow_edit" checked 
                                 @change="onCheckLimit">
                  {{ $t('prepaid-cards.no-limit') }}
                </b-form-checkbox>
              </div>
            </div>
          </div>
          <div class="row form-group discount">
            <div class="col-12 col-sm-12">
              <b-form-checkbox v-model="prepaid_card.fields.discount_for_client" 
                               :class="'icon-line'"
                               :disabled="prepaid_card.fields.prepaid_card_type == 
                               options.prepaid_card_type.discount_card || !allow_edit">
                {{ $t('prepaid-cards.discount-for-having-card') }}
              </b-form-checkbox>
            </div>
          </div>
          <div class="row form-group discount-for-services">
            <div class="col-12 col-sm-5">
              <label>{{ $t('prepaid-cards.discount-for-services') }}</label>
            </div>
            <div class="col-12 col-sm-7 row">
              <div class="col-8 col-sm-7">
                <b-form-input v-model="prepaid_card.fields.discount_for_service" :disabled="!prepaid_card.fields.discount_for_client || !allow_edit" type="text"/>
              </div>
              <div class="col-1 col-sm-1 padding-zero">
                %
              </div>
            </div>
          </div>
          <div class="row form-group discount-for-products">
            <div class="col-12 col-sm-5">
              <label>{{ $t('prepaid-cards.discount-for-products') }}</label>
            </div>
            <div class="col-12 col-sm-7 row">
              <div class="col-8 col-sm-7">
                <b-form-input v-model="prepaid_card.fields.discount_for_product" :disabled="!prepaid_card.fields.discount_for_client || !allow_edit" type="text"/>
              </div>
              <div class="col-1 col-sm-1 padding-zero">
                %
              </div>
            </div>
          </div>
          <div v-if="form_edit" class="row form-group">
            <div class="col-12 col-sm-5">
              <label>{{ $t('general.status') }}</label>
            </div>
            <div class="col-12 col-sm-7">
              <radio-group v-model="prepaid_card.fields.status" :options="options.option_goods_status" :buttons="true" 
                           :disabled="!allow_edit"/>
            </div>
          </div>
        </b-tabs>
      </form>
      <!-- END CONTENT -->

      <!-- BEGIN ERROR -->
      <error-box :errors="prepaid_card_errors"/>
      <!-- END ERROR -->

      <!-- BEGIN FOOTER -->
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
      <!-- END FOOTER -->

    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters }        from 'vuex'
import { options }           from '../../../helpers/options'
import PrepaidCardViewModel  from '../../../view-model/goods/prepaid-card-view-model.js'
import PrepaidCardApi        from '../../../api/goods/prepaid-card-api.js'
import component_base        from '../../../components/common/component-base/component-base'
import input_money           from '../../../components/common/form/input/input-money/input-money.vue'
import radio_group           from '../../../components/common/form/radio/radio-group/radio-group' 
import error_box             from '../../common/form/error-box/error-box' 
import btn_action_group      from '../../common/button/btn-action-group/btn-action-group'

export default {
  components: {
    'input-money': input_money,
    'radio-group': radio_group,
    'error-box'  : error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      options,
      prepaid_card: new PrepaidCardViewModel(),
      prepaid_card_errors: [],
      prepaid_card_type_options: [
        { text: 'prepaid-cards.deposit-card', value: options.prepaid_card_type.deposit_card },
        { text: 'prepaid-cards.discount-card', value: options.prepaid_card_type.discount_card }
      ],
      form_title  : '',
      form_options: { 
        delete : false,
        confirm: true 
      },
      form_edit   : false,
      no_limit    : false,
      allow_edit  : true
    }
  },
  computed: {
    ...mapGetters('prepaid_card', {
      action_data: 'getPrepaidCardAction'
    })
  },
  methods: {
    hideModal(){
      this.hideDialogById('action-prepaid-card-modal')
    },
    onCancel(){
      this.hideModal()
    },

    onLoadForm(){
      this.allow_edit = true
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('prepaid-cards.prepaid-card-add')
        this.form_edit  = false
        this.no_limit   = false
        this.prepaid_card = new PrepaidCardViewModel()
      }
      if(this.action_data.action == options.form_actions.edit){
        if(this.action_data.data.shared)
        {
          this.allow_edit = false
          this.form_options.confirm = false
        }    
        else  this.form_options.confirm = true
        
        this.form_title = this.$i18n.t('prepaid-cards.prepaid-card-edit')
        this.form_edit  = true
        this.prepaid_card.fields = Object.assign({}, this.action_data.data)
        if(this.prepaid_card.fields.validity == options.enum_no_limit) this.no_limit = true
        else this.no_limit = false
      }
      this.prepaid_card_errors = []
    },
    
    onCheckLimit(){
      if(this.no_limit == false) this.no_limit = true
      else this.no_limit = false
    },
    
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addPrepaidCardAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updatePrepaidCardAsync', 'update-page')
      }
    },
    onChangePrepaidCardType(value){
      this.prepaid_card_errors = []
      if(value == options.prepaid_card_type.discount_card){
        this.prepaid_card.fields.discount_for_client = true
        this.prepaid_card.fields.charge_amount = 0
      }
    },

    // add prepaid card
    async submitActionAsync(api_action, success_action){
      this.prepaid_card.fields = Object.assign(this.prepaid_card.fields, this.shop_data)
      let tmp_prepaid_card = _.cloneDeep(this.prepaid_card)

      if(tmp_prepaid_card.fields.prepaid_card_type == options.prepaid_card_type.discount_card){
        tmp_prepaid_card.fields.charge_amount = 0
      }

      if(this.no_limit == true){
        tmp_prepaid_card.fields.validity = options.enum_no_limit
      }

      if(tmp_prepaid_card.fields.discount_for_client){
        tmp_prepaid_card.fields.discount_for_service = Number(tmp_prepaid_card.fields.discount_for_service)
        tmp_prepaid_card.fields.discount_for_product = Number(tmp_prepaid_card.fields.discount_for_product)
      }
      else {
        tmp_prepaid_card.fields.discount_for_service = 0
        tmp_prepaid_card.fields.discount_for_product = 0
      }

      // validate
      this.prepaid_card_errors = tmp_prepaid_card.isValid()
      if(this.prepaid_card_errors.length == 0) {
        this.preLoader(true)
        let prepaid_card_api = new PrepaidCardApi()
        let result = await prepaid_card_api[api_action](tmp_prepaid_card.fields)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result, success_action)
        else this.prepaid_card_errors = result.error_messages
      }
    },

    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      }
      else {
        this.prepaid_card_errors = result.error_messages
      }
    }
  }
}
</script>

<style lang="scss">
@import './prepaid-card-action.scss';
</style>