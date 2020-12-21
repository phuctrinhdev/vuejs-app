<template>
  <b-modal id="action-message-setup-post-visit-general-modal" 
           :title="$t('message-autos.sending-time')"
           :no-close-on-backdrop="true"
           hide-footer 
           class="action-message-setup-post-visit-general-modal"
           @show="onLoadForm()">
    <select-control v-model="target_hour" :options="target_hour_options"
                    :not-translate="true"
                    class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.hour') }}
    <select-control v-model="target_minute" :options="target_minute_options"
                    :not-translate="true"
                    class="dib time-sm" text-field="text" value-field="value"/>{{ $t('messages.minutes') }} 
    <div class="modal-footer">
      <btn-action-group :data="form_options" 
                        @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template>

<script>
import { options }    from '../../../helpers/options'
import component_base from '../../common/component-base/component-base'
import { mapGetters } from 'vuex'

import MessageSetupPostVisitApi from '../../../api/message-autos/message-setup-post-visit-api'
import MessageSetupPostVisitGeneralViewModel from '../../../view-model/message-autos/message-setup-post-visit/message-setup-post-visit-general-view-model' 

import error_box        from '../../common/form/error-box/error-box' 
import select_control   from '../../../components/common/form/select/select-control/select-control2'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'

export default {
  components: {
    'select-control'   : select_control,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  }, 
  extends: component_base,
  data(){
    return {
      options,

      message_setup_post_visit_api: {},
      message_setup_post_visit_general: {},

      target_hour: '08',
      target_minute: '00',
      target_hour_options: [],
      target_minute_options: [],
      api_action: '',

      form_options: {
        delete: false
      },
    }
  },
  computed: {
    ...mapGetters('message_setup_post_visit_general', {
      action_data: 'getMessageSetupPostVisitGeneralAction'
    })
  },
  created(){
    this.message_setup_post_visit_api = new MessageSetupPostVisitApi()

    for (let index = 8; index < 23; index++) {
      let hour = ''
      if(String(index).length < 2) hour = '0' + index
      else hour = String(index)
      this.target_hour_options.push({ text: hour, value: hour })
    }
    for (let index = 0; index < 6; index++) {
      let minute = ''
      minute = index + '0'
      this.target_minute_options.push({ text: minute, value: minute })
    }
  },
  methods: {
    hideModal(){
      this.hideDialogById('action-message-setup-post-visit-general-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.target_hour = '08'
      this.target_minute ='00'

      if(this.action_data.action == options.form_actions.add) {
        this.message_setup_post_visit_general = new MessageSetupPostVisitGeneralViewModel()
        this.message_setup_post_visit_general.fields.country_code = this.shop_data.country
        this.message_setup_post_visit_general.fields.shop_id = this.shop_data.shop_id
        this.api_action = 'createMessageSetupPostVisitGeneralAsync'
      }
      if(this.action_data.action == options.form_actions.edit){
        this.message_setup_post_visit_general = Object.assign(new MessageSetupPostVisitGeneralViewModel(), this.action_data.data)
        this.api_action = 'updateMessageSetupPostVisitGeneralAsync'
        let temp = this.message_setup_post_visit_general.fields.send_time.split(':')
        this.target_hour = temp[0]
        this.target_minute = temp[1]
      }
    },
    async onConfirm(){
      this.preLoader(true)
      this.message_setup_post_visit_general.fields.send_time = this.target_hour + ':' + this.target_minute
      let result = await this.message_setup_post_visit_api[this.api_action](this.message_setup_post_visit_general)
      this.preLoader(false)
      if(result.is_ok) {
        this.$emit('reload-page')
        this.hideModal()
      }else this.showAlert(result.error_messages)
    },
  }
}
</script>

<style lang="scss">
@import './sending-time-form.scss';
</style>