<template>
  <div class="common-style add-item-modal">
    <b-modal id="action-user-account-modal" 
             :title="form_title"
             :no-close-on-backdrop="true"
             size="sm"
             hide-footer
             @show="onLoadForm()">            
      <form class="form-wrapper clearfix">
        <div class="form-group">
          <dl class="clearfix list mb10">
            <dt>{{ $t('user-accounts.id') }} <strong class="color-red">*</strong></dt>
            <dd><b-form-input v-model="user_account.fields.user_id" :disabled="action_data.action == options.form_actions.edit" type="text"/></dd>
          </dl> 
          <template v-if="action_data.action == options.form_actions.add">
            <div v-html="$t('user-accounts.user-id-info')"/>
            <dl class="clearfix list mb10">
              <dt>{{ $t('general.password') }} <strong class="color-red">*</strong></dt>
              <dd><b-form-input v-model="user_account.fields.password" type="text"/></dd>
            </dl> 
            <div v-html="$t('user-accounts.password-info')"/>
            <dl class="clearfix list mb10">
              <dt>{{ $t('general.password-confirmation') }} <strong class="color-red">*</strong></dt>
              <dd><b-form-input v-model="user_account.fields.password2" type="text"/></dd>
            </dl>
          </template>
          <dl class="clearfix list mb10">
            <dt>{{ $t('user-accounts.user-privilege') }} <strong class="color-red">*</strong></dt>
            <dd>
              <b-form-select v-model="user_account.fields.user_role_code" :placeholder="$t('general.select')"
                             :options="user_role_options" value-field="role_code" text-field="role_name"
                             class="w100p"/>
            </dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('user-accounts.staff') }}</dt>
            <dd>
              <b-form-select v-model="user_account.fields.staff_id" :placeholder="$t('general.select')"
                             :options="staff_options" value-field="id" text-field="aliasname"
                             class="w100p"/>
            </dd>
          </dl>
          <dl class="clearfix list mb10">
            <dt>{{ $t('user-accounts.language') }} <strong class="color-red">*</strong></dt>
            <dd>
              <b-form-select v-model="user_account.fields.language" :placeholder="$t('general.select')"
                             :options="options.language_type" value-field="language" text-field="name"
                             class="w100p"/>
            </dd>
          </dl>
          <dl v-if="action_data.action == options.form_actions.edit && user_account.fields.user_role_code != 'MASTER'" class="clearfix list">
            <dt>{{ $t('general.status') }} <strong class="color-red">*</strong></dt>
            <dd>
              <radio-group v-model="user_account.fields.status" :options="options.option_goods_status" :buttons="true"/>
            </dd>
          </dl>
        </div>
      </form>
      <error-box :errors="user_account_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" 
                          @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserAccountViewModel from '../../../view-model/account/user-account-view-model'
import UserAccountApi from '../../../api/account/user-account-api'
import UserRoleApi from '../../../api/account/user-role-api'
import StaffApi from '../../../api/staffs/staff-api.js'
import { options } from '../../../helpers/options'
import radio_group from '../../../components/common/form/radio/radio-group/radio-group' 
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base from '../../common/component-base/component-base'
import _ from 'lodash'

export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      options : options,

      user_account: {},
      user_account_errors: [], 

      form_title: '',
      form_options: {
        delete: false
      },

      staff_options:[],
      user_role_options: []
    }
  },
  computed: {
    ...mapGetters('user_account', {
      action_data: 'getUserAccountAction'
    }),
  },
  beforeMount(){
    this.user_account = new UserAccountViewModel()
  },
  methods: {
    onLoadForm(){
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('user-accounts.add-title')
        this.user_account = new UserAccountViewModel()
      }
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('user-accounts.edit-title')
        this.user_account.fields = Object.assign({}, this.action_data.data)
      }
      this.user_account_errors = []
      this.loadOptions()
    },
    async loadOptions(){
      // Staff Options
      let filter = {
        staff_id: this.user_account.fields.staff_id,
        shop_id: this.shop_data.shop_id,
      }
      let staff_api = new StaffApi() 
      let result = await staff_api.getNotUseStaffActiveAsync(filter)
      if(result.is_ok){ 
        this.staff_options = result.data.items
        this.staff_options.unshift({ id: null, aliasname: this.$i18n.t('general.select') })
      }
      else this.showAlert(result.error_messages)
      
      // UserRole Options
      if(this.user_account.fields.user_role_code != 'MASTER'){
        filter = {
          solution_id: this.shop_data.solution_id,
          status: options.common_status.active
        }
        let user_role_api = new UserRoleApi() 
        result = await user_role_api.getUserRolesAsync(filter)
        if(result.is_ok){ 
          this.user_role_options = result.data.items
          if(this.user_account.fields.user_role_code != 'MASTER'){
            this.user_role_options.splice(_.findIndex(this.user_role_options, ['role_code', 'MASTER']), 1)
          }

          // Add Inactive UserRole
          if(result.data.items.find(x => x.role_code == this.user_account.fields.user_role_code) == undefined 
            && this.user_account.fields.user_role_code != null){
            this.user_role_options.push({ role_code: this.user_account.fields.user_role_code, role_name: this.user_account.fields.user_role_name })
          }
        }
        else this.showAlert(result.error_messages)
      }
      else {
        this.user_role_options = [{role_code: 'MASTER', role_name: 'MASTER'}]
      }
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('createSalonUserAccountAsync')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateSalonUserAccountAsync')
      }
    },
    async submitActionAsync(api_action){
      this.user_account.fields = Object.assign(this.user_account.fields, this.shop_data)

      // validate
      this.user_account_errors = this.user_account.isValid(this.action_data.action) 
      if(this.user_account_errors.length == 0) {
        this.preLoader()
        let user_account_api = new UserAccountApi() 
        let result = await user_account_api[api_action](this.user_account.fields)
        this.preLoader(false)

        if(result.is_ok) {
          this.$emit('reload-page')
          this.hideModal()
        }
        else this.user_account_errors = result.error_messages
      }
    },
    hideModal(){
      this.hideDialogById('action-user-account-modal')
    },
    onCancel(){
      this.hideModal()
    }
  }
}
</script>