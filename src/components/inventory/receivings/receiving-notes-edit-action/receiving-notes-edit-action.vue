<template>
  <div class="receiving-notes-edit-action-wrapper">
    <b-modal id="receiving-notes-edit-action-modal"
             :no-close-on-backdrop="true"
             title="Edit Note"
             size="sm"
             hide-footer
             @show="onLoadForm()"
             @hide="onCancel()">

      <!-- BEGIN MODAL BODY -->
      <div class="modal-body">
        <form class="form-horizontal">
          <div class="row form-group">
            <div class="col-12">
              <b-form-textarea v-model="receiving_vm.notes" :rows="4"/>
            </div>
          </div>
          <error-box :errors="errors"/>
        </form>
      </div>
      <!-- END MODAL BODY -->

      <!-- BEGIN MODAL FOOTER -->
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
      <!-- END MODAL FOOTER -->
    </b-modal>
  </div>
</template>

<script>
const UPDATED_NOTES_RECEIVING_EVENT_NAME = 'updated-receiving-notes'
import ReceivingApi          from '../../../../api/inventory/receiving-api.js'
import ReceivingViewModel    from '../../../../view-model/inventory/receivings/receiving-view-model.js'
import error_box             from '../../../common/form/error-box/error-box.vue'
import btn_action_group      from '../../../common/button/btn-action-group/btn-action-group'
import component_base        from '../../../common/component-base/component-base.vue'
import { common_options }    from '../../../../helpers/options/common-options'
import { mapGetters }        from 'vuex'
import _                     from 'lodash'

export default {
  components : {
    'error-box'       : error_box,
    'btn-action-group': btn_action_group,
  },
  extends: component_base,
  data(){
    return {
      receiving_vm  : {},
      receiving_api : {},
      errors : []
    }
  },
  computed:{
    ...mapGetters('user',{
      x_user : 'getUser'
    }),
    ...mapGetters('receiving',{
      x_receivings       : 'getReceivings',
      x_receiving_action : 'getReceivingAction'
    }),
    is_form_edit(){
      return this.x_receiving_action.action == common_options.form_actions.edit
    }
  },
  created(){
    this.receiving_api = new ReceivingApi()
    this.receiving_vm  = new ReceivingViewModel()
    this.form_options  = { delete: false }
  },
  methods:{
    onLoadForm(){
      this.errors = []
      this.receiving_vm           = _.cloneDeep(this.x_receiving_action.data)
      this.receiving_vm.user_id   = this.x_user.user_id
      this.receiving_vm.user_name = this.x_user.user_name
      this.receiving_vm.shop_id   = this.shop_data.shop_id
    },
    onCancel(){
      this.hideModal()
    },
    async onConfirm(){
      this.errors = this.receiving_vm.isValid()
      if(this.errors.length == 0){
        this.preLoader()
        let response = await this.receiving_api.updateReceivingAsync(this.receiving_vm)
        this.preLoader(false)
        if (response.is_ok){
          this.$emit(UPDATED_NOTES_RECEIVING_EVENT_NAME,response.data)
          this.hideModal()
        }else{
          this.showAlert(response.error_messages)
        }
      }
    },
    hideModal(){
      this.hideDialogById('receiving-notes-edit-action-modal')
    }
  }
}
</script>

<style lang="scss">
@import './receiving-notes-edit-action.scss';
</style>
