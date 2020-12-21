<template>
  <div class="receiving-detail-action-wrapper">
    <b-modal id="receiving-detail-action-modal"
             :no-close-on-backdrop="true"
             :title="$t('receivings.view-receiving-detail')"
             size="xl"
             hide-footer
             @show="onLoadForm()"
             @hide="onCancel()">

      <!-- BEGIN MODAL BODY -->
      <div class="modal-body">
        <h3>{{ $t('receivings.title') }}</h3>
        <div class="receiving-information row">
          <div class="col-4">
            <span>{{ $t('receivings.supplier') }} : </span>
            <span>{{ receiving_vm.supplier_name }}</span>
          </div>
          <div class="col-8">
            <span>{{ $t('receivings.receiving-date') }} : </span>
            <span>{{ moment(convertTimeStampToDate(receiving_vm.receiving_date_ts)).format(common_options.standard_date_format.ymd) }}</span>
          </div>
          <div class="col-12">
            <p>{{ $t('receivings.notes') }}</p>
            <p>{{ receiving_vm.notes }}</p>
          </div>
        </div>
        <div class="table">
          <view-table :data="table_data">
            <template slot="unit_price" slot-scope="{row}">
              <span>{{ formatMoney(row.unit_price,0) }}</span>
            </template>
            <template slot="quantity" slot-scope="{row}">
              <span>{{ formatMoney(row.quantity,0) }}</span>
            </template>
            <template slot="amount" slot-scope="{row}">
              <span>{{ formatMoney(row.amount,0) }}</span>
            </template>
          </view-table>
        </div>
      </div>
      <!-- END MODAL BODY -->

      <!-- BEGIN MODAL FOOTER -->
      <div class="modal-footer">
        <button id="btn-detail-edit" class="btn btn-default" @click="onReceivingAction">{{ $t('general.edit') }}</button>
        <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
        <button id="btn-detail-delete" class="btn btn-secondary" @click="onDeleteReceivingAsync">{{ $t('general.delete') }}</button>
      </div>
    </b-modal>
    <!-- END MODAL FOOTER -->
  </div>
</template>

<script>
const DELETED_RECEIVING_EVENT_NAME = 'deleted-receiving'
import moment                        from 'moment'
import ReceivingViewModel            from '../../../../view-model/inventory/receivings/receiving-view-model.js'
import ReceivingApi                  from '../../../../api/inventory/receiving-api.js'
import component_base                from '../../../common/component-base/component-base.vue'
import view_table                    from '../../../common/view-table/view-table.vue'
import { mapGetters, mapMutations }             from 'vuex'
import { common_options }                       from '../../../../helpers/options/common-options.js'
import { convertTimeStampToDate,formatMoney }   from '../../../../helpers/common.js'
import _ from 'lodash'
export default {
  components : {
    'view-table' : view_table
  },
  extends : component_base,
  data(){
    return{
      moment,
      common_options,
      receiving_api : {},
      receiving_vm  : {}
    }
  },
  computed:{
    ...mapGetters('user',{
      x_user : 'getUser'
    }),
    ...mapGetters('receiving',{
      x_receiving_action : 'getReceivingAction'
    }),
    table_data(){
      return {
        fields : [
          {field: 'product_code',     label: 'receivings.product-code',   width: '20%',   sortable: false },
          {field: 'product_name',     label: 'receivings.product-name',   width: '20%',   sortable: false },
          {field: 'unit_price',       label: 'receivings.unit-price',     width: '20%',   sortable: false , expand: true },
          {field: 'quantity',         label: 'receivings.quantity',       width: '20%',   sortable: false , expand: true },
          {field: 'amount',           label: 'receivings.amount',         width: '20%',   sortable: false , expand: true }
        ],
        rows    : this.receiving_vm.receiving_items,
        options    : {
          pagination : false
        }
      }
    }
  },
  created(){
    this.receiving_api = new ReceivingApi()
    this.receiving_vm  = new ReceivingViewModel()
  },
  methods:{
    ...mapMutations('receiving',[
      'setReceivings',
      'setReceivingAction'
    ]),

    async onLoadForm(){
      let query = {
        id      : this.x_receiving_action.data.receiving_id,
        shop_id : this.x_receiving_action.data.shop_id
      }
      this.preLoader()
      let response = await this.receiving_api.getReceivingDetailAsync(query)
      this.preLoader(false)
      if (response.is_ok){
        let tmp_receiving_vm     = _.cloneDeep(response.data)
        let tmp_receiving_action = {
          action : common_options.form_actions.edit,
          data   : tmp_receiving_vm
        }
        this.setReceivingAction(_.cloneDeep(tmp_receiving_action))
        this.receiving_vm = this.x_receiving_action.data
      }else{
        this.showAlertDialog(response.error_messages)
      }
    },
    async onDeleteReceivingAsync(){
      let query = {
        receiving_id : this.receiving_vm.receiving_id,
        user_id      : this.x_user.user_id,
        user_name    : this.x_user.user_name,
        shop_id      : this.shop_data.shop_id
      }
      this.preLoader()
      let response = await this.receiving_api.deleteReceivingAsync(query)
      this.preLoader(false)
      if (response.is_ok){
        this.$emit(DELETED_RECEIVING_EVENT_NAME,this.receiving_vm)
        this.hideModal()
      }else{
        this.showAlertDialog(response.error_messages)
      }
    },

    onReceivingAction(){
      this.showDialogById('receiving-action-modal')
    },
    onCancel(){
      this.hideModal()
    },

    hideModal(){
      this.hideDialogById('receiving-detail-action-modal')
    },
    formatMoney,
    convertTimeStampToDate
  }
}
</script>

<style lang="scss">
@import './receiving-detail-action.scss';
</style>
