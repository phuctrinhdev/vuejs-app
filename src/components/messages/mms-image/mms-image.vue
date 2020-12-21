<template>
  <b-modal id="mms-image-modal" 
           :title="$t('messages.sending-image')" 
           size="sm" 
           hide-footer no-close-on-backdrop
           @show="onLoadForm()">
    <p class="tac">
      <img :src="mms_image" class="w100p" @load="revoke">
    </p>
    <div class="modal-footer">
      <button class="btn btn-default" @click="hideModal">{{ $t('general.close') }}</button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import component_base from '../../../components/common/component-base/component-base'
import TextMessageApi from '../../../api/messages/text-message-api'

export default {
  extends: component_base,
  data() {
    return {
      mms_image: ''
    }
  },
  computed: {
    ...mapGetters('text_message', {
      image_data  : 'getImage',
    })
  },
  methods: {
    async onLoadForm(){
      let text_message_api = new TextMessageApi()
      this.preLoader()
      this.mms_image = await text_message_api.getImageUrl(this.image_data)
      this.preLoader(false)
    },
    revoke(){
      window.URL.revokeObjectURL(this.mms_image)
    },
    hideModal(){
      this.hideDialogById('mms-image-modal')
    },
  }
}
</script>