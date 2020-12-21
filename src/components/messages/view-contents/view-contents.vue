<template>
  <div class="common-style view-contents">
    <b-modal id="view-contents-modal" 
             :title="$t('messages.contents')"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             @show="onLoadForm()">
      <div class="contents">
        <div :class="{'image-mms': message_data.message_type == options.messages_enums.message_type.mms }" class="phone-message-box box content-image">
          <div class="inner">
            <div v-if="message_data.message_type == options.messages_enums.message_type.mms" class="mms-img-box">
              <img v-if="!emptyValue(message_data.image_path) && !emptyValue(message_data.image_name)" :src="imagePath()">
              <font v-else>{{ $t('messages.image-area') }}</font>
            </div>
            <textarea ref="txArea" v-model="message_data.contents" :disabled="true" 
                      class="textbox noresize ft-b" cols="30" rows="10"/>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" style="width: 130px !important;" @click="onSaveMessage">{{ $t('messages.save-message') }}</button>
        <button class="btn btn-default" @click="hideModal">{{ $t('general.close') }}</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { options }      from '../../../helpers/options'
import component_base   from '../../../components/common/component-base/component-base'
import TextMyMessageApi from '../../../api/messages/text-my-message-api'
import { emptyValue }   from '../../../helpers/common'

export default {
  extends: component_base,
  props: {
    data: {
      type: Object,
      default: null
    },
  },
  data(){
    return {
      options: options,
      message_data: {
        message_type : options.messages_enums.message_type.sms,
        contents     : '',
        image_path   : '',
        image_name   : ''
      }
    }
  },
  methods: {
    emptyValue,
    onLoadForm(){
      Object.assign(this.message_data, this.data)
    },
    hideModal(){
      this.hideDialogById('view-contents-modal')
    },
    imagePath(){
      // eslint-disable-next-line no-undef
      return process.env.AZURE_STORAGE_MESSAGE_URL + this.message_data.image_path + '/' + this.message_data.image_name
    },
    async onSaveMessage(){
      let data_send = {
        shop_id      : this.shop_data.shop_id,
        contents     : this.message_data.contents,
        message_type : this.message_data.message_type == options.messages_enums.message_type.sms ? this.message_data.message_type : options.messages_enums.message_type.lms,
        solution_id  : this.shop_data.solution_id,
        country_code : this.shop_data.country
      }

      let text_my_message_api = new TextMyMessageApi()
      this.preLoader()
      let result = await text_my_message_api.createTextMyMessageAsync(data_send)
      this.preLoader(false)
      if(result.is_ok){
        this.showAlert(new Array(this.$i18n.t('general.success')))
      }else {
        this.showAlert(result.error_messages)
      } 
    },
  }
}
</script>

<style lang="scss">
@import './view-contents.scss';
</style>