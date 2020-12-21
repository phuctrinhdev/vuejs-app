<template>
  <div class="common-style add-item-modal">
    <b-modal id="client-referralsource-action-modal"            
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             @show="onLoadForm()">
      <form class="form-wrapper clearfix">
        <div class="form-group ">
          <dl class="clearfix list">
            <dt>{{ $t('misc-codes.item-name') }} <strong class="color-red">*</strong></dt>
            <dd><input v-model="client_referralsource.fields.name" type="text" class="w100p"></dd>
          </dl>
        </div>
        <div class="form-group">
          <dl class="clearfix list">
            <dt>Status</dt>
            <dd>
              <div class="switch">
                <radio-group v-model="client_referralsource.fields.status" :options="options.option_goods_status" :buttons="true"/>

                <!-- <b-form-radio-group v-model="client_referralsource.fields.status" buttons>
                  <b-form-radio :value="options.good_status.active">{{ $t('general.active') }}</b-form-radio>
                  <b-form-radio :value="options.good_status.inactive">{{ $t('general.inactive') }}</b-form-radio>
                </b-form-radio-group> -->
              </div>
            </dd>
          </dl>                  
        </div>
      </form>
      <error-box :errors="client_referralsource_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" 
                          @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
      </div>
      <!-- <div v-if="client_referralsource_errors.length > 0" class="validate-errors-wrapper">
        <ul class="validate-errors">
          <li v-for="error in client_referralsource_errors" :key="error" v-html="error"/>
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" @click="onConfirm()">{{ $t('general.confirm') }}</button>
        <button type="button" class="btn btn-secondary" @click="onCancel()">{{ $t('general.cancel') }}</button>
        <button v-if="form_detele" class="btn btn-default" @click="onDelete()">{{ $t('general.delete') }}</button>
      </div> -->
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { options }                    from '../../../../helpers/options'
import ClientReferralSourceViewModel  from '../../../../view-model/clients/client-referralsource-view-model.js'
import ClientReferralSourceApi        from '../../../../api/clients/client-referralsource-api.js'
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
      
      client_referralsource: new ClientReferralSourceViewModel(),
      client_referralsource_errors: [], 
      
      form_title: '',
      form_options: {
        delete: false
      },
    }
  },
  computed: {
    ...mapGetters('client_referralsource', {
      action_data: 'getClientReferralSourceAction'
    }),
  },
  methods: { 
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addClientReferralSourceAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateClientReferralSourceAsync', 'update-page')
      }
    },
    onCancel(){
      this.hideModal()
    },
    onDelete(){
      this.submitActionAsync('deleteClientReferralSourceAsync', 'reload-page')
    },
    hideModal(){
      this.hideDialogById('client-referralsource-action-modal')
    },
    onLoadForm(){
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('misc-codes.add-item')
        this.client_referralsource = new ClientReferralSourceViewModel()
      }
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('misc-codes.edit-item')        
        this.client_referralsource.fields = Object.assign({}, this.action_data.data)
      }
      this.form_options.detele = false
      this.client_referralsource_errors = []
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){      
      this.client_referralsource.fields = Object.assign(this.client_referralsource.fields, this.shop_data)      
      // validate
      this.client_referralsource_errors = this.client_referralsource.isValid() 
      if(this.client_referralsource_errors.length == 0) {
        this.preLoader()
        let client_referralsource_api = new ClientReferralSourceApi() 
        let result = await client_referralsource_api[api_action](this.client_referralsource.fields)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result, success_action)
        else this.client_referralsource_errors = result.error_messages
      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        ClientsCache.clearAllClientsSetupCache()
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else {
        this.client_referralsource_errors = result.error_messages
      } 
    }
  }
}
</script>
<style lang="scss">
@import '../add-item.scss';
</style>