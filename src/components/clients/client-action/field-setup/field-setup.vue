<template>
  <div>
    <b-modal id="setup-field-modal" 
             :title="$t('setup-field.title')"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             class="setup-field-modal" 
             @show="onLoadForm()" >
      <div class="common-style">
        <p class="color-red">
          {{ $t('setup-field.guide') }}
        </p>
        <div class="set-field-check-box">
          <ul class="clearfix">
            <li v-for="(field, index) in setup_fields" :key="index">
              <b-form-checkbox v-model="selected_fields" :value="field.value">
                <span class="text">{{ $t(field.text) }}</span>
              </b-form-checkbox>
            </li>
          </ul>
        </div>
      </div>  
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ClientFieldSetupApi from '../../../../api/clients/client-field-setup-api'
import btn_action_group from '../../../../components/common/button/btn-action-group/btn-action-group'
import component_base    from '../../../../components/common/component-base/component-base'
import ClientsCache        from '../../../../helpers/cache/clients-cache'

export default {
  components: {
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  props: {
    field_setup: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      form_options: {
        delete: false
      },
      selected_fields: [],
      setup_fields: [
        { text: 'clients.member',          value: 'member' },
        { text: 'clients.mobile-number2',  value: 'mobile_number2' },
        { text: 'clients.sex',             value: 'sex' },
        { text: 'clients.phone-number',    value: 'phone_number' },
        { text: 'general.email',           value: 'email' },
        { text: 'clients.birthday',        value: 'birthday' },
        { text: 'clients.client-rating',   value: 'client_rating' },
        { text: 'clients.client-group',    value: 'client_group' },
        { text: 'clients.preferred-staff', value: 'preferred_staff' },
        { text: 'clients.recommender',     value: 'recommender' },
        { text: 'clients.referral-source', value: 'referral_source' },
        { text: 'clients.address',         value: 'address' },
      ]
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser'
    }),
  },
  methods: { 
    onConfirm(){
      this.submitActionAsync()
    },
    onCancel(){
      this.hideModal()
    }, 
    hideModal(){
      this.hideDialogById('setup-field-modal')
    },
    onLoadForm(){
      this.selected_fields = []
      if(Object.keys(this.field_setup).length==0){
        for(let i in this.setup_fields){
          this.selected_fields.push(this.setup_fields[i].value)
        }
      }
      else{
        for(let i in this.field_setup){
          if(this.field_setup[i])
            this.selected_fields.push(i)
        }
      }
    },

    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(){
      let data = {}
      for(let i in this.setup_fields){
        if(this.selected_fields.indexOf(this.setup_fields[i].value) > -1)
          data[this.setup_fields[i].value] = true
        else
          data[this.setup_fields[i].value] = false
      }
      data.shopId = this.shop_data.shop_id
      this.preLoader()
      let client_field_setup_api = new ClientFieldSetupApi() 
      let result = await client_field_setup_api.updateClientFieldSetupsAsync(data)
      this.preLoader(false)

      if(result.is_ok) this.actionSuccess(result)
      else this.showAlert(result.error_messages)
    },
    actionSuccess(result){
      if(result.is_ok){
        ClientsCache.clearAllClientsSetupCache()
        this.$emit('update-page-fields',result.data)
        this.hideModal()
      } 
      else this.showAlert(result.error_messages)
    }
  }
}
</script>