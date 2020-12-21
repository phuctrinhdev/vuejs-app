<template>
  <b-modal 
    :id="modal_id" 
    :class="modal_id"
    :title="$t('clients.owner-login')" 
    hide-footer 
    size="sm">
    <b-form>
      <b-form-group
        :label="$t('user-accounts.id')"
        label-cols-sm="4"
        label-cols-lg="3"
        label-for="owner_id"
      >
        <b-form-input v-model="user_id"/>
      </b-form-group>
      <b-form-group
        :label="$t('general.password')"
        label-cols-sm="4"
        label-cols-lg="3"
        label-for="owner_password"
      >
        <b-form-input v-model="user_pass" type="password" class="owner-password"/>
      </b-form-group>
    </b-form>
    <div class="modal-footer">
      <btn-action-group 
        :data="form_options" 
        @confirm="onCheckOwnerLogin" 
        @cancel="hideModal"/>
    </div>
  </b-modal>
</template>

<script>
import component_base from '../../common/component-base/component-base'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import ClientManagementApi from '../../../api/clients/client-management-api'

export default {
  components: {
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      modal_id: 'check-owner-login-modal',
      is_owner: false,
      form_options: {
        delete: false,
        confirm: true
      },

      client_management_api: new ClientManagementApi(),
      user_id: '',
      user_pass: ''
    }
  },
  methods: {
    hideModal() {
      this.hideDialogById('check-owner-login-modal')
    },
    async onCheckOwnerLogin(){
      let query = {
        user_id : this.user_id,
        password: this.user_pass,
        shop_id : this.shop_data.shop_id,
      }
      
      this.preLoader()
      let response = await this.client_management_api.checkUserMasterAsync(query)
      this.preLoader(false)

      if(response.is_ok){
        this.$emit('confirm', response.data)
        this.hideModal()
      }
      else this.showAlert(response.error_messages)
    }
  }
}
</script>

<style lang="scss">
.check-owner-login-modal {
  .owner-password {
    font-family: Arial, Helvetica, sans-serif;
  }
}
</style>