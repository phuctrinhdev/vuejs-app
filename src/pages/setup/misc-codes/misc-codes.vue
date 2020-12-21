<template>
  <main class="app-content">    
    <section class="misc-codes contents-style common-style">
      <div class="inner"> 
        <article class="setup-top clearfix">
          <h3>{{ $t('misc-codes.misc-code-setting') }}</h3> 
        </article>
        <div class="misc-codes-wrapper">
          <div class="part-title">
            <b-badge pill variant="info">{{ $t('misc-codes.codes') }}</b-badge>
          </div>
          <div>
            <b-card no-body>
              <b-tabs pills card vertical>
                <b-tab :title="$t('misc-codes.payment-method')" active
                       @click="onViewTabContent(options.misc_code.payment_method)">
                  <b-card-text>
                    <payment-method v-if="is_selected_payment_method"/>
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('misc-codes.sales-type')"
                       @click="onViewTabContent(options.misc_code.sales_type)">
                  <b-card-text>
                    <sales-type v-if="is_selected_sales_type"/>
                  </b-card-text>
                </b-tab>

                <b-tab :title="$t('misc-codes.discount-category')"
                       @click="onViewTabContent(options.misc_code.discount_category)">
                  <b-card-text>
                    <discount-category v-if="is_selected_discount_category"/>
                  </b-card-text>
                </b-tab>

                <b-tab :title="$t('misc-codes.client-group')" 
                       @click="onViewTabContent(options.misc_code.client_group)">
                  <b-card-text>
                    <client-group v-if="is_selected_client_group"/>
                  </b-card-text>
                </b-tab>

                <b-tab :title="$t('misc-codes.client-rating')" 
                       @click="onViewTabContent(options.misc_code.client_rating)">
                  <b-card-text>
                    <client-rating v-if="is_selected_client_rating"/>
                  </b-card-text>
                </b-tab> 

                <b-tab :title="$t('misc-codes.client-referralsource')" 
                       @click="onViewTabContent(options.misc_code.client_referral_source)">
                  <b-card-text>
                    <client-referralsource v-if="is_selected_client_referral_source"/>
                  </b-card-text>
                </b-tab> 

              </b-tabs>
            </b-card>
          </div>
        </div> 
      </div>
    </section>
  </main>
</template>

<script>
import { options }            from '../../../helpers/options'
import payment_method         from '../../../components/setup/misc-codes/payment-method/payment-method'
import sales_type             from '../../../components/setup/misc-codes/sales-type/sales-type'
import discount_category      from '../../../components/setup/misc-codes/discount-category/discount-category.vue'
import client_group           from '../../../components/setup/misc-codes/client-group/client-group.vue' 
import client_referralsource  from '../../../components/setup/misc-codes/client-referralsource/client-referralsource.vue' 
import client_rating          from '../../../components/setup/misc-codes/client-rating/client-rating.vue' 
import component_base         from '../../../components/common/component-base/component-base'
import show_inactives         from '../../../components/common/show-inactives/show-inactives.vue'


export default {
  components: {
    'sales-type': sales_type,
    'payment-method': payment_method,
    'discount-category': discount_category,
    'client-group': client_group,
    'client-referralsource': client_referralsource,
    'client-rating': client_rating,
    'show-inactives': show_inactives
  },
  extends: component_base,
  data() {
    return {
      options,

      is_selected_payment_method: true,
      is_selected_sales_type: false,
      is_selected_discount_category: false,
      is_selected_client_group: false,
      is_selected_client_rating: false,
      is_selected_client_referral_source: false
    }
  },
  methods: {
    async onViewTabContent(tab_content) {
      this.is_selected_payment_method         = false
      this.is_selected_sales_type             = false
      this.is_selected_discount_category      = false
      this.is_selected_client_group           = false
      this.is_selected_client_rating          = false
      this.is_selected_client_referral_source = false
      
      if(tab_content == options.misc_code.payment_method)
        this.is_selected_payment_method = true
      if(tab_content == options.misc_code.sales_type)
        this.is_selected_sales_type = true
      if(tab_content == options.misc_code.discount_category) 
        this.is_selected_discount_category = true
      if(tab_content == options.misc_code.client_group)
        this.is_selected_client_group = true
      if(tab_content == options.misc_code.client_rating)
        this.is_selected_client_rating = true
      if(tab_content == options.misc_code.client_referral_source)
        this.is_selected_client_referral_source = true
    },
  }
}
</script>

<style lang="scss">
@import './misc-codes.scss';
</style>
