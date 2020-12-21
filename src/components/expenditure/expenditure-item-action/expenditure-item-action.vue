<template>
  <b-modal id="expenditure-item-action-modal"
           :no-close-on-backdrop="true"
           :title="form_title"
           size="sm"
           hide-footer
           class="expenditure-item-action-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <form class="form-horizontal">
      <div class="row form-group">
        <div class="col-12 col-sm-4">
          <label class="require">{{ $t('expenditure.item-name') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-input id="expenditure-name" v-model="expenditure_item.fields.item_name" type="text"/>
        </div>
      </div>
      <template v-if="is_form_edit">
        <div class="row form-group">
          <div class="col-12 col-sm-4 ">
            <label>{{ $t('suppliers.status') }}</label>
          </div>
          <div class="col-12 col-sm-8 ">
            <div class="switch">
              <radio-group id="expenditure-status" v-model="expenditure_item.fields.status"
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
import radio_group                   from '../../common/form/radio/radio-group/radio-group.vue'
import ExpenditureItemViewModel      from '../../../view-model/expenditure/expenditure-item-view-model'
import ExpenditureItemApi            from '../../../api/expenditure/expenditure-items-api'
import component_base                from '../../../components/common/component-base/component-base'
import error_box                     from '../../../components/common/form/error-box/error-box'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group'
import { common_options }            from '../../../helpers/options/common-options.js'
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
      form_options : {
        delete: false
      },
      errors       : [],

      expenditure_item: new ExpenditureItemViewModel(),
      expenditure_api : new ExpenditureItemApi()
    }
  },
  computed:{
    ...mapGetters('expenditure_item',{
      x_expenditure_item_action : 'getExpenditureItemAction'
    }),
    is_form_add(){
      return this.x_expenditure_item_action.action == common_options.form_actions.add
    },
    is_form_edit(){
      return this.x_expenditure_item_action.action == common_options.form_actions.edit
    },
    form_title(){
      if(this.is_form_add)
        return this.$i18n.t('expenditure.add-item')
      if(this.is_form_edit)
        return this.$i18n.t('expenditure.edit-item')
    },
    status_options(){
      return [
        { text : this.$i18n.t('general.active')   , value :  common_options.good_status.active },
        { text : this.$i18n.t('general.inactive') , value :  common_options.good_status.in_active },
      ]
    },
  },
  methods:{
    hideModal(){
      this.hideDialogById('expenditure-item-action-modal')
    },
    onCancel(){
      this.hideModal()
    },

    onLoadForm(){
      this.errors = []

      if(this.is_form_add){
        this.expenditure_item = new ExpenditureItemViewModel()
      }
      if(this.is_form_edit){
        this.expenditure_item.setFields(this.x_expenditure_item_action.data)
      }
      this.expenditure_item.fields.shop_id = this.shop_data.shop_id
    },
    async onConfirm() {
      this.errors = this.expenditure_item.isValid()
      if(this.errors.length == 0){
        let response = {}
        let tmp_event = ''

        this.preLoader()
        if(this.is_form_add){
          tmp_event = 'added'
          response = await this.expenditure_api.addExpenditureItemAsync(this.expenditure_item)
        }
        if(this.is_form_edit){
          tmp_event = 'edited'
          response = await this.expenditure_api.updateExpenditureItemAsync(this.expenditure_item)
        }
        this.preLoader(false)

        if(response.is_ok){
          this.$emit(tmp_event, response.data)
          this.hideModal()
        }
        else{
          this.errors = response.error_messages
        }
      }
    }
  }
}
</script>

<style lang="scss">
.expenditure-item-action-modal {
  input {
    height: 25px;
  }
  .btn-group-toggle {
    border: 1px solid $blue;
  }
  .modal-footer {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
