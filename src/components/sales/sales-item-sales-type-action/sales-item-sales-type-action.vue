<template>
  <b-modal id="sales-item-sales-type-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="sales-item-sales-type-action-modal"
           @show="onLoadForm">
    <div class="sales-type-list">
      <ul class="row">
        <li v-for="(sales_type, index) in sales_setup.sales_type_setup" :key="index" 
            class="col-6" @click="onConfirm(sales_type)"><a>{{ sales_type.name }}</a></li>
      </ul>
    </div>

    <div class="modal-footer sales-type-submit">
      <div class="btn-action-group">
        <button class="btn btn-default" @click="onDelete">{{ $t('general.delete') }}</button>
        <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
      </div>
    </div>
  </b-modal>
</template>


<script>
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
// import { options }               from '../../../helpers/options'
// import { sales_options }         from '../../../helpers/options/sales-options'
import SalesCache               from '../../../helpers/cache/sales-cache'
import component_base            from '../../common/component-base/component-base'
import btn_action_group          from '../../common/button/btn-action-group/btn-action-group'

// import { formatMoney }           from '../../../../../helpers/common'

export default {
  components: {
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      sales_cache: new SalesCache(),
      sales_setup: {},

      form_options: {
        delete: false
      },

      sales_type_selected: {},
      sales_type_default: {
        id: null,
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_sales_item_action: 'getSalesItemAction'
    }),
    form_title(){return this.$i18n.t('sales.sales-type')},
  },
  methods: {
    ...mapMutations('sales',[
      // 'updateSalesActionSalesItem',
      // 'updateSalesItemActionSalesType',
    ]),
    hideModal(){
      this.hideDialogById('sales-item-sales-type-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      // sales setup
      this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }
    },
    onDelete() {
      this.onConfirm(this.sales_type_default)
    },
    onConfirm(sales_type_selected){
      let tmp_sales_type = {
        sales_type_id: sales_type_selected.id,
        sales_type_name: sales_type_selected.name
      }
      this.$emit('apply-sales-type', _.cloneDeep(tmp_sales_type))
      this.hideModal()
    }
  }
}
</script>

<style lang="scss">
@import './sales-item-sales-type-action.scss';
</style>