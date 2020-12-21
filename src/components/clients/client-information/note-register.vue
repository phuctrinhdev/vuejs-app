<template>
  <div class="common-style">
    <b-modal id="note-register-modal"             
             :title="note_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             @show="onLoadForm">             
      <textarea v-model="notes" 
                :readonly="note_data.type != options.page_modal_check.page"
                class="note noresize w100p long" 
                cols="30" 
                rows="10"/>
      <div class="modal-footer">
        <div class="btn-action-group">
          <button v-if="note_data.type == options.page_modal_check.page" class="btn btn-default" @click="onConfirm">{{ $t('general.confirm') }}</button>
          <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters }    from 'vuex'
import ClientApi         from '../../../api/clients/client-api.js'
import btn_action_group  from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'
import { options }       from '../../../helpers/options'

export default {
  components: {
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  props: {
    data: {
      type    : Object,
      default : () => ([])
    }
  },
  data(){
    return {
      options,
      note_title : '',
      notes      : '',
      client_api : new ClientApi()
    }
  },
  computed:{
    note_data(){
      return this.data
    },
    ...mapGetters('client', {
      x_client_information: 'getClientInformation'
    })
  },
  methods: {
    ...mapActions('client', [
      'updateClientInformationData'
    ]),

    async onLoadForm(){
      if(this.note_data.type == options.page_modal_check.page){
        this.note_title = this.$i18n.t('client-information.add-note')
      }else{
        this.note_title = this.$i18n.t('general.notes')
      }
       
      // Get Client Detail by ClientId And ShopId
      this.preLoader()
      let result = await this.client_api.getClientAsync({ client_id : this.data.client_id, shop_id   : this.shop_data.shop_id })
      this.preLoader(false)
      if(result.is_ok){
        this.notes = result.data.notes
      }
      else{
        this.showAlert(result.error_messages)
      }
    },

    async onConfirm(){
      this.preLoader(true)
      let sent_data = {
        client_id : this.data.client_id,
        shop_id   : this.data.shop_id,
        notes     : this.notes
      }
      let result = await this.client_api.updateNoteAsync(sent_data)
      this.preLoader(false)
      if(result.is_ok) { 
        let tmp_client_information        = this.x_client_information
        tmp_client_information.data.notes = result.data.notes 
        this.updateClientInformationData(tmp_client_information)
        this.hideModal()
      }
      else{
        this.showAlert(result.error_messages)
      }
    },

    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('note-register-modal')
    }

  }
}
</script>
<style lang="scss">
@import './client-information.scss';
</style>