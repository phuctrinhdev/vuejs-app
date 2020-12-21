<template>
  <div class="common-style">
    <b-modal id="family-action-modal" 
             ref="my-modal"
             :title="$i18n.t('family.family-member')"
             :no-close-on-backdrop="true"
             hide-footer
             size="lg"
             @show="onLoadForm()">
      <component ref="view" 
                 :is="view"
                 :clients_setup="clients_setup"
                 @change-component="onChangeComponent"/>
      <div class="modal-footer">
        <a class="btn default cancel" block @click="hideModal">{{ $t('general.close') }}</a>
      </div>
    </b-modal>
    
    <family-member-action @family-member-action="onActionFamilyMemberFinished"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { CLIENTS_ENUMS }          from '../../../config/constant'
import combonent_base             from '../../common/component-base/component-base'
import family_member_list         from '../../../components/clients/family/family-member-list.vue'
import family_member_search       from '../../../components/clients/family/family-member-search.vue'
import family_member_action       from '../../../components/clients/family/family-member-action.vue'
import ClientApi from '../../../api/clients/client-api'
import ClientsCache                     from '../../../helpers/cache/clients-cache'

export default {
  components: {
    'family-member-action': family_member_action
  },
  extends: combonent_base,
  data(){
    return {
      client_api: new ClientApi(),
      view: null,

      clients_setup: {},
      clients_cache: new ClientsCache(),
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('client_family', {
      family_members: 'getFamilyMembers'
    }),
  },
  methods: {
    ...mapActions('client_family', [
      'updateFamilyMembersData',
    ]),
    ...mapActions('client', [
      'updateClientInformationData',
      'getClientInformationDataAsync'
    ]),
    hideModal(){
      this.$refs['my-modal'].hide()
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      await this.initClientSetup()

      this.view = family_member_list
      this.$nextTick(() => {
        this.$refs.view.loadTableData()
      })
    },
    async initClientSetup(){
      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup))
        this.showMissingClientsSetupAlert()
    },
    onChangeComponent(view){
      if(view == CLIENTS_ENUMS.PAGE.FAMILY_MEMBER_SEARCH){
        this.view = family_member_search
      }
      else{
        this.view = family_member_list
        this.$nextTick(() => {
          this.$refs.view.loadTableData()
        })
      }
    },
    async onActionFamilyMemberFinished(){
      await this.getClientInformationDataAsync(Object.assign({}, { shop_id: this.shop_data.shop_id, client_id: this.x_client.data.id }))
      
      this.view = family_member_list
      this.$nextTick(() => {
        this.$refs.view.loadTableData()
        this.$emit('finished-family-action')
      })
    }
  }
}
</script>
<style lang="scss">
@import './family.scss';
</style>