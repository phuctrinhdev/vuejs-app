<template>
  <table class="normal birthday-greetings-tab">
    <thead>
      <tr>
        <td class="status">{{ $t('general.status') }}</td>
        <td class="type">{{ $t('messages.message-type') }}</td>
        <td class="edit">{{ $t('general.edit') }}</td>
      </tr> 
    </thead>
    <tbody>
      <tr>
        <td>
          <span :class="status_class"/>
        </td>
        <td>{{ $t('messages.birthday-greetings') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup">{{ $t('general.edit') }}</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { options }      from '../../../helpers/options'
import { mapMutations } from 'vuex'
import component_base   from '../../common/component-base/component-base'

import MessageSetupClientApi       from '../../../api/message-autos/message-setup-client-api'
import MessageSetupClientViewModel from '../../../view-model/message-autos/message-setup-client/message-setup-client-view-model'

export default {
  extends : component_base,
  data(){
    return {
      options: options,
      message_setup_client_api: {},
      message_setup_client: {},
      service_category_api: {},
      shop_id: 0
    }
  },
  computed: {
    status_class() {
      let class_name = ''
      if(this.message_setup_client.fields.status == options.common_status.active) class_name = 'active-btn'
      else if(this.message_setup_client.fields.status == options.common_status.inactive) class_name = 'inactive-btn'
      else class_name = 'not-setting-btn'

      return class_name
    },
  },
  created(){
    this.message_setup_client_api = new MessageSetupClientApi()
    this.message_setup_client = new MessageSetupClientViewModel()
    this.shop_id = this.shop_data.shop_id
  },
  methods: {
    ...mapMutations('setup_automatic_messaging', [
      'setSetupAutomaticMessagingInfo',
    ]),
    async onLoadForm(){
      await this.loadDataTableAsync()
    }, 
    async loadDataTableAsync() { 
      this.preLoader()
      let result = await this.message_setup_client_api.getMessageSetupClientAsync(this.shop_id)
      this.preLoader(false)
      if(result.is_ok){
        this.message_setup_client = result.data
      }
      else{
        this.showAlert(result.error_messages)
      }
    },
    onActionSetup(){
      this.setSetupAutomaticMessagingInfo({
        tab  : options.messages_enums.setup_automatic_messaging_tab.client,
        type : options.messages_enums.setup_automatic_messaging_type.birthday_greetings,
        // id   : this.message_setup_client.fields.id
      })
      this.$router.push('setup-automatic-messaging-info')
    }
  }
}
</script>

<style lang="scss">
  .birthday-greetings-tab {
    thead {
      tr {
        td {
          &.status {
            width: 20%;
          }
          &.type {
            width: 60%;
          }
          &.edit {
            width: 20%;
          }
        }
      }
    }
  }
</style>