<template>
  <main class="app-content">
    <section class="content report-balances-and-loyalty-points-page">
      <div class="page-title">
        <h3>{{ $t('report.balances-and-loyalty-points') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('stock-internal-use.print') }}</a></li>
        </ul>
      </div>

      <div class="tabs-wrapper">
        <b-form-select v-model="tab_index" class="report-links mobile" @input="onSelectTabLink">
          <option v-for="(tab, i) in tab_index_options" :key="i" :value="tab.value">{{ $t(tab.text) }}</option>
        </b-form-select>

        <b-tabs v-model="tab_index" card>
          <b-tab :title="$i18n.t('report.prepaid-cards')">
            <report-prepaid-cards v-if="tab_index == 0" :class="{ active: tab_index == 0 }"/>
          </b-tab>
          <b-tab :title="$i18n.t('report.prepaid-card-summary')">
            <report-prepaid-card-summary v-if="tab_index == 1" :class="{ active: tab_index == 0 }"/>
          </b-tab>
          <b-tab :title="$i18n.t('report.prepaid-services')">
            <report-prepaid-services v-if="tab_index == 2" :class="{ active: tab_index == 0 }"/>
          </b-tab>
          <b-tab :title="$i18n.t('client-information.loyalty-points')">
            <report-loyalty-points v-if="tab_index == 3" :class="{ active: tab_index == 0 }"/>
          </b-tab>
        </b-tabs>
      </div>
    </section>
  </main>
</template>

<script>
import { mapMutations, mapGetters }  from 'vuex'
import component_base                from '../../../components/common/component-base/component-base'

import report_prepaid_cards          from './report-prepaid-cards.vue'
import report_prepaid_card_summary   from './report-prepaid-card-summary.vue'
import report_prepaid_services       from './report-prepaid-services.vue'
import report_loyalty_points         from './report-loyalty-points.vue'


export default {
  components: {
    'report-prepaid-cards': report_prepaid_cards,
    'report-prepaid-card-summary': report_prepaid_card_summary,
    'report-prepaid-services': report_prepaid_services,
    'report-loyalty-points': report_loyalty_points
  },
  extends : component_base,
  data(){
    return {
      tab_index: 0,
    }
  },
  computed:{
    ...mapGetters('expenditure_item',{
      x_expenditure_items       : 'getExpenditureItems',
      x_expenditure_item_action : 'getExpenditureItemAction'
    }),
    tab_index_options(){
      return [
        { value: 0, text: 'report.prepaid-cards' },
        { value: 1, text: 'report.prepaid-card-summary' },
        { value: 2, text: 'report.prepaid-services' },
        { value: 3, text: 'client-information.loyalty-points' }
      ]
    }
  },
  methods:{
    ...mapMutations('expenditure_item',[
      'setExpenditureItems',
      'setExpenditureItemAction'
    ]),
    onSelectTabLink(){
      // this.$router.push(this.booking_link_selected)
    },
  }
}
</script>

<style lang="scss">
@import './report-balances-and-loyalty-points.scss';
</style>
