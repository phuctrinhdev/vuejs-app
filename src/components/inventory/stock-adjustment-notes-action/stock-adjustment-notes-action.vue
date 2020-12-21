<template>
  <b-modal id="stock-adjustment-notes-action-modal" 
           :title="t_form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="stock-adjustment-notes-action-modal"
           @show="onLoadForm">
    <div class="form-wrapper">
      <div class="stock-adjustment-brief">{{ stock_adjustment_brief }}</div>
      <div class="row form-group product-name">
        <div class="col-12 col-sm-1">
          <label>{{ $t('general.notes') }}</label>
        </div>
        <div class="col-12 col-sm-11">
          <b-form-textarea id="stock-adjustment-notes" v-model="notes" :rows="4"
                           placeholder=""/>
        </div>
      </div>
    </div>
    <error-box :errors="errors"/>
    <footer class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </footer>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { options }       from '../../../helpers/options'
import component_base    from '../../common/component-base/component-base'
import error_box         from '../../common/form/error-box/error-box' 
import btn_action_group  from '../../common/button/btn-action-group/btn-action-group'

export default {
  components: {
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data() {
    return {
      options,
      form_options: {
        delete: false
      },
      notes: '',
    }
  },
  computed: {
    ...mapGetters('stock_adjustment',{
      x_stock_adjustment_action : 'getStockAdjustmentAction',
    }),
    t_form_title(){return this.$i18n.t('stock-adjustment.stock-adjustment')},
    stock_adjustment_brief(){
      let tmp = this.$i18n.t('stock-adjustment.stock-adjustment-brief')
      tmp = tmp.replace('{cases}', this.x_stock_adjustment_action.options.cases)
      tmp = tmp.replace('{total}', this.x_stock_adjustment_action.options.cases_total)
      return tmp
    }
  },
  methods: {
    hideModal(){
      this.hideDialogById('stock-adjustment-notes-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.errors = []
      this.notes = ''
    },
    async onConfirm(){
      this.$emit('edited-notes', this.notes)
    }
  }
}
</script>

<style lang="scss">
.stock-adjustment-notes-action-modal {
  .stock-adjustment-brief {
    margin-bottom: 20px;
  }
}
</style>