<template>
  <main>
    <div class="common-style contents-style send-messages">
      <article class="setup-top clearfix">
        <h3>{{ title }}</h3>
      </article>
      <send-message-action :type="$route.params.type" 
                           :page="options.page_modal_check.page" 
                           :data="$route.params.client_id"
                           :call_number="$route.params.call_number"/>
    </div>
  </main>
</template>

<script>
import { options } from '../../../helpers/options'
import send_message_action from '../../../components/messages/send-message-action/send-message-action'

export default {
  components: {
    'send-message-action': send_message_action
  },
  data() {
    return {
      options: options,
      title: null
    }
  },
  mounted(){
    if(this.$route.params.type == options.messages_enums.send_page.unregister_clients 
      || this.$route.params.type == options.messages_enums.send_page.cid_unregister_client)
      this.title = this.$i18n.t('messages.unregister-message-title')
    else if(this.$route.params.type == options.messages_enums.send_page.client)
      this.title = this.$i18n.t('messages.send-message-title')
  }
}
</script>

<style lang='scss'>
@import './send-messages.scss';
</style>