<template>
  <div class="common-style">
    <b-modal id="modal-add-staffs"
             ref="formModal"
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="mdl"
             class="modal-add-staffs"
             @show="onLoadForm()">            
      <form class="form-wrapper clearfix">
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.staff-number') }}<strong class="color-red">*</strong></dt>
            <dd class="clearfix">
              <div ref="staffNumber" class="input-box"><input v-model="staff.fields.staff_number" type="text" class="w100p"></div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.name-alias') }}<strong class="color-red">*</strong></dt>
            <dd>
              <div class="input-box"><input v-model="staff.fields.aliasname" type="text" class="w100p"></div>
              <div class="last-box">
                <span class="fz13 color-gray">
                  * {{ $t('staffs.describe-alias') }}
                </span>
              </div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.full-name') }}</dt>
            <dd>
              <div class="input-box"><input v-model="staff.fields.fullname" type="text" class="w100p"></div>
              <div class="last-box">
                <b-form-checkbox
                  id="checkbox-2"
                  v-model= "same_as"
                  name="checkbox-2">
                  <span class="text">{{ $t('staffs.samealias') }}</span>
                </b-form-checkbox>
              </div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.mobile-number') }}</dt>
            <dd>
              <div class="input-box">
                <input v-model="staff.fields.mobile_phonenumber" type="text" 
                       class="w100p" placeholder="Number only"></div>
            </dd>
          </dl> 
        </div>
        
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.phone-number') }}</dt>
            <dd>
              <div class="input-box">
                <input v-model="staff.fields.phone_number" type="text"
                       class="w100p" placeholder="Number only"></div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('validate_fields.email') }}</dt>
            <dd>
              <div class="input-box"><input v-model="staff.fields.email" type="text" class="w100p"></div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.birthday') }}</dt>
            <dd>
              <div class="input-box day-option">
                <span><input v-model="staff.fields.birth_dd" type="text" class="w50"> {{ $t('staffs.day') }} </span>
                <span><input v-model="staff.fields.birth_month" type="text" class="w50"> {{ $t('staffs.month') }} </span>
                <span><input v-model="staff.fields.birth_year" type="text" class="w70"> {{ $t('staffs.year') }} </span>
              </div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.career') }}</dt>
            <dd>
              <div class="input-box"><input v-model="staff.fields.career" type="text" class="w100p"></div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.job-position') }}</dt>
            <dd>
              <div class="input-box"><input v-model="staff.fields.job_position" type="text" class="w100p"></div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.certifications') }}</dt>
            <dd>
              <div class="input-box"><input v-model="staff.fields.certifications" type="text" class="w100p"></div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.postcode') }}</dt>
            <dd class="clearfix">
              <div class="input-box res-non vam">
                <input v-model="staff.fields.postcode" :disabled="isKorea" type="text" 
                       class="w-big">
                <a>
                  <span v-if="isKorea" class="search-img" @click="onFindPostCodeKR"/>
                </a>
              </div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.address') }} 1</dt>
            <dd>
              <div class="input-box"><input v-model="staff.fields.address1" :disabled="isKorea" type="text" 
                                            class="w100p"></div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.address') }} 2</dt>
            <dd>
              <div class="input-box"><input v-model="staff.fields.address2" type="text" class="w100p"></div>
            </dd>
          </dl> 
        </div>

        <div class="form-group entry-date">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.entry-date') }}</dt>
            <dd class="clearfix">
              <div class="input-box res-non vam">
                <v-date-picker v-model="staff.fields.entry_date"
                               :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                               :input-props="{ placeholder: '' }"/>
                <span class="calendar-img"/>
              </div>
            </dd>
          </dl> 
        </div>

        <div class="form-group leaving-date">
          <dl class="clearfix list">
            <dt>{{ $t('staffs.leaving-date') }}</dt>
            <dd class="clearfix">
              <div class="input-box res-non vam">
                <v-date-picker v-model="staff.fields.leaving_date"
                               :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                               :input-props="{ placeholder: '' }"/>
                <span class="calendar-img" />
              </div>
            </dd>
          </dl> 
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('validate_fields.notes') }}</dt>
            <dd>
              <textarea v-model="staff.fields.notes" 
                        class="note noresize w100p" cols="30" rows="10"/>
            </dd>
          </dl> 
        </div>
        <div class="form-group">
          <dl class="clearfix list">
            <dt class="res-non">{{ $t('validate_fields.status') }}</dt>
            <dd class="res-non">
              <div class="input-box">
                <div class="switch">
                  <radio-group v-model="staff.fields.status" :options="options.option_goods_status" :buttons="true"/> <!-- todo - input :data -->
                </div>
              </div>
            </dd>
          </dl> 
        </div>
      </form> 
      <error-box :errors="staff_errors"/>
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal>

    <!-- alert -->
    <alert id="staff-error-alert" :alerts="alerts" :title="$t('staffs.error-title')"
           :close_action="true"
           @close-event="focusField"/>

    <find-postcode-kr v-if="isKorea" ref="find_postcode" @update-address = "setPostCodeKR"/>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { setupCalendar, DatePicker } from 'v-calendar'
import { options }            from '../../../helpers/options'
import StaffApi               from '../../../api/staffs/staff-api'
import StaffViewModel         from '../../../view-model/staffs/staff-view-model.js'

import radio_group            from '../../../components/common/form/radio/radio-group/radio-group'
import btn_action_group       from '../../common/button/btn-action-group/btn-action-group'
import error_box              from '../../common/form/error-box/error-box' 
import alert                  from '../../../components/common/alert/alert.vue'
import find_postcode_kr    from '../../../components/common/find-postcode/find-postcode-kr'
import component_base         from '../../../components/common/component-base/component-base'

export default {
  components: {
    'alert': alert,
    'btn-action-group': btn_action_group,
    'radio-group': radio_group,
    'error-box': error_box,
    'v-date-picker': DatePicker,
    'find-postcode-kr': find_postcode_kr
  },
  extends: component_base,
  data() {
    return {
      isKorea: false,
      options,
      
      form_title: '',
      form_options: {
        delete: false
      },
      same_as: false,
      opened: false,

      staff: new StaffViewModel(),
      staff_errors: [],

      alerts: [],

      entry_date: new Date()
    }
  },
  computed: {
    ...mapGetters('staff', {
      action_data: 'getStaffAction'
    })
  },
  watch:{
    same_as: function(){
      if(this.same_as){
        var aliasname = this.staff.fields.aliasname
        this.staff.fields.fullname = aliasname
      }
      else{
        this.staff.fields.fullname = ''
      }
    }
  },
  beforeMount(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
  },
  mounted(){
    this.isKorea = false
    if(this.shop_data.country == options.country_code.kr) this.isKorea= true
  },
  methods: { 
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    onFindPostCodeKR() {
      this.$refs.find_postcode.onFindPostCodeKR()
    },	
    setPostCodeKR(postcode, address){
      this.staff.fields.postcode = postcode
      this.staff.fields.address1 =  address
      this.staff.fields.address2 = ''
    },
    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('modal-add-staffs')
    },
    onLoadForm(){
      this.same_as=false
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('staffs.staff-add')
        this.staff = new StaffViewModel()
      }
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('staffs.staff-edit')
        this.staff.fields = Object.assign(this.staff.fields, this.action_data.data)
        this.mapDataViewForm()
      }
      this.staff_errors = []
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addStaffAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit && this.action_data.working_hours != null){
        this.submitActionAsync('updateStaffAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateStaffAsync', 'reload-page')
      }
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){
      this.staff.fields = Object.assign(this.staff.fields, this.shop_data)
      // validate
      this.staff_errors = this.staff.isValid()
      if(this.staff_errors.length > 0) this.mapDataViewForm()
      else {
        this.preLoader()
        let staff_api = new StaffApi() 
        let result = await staff_api[api_action](this.staff.fields)
        this.preLoader(false)
        
        if(result.is_ok) {
          this.actionSuccess(result, success_action)
        }
        else this.showCustomAlert(new Array(result.error_messages[0].errorMessage), 'staff-error-alert')
      }
    },
    mapDataViewForm(){
      if(this.staff.fields.birth_year == 0) this.staff.fields.birth_year = ''
      if(this.staff.fields.birth_month == 0) this.staff.fields.birth_month = ''      
      if(this.staff.fields.birth_dd == 0) this.staff.fields.birth_dd = ''
    },
    
    // alert
    showCustomAlert(alerts, modal_name){
      this.setAlertsData(alerts)
      this.alerts = alerts
      this.showDialogById(modal_name)
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      }
      
      else this.showAlert(result.error_messages)
    },
    focusField(){
      this.$nextTick(function(){
        this.$refs.staffNumber.focus()
      })
    }
  }
}
</script>

<style lang="scss">
@import '../staff-common.scss';
</style>
