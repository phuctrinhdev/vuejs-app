<template>
  <div class="common-style">
    <b-modal :id="page_id"             
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="mdl"
             class="action-client-modal"
             @show="onLoadForm()"
             @hide="onCancel()"> 
      <!-- BEGIN CLIENT FROM -->
      <form ref="form" class="form-wrapper clearfix">
        <p class="set-field-btn">
          <a class="setup-hover client-action-img" @click="onFieldSetup">
            <span class="client-setup-big"/>
            <span>{{ $t('clients.setup-field') }}</span>
          </a>
        </p>
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.client-name') }} <strong class="color-red">*</strong></dt>
            <dd class="clearfix">
              <div class="input-box">
                <input ref="name" v-model="client.fields.client_name"
                       class="w100p" type="text">
              </div>
              <div class="last-box checkbox-por">
                <a class="setup-hover client-action-img" @click="onDuplicatedClients(options.clients_enums.duplicated_client_search_type_values.name)">
                  <span class="duplicate-check"/>
                  <span class="setup-hover-tultip">{{ $t('clients.tooltip-duplication') }}</span>
                </a>
                <b-form-checkbox v-if="field_setup.member" id="checkbox-1" v-model="client.fields.member_type"
                                 :value="options.clients_enums.client_member_type.member" 
                                 :unchecked-value="options.clients_enums.client_member_type.non_member"
                                 :disabled="isOwnClient() == false"
                                 name="checkbox-1" class="add-client-check"
                                 @change="getMemberNumber">
                  <span class="text">{{ $t('clients.member') }}</span>
                </b-form-checkbox>
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.member" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.member-number') }}</dt>
            <dd>
              <div class="input-box res-non">
                <input v-model="client.fields.member_number" :disabled="client.fields.member_type == 2"
                       type="text" class="w100p">
              </div>
              <div v-if="isOwnClient()" class="last-box res-non">
                <a class="setup-hover client-action-img" @click="onMemberNumberSetup">
                  <span class="client-setup-s"/>
                  <span class="setup-hover-tultip">{{ $t('clients.tooltip-member-number-setup') }}</span>
                </a>                
              </div>
            </dd>
          </dl> 
        </div>
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.mobile-number') }}</dt>
            <dd>
              <div class="input-box res-non">
                <input v-model="client.fields.mobile_number" :disabled="!form_options.confirm"
                       class="w100p" placeholder="Number only" 
                       type="text">
              </div>
              <div class="last-box res-non mb5">
                <a class="setup-hover client-action-img" @click="onDuplicatedClients(options.clients_enums.duplicated_client_search_type_values.mobile)">
                  <span class="duplicate-check"/>
                  <span class="setup-hover-tultip">{{ $t('clients.tooltip-duplication') }}</span>
                </a>
              </div>
              <div class="input-box">
                <span>
                  <select v-model="client.fields.allowed_message_type" class="custom-select w100p">
                    <option :value="options.clients_enums.allowed_message_type.allow_message">{{ $t('clients.allow-message') }}</option>
                    <option :value="options.clients_enums.allowed_message_type.not_marketing">{{ $t('clients.not-marketing-message') }}</option>
                    <option :value="options.clients_enums.allowed_message_type.not_message">{{ $t('clients.not-any-message') }}</option>
                  </select>
                </span>
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.mobile_number2" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.mobile-number2') }}</dt>
            <dd>
              <div class="input-box">
                <input v-model="client.fields.mobile_number2" :disabled="!form_options.confirm"
                       type="text" class="w100p" placeholder="Number only">
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.phone_number" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.phone-number') }}</dt>
            <dd>
              <div class="input-box">
                <input v-model="client.fields.phone_number" :disabled="!form_options.confirm"
                       type="text" class="w100p" placeholder="Number only">
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.email" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('general.email') }}</dt>
            <dd>
              <div class="input-box">
                <input v-model="client.fields.email" type="text" class="w100p">
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.sex" class="form-group">
          <dl class="clearfix list">
            <dt class="mt5">{{ $t('clients.sex') }}</dt>
            <dd>
              <div class="input-box">
                <radio-group v-model="client.fields.sex" :options="options.clients_enums.sex" :buttons="false"/>
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.birthday" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.birthday') }}</dt>
            <dd>
              <div class="input-box day-option">
                <span><input v-model="client.fields.birth_dd" type="text" class="w50"> {{ $t('clients.day') }} </span>
                <span><input v-model="client.fields.birth_month" type="text" class="w50"> {{ $t('general.month') }} </span>
                <span><input v-model="client.fields.birth_year" type="text" class="w70"> {{ $t('clients.year') }}{{ $t('clients.optional') }} </span>
              </div>
              <!-- <div class="switch">
                <radio-group v-model="client.fields.birthday_type" :options="options.clients_enums.birthday_type" :buttons="true"/>
              </div> -->
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.client_rating" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.client-rating') }}</dt>
            <dd>
              <div class="input-box">
                <b-form-select v-model="client.fields.client_rating_id" :options="client_rating_select"
                               :disabled="client.fields.shop_id != shop_id"
                               value-field="id" text-field="name" class="custom-select w100p"/> 
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.client_group" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.client-group') }}</dt>
            <dd>
              <div class="input-box">
                <b-form-select v-model="client.fields.client_group_id" :options="client_group_select"
                               :disabled="client.fields.shop_id != shop_id"
                               value-field="id" text-field="name" class="custom-select w100p"/> 
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.preferred_staff" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.preferred-staff') }}</dt>
            <dd>
              <div class="input-box">
                <b-form-select v-model="client.fields.preferred_staff_id" :options="staff_select"
                               :disabled="client.fields.shop_id != shop_id"
                               value-field="id" text-field="aliasname" class="custom-select w100p"/>
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.referral_source" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.referral-source') }}</dt>
            <dd>
              <div class="input-box">
                <b-form-select v-model="client.fields.client_referral_source_id" :options="client_referral_source_select"
                               :disabled="client.fields.shop_id != shop_id"
                               value-field="id" text-field="name" class="custom-select w100p"/> 
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.recommender" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.recommender') }}</dt>
            <dd class="clearfix">
              <div class="input-box res-non non2">
                <input v-model="client.fields.recommender_name"
                       type="text" class="w100p" disabled>
              </div>
              <div v-if="isOwnClient()" class="last-box res-non non2">
                <a class="client-action-img" @click="onRecommender()">
                  <span class="search-img"/>
                </a>
                <a class="btn secondary small" @click="deleteRecommender">X</a>
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.address" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.postcode') }}</dt>
            <dd class="clearfix">
              <div class="input-box res-non">
                <input v-model="client.fields.postcode" :disabled="!form_options.confirm || isKorea" type="text" 
                       class="w100p">
              </div>
              <div class="last-box res-non">
                <a class="client-action-img">
                  <span v-if="isKorea" class="search-img" @click="onFindPostCodeKR"/>
                </a>
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.address" :disabled="isKorea" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.address') }} 1</dt>
            <dd>
              <div class="input-box">
                <input v-model="client.fields.address1" :disabled="!form_options.confirm || isKorea" type="text" 
                       class="w100p">
              </div>
            </dd>
          </dl> 
        </div>
        <div v-if="field_setup.address" class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.address') }} 2</dt>
            <dd>
              <div class="input-box">
                <input v-model="client.fields.address2" :disabled="!form_options.confirm" type="text" 
                       class="w100p">
              </div>
            </dd>
          </dl> 
        </div>
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.notes') }}</dt>
            <dd>
              <textarea v-model="client.fields.notes"
                        class="note noresize w100p" cols="30" rows="10"/>
            </dd>
          </dl> 
        </div>
      </form>
      <!-- EMD CLIENT FROM -->

      <!-- BEGIN ERRORS -->
      <error-box :errors="client_errors"/>
      <!-- END ERRORS -->

      <!-- BEGIN FOOTER -->
      <div class="modal-footer">
        <btn-action-group :data="form_options" 
                          @confirm="onConfirm" 
                          @cancel="onCancel" 
                          @delete="onDelete"/>
      </div>
      <!-- END FOOTER -->
    </b-modal>

    <!-- alert -->
    <alert id="client-alert" :alerts="alerts" :title="$t('clients.alert-title')"
           :close_action="true"
           @close-event="focusField"/>
    <!-- modal action -->
    <field-setup v-if="field_setup_modal_visible" :field_setup="field_setup" @update-page-fields="updatePageFields"/>
    <duplicated-clients v-if="dulicated_clients_modal_visible" :search_value="duplicated_search_value"/>
    <recommender v-if="recommender_modal_visible" :client_id="client_id" @add-recommender="addRecommender"/>
    <member-number-setup v-if="member_number_setup_visible" :data="shop_info.environments.member_number_setup" @update-setup="updateMemberNumberSetup"/>
    <find-postcode-kr v-if="isKorea" ref="find_postcode" @update-address = "setPostCodeKR"/>
  </div>
</template>
<script>
import _ from 'lodash'
import { checkNullAndEmpty, mapSecurityInfo, getHideClientInfoPermission, hideMobilePhone, hiddenInformation }      from '../../../helpers/common'
import { mapGetters, mapActions } from 'vuex'
import ClientViewModel            from '../../../view-model/clients/client-view-model.js'
import ClientApi                  from '../../../api/clients/client-api.js'
import alert                      from '../../../components/common/alert/alert.vue'
import { options }                from '../../../helpers/options'
import { CLIENTS_ENUMS, FORM_ACTIONS } from '../../../config/constant'
import field_setup         from '../../../components/clients/client-action/field-setup/field-setup.vue'
import duplicated_clients  from '../../../components/clients/client-action/duplicated-clients/duplicated-clients.vue'
import recommender         from '../../../components/clients/client-action/recommender/recommender.vue'
import member_number_setup from '../../../components/clients/client-action/member-number-setup/member-number-setup.vue'
import btn_action_group    from '../../../components/common/button/btn-action-group/btn-action-group'
import error_box           from '../../../components/common/form/error-box/error-box'
import radio_group         from '../../../components/common/form/radio/radio-group/radio-group' 
import find_postcode_kr    from '../../../components/common/find-postcode/find-postcode-kr'
import component_base      from '../../common/component-base/component-base'
import { sales_options }   from '../../../helpers/options/sales-options'
import ClientsCache                     from '../../../helpers/cache/clients-cache'
import StaffApi                  from '../../../api/staffs/staff-api.js'
import staff_mixin from '../../../helpers/mixins/staff-mixin'
export default {
  components: {
    'alert': alert,
    'field-setup': field_setup,
    'duplicated-clients': duplicated_clients,
    'recommender': recommender,
    'member-number-setup': member_number_setup,
    'btn-action-group': btn_action_group,
    'error-box': error_box,
    'radio-group': radio_group,
    'find-postcode-kr': find_postcode_kr
  },
  extends: component_base,
  mixins: [staff_mixin],
  props: {
    root: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      isKorea: false,
      options,
      page_id: 'action-client-modal',
      client: {},
      client_errors: [],

      client_group_select: [],
      client_referral_source_select: [],
      client_rating_select: [],
      staff_select: [],

      form_title: '',
      
      alerts: [],

      form_options: {
        delete: false,
        confirm: false
      },

      recommender_modal_visible: false,
      field_setup_modal_visible: false,
      dulicated_clients_modal_visible: false,
      member_number_setup_visible: false,
      duplicated_search_value: {},

      client_api: null,
      shop_info: {},
      field_setup: {},
      preferred_staff: {},
      select_filter: {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.active
      },
      client_id: 0,
      shop_id: 0,

      allow_edit_client: sales_options.security_level_enum.master,
      allow_delete_client: sales_options.security_level_enum.master,

      contact_info_to_manager: options.clients_enums.contact_info_hiding_type.hideall, 
      contact_info_to_staff: options.clients_enums.contact_info_hiding_type.hideall,

      check_original_data : false,
      check_fields_validation: {
        mobile_validation: true,
        mobile2_validation: true,
        phone_validation: true,      
        postcode_validation: true,
        address1_validation: true,      
        address2_validation: true
      },
      clients_setup: {},
      clients_cache: new ClientsCache(),
    }
  },
  computed: {
    ...mapGetters('client', {
      action_data: 'getClientAction'
    }),
  },
  beforeMount(){
    this.client = new ClientViewModel()
  },
  mounted(){
    this.isKorea = false
    if(this.shop_data.country == options.country_code.kr) this.isKorea= true
    this.client_api = new ClientApi()
    this.staff_api = new StaffApi()
    this.select_filter.shop_id = this.shop_data.shop_id
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    onFindPostCodeKR() {
      this.$refs.find_postcode.onFindPostCodeKR()
    },	
    setPostCodeKR(postcode, address){
      this.client.fields.postcode = postcode
      this.client.fields.address1 =  address
      this.client.fields.address2 = ''
    },
    hideModal(){
      this.hideDialogById(this.page_id)
      this.page_id ='action-client-modal'
    },
    onCancel(){
      this.$emit('hidden', this.page_id)
      this.hideModal()
    },
    onLoadForm(){
      this.page_id ='action-client-modal'
      this.client_errors = []
      this.setClientData()
      this.page_id= this.page_id + this.root
    },
    async initClientSetup(){
      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup))
        this.showMissingClientsSetupAlert()
      else 
      {
        this.shop_info = this.clients_setup
        this.field_setup = this.clients_setup.field_setups
        this.allow_edit_client = this.clients_setup.environments.allow_edit_client
        this.allow_delete_client = this.clients_setup.environments.allow_delete_client
        this.contact_info_to_manager = this.clients_setup.environments.contact_info_to_manager
        this.contact_info_to_staff = this.clients_setup.environments.contact_info_to_staff
      }
    },
    async setClientData(){
      this.initClientSetup()
      if(this.action_data.action == options.cid_enum.cid_client_action)
      {
        this.form_title = this.$i18n.t('clients.client-add')
        this.form_options.delete = false
        this.form_options.confirm = true
        this.client = new ClientViewModel()
        this.client_id = 0
        if(this.action_data.is_mobile){
          this.client.fields.mobile_number = this.action_data.call_number
          this.client.fields.phone_number = null
        }
        else this.client.fields.phone_number = this.action_data.call_number
      }
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('clients.client-add')
        this.form_options.delete = false
        this.form_options.confirm = true
        this.client = new ClientViewModel()
        this.client_id = 0
      }
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('clients.client-edit')
        this.shop_id = this.shop_data.shop_id
        this.client.fields = Object.assign({}, this.action_data.data)
        if(this.client.fields.shop_id != this.shop_id)
        {
          this.form_options.delete = false
          this.form_options.confirm = false
        }
        if(this.client.fields.birth_year == 0)
          this.client.fields.birth_year = null
        if(this.client.fields.birth_month == 0)
          this.client.fields.birth_month = null
        if(this.client.fields.birth_dd == 0)
          this.client.fields.birth_dd = null

        this.client_id = this.client.fields.id
      }
      await this.loadData()
    },
    async loadData(){
      this.initClientSetup()
      let active_staff_result = await this.getStaffsAsyncMixin()
      this.preferred_staff = active_staff_result.data.items
      // select control
      let addCodes = (data, setup, option) => {
        if(setup){
          if(option == 'staff_select')
            this[option] = [ { id: null, aliasname: '' } ]
          else
            this[option] = [ { id: null, name: '' } ]

          for(let i in data){
            this[option].push(data[i])
          }
        }
      }
      if(this.shop_info.field_setups != undefined)
      {
        addCodes(this.shop_info.client_ratings, this.shop_info.field_setups.client_rating, 'client_rating_select')
        addCodes(this.shop_info.client_groups, this.shop_info.field_setups.client_group, 'client_group_select')
        addCodes(this.shop_info.referral_sources, this.shop_info.field_setups.referral_source, 'client_referral_source_select')
        addCodes(this.preferred_staff, this.shop_info.field_setups.preferred_staff, 'staff_select')
        this.getMemberNumber()
      }

      // Add Inactive Codes (if client has inactive codes)
      let addInActiveCodes = (data, id, name, option) => {
        if(data.find(x => x.id == id) == undefined && id != null){
          if(option == 'staff_select')
            this[option].push({ id: id, aliasname: name })
          else
            this[option].push({ id: id, name: name })
        }
      }
      if(this.action_data.action == FORM_ACTIONS.EDIT){
        if(this.x_user.user_role_code == options.user_roles.master)
        {
          this.form_options.delete = true
          this.form_options.confirm = true
        }
        let isHideClientInfo = getHideClientInfoPermission(this.contact_info_to_manager, this.contact_info_to_staff, this.action_data.data.registration_date)
        if(isHideClientInfo) this.hideInfoByPermission()

        if(this.x_user.user_role_code==options.user_roles.staff)
        {
          if(this.allow_edit_client == sales_options.security_level_enum.staff_or_higher) this.form_options.confirm = true
          if(this.allow_delete_client == sales_options.security_level_enum.staff_or_higher) this.form_options.delete = true
        }
        if(this.x_user.user_role_code==options.user_roles.manager)
        {
          if(this.allow_edit_client != sales_options.security_level_enum.master) this.form_options.confirm = true
          if(this.allow_delete_client != sales_options.security_level_enum.master) this.form_options.delete = true
        }
        addInActiveCodes(this.shop_info.client_groups, this.action_data.data.client_group_id, this.action_data.data.client_group_name, 'client_group_select')
        addInActiveCodes(this.shop_info.client_ratings, this.action_data.data.client_rating_id, this.action_data.data.client_rating_name, 'client_rating_select')
        addInActiveCodes(this.shop_info.referral_sources, this.action_data.data.client_referral_source_id, this.action_data.data.client_referral_source_name, 'client_referral_source_select')
        addInActiveCodes(this.preferred_staff, this.action_data.data.preferred_staff_id, this.action_data.data.preferred_staff_name, 'staff_select')

      }
      //}
      else this.showAlert(active_staff_result.error_messages)
    },
    hideInfoByPermission()
    {
      this.client.fields.mobile_number= hideMobilePhone(this.client.fields.mobile_number)
      this.client.fields.mobile_number2= hideMobilePhone(this.client.fields.mobile_number2)
      this.client.fields.phone_number= hideMobilePhone(this.client.fields.phone_number)
      this.client.fields.postcode = hiddenInformation()
      this.client.fields.address1 = hiddenInformation()
      this.client.fields.address2 = hiddenInformation()
      this.check_original_data =true
    },
    // get next member number
    async getMemberNumber(){
      this.$nextTick(async function(){
        if(this.field_setup.member){
          if(this.action_data.action == FORM_ACTIONS.ADD || this.action_data.action == options.cid_enum.cid_client_action){
            if(this.client.fields.member_type == CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.MEMBER && this.shop_info.environments.member_number_setup == 1){
              let result = await this.client_api.getNextMemberNumberAsync(this.shop_data.shop_id)
              if(result.is_ok) this.client.fields.member_number = result.data
              else this.showAlert(result.error_messages)
            } 
            else this.client.fields.member_number = ''
          }
          else{
            if(this.action_data.data.member_type == CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.MEMBER){
              if(this.client.fields.member_type == CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.MEMBER)
                this.client.fields.member_number = this.action_data.data.member_number
              else this.client.fields.member_number = ''
            }
            else{
              if(this.client.fields.member_type == CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.MEMBER && this.shop_info.environments.member_number_setup == 1){
                let result = await this.client_api.getNextMemberNumberAsync(this.shop_data.shop_id)
                if(result.is_ok) this.client.fields.member_number = result.data
                else this.showAlert(result.error_messages)
              }
              else this.client.fields.member_number = ''
            }
          }
        }
      })
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add || this.action_data.action == options.cid_enum.cid_client_action){
        this.client.fields = Object.assign({}, this.client.fields)
        this.client.fields.shop_id = this.shop_data.shop_id
        if(this.client.fields.mobile_number == '') this.client.fields.mobile_number = null
        this.check_original_data = false
        this.submitActionAsync('addClientAsync', 'reload-page' )
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateClientAsync', 'reload-page')
      }
    },
    // submit action
    async submitActionAsync(api_action, success_action){
      let tmp_client = _.cloneDeep(this.client.fields)
      tmp_client = mapSecurityInfo(tmp_client)
      if(this.check_original_data) this.checkSameAsOriginalData(tmp_client)
      this.client_errors = this.client.isValid(this.check_fields_validation)

      if(this.client_errors.length == 0) {
        this.preLoader(true)
        let result = await this.client_api[api_action](tmp_client)
        this.preLoader(false)
        if(result.is_ok) this.actionSuccess(result, success_action)
        else {
          this.client_errors = result.error_messages
          // this.showAlert(new Array(result.error_messages[0].errorMessage), 'client-alert')
          this.showAlert(new Array(result.error_messages[0].errorMessage))
        }
      }
    },
    checkSameAsOriginalData(tmp_client)
    {
      let original_client = Object.assign({}, this.action_data.data)
      original_client.mobile_number= hideMobilePhone(original_client.mobile_number)
      original_client.mobile_number2= hideMobilePhone(original_client.mobile_number2)
      original_client.phone_number= hideMobilePhone(original_client.phone_number)
      original_client.postcode = hiddenInformation()
      original_client.address1 = hiddenInformation()
      original_client.address2 = hiddenInformation()
      if(this.client.fields.mobile_number == original_client.mobile_number)
      {
        tmp_client.mobile_number = this.action_data.data.mobile_number
        this.check_fields_validation.mobile_validation = false
      } 

      if(this.client.fields.mobile_number2 == original_client.mobile_number2)
      {
        tmp_client.mobile_number2 = this.action_data.data.mobile_number2
        this.check_fields_validation.mobile2_validation = false
      }

      if(this.client.fields.phone_number == original_client.phone_number)
      {
        tmp_client.phone_number = this.action_data.data.phone_number
        this.check_fields_validation.phone_validation = false
      }

      if(this.client.fields.postcode == original_client.postcode)
      {
        tmp_client.postcode = this.action_data.data.postcode
        this.check_fields_validation.postcode_validation = false
      }

      if(this.client.fields.address1 == original_client.address1)
      {
        tmp_client.address1 = this.action_data.data.address1
        this.check_fields_validation.address1_validation = false
      }

      if(this.client.fields.address2 == original_client.address2)
      {
        tmp_client.address2 = this.action_data.data.address2
        this.check_fields_validation.address2_validation = false
      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      }
      else this.showAlert(result.error_messages)
    },
    async onDelete(){
      let send_data = {
        clientId: this.client.fields.id,
        shopId: this.shop_data.shop_id,
        sessionToken: this.x_user.session_token,
        shopLocation: this.shop_data.shop_location,
        country: this.shop_data.country
      }
      this.preLoader(true)
      let result = await this.client_api.updateToDeletedClientAsync(send_data)
      this.preLoader(false)
      if(result.is_ok) this.actionSuccess(result, 'reload-page')
      else this.showAlert(result.error_messages) 
    },
    async updatePageFields(data){
      this.field_setup = data
      this.setClientData()
      await this.getMemberNumber()
    },
    updateMemberNumberSetup(member_number_setup){
      this.shop_info.environments.member_number_setup = member_number_setup
      this.getMemberNumber()
    },
    // Add Recommender name in recommender field
    addRecommender(row){
      this.$set(this.client.fields, 'recommender_id', row.client_id)   
      this.$set(this.client.fields, 'recommender_name', row.client_name)
    },
    deleteRecommender(){
      this.$set(this.client.fields, 'recommender_id', null)   
      this.$set(this.client.fields, 'recommender_name', null)
    },
    focusField(){
      this.$nextTick(function(){
        this.$refs.name.focus()
      })
    },
    onMemberNumberSetup(){
      this.member_number_setup_visible = true

      this.$nextTick(function(){
        this.showDialogById('member-number-setup-modal')
      })
    },
    onDuplicatedClients(condition){
      if(condition == CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.NAME){
        if(!checkNullAndEmpty(this.client.fields.client_name)){
          this.duplicated_search_value = {
            client_id: this.client.fields.id,
            search_condition: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.NAME,
            search_value: this.client.fields.client_name,
            search_value2: null
          }
        } 
        else{
          this.showAlert(new Array(this.$i18n.t('duplicated-clients.empty-name')))
          return
        }
      }else{
        if(!checkNullAndEmpty(this.client.fields.mobile_number) || !checkNullAndEmpty(this.client.fields.mobile_number2)){
          this.duplicated_search_value = {
            client_id: this.client.fields.id,
            search_condition: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.MOBILE,
            search_value: this.client.fields.mobile_number,
            search_value2: this.client.fields.mobile_number2
          }
        }
        else{
          this.showAlert(new Array(this.$i18n.t('duplicated-clients.empty-mobile-number')))
          return
        } 
      }
      this.dulicated_clients_modal_visible = true

      this.$nextTick(function(){
        this.showDialogById('check-duplication-modal')
      })
    },
    onRecommender(){
      this.recommender_modal_visible = true

      this.$nextTick(function(){
        this.showDialogById('search-recommender-modal')
      })
    },
    onFieldSetup(){
      this.field_setup_modal_visible = true

      this.$nextTick(function(){
        this.showDialogById('setup-field-modal')
      })
    },

    // alert
    showAlert(alerts, modal_name){
      this.setAlertsData(alerts)
      this.alerts = alerts
      this.showDialogById(modal_name)
    },
    isOwnClient()
    {
      if (this.client.fields.shop_id == this.shop_id || this.action_data.action != options.form_actions.edit)
        return true
      else
      {
        this.form_options.delete = false
        return false
      } 
    },
  }
}
</script>

<style lang="scss">
@import './client-action.scss';
</style>