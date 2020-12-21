<template>
  <div class="common-style">
    <b-modal id="family-member-action" 
             ref="my-modal"
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             @show="onLoadForm()">
      <div class="family-member-box">
        <div class="tabbox-table">
          <table class="normal">
            <thead>
              <tr>
                <th>{{ $t('family.name') }}</th>
                <th>
                  <template v-if="x_family_member_action.action == options.form_actions.delete">
                    <p>{{ $t('family.take-family-point') }}</p>
                    <p>({{ $t('general.max') }} 900,000)</p>
                  </template>
                  <template v-else>
                    {{ $t('family.relationship') }}
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ family_member.fields.target_client_name }}</td>
                <td>
                  <template v-if="x_family_member_action.action == options.form_actions.delete">
                    <input-money v-model="family_member.fields.family_point" class="w100p"/>
                  </template>
                  <template v-else>
                    <input v-model="family_member.fields.relationship" class="w100p">
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="x_family_member_action.action == options.form_actions.delete" class="fz13 mt10">
          {{ $t('family.delete-family-member-guide') }}
        </p>
      </div>
      <error-box :errors="family_member_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { options,  } from '../../../helpers/options'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import ClientFamilyApi from '../../../api/clients/client-family-api.js'
import error_box from '../../common/form/error-box/error-box' 
import FamilyViewModel from '../../../view-model/clients/family-view-model.js'
import component_base    from '../../common/component-base/component-base'
import ClientApi from '../../../api/clients/client-api'
import input_money           from '../../common/form/input/input-money/input-money.vue'

export default {
  components: {
    'btn-action-group': btn_action_group,
    'error-box': error_box,
    'input-money': input_money
  },
  extends: component_base,
  data(){
    return {
      options,
      form_title: '',
      client_api: new ClientApi(),
      client_family_api: new ClientFamilyApi(),

      family_member: new FamilyViewModel(),
      form_options: {
        delete: false
      },
      family_member_errors: [],
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('client_family', {
      x_family_member_action: 'getFamilyMemberAction',
    })
  },
  methods: {
    ...mapMutations('client', [
      'updateClientInformationFromEmptyValue',
    ]),
    ...mapActions('client_family', [
      'updateFamilyMembersData',
    ]),
    onLoadForm(){
      this.family_member_errors = []
      this.form_title = this.$i18n.t('family.add-family-member-title')
      this.family_member.fields = Object.assign({}, this.x_family_member_action.data)

      if(this.x_family_member_action.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('family.edit-family-member-title')
      }
      if(this.x_family_member_action.action == options.form_actions.delete){
        this.form_title = this.$i18n.t('family.delete-family-member-title')
      }
    },
    onConfirm(){
      if(this.x_family_member_action.action == options.form_actions.create){
        this.submitCreateFamilyAsync()
      }
      if(this.x_family_member_action.action == options.form_actions.add){
        this.submitAddFamilyMemberAsync()
      }
      if(this.x_family_member_action.action == options.form_actions.edit){
        this.submitUpdateFamilyMemberAsync()
      }
      if(this.x_family_member_action.action == options.form_actions.delete){
        this.submitDeleteFamilyMemberAsync()
      }
    },
    async submitCreateFamilyAsync(){
      let client_query = {
        client_id: this.family_member.fields.target_client_id,
        shop_id: this.shop_data.shop_id
      }
      let repsonse = await this.client_api.getClientAsync(client_query)
      if(repsonse.is_ok){
        let target_client = repsonse.data

        // check client mobile/phone
        this.updateClientInformationFromEmptyValue(this.x_client.data)
        
        // check target mobile/phone
        if(!target_client.mobile_number) target_client.mobile_number = ''
        if(!target_client.phone_number) target_client.phone_number = ''

        let send_data = {
          client_id                   : this.x_client.data.id,
          client_name                 : this.x_client.data.client_name,
          client_mobile_number        : this.x_client.data.mobile_number,
          client_phone_number         : this.x_client.data.phone_number,

          target_client_id            : target_client.id,
          target_client_name          : target_client.client_name,
          target_client_mobile_number : target_client.mobile_number,
          target_client_phone_number  : target_client.phone_number,
          relationship                : this.family_member.fields.relationship,

          created_by_id               : this.x_user.user_id,
          created_by_name             : this.x_user.user_name,
          session_token               : this.x_user.session_token,
          shop_location               : this.shop_data.shop_location,
          shop_id                     : this.shop_data.shop_id,
        }

        this.preLoader(true)
        let result = await this.client_family_api.createFamilyAsync(send_data)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result)
        else this.family_member_errors = result.error_messages
      }
      else {
        this.showAlert(repsonse.error_messages)
      }
    },
    async submitAddFamilyMemberAsync(){
      // 0 + f: add
      // client no family, target has family
      let send_data = {
        family_id             : this.x_family_member_action.data.family_id,
        client_id             : this.x_client.data.id,
        client_name           : this.x_client.data.client_name,
        client_mobile_number  : this.x_client.data.mobile_number,
        client_phone_number   : this.x_client.data.phone_number,
        relationship          : this.family_member.fields.relationship,

        created_by_id         : this.x_user.user_id,
        created_by_name : this.x_user.user_name,
        session_token         : this.x_user.session_token,
        shop_location         : this.shop_data.shop_location,
        shop_id               : this.shop_data.shop_id,
      }

      // f + 0: add
      // client has family, target no family
      if(this.family_member.fields.client_id == this.family_member.fields.target_client_id){
        let client_query = {
          client_id: this.family_member.fields.target_client_id,
          shop_id: this.shop_data.shop_id
        }
        let repsonse = await this.client_api.getClientAsync(client_query)
        if(repsonse.is_ok){
          let target_client = repsonse.data
          target_client = this.correctEmptyMobileAndPhoneNumber(target_client)

          send_data.client_id           = target_client.id
          send_data.client_name         = target_client.client_name
          send_data.client_mobile_number= target_client.mobile_number
          send_data.client_phone_number = target_client.phone_number
        }
        else {
          this.showAlert(repsonse.error_messages)
          return
        }
      }

      this.preLoader(true)
      let result = await this.client_family_api.addFamilyMemberAsync(send_data)
      this.preLoader(false)

      if(result.is_ok) this.actionSuccess(result)
      else this.family_member_errors = result.error_messages
    },
    async submitUpdateFamilyMemberAsync(){
      let send_data = {
        family_id       : this.x_family_member_action.data.family_id,
        family_member_id: this.x_family_member_action.data.family_member_id,
        relationship    : this.family_member.fields.relationship,
        updated_by_id   : this.x_user.user_id,
        updated_by_name : this.x_user.user_name,
        session_token   : this.x_user.session_token,
        shop_location   : this.shop_data.shop_location,
        shop_id         : this.shop_data.shop_id,
      }

      this.preLoader(true)
      let result = await this.client_family_api.updateFamilyMemberAsync(send_data)
      this.preLoader(false)

      if(result.is_ok) this.actionSuccess(result)
      else this.family_member_errors = result.error_messages
    },
    async submitDeleteFamilyMemberAsync(){
      let send_data = {
        family_id             : this.x_family_member_action.data.family_id,
        family_member_id      : this.x_family_member_action.data.family_member_id,
        family_loyalty_points : this.family_member.fields.family_point,

        created_by_id         : this.x_user.user_id,
        created_by_name       : this.x_user.user_name,
        session_token         : this.x_user.session_token,
        shop_location         : this.shop_data.shop_location,
        shop_id               : this.shop_data.shop_id
      }

      this.preLoader(true)
      let result = await this.client_family_api.deleteFamilyMemberAsync(send_data)
      this.preLoader(false)

      if(result.is_ok) this.actionSuccess(result)
      else this.family_member_errors = result.error_messages
    },
    async submitActionAsync(api_action){
      this.family_member.fields = Object.assign(this.family_member.fields, this.shop_data)

      // validate
      this.family_member_errors = this.family_member.isValid()
      if(this.family_member_errors.length == 0) {
        this.preLoader(true)
        let send_data = this.family_member.fields
        let client_family_api = new ClientFamilyApi()
        let result = await client_family_api[api_action](send_data)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result)
        else this.family_member_errors = result.error_messages
      }
    },
    correctEmptyMobileAndPhoneNumber(client){
      if(!client.mobile_number) client.mobile_number = ''
      if(!client.phone_number) client.phone_number = ''
      return client
    },
    actionSuccess(result){
      if(this.x_family_member_action.action == options.form_actions.create|| this.x_family_member_action.action == options.form_actions.add){
        this.$emit('family-member-action', result.data, options.form_actions.add)
      }
      else if(this.x_family_member_action.action == options.form_actions.edit){
        this.updateFamilyMembersData(result)
      }
      else if(this.x_family_member_action.action == options.form_actions.delete){
        if(this.family_member.fields.client_id == this.x_client.data.id) // self delete
          this.$emit('family-member-action', result.data, options.form_actions.delete, true)
        else
          this.$emit('family-member-action', result.data, options.form_actions.delete)
      }
      else {
        this.$emit('family-member-action', result.data)
      }
      this.hideModal()
    },
    onCancel(){
      this.hideModal()
    },
    onDelete(){
      this.hideModal()
    },
    hideModal(){
      this.$refs['my-modal'].hide()
    }
  }
}
</script>
<style lang="scss">
@import './family.scss';
</style>