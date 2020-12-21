<template>
  <main class="app-content">
    <client-action v-if="client_action_visible" :root="root" @reload-page="onReloadPage" 
                   @hidden="client_action_visible=false"/>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import client_action               from '../../../components/clients/client-action/client-action.vue'
import component_base from '../component-base/component-base'
import { isMobile }               from '../../../helpers/common'
export default{
  components: {
    'client-action': client_action,
  },
  extends: component_base,
  props: {
    call_number: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      client_action_visible: false,
      root: 'cid-popup'
    }
  },
  mounted(){
    this.client_action_visible=false
    this.addClient()
  },
  methods: {
    ...mapActions('client', [
      'setClientActionDataAsync'
    ]),
    addClient(){
      this.client_action_visible = true
      var unregistered_call_number = this.call_number
      var is_mobile = false
      if(isMobile(unregistered_call_number))
        is_mobile = true
      let client_action = {
        action: 'add-client-from-cid',
        call_number : unregistered_call_number,
        is_mobile: is_mobile
          
      }
      this.setClientActionDataAsync(client_action).then(() => {
        this.showDialogById('action-client-modal')
      })
    },
    onReloadPage(client){
      this.$emit('reload-page', client)
      this.client_action_visible=false
    }
  }
}
</script>