<template>
  <div class="common-style add-item-modal">
    <b-modal id="client-group-action-modal"             
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             @show="onLoadForm()">             
      <form class="form-wrapper clearfix">
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('misc-codes.item-name') }} <strong class="color-red">*</strong></dt>
            <dd><input v-model="client_group.fields.name" type="text" class="w100p"></dd>
          </dl> 
        </div>
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('misc-codes.status') }}</dt>
            <dd>
              <div class="switch">
                <radio-group v-model="client_group.fields.status" :options="options.option_goods_status" :buttons="true"/>
              </div>
            </dd>
          </dl>
        </div>
      </form>
      <error-box :errors="client_group_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" 
                          @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { options }          from '../../../../helpers/options'
import ClientGroupViewModel from '../../../../view-model/clients/client-group-view-model.js'
import ClientGroupApi       from '../../../../api/clients/client-group-api.js'
import radio_group          from '../../../common/form/radio/radio-group/radio-group' 
import error_box            from '../../../common/form/error-box/error-box' 
import btn_action_group     from '../../../common/button/btn-action-group/btn-action-group'
import component_base       from '../../../common/component-base/component-base'
import ClientsCache from '../../../../helpers/cache/clients-cache'

export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      options:options, 
      
      client_group: new ClientGroupViewModel(),
      client_group_errors: [], 
      
      form_title: '',
      form_options: {
        delete: false
      },
    }
  },
  computed: {
    ...mapGetters('client_group', {
      action_data: 'getClientGroupAction'
    }),
  },
  methods: { 
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addClientGroupAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateClientGroupAsync', 'update-page')
      }
    },
    onCancel(){
      this.hideModal()
    },
    onDelete(){
      this.submitActionAsync('deleteClientGroupAsync', 'reload-page')
    },
    hideModal(){
      this.hideDialogById('client-group-action-modal')
    },
    onLoadForm(){
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('misc-codes.add-item')
        this.client_group = new ClientGroupViewModel()
      }
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('misc-codes.edit-item')
        this.client_group.fields = Object.assign({}, this.action_data.data)
      }
      this.form_options.delete = false
      this.client_group_errors = []
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){
      this.client_group.fields = Object.assign(this.client_group.fields, this.shop_data)      
      // validate
      this.client_group_errors = this.client_group.isValid() 
      if(this.client_group_errors.length == 0) {
        this.preLoader()
        let client_group_api = new ClientGroupApi() 
        let result = await client_group_api[api_action](this.client_group.fields)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result, success_action)
        else this.client_group_errors = result.error_messages
      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        ClientsCache.clearAllClientsSetupCache()
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else {
        this.client_group_errors = result.error_messages
      } 
    }
  }
}
</script>
<style lang="scss">
@import '../add-item.scss';
</style>