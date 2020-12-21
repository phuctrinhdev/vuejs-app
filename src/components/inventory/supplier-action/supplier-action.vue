<template>
  <b-modal :id="modal_id"
           :class="modal_id"
           :title="modal_title"
           :no-close-on-backdrop="true"
           size="sm"
           hide-footer
           @show="onLoadForm()"
           @hide="onCancel()">
    <form class="form-wrapper">
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label class="require">{{ $t('suppliers.supplier-name') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input id="supplier-name" v-model="supplier_vm.fields.supplier_name" type="text">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label>{{ $t('suppliers.representative') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input id="supplier-representative" v-model="supplier_vm.fields.representative" type="text">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label>{{ $t('suppliers.mobile-number') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input id="supplier-mobile-number" v-model="supplier_vm.fields.mobile_number" type="text">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label>{{ $t('suppliers.phone-number') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input id="supplier-phone-number" v-model="supplier_vm.fields.phone_number" type="text">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label>{{ $t('suppliers.fax') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input id="supplier-fax" v-model="supplier_vm.fields.fax" type="text">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label>{{ $t('suppliers.email') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input id="supplier-email" v-model="supplier_vm.fields.email" type="text">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label>{{ $t('suppliers.notes') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <textarea id="supplier-notes" v-model="supplier_vm.fields.notes" :rows="3"/>
        </div>
      </div>
      <template v-if="is_form_edit">
        <div class="row form-group">
          <div class="col-12 col-sm-4">
            <label>{{ $t('suppliers.status') }}</label>
          </div>
          <div class="col-12 col-sm-8 ">
            <div class="switch">
              <radio-group id="supplier-status" v-model="supplier_vm.fields.active"
                           :options="options.option_goods_status"
                           :buttons="true"/>
            </div>
          </div>
        </div>
      </template>
    </form>

    <error-box :errors="errors"/>
    <div class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template>

<script>

const ADDED_SUPPLIER_EVENT_NAME   = 'added-supplier'
const UPDATED_SUPPLIER_EVENT_NAME = 'updated-supplier'
import SupplierApi                   from '../../../api/inventory/supplier-api.js'
import SupplierViewModel             from '../../../view-model/inventory/supplier/supplier-view-model.js'
import radio_group                   from '../../common/form/radio/radio-group/radio-group.vue'

import component_base                from '../../../components/common/component-base/component-base'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'
import { common_options }            from '../../../helpers/options/common-options.js'
import { inventory_options }         from '../../../helpers/options/inventory-options.js'
import { options }                   from '../../../helpers/options'
import { mapGetters } from 'vuex'

export default {
  components: {
    'error-box'       : error_box,
    'radio-group'     : radio_group,
    'btn-action-group': btn_action_group
  },
  extends : component_base,
  data(){
    return {
      options,
      common_options,
      inventory_options,

      supplier_vm  : new SupplierViewModel(),
      supplier_api : new SupplierApi(),

      modal_id     : 'supplier-action-modal',
      form_options : {
        delete: false
      },
      errors       : []
    }
  },
  computed:{
    ...mapGetters('supplier',{
      x_suppliers       : 'getSuppliers',
      x_supplier_action : 'getSupplierAction'
    }),
    is_form_add(){
      return this.x_supplier_action.action == common_options.form_actions.add
    },
    is_form_edit(){
      return this.x_supplier_action.action == common_options.form_actions.edit
    },
    modal_title(){
      if(this.is_form_add)
        return this.$i18n.t('suppliers.add-supplier')
      if(this.is_form_edit)
        return this.$i18n.t('suppliers.edit-supplier')
    },
    status_options(){
      return [
        { text : this.$i18n.t('general.active')   , value :  inventory_options.supplier_status_enum.active },
        { text : this.$i18n.t('general.inactive') , value :  inventory_options.supplier_status_enum.in_active },
      ]
    },
  },
  methods:{
    hideModal(){
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.errors = []
      this.supplier_vm         = this.x_supplier_action.data
      this.supplier_vm.shop_id = this.shop_data.shop_id
    },

    async onConfirm() {
      this.errors = this.supplier_vm.isValid()
      if (this.errors.length == 0){
        this.preLoader()
        let response = {}
        let tmp_event_name = ''
        if(this.is_form_add){
          tmp_event_name = ADDED_SUPPLIER_EVENT_NAME
          this.supplier_vm.active = inventory_options.supplier_status_enum.active
          response = await this.supplier_api.addSupplierAsync(this.supplier_vm)
        }
        if(this.is_form_edit){
          tmp_event_name = UPDATED_SUPPLIER_EVENT_NAME
          response = await this.supplier_api.updateSupplierAsync(this.supplier_vm)
        }
        this.preLoader(false)
        if(response.is_ok){
          this.$emit(tmp_event_name,response.data)
          this.hideModal()
        }else{
          this.errors = response.error_messages
        }
      }
    },
  }
}
</script>

<style lang="scss">
@import './supplier-action.scss';
</style>
