<template>
  <div class="common-style">
    <b-modal id="img-show-modal" 
             :title="$t('sales-message-tab.image')" 
             hide-footer no-close-on-backdrop
             size="sm"
             @show="onLoadForm()">             
      
      <div class="img-show-box">
        <p class="img-border-box tac">
          <img :src="mms_image" @load="revoke">
        </p>
      </div>

      <div class="modal-footer">
        <a class="btn default cancel" block @click="hideModal">close</a>
      </div>
    </b-modal>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import TextMessageApi from '../../../api/messages/text-message-api'
import component_base from '../../../components/common/component-base/component-base'

export default {
  extends: component_base,
  data(){
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
      this.hideDialogById('img-show-modal')
    },
  }
}
</script>
<style lang="scss">
@import './client-information.scss';
</style>