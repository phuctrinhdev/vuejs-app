<template>
  <div class="move-balance-action-wrapper">
    <b-modal id="move-balance-action-modal"
             :title="$t('sales-prepaid-card-tab.move-balance')"
             :no-close-on-backdrop="true"
             hide-footer
             @show="onloadForm()"
             @hide="onCancel()">
      <div class="modal-body">
        <template v-if="is_table_load">
          <div class="row">
            <div class="col-6">
              <table-move-balance
                :title="$t('sales-prepaid-card-tab.source')"
                :items="prepaid_cards"
                radio_name="source"
                @selectedItem="onHandleSource"/>
            </div>
            <div class="col-6">
              <table-move-balance
                :title="$t('sales-prepaid-card-tab.destination')"
                :items="prepaid_cards"
                :disabled_item_id="from_card_id"
                :reset_state="true"
                radio_name="destination"
                @selectedItem="onHandleDestination"/>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <p class="fz-kr">* After selecting the source prepaid card and select the destination card, the balance of the source card is transferred to the destination card.
              </p>
            </div>
          </div>
        </template>
      </div>
      <error-box :errors="errors"/>
      <footer class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </footer>
    </b-modal>
  </div>
</template>

<script>
import PrepaidCardViewModel            from '../../../view-model/sales/prepaid-card/prepaid-card-view-model'
import BalanceMoveAPI                  from '../../../api/sales/balance-move-api.js'
import AddBalanceMoveViewModel         from '../../../view-model/sales/balance-move/add-balance-move-view-model'
import component_base                  from '../../common/component-base/component-base'
import btn_action_group                from '../../common/button/btn-action-group/btn-action-group'
import error_box                       from '../../common/form/error-box/error-box'
import Validator                       from '../../../view-model/validator'
import table_move_balance              from './table-move-balance'
import { options }                     from '../../../helpers/options.js'
import { sales_options }                from '../../../helpers/options/sales-options.js'
import { mapGetters,mapActions }       from 'vuex'
import { convertDateToTimeStamp,
  convertDateToTimezone }      from '../../../helpers/common'

export default {
  components : {
    'btn-action-group'   : btn_action_group,
    'error-box'          : error_box,
    'table-move-balance' : table_move_balance
  },
  extends : component_base,
  props: {
    is_submit_to_api: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return{
      errors            : [],
      
      balance_move_api  : new BalanceMoveAPI(),
      new_balance_move  : new AddBalanceMoveViewModel(),

      is_table_load     : false,
      prepaid_cards     : [],
      from_card_id      : 0,
      to_card_id        : 0,

      validator         : new Validator(),

      form_options      : {
        delete: false
      },
    }
  },
  computed:{
    ...mapGetters('sales_prepaid_card',{
      x_prepaid_cards : 'getSalesPrepaidCards'
    }),
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('user',{
      x_user: 'getUser'
    }),
    message_error_text(){
      return this.$i18n.t('sales-prepaid-card-tab.source-destination-not-be-same')
    }
  },
  methods:{
    ...mapActions('sales_prepaid_card',[
      'updateSalesPrepaidCardData'
    ]),
    hideModal(){
      this.is_table_load = false
      this.hideDialogById('move-balance-action-modal')
    },
    onCancel(){
      this.hideModal()
    },

    onloadForm(){
      this.errors        = []
      this.prepaid_cards = []
      this.from_card_id  = 0
      this.to_card_id    = 0
      this.is_table_load = true
      let prepaid_cards_field = this.x_prepaid_cards.items
      for (let key in prepaid_cards_field) {
        if(prepaid_cards_field[key].prepaid_card_type == options.prepaid_card_type.deposit_card &&
          (prepaid_cards_field[key].expiry_date_ts >= convertDateToTimeStamp(new Date(),false) ||
          prepaid_cards_field[key].expiry_date_ts == sales_options.NOT_LIMIT)){
          let prepaid_card = new PrepaidCardViewModel()
          prepaid_card.setFields(prepaid_cards_field[key])
          this.prepaid_cards.push(prepaid_card)
        }
      }
    },
    onHandleSource(card_id){
      this.from_card_id = card_id
    },
    onHandleDestination(card_id){
      this.to_card_id = card_id
    },

    async onConfirm(){
      if(this.is_submit_to_api){
        this.preLoader()
        this.errors = this.isValidComponent()
        if(this.errors.length == 0){
          let model    = this.getAddBalanceMoveViewModel()
          let response = await this.balance_move_api.addBalanceMoveAsync(model)
          if( response.is_ok){
            for(let item of response.data){
              this.updateSalesPrepaidCardData(item.getFields())
            }
            this.$emit('added-move-balance')
            this.hideModal()
          }
          else{
            this.showAlertDialog(response.error_messages)
          }
        }
        this.preLoader(false)
      }
      else {
        // console.log('onConfirm', this.from_card_id, this.to_card_id)
        // console.log('prepaid_cards', this.prepaid_cards)
        // let tmp_balance_move = {
        //   from_client_prepaid_card_id : client_prepaid_card.id,
        //   move_balance                : client_prepaid_card.balance,
        //   to_client_prepaid_card_id   : 0,
        //   to_prepaid_card_guid        : tmp_sales_item.fields.prepaid_goods_guid
        // }
      }
    },
    getAddBalanceMoveViewModel(){
      let tmp_date_time_ts = convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true)
      let add_balance_move = new AddBalanceMoveViewModel()
      add_balance_move.setFields({
        client_id                   : this.x_client.data.id,
        client_name                 : this.x_client.data.client_name,
        family_id                   : this.x_client.data.family_id,
        from_client_prepaid_card_id : this.from_card_id,
        to_client_prepaid_card_id   : this.to_card_id,
        balance_move_date_time_ts   : tmp_date_time_ts,
        created_by_id               : this.x_user.user_id,
        created_by_name             : this.x_user.user_name,
        session_token               : this.x_user.session_token,
        shop_location               : this.shop_data.shop_location,
        shop_id                     : this.shop_data.shop_id,

        chain_id                    : this.shop_data.chain_id,
        branch_number               : this.shop_data.branch_number,
        shop_name                   : this.shop_data.shop_name,
        client_shop_id              : this.x_client.data.shop_id,
        client_shop_name            : this.x_client.data.shop_name
      })
      return add_balance_move
    },

    isValidComponent(){
      let messages =  []
      let fields = {
        source      : this.from_card_id,
        destination : this.to_card_id,
      }
      let validation_rules = {
        source :{
          label : 'sales-prepaid-card-tab.source',
          rules : {
            numeric : '',
            customRule : {
              message : 'validate_messages.require',
              process(model){
                if(model.source == 0){
                  return false
                }
                return true
              }
            }
          }
        },
        destination:{
          label : 'sales-prepaid-card-tab.destination',
          rules : {
            numeric : '',
            customRule : {
              message : 'validate_messages.require',
              process(model){
                if( model.destination == 0){
                  return false
                }
                return true
              }
            }
          }
        }
      }
      if(typeof this.from_card_id === 'number' &&
         typeof this.to_card_id === 'number'   &&
         this.from_card_id > 0 && this.to_card_id > 0 &&
         this.from_card_id == this.to_card_id){
        messages.push(this.message_error_text)
      }
      this.validator.setModel(fields)
      messages = messages.concat(this.validator.validate(validation_rules))
      return messages
    },
  }
}
</script>

<style lang="scss">
@import './sales-move-balance-action.scss';
</style>
