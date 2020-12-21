<template>
  <b-modal id="notes-action-modal" 
           :title="t_form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="notes-action-modal"
           @show="onLoadForm">
    <b-form-textarea v-model="notes" :rows="8" placeholder=""/>
    <error-box :errors="errors"/>
    <footer class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </footer>
  </b-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    ...mapGetters('sales', {
      x_sales_action: 'getSalesAction',
    }),
    t_form_title(){return this.$i18n.t('sales.edit-notes')},
  },
  methods: {
    ...mapActions('sales', [
      'updateSalesData'
    ]),
    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('notes-action-modal')
    },
    onLoadForm(){
      this.errors = []
      this.notes = this.x_sales_action.data.notes
    },
    async onConfirm(){
      this.$emit('edited-notes', this.notes)
    }
  }
}
</script>