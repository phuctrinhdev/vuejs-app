<template>
  <div class="common-style add-item-modal">
    <b-modal id="password-edit-modal" 
             :title="$t('user-accounts.password-edit-title')" 
             size="sm" 
             hide-footer no-close-on-backdrop
             @show="onLoadForm()">     
      <form class="form-wrapper clearfix">
        <div class="form-group">
          <dl class="clearfix list mb10">
            <dt>{{ $t('user-accounts.id') }} <strong class="color-red">*</strong></dt>
            <dd><input v-model="password_data.fields.user_id" type="text" class="block w100p"
                       disabled></dd>
          </dl> 
          <dl class="clearfix list mb10">
            <dt>{{ $t('general.password') }} <strong class="color-red">*</strong></dt>
            <dd><input v-model="password_data.fields.password" type="password" class="w100p"></dd>
          </dl> 
          <div v-html="$t('user-accounts.password-info')"/>
          <dl class="clearfix list">
            <dt>{{ $t('general.password-confirmation') }} <strong class="color-red">*</strong></dt>
            <dd><input v-model="password_data.fields.password2" type="password" class="w100p"></dd>
          </dl>
        </div>
      </form>
      <error-box :errors="password_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" 
                          @confirm="onConfirm" @cancel="hideModal"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
import component_base from '../../common/component-base/component-base'
import UserAccountApi from '../../../api/account/user-account-api'
import PasswordViewModel from '../../../view-model/account/password-view-model.js'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import error_box from '../../common/form/error-box/error-box'

export default {
  components: {
    'btn-action-group': btn_action_group,
    'error-box': error_box,
  },
  extends: component_base,
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data(){
    return {
      password_data: {},
      password_errors: [],

      form_options: {
        delete: false
      }
    }
  },
  beforeMount(){
    this.password_data = new PasswordViewModel()
  },
  methods: {
    onLoadForm(){
      this.password_errors = []
      this.password_data.fields = Object.assign({}, this.data)
    },
    async onConfirm(){
      this.password_errors = this.password_data.isValid()
      if(this.password_errors.length == 0 ) {
        let data_send = {
          id: this.password_data.fields.user_account_id,
          password: this.password_data.fields.password,
          shop_id: this.password_data.fields.shop_id,
          user_id: this.password_data.fields.user_id 
        }
        this.preLoader(true)
        let user_account_api = new UserAccountApi()
        let result = await user_account_api.updatePasswordAsync(data_send)
        this.preLoader(false)
        if(result.is_ok) this.hideModal()
        else this.password_errors = result.error_messages
      }
    },
    hideModal() {
      this.hideDialogById('password-edit-modal')
    }
  }
}
</script>