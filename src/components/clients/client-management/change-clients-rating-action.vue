<template>
  <b-modal 
    :id="modal_id"
    :class="modal_id"
    :title="$t('clients.change-clients-rating')"
    :no-close-on-backdrop="true"
    hide-footer
    @show="onLoadForm()"
    @hide="onCancel()">
    <b-form>
      <b-form-group
        :label="$t('clients.new-client-rating')"
        label-cols-sm="4"
        label-cols-lg="3"
        label-for="clients_rating"
      >
        <b-form-select v-model="client_rating_id_selected" 
                       :options="client_rating_options" 
                       :placeholder="$t('general.select')" 
                       value-field="id"
                       text-field="name"/>
      </b-form-group>
      <p v-if="client_ids != null">Clients rating of {{ client_ids.length }} clients will be changed to new rating</p>
    </b-form>
    <div class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template>

<script>
import component_base from '../../common/component-base/component-base'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import ClientsCache from '../../../helpers/cache/clients-cache'
import ClientManagementApi from '../../../api/clients/client-management-api'

export default {
  components: {
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  props: {
    client_ids: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      modal_id: 'change-clients-rating-action-modal',
      form_options: {
        delete: false,
        confirm: true
      },
      clients_setup: {},
      clients_cache: new ClientsCache(),
      
      client_management_api: new ClientManagementApi(),
      client_rating_id_selected: 0,
      client_rating_options: []
    }
  },
  computed: {
    warning_select_client_rating(){return this.$t('clients.warning-select-client-rating')},
    warning_select_clients_for_change_rating(){return this.$t('clients.warning-select-clients-for-change-rating')},
    change_client_rating_success(){return this.$t('clients.change-client-rating-success')},
    text_all(){return this.$t('general.all')}
  },
  async created(){
    this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
    if(this.isNullObject(this.clients_setup)){
      this.showMissingClientsSetupAlert()
    }
    else {
      let first_client_rating_option = { id: 0, name: this.text_all }
      this.client_rating_options = [first_client_rating_option, ...this.clients_setup.client_ratings]
    }
  },
  methods: {
    hideModal() {
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.client_rating_id_selected = 0
    },
    async onConfirm(){
      // validate
      let errors = []
      if(this.client_rating_id_selected == 0){
        errors.push(this.warning_select_client_rating)
      }
      if(this.client_ids != null && this.client_ids.length == 0){
        errors.push(this.warning_select_clients_for_change_rating)
      }
      if(errors.length > 0){
        this.showAlert(errors)
        return
      }
      
      let query = {
        client_ids        : this.client_ids,
        client_rating_id  : this.client_rating_id_selected,
        session_token     : this.x_user.session_token,
        shop_id           : this.shop_data.shop_id,
        shop_location     : this.shop_data.shop_location
      }

      this.preLoader()
      let response = await this.client_management_api.changeClientsRatingAsync(query)
      this.preLoader(false)

      if(response.is_ok){
        this.showAlert(['Change clients rating successfully'])
        this.hideModal()
      }
      else this.showAlert(response.error_messages)
    }
  }
}
</script>