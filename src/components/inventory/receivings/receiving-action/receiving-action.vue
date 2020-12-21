<template>
  <div class="receiving-action-wrapper">
    <b-modal id="receiving-action-modal"
             :no-close-on-backdrop="true"
             :title="form_title_text"
             size="xl"
             hide-footer
             class="receiving-action-modal"
             @show="onLoadForm()"
             @hide="onCancel()">

      <!-- BEGIN MODAL BODY -->
      <div class="row">
        <div class="col-md-9">
          <div class="receiving-information">
            <div class="supplier">
              <label>{{ $t('receivings.supplier') }}</label>
              <b-form-select id="ddlAdd_Suppliers" v-model="tmp_supplier_id"
                             :options="suppliers_options"
                             value-field="supplier_id"
                             text-field="supplier_name"
                             @change="onChangeSupplier">
                <template v-slot:first v-if="is_form_add">
                  <option :value="0">{{ $t('general.select') }}</option>
                </template>
              </b-form-select>
            </div>
            <div class="receiving_date">
              <label>{{ $t('receivings.receiving-date') }}</label>
              <v-date-picker id="dtRecevingDate" v-model="tmp_receiving_date"
                             :popover="{ placement: 'bottom' }"
                             :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                             :input-props="{ placeholder: '' }"
                             class="receiving-date"
                             @input="onChangeReceivingDate"/>
            </div>
            <div class="notes">
              <label>{{ $t('receivings.notes') }}</label>
              <template v-if="is_form_add">
                <b-form-textarea id="txtNotes" v-model="receiving_vm.notes" :rows="3"/>
              </template>
              <template v-else-if="is_form_edit">
                <p @click="onReceivingNotesEditAction">{{ receiving_vm.notes }}</p>
              </template>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="btn-wrapper view-pc">
            <a v-if="!is_form_edit" id="btnSave" class="btn btn-default"
               @click="onAddReceivingAsync">{{ $t('general.save') }}</a>
            <a class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</a>
          </div>
        </div>
      </div>
      <div class="receiving-items">
        <a id="btnAddProduct" class="btn-add-product" @click="onReceivingItemAddAction">{{ $t('receivings.add-product') }}</a>
        <span class="table-intro">{{ total_amount_text }}</span>
        <view-table :data="table_data">
          <template slot="unit_price" slot-scope="{row}">
            <template v-if="is_form_add">
              <input-money v-model="row.unit_price"
                           :decimal="0"
                           :zero="true"
                           @input="updateRecievingItem(row)"/>
            </template>
            <template v-else-if="is_form_edit">
              <span>{{ formatMoney(row.unit_price,0) }}</span>
            </template>
          </template>
          <template slot="quantity" slot-scope="{row}">
            <template v-if="is_form_add">
              <input-money v-model="row.quantity"
                           :decimal="0"
                           :zero="true"
                           @input="updateRecievingItem(row)"/>
            </template>
            <template v-else-if="is_form_edit">
              <span>{{ formatMoney(row.quantity,0) }}</span>
            </template>
          </template>
          <template slot="amount" slot-scope="{row}">
            <span>{{ formatMoney(row.amount,0) }}</span>
          </template>
          <template slot="edit" slot-scope="{row}">
            <a class="btn" @click="onReceivingItemEditAction(row)">{{ $t('general.edit') }}</a>
          </template>
          <template slot="delete" slot-scope="{row}">
            <a class="btn" @click="onDeleteReceivingItem(row)">x</a>
          </template>
        </view-table>

        <div class="btn-wrapper view-mobile">
          <a v-if="!is_form_edit" id="btnSave" class="btn btn-default"
             @click="onAddReceivingAsync">{{ $t('general.save') }}</a>
          <a class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</a>
        </div>
      </div>
    </b-modal>

    <!-- BEGIN ACTION -->
    <alert-confirm :id="receiving_alert_id"
                   :data_alerts="alert_messages"
                   @confirm="onUpdateReceivingAsync"
                   @cancel="onCancelAlert"/>
    <receiving-item-add-action @added-receiving-item="onAddedReceivingItems"/>
    <receiving-item-edit-action @updated-receiving-item="updateReceivingIntoStore"/>
    <receiving-notes-edit-action @updated-receiving-notes="updateReceivingIntoStore"/>
  </div>
</template>

<script>
const ADDED_RECEIVING_EVENT_NAME = 'added-receiving'
import input_money                   from '../../../common/form/input/input-money/input-money.vue'
import alert_confirm                 from '../../../common/alert/alert-confirm.vue'
import ReceivingViewModel            from '../../../../view-model/inventory/receivings/receiving-view-model.js'
import receiving_item_add_action     from '../receiving-item-add-action/receiving-item-add-action.vue'
import receiving_item_edit_action    from '../receiving-item-edit-action/receiving-item-edit-action.vue'
import receiving_notes_edit_action   from '../receiving-notes-edit-action/receiving-notes-edit-action.vue'


import ReceivingApi                  from '../../../../api/inventory/receiving-api.js'
import component_base                from '../../../common/component-base/component-base.vue'
import view_table                    from '../../../common/view-table/view-table.vue'
import supplier_mixin                from '../../../../helpers/mixins/supplier-mixin.js'


import { common_options }                      from '../../../../helpers/options/common-options'
import { mapGetters, mapMutations }            from 'vuex'
import { setupCalendar,DatePicker }            from 'v-calendar'
import _                                       from 'lodash'
import { formatMoney, 
// convertDateToTimezone 
}  from '../../../../helpers/common.js'

export default {
  components : {
    'alert-confirm'               : alert_confirm,
    'view-table'                  : view_table,
    'v-date-picker'               : DatePicker,
    'input-money'                 : input_money,
    'receiving-item-add-action'   : receiving_item_add_action,
    'receiving-item-edit-action'  : receiving_item_edit_action,
    'receiving-notes-edit-action' : receiving_notes_edit_action
  },
  extends : component_base,
  mixins  : [supplier_mixin],
  data(){
    return {
      common_options,
      receiving_alert_id : 'alert-confirm-receiving-modal',
      alert_messages     : ['Are you sure you want to changes ?'],
      receiving_vm       : {},
      suppliers_options  : [],

      // The fields below will be apply if user cancel the updating.
      tmp_supplier_name     : '',
      tmp_supplier_id       : 0,
      tmp_receiving_date    : {}
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
      let class_name = 'hide'
      if(this.is_form_edit) class_name = ''
      return {
        fields : [
          {field: 'product_code',          label: 'receivings.product-code',     width: '15%',   sortable: false},
          {field: 'product_name',          label: 'receivings.product-name',     width: '20%',   sortable: false},
          {field: 'unit_price',            label: 'receivings.unit-price',       width: '15%',   sortable: false, expand: true },
          {field: 'quantity',              label: 'receivings.qty',              width: '15%',   sortable: false, expand: true },
          {field: 'amount',                label: 'receivings.amount',           width: '15%',   sortable: false, expand: true },
          {field: 'edit',                  label: 'general.edit',                width: '10%',   sortable: false, expand: true, thClass: class_name, tdClass:class_name},
          {field: 'delete',                label: 'general.delete',              width: '10%',   sortable: false, expand: true }
        ],
        rows       : this.receiving_vm.receiving_items,
        options    : {
          pagination : false
        }
      }
    },
    form_title_text(){
      let text = ''
      if (this.is_form_edit) text = this.$i18n.t('receivings.edit-receivings')
      if (this.is_form_add) text = this.$i18n.t('receivings.add-receivings')
      return text
    },
    total_amount_text(){
      let text = this.$i18n.t('receivings.total-amount')
      text = text.replace('{total_amount}',formatMoney(this.receiving_vm.amount,0))
      return text
    },
    is_form_edit(){
      return this.x_receiving_action.action == common_options.form_actions.edit
    },
    is_form_add(){
      return this.x_receiving_action.action == common_options.form_actions.add
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
    this.receiving_api      = new ReceivingApi()
    this.receiving_vm       = new ReceivingViewModel()
    this.tmp_receiving_date = new Date() // convertDateToTimezone
  },
  methods:{
    ...mapMutations('receiving',[
      'updateReceiving',
      'updateReceivingAction',
      'setReceivingItemAction'
    ]),

    async onLoadForm(){
      this.suppliers_options = await this.getSuppliersOptionMixinAsync()

      this.receiving_vm = this.x_receiving_action.data
      if(this.is_form_add){
        this.receiving_vm.receiving_date_ts = this.tmp_receiving_date
      }
      if(this.is_form_edit && this.receiving_vm.receiving_id > 0){
        this.tmp_receiving_date = this.receiving_vm.receiving_date
      }
      this.tmp_supplier_name      = this.receiving_vm.supplier_name
      this.tmp_supplier_id        = this.receiving_vm.supplier_id
      this.receiving_vm.user_id   = this.x_user.user_id
      this.receiving_vm.user_name = this.x_user.user_name
      this.receiving_vm.shop_id   = this.shop_data.shop_id
    },

    // receiving
    async onAddReceivingAsync(){
      let errors = this.receiving_vm.isValid()
      if(errors.length == 0){
        this.preLoader()
        let response = await this.receiving_api.addReceivingAsync(this.receiving_vm)
        this.preLoader(false)
        if (response.is_ok){
          this.$emit(ADDED_RECEIVING_EVENT_NAME,this.receiving_vm)
          this.hideModal()
        }else{
          this.showAlert(response.error_messages)
        }
      }else{
        this.showAlert(errors)
      }
    },
    async onUpdateReceivingAsync(){
      this.receiving_vm.supplier_id       = this.tmp_supplier_id
      this.receiving_vm.supplier_name     = this.tmp_supplier_name
      this.receiving_vm.receiving_date_ts = this.tmp_receiving_date
      
      let errors = this.receiving_vm.isValid()
      if(errors.length == 0){
        this.preLoader()
        let response = await this.receiving_api.updateReceivingAsync(this.receiving_vm)
        this.preLoader(false)
        if (response.is_ok){
          this.updateReceivingIntoStore(response.data)
        }else{
          this.showAlert(response.error_messages)
        }
      }else{
        this.showAlert(errors)
      }
    },

    // receiving item
    async onAddedReceivingItems(receiving_items){
      if(this.is_form_add){
        this.receiving_vm.addReceivingItems(receiving_items)
      }
      if(this.is_form_edit){
        this.receiving_vm.receiving_items = []
        this.receiving_vm.addReceivingItems(receiving_items)
        this.preLoader()
        let response = await this.receiving_api.addReceivingItemsAsync(this.receiving_vm)
        this.preLoader(false)
        if (response.is_ok){
          this.updateReceivingIntoStore(response.data)
        }else{
          this.showAlert(response.error_messages)
        }
      }
    },
    updateRecievingItem(receiving_item){
      this.receiving_vm.updateReceivingItem(receiving_item)
    },
    async onDeleteReceivingItem(receiving_item){
      if(this.is_form_edit){
        let query = {
          shop_id          : this.shop_data.shop_id,
          receiving_id     : this.receiving_vm.receiving_id,
          user_id          : this.x_user.user_id,
          user_name        : this.x_user.user_name,
          receiving_item_id: receiving_item.receiving_item_id
        }
        let errors = this.receiving_vm.isDeletingItemValid()
        if(errors.length == 0){
          this.preLoader()
          let response = await this.receiving_api.deleteReceivingItemAsync(query)
          this.preLoader(false)
          if (response.is_ok){
            this.updateReceivingIntoStore(response.data)
          }else{
            this.showAlert(response.error_messages)
          }
        }else{
          this.showAlert(errors)
        }
      }else{
        this.receiving_vm.deleteReceivingItem(receiving_item.product_id)
      }
    },


    onReceivingItemAddAction(){
      this.showDialogById('receiving-item-add-action-modal')
    },
    onReceivingItemEditAction(receiving_item){
      let tmp_receiving_item_action = {
        action : common_options.form_actions.edit,
        data   : _.cloneDeep(receiving_item)
      }
      this.setReceivingItemAction(_.cloneDeep(tmp_receiving_item_action))
      this.showDialogById('receiving-item-edit-action-modal')
    },
    onReceivingNotesEditAction(){
      this.showDialogById('receiving-notes-edit-action-modal')
    },
    onChangeSupplier(supplier_id){
      let supplier_vm = _.find(this.suppliers_options,x=>x.supplier_id == supplier_id)
      if (typeof supplier_vm !== 'undefined'){
        if(this.is_form_edit){
          this.showDialogById(this.receiving_alert_id)
        }else{
          this.receiving_vm.supplier_name = supplier_vm.supplier_name
          this.receiving_vm.supplier_id   = supplier_vm.supplier_id
        }
        this.tmp_supplier_name = supplier_vm.supplier_name
      }
    },
    onChangeReceivingDate(date){
      if(this.is_form_edit){
        this.showDialogById(this.receiving_alert_id)
      }else{
        this.receiving_vm.receiving_date_ts = date
      }
    },
    onCancelAlert(){
      this.tmp_supplier_name  = this.receiving_vm.supplier_name
      this.tmp_supplier_id    = this.receiving_vm.supplier_id
      this.tmp_receiving_date = this.receiving_vm.receiving_date
    },
    onCancel(){
      this.hideModal()
    },

    updateReceivingIntoStore(receiving_vm = ReceivingViewModel){
      this.updateReceiving(receiving_vm)
      this.updateReceivingAction(receiving_vm)
    },
    hideModal(){
      this.hideDialogById('receiving-action-modal')
    },
    formatMoney
  }
}
</script>

<style lang="scss">
@import './receiving-action.scss';
</style>
