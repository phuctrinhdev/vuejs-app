<template>
  <div class="common-style">
    <b-modal id="loyalty-points-modal" 
             :title="$t('client-information.loyalty-title')"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             class="loyalty-points-modal"
             @show="onLoadForm()"
             @hide="onCancel()">
      <div class="loyalty-points-box">
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('client-information.current-loyalty-points') }}</dt>
            <dd>
              <div class="current-points mb10">
                <input v-model="loyalty_point.fields.points" 
                       type="text" class="w100p block" readonly>
              </div>
            </dd>
          </dl>
        </div>
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('client-information.new-loyalty-points') }}</dt>
            <dd>
              <div class="new-points mb10">
                <input-money v-model="loyalty_point.fields.change_point" :zero="false" class="w100p"/>
              </div>
            </dd>
          </dl>
        </div>
      </div>
      <error-box :errors="loyalty_point_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ClientFamilyApi       from '../../../api/clients/client-family-api.js'
import { options }           from '../../../helpers/options'
import btn_action_group      from '../../common/button/btn-action-group/btn-action-group'
import component_base        from '../../common/component-base/component-base'
import error_box             from '../../common/form/error-box/error-box' 
import LoyaltyPointviewModel from '../../../view-model/clients/loyalty-point-view-model.js'
import input_money           from '../../common/form/input/input-money/input-money.vue'
import ClientAccountViewModel from '../../../view-model/sales/outstanding/client-account-view-model'
import SalesClientAccountChangePointViewModel from '../../../view-model/sales/sales-client-account/sales-client-account-change-point-view-model'
// import { formatMoney }       from '../../../helpers/common'

export default {
  components: {
    'btn-action-group': btn_action_group,
    'error-box'       : error_box,
    'input-money'     : input_money
  },
  extends: component_base,
  props: {
    client_id: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      options,

      form_options: {
        delete: false
      },

      client_family_api: new ClientFamilyApi(),
      sales_client_account_change_point: new SalesClientAccountChangePointViewModel(),

      loyalty_point: new LoyaltyPointviewModel(),
      loyalty_point_errors: [],
    }
  },
  computed:{
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('sales_client_account', {
      x_sales_client_account: 'getSalesClientAccount'
    }),
    sales_client_account(){
      let tmp_client_account_vm = new ClientAccountViewModel()
      tmp_client_account_vm.setFields(this.x_sales_client_account)
      return tmp_client_account_vm
    },
  },
  methods: {
    ...mapMutations('sales_client_account', [
      'updateSalesClientAccountChangePoint',
    ]),

    async onLoadForm(){
      this.loyalty_point = new LoyaltyPointviewModel()
      this.loyalty_point.updateFieldsFromSalesClientAccount(this.sales_client_account)
    },

    async onConfirm(){
      // validate view model
      this.loyalty_point_errors = this.loyalty_point.isValid()
      if(this.loyalty_point_errors.length > 0) {
        return
      }

      // update family points
      if(this.loyalty_point.fields.family_id > 0){
        let sent_data = {
          family_id       : this.loyalty_point.fields.family_id,
          family_point    : this.loyalty_point.fields.change_point,
          created_by_id   : this.x_user.user_id,
          created_by_name : this.x_user.user_name,
          session_token   : this.x_user.session_token,
          shop_location   : this.shop_data.shop_location,
          shop_id         : this.shop_data.shop_id,
        }

        this.preLoader(true)
        let result = await this.client_family_api.updateFamilyPointAsync(sent_data)
        this.preLoader(false)

        if(result.is_ok) {
          this.$emit('updated-loyalty-points')
          this.hideModal()
        }
        else this.showAlert(result.error_messages)
      }
      // update client points
      else{
        this.sales_client_account_change_point.setFields({
          client_id               : this.client_id,
          client_name             : this.x_client.data.client_name,
          client_mobile_number    : this.x_client.data.mobile_number,
          client_phone_number     : this.x_client.data.phone_number,
          loyalty_points          : this.loyalty_point.fields.change_point,
          updated_by_id           : this.x_user.user_id,
          updated_by_name         : this.x_user.user_name,
          shop_id                 : this.shop_data.shop_id
        })

        this.preLoader(true)
        let result = await this.client_family_api.updateSalesClientAccountChangePointAsync(this.sales_client_account_change_point)
        this.preLoader(false)

        if(result.is_ok) {
          this.updateSalesClientAccountChangePoint(result.data.loyalty_points)
          this.hideModal()
        } 
        else this.showAlert(result.error_messages)
      }
    },

    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('loyalty-points-modal')
    }
  }
}
</script>

<style lang="scss">
@import './client-information.scss';

.loyalty-points-modal {
  .loyalty-points-box {
    .form-group {
      margin-bottom: 0;
      dt {
        line-height: 25px;
      }
      .input-money {
        height: 25px;
        padding: 0 5px;
      }
    }
  }
}

</style>