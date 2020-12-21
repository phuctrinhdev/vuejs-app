<template>
  <main class="app-content">
    <section class="loyalty-setup contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('loyalty-points-setup.loyalty-points-setup') }}</h3>
        </article>
        
        <div class="section-part sales-points"> 
          <div class="slide-x big large">
            <table class="normal">
              <thead>
                <tr>
                  <td colspan="5">{{ $t('loyalty-points-setup.sales-points') }}</td>
                </tr>
                <tr>
                  <td>{{ $t('loyalty-points-setup.apply') }}</td>
                  <td v-for="(setup, i) in loyalty_points_setups.fields.loyalty_points_setups" :key="i">
                    <div class="switch">
                      <b-form-checkbox v-model="setup.is_apply" switch>
                        <span v-if="setup.is_apply">{{ $t('general.on') }}</span>
                        <span v-else>{{ $t('general.off') }}</span>
                      </b-form-checkbox>
                    </div>
                  </td>
                </tr>
                <tr class="row-purple">
                  <td>{{ $t('loyalty-points-setup.payment-methods') }}</td>
                  <td v-for="(setup, i) in loyalty_points_setups.fields.loyalty_points_setups" :key="i">
                    <template v-if="setup.goods_type == options.sales_enum.goods_type.product">
                      {{ $t('loyalty-points-setup.products-sales-points') }}(%)
                    </template>
                    <template v-if="setup.goods_type == options.sales_enum.goods_type.service">
                      {{ $t('loyalty-points-setup.service-sales-points') }}(%)
                    </template>
                    <template v-if="setup.goods_type == options.sales_enum.goods_type.prepaid_service">
                      {{ $t('loyalty-points-setup.prepaid-service-sales-points') }}(%)
                    </template>
                    <template v-if="setup.goods_type == options.sales_enum.goods_type.prepaid_card">
                      {{ $t('loyalty-points-setup.prepaid-card-sales-points') }}(%)
                    </template>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(payment_method, i) in loyalty_points_setups.fields.payment_methods" :key="i">
                  <td>{{ payment_method.payment_method_name }}</td>
                  <td v-for="(percentage, j) in payment_method.percentages" :key="j" :class="{ disabled: !loyalty_points_setups.fields.loyalty_points_setups[j].is_apply }">
                    <!-- :decimal="1" -->
                    <input-money-by-blur v-model="payment_method.percentages[j]" 
                                         :decimal="1"
                                         :disabled="!loyalty_points_setups.fields.loyalty_points_setups[j].is_apply" 
                                         class="blind"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="buttonbox mt20">
            <button class="btn-default" @click="onSubmitLoyaltyPointsSetupsAsync">{{ $t('general.save') }}</button>
          </div>
        </div>
        
        <div class="section-part recommendation-points">
          <div class="slide-x small">
            <table class="normal">
              <thead>
                <tr>
                  <td colspan="2" class="recommendation-title">
                    <span>{{ $t('loyalty-points-setup.recommendation-points') }}</span>
                    <div class="switch">
                      <b-form-radio-group v-model="recomm_point.fields.status" buttons>
                        <b-form-radio :value="options.clients_enums.apply_recommendation_point_type.on">On</b-form-radio>
                        <b-form-radio :value="options.clients_enums.apply_recommendation_point_type.off">Off</b-form-radio>
                      </b-form-radio-group>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ $t('loyalty-points-setup.recommender') }}</td>
                  <td>
                    <input-money-by-blur v-model="recomm_point.fields.recommender" class="blind"/>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('loyalty-points-setup.recommended-client') }}</td>
                  <td>
                    <input-money-by-blur v-model="recomm_point.fields.recommended_client" class="blind"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="buttonbox mt20">
            <button class="btn-default" @click="saveRecommendatinPointSetupAsync">{{ $t('general.save') }}</button>
          </div>
        </div>
      </div>
    </section>
 
  </main>
</template>

<script>
import { options }   from '../../../helpers/options'
import SalesCache from '../../../helpers/cache/sales-cache'
import LoyaltyPointsSetupsApi            from '../../../api/sales/loyalty-points-setups-api'
import LoyaltyPointsSetupsViewData       from './loyalty-points-setups-view-data'
import RecommendationPointSetupApi       from '../../../api/clients/recommendation-point-setup-api'
import RecommendationPointSetupViewModel from '../../../view-model/sales/recommendation-point-setup-view-model'


import component_base    from '../../../components/common/component-base/component-base'
import radio_group       from '../../../components/common/form/radio/radio-group/radio-group' 
import input_money_by_blur from '../../../components/common/form/input/input-money/input-money-by-blur'

export default {
  components: {
    'radio-group': radio_group,
    'input-money-by-blur': input_money_by_blur
  },
  extends: component_base,
  data() {
    return {
      options,

      loyalty_points_setups_api: new LoyaltyPointsSetupsApi(),
      loyalty_points_setups: new LoyaltyPointsSetupsViewData(),

      recomm_point_api: new RecommendationPointSetupApi(),
      recomm_point: new RecommendationPointSetupViewModel(),
    }
  },
  async created() {
    await this.loadLoyaltyPointsSetupsAsync()
    await this.loadRecommendationTable()
  },
  methods: {
    // sales points
    async loadLoyaltyPointsSetupsAsync(){
      this.preLoader()
      let result = await this.loyalty_points_setups_api.getLoyaltyPointsSetupsAsync(this.shop_data.shop_id)
      this.preLoader(false)
      
      if(result.is_ok){
        this.loyalty_points_setups.setFields(result.data)
        this.loyalty_points_setups.updateViewDataFromModelData()
      }
      else this.showAlert(result.error_messages)
    },
    async onSubmitLoyaltyPointsSetupsAsync(){
      this.loyalty_points_setups.updateModelDataFromViewData()
      this.loyalty_points_setups.fields.shop_id = this.shop_data.shop_id

      this.preLoader()
      let result = await this.loyalty_points_setups_api.updateLoyaltyPointsSetupsAsync(this.loyalty_points_setups)
      this.preLoader(false)

      if(result.is_ok) {
        this.loyalty_points_setups.setFields(result.data)
        this.loyalty_points_setups.updateViewDataFromModelData()

        SalesCache.clearAllSalesSetupCache()
      }
      else {
        this.showAlert(result.error_messages)
      }
    },

    // recommendation points
    async loadRecommendationTable() {
      this.preLoader()
      let result = await this.recomm_point_api.getRecommendationPointSetupAsync(this.shop_data.shop_id) 
      this.preLoader(false)

      if(result.is_ok) {
        if(result.data == null){
          this.recomm_point.fields = new RecommendationPointSetupViewModel()
        }
        else {
          this.recomm_point.fields = Object.assign({}, result.data)
        }
      }
      else {
        this.showAlert(result.error_messages)
      }
    },
    async saveRecommendatinPointSetupAsync(){
      this.recomm_point.fields = Object.assign(this.recomm_point.fields, this.shop_data)

      // validate
      let recomm_point_errors = this.recomm_point.isValid() 
      if(recomm_point_errors.length != 0) {
        this.showAlert(recomm_point_errors)
        return
      }
      
      this.preLoader()
      let result = await this.recomm_point_api.addOrUpdateRecommendationPointSetupAsync(this.recomm_point)
      this.preLoader(false)
      
      if(result.is_ok) {
        this.recomm_point.setFields(result.data)
        // this.showConfirm([this.$i18n.t('loyalty-points-setup.saved-success')])
        
        SalesCache.clearAllSalesSetupCache()
      }
      else {
        this.showAlert(result.error_messages)
      }
    },
    showConfirm(alerts){
      this.showAlert(alerts, {title:this.$i18n.t('general.confirm'), cancel_title :this.$i18n.t('general.close')})
    },
  }
}
</script>
<style lang='scss'>
@import './loyalty-points-setup.scss';
</style>