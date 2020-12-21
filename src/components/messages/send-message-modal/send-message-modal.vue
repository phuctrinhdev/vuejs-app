<template>
  <div class="common-style">
    <b-modal id="send-message-modal" 
             :title="$t('messages.message')" 
             hide-footer no-close-on-backdrop
             size="lg"
             @show="onLoadForm()">             
      <send-message-action ref="send_text_message" :data="data" :type="type" 
                           :page="options.page_modal_check.modal"
                           @reload-page="onReloadPage"/>
    </b-modal>
  </div>
</template>

<script>
import { options }         from '../../../helpers/options'
import send_message_action from '../../../components/messages/send-message-action/send-message-action'
import component_base      from '../../../components/common/component-base/component-base'

export default {
  components: {
    'send-message-action' : send_message_action
  },
  extends: component_base,
  props: {
    data: {
      type: undefined, // Any type
      default: null
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      options,
    }
  },
  methods: {
    async onLoadForm(){
      await this.$refs['send_text_message'].onLoadForm()
    },
    onReloadPage(){
      this.$emit('reload-page')
      this.hideDialogById('send-message-modal')
    }
  } 
}
</script>