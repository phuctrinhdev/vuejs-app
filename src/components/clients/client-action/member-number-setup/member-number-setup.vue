<template>
  <div>
    <b-modal id="member-number-setup-modal" 
             :title="$t('client-environment.member-number-setup')"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             class="member-number-setup-modal">
      <div class="input-box tac">
        <radio-group v-model="member_number_setup" :options="options.clients_enums.member_number_setup_type" :buttons="false"/>
      </div>  
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ClientEnvironmentSetupApi from '../../../../api/clients/client-environment-setup-api'
import { options } from '../../../../helpers/options'
import { CLIENTS_ENUMS } from '../../../../config/constant'
import btn_action_group from '../../../../components/common/button/btn-action-group/btn-action-group'
import radio_group from '../../../../components/common/form/radio/radio-group/radio-group' 
import component_base    from '../../../../components/common/component-base/component-base'
import ClientsCache        from '../../../../helpers/cache/clients-cache'

export default {
  components: {
    'btn-action-group': btn_action_group,
    'radio-group': radio_group,
  },
  extends: component_base,
  props: {
    data: {
      type: Number,
      default: CLIENTS_ENUMS.MEMBER_NUMBER_SETUP_TYPE.AUTO
    }
  },
  data(){
    return {
      options: options,
      member_number_setup: this.data,
      form_options: {
        delete: false
      },
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    })
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    async onConfirm(){
      let data = {
        value: this.member_number_setup,
        shop_id: this.shop_data.shop_id,
        setup_type: CLIENTS_ENUMS.ENVIRONMENT_SETUP_TYPE.MEMBER_NUMBER_SETUP
      }
      this.preLoader()
      let client_environment_setup_api = new ClientEnvironmentSetupApi() 
      let result = await client_environment_setup_api.updateEnvironmentSetupAsync(data)
      this.preLoader(false)

      if(result.is_ok) this.actionSuccess(result)
      else this.showAlert(result.error_messages)
    },
    actionSuccess(result){      
      ClientsCache.clearAllClientsSetupCache()
      this.$emit('update-setup', result.data.member_number_setup)
      this.hideModal()
    },
    onCancel(){
      this.hideModal()
    }, 
    hideModal(){
      this.hideDialogById('member-number-setup-modal')
    }
  }
}
</script>