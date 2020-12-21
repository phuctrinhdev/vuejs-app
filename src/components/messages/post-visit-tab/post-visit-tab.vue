<template>
  <div>
    <div class="text-box">
      <p>{{ $t('message-autos.sending-time') }} {{ $t('message-autos.1-day-after') }} </p>
      <p>
        <span class="mr10">
          <template v-if="message_setup_post_visit_general.fields.id > 0">
            <strong>{{ target_hour }}</strong> {{ $t('messages.hour') }} <strong>{{ target_minute }}</strong> {{ $t('messages.minutes') }}
          </template>
          <template v-else>
            {{ $t('message-autos.not-exist-sending-time') }}
          </template>
        </span>
        <button v-if="message_setup_post_visit_general.fields.id > 0" class="btn secondary" @click="onActionGeneralSetup(options.form_actions.edit)">{{ $t('general.edit') }}</button>
        <button v-else class="btn secondary" @click="onActionGeneralSetup(options.form_actions.add)">{{ $t('general.add') }}</button>
      </p>
      <b-form-group class="right-check-box">
        <button v-if="message_setup_post_visit_general.fields.id > 0" class="btn secondary" @click="onActionSetup(null)">{{ $t('general.add') }}</button>
      </b-form-group>
    </div>
    <table class="normal post-visit-tab">
      <thead>
        <tr>
          <td class="category-name">{{ $t('message-autos.service-category') }}</td>
          <td class="status">{{ $t('general.status') }}</td>
          <td class="visit-type">{{ $t('message-autos.recent-visit-type') }}</td>
          <td class="sending-date">{{ $t('message-autos.sending-date') }}<br>({{ $t('message-autos.after-from-last-visit') }})</td>
          <td class="visit-type-count">{{ $t('message-autos.visit-count-type') }}</td>
          <td class="edit">{{ $t('general.edit') }}</td>
        </tr> 
      </thead>
      <tbody>
        <tr v-for="master_id in message_setup_post_visit_master_list.keys()" :key="master_id">
          <td>{{ message_setup_post_visit_master_list.get(master_id)[0].fields.category_names }}</td>
          <td v-html="onSetDetailCol(master_id, 'status')"/>
          <td v-html="onSetDetailCol(master_id, 'visit_type')"/>
          <td v-html="onSetDetailCol(master_id, 'sending_date')"/>
          <td v-html="onSetDetailCol(master_id, 'apply_to')"/>
          <td>
            <button class="btn secondary" @click="onActionSetup(master_id)">{{ $t('general.edit') }}</button>
          </td>
        </tr>
        <tr v-if="message_setup_post_visit_master_list.size == 0">
          <td colspan="6">{{ $t('general.table-empty') }}</td>
        </tr>
      </tbody>
    </table>
    <sending-time-form @reload-page="onReloadPage"/>
  </div>
</template>

<script>
import { options }      from '../../../helpers/options'
import component_base   from '../../common/component-base/component-base'
import { mapMutations
  , mapActions }        from 'vuex'

import ServiceCategoryApi       from '../../../api/goods/service-category-api'
import MessageSetupPostVisitApi from '../../../api/message-autos/message-setup-post-visit-api'
import MessageSetupPostVisitGeneralViewModel from '../../../view-model/message-autos/message-setup-post-visit/message-setup-post-visit-general-view-model'

import sending_time_form from '../../messages/sending-time-form/sending-time-form'

export default {
  components: {
    'sending-time-form' : sending_time_form,
  },
  extends : component_base,
  data(){
    return {
      options: options,
      message_setup_post_visit_api: {},
      service_category_api: {},

      message_setup_post_visit_general: {},
      message_setup_post_visit_master_list: [],
      target_hour: '',
      target_minute: '',
      shop_id: 0,
      check: false
    }
  },
  created(){
    this.message_setup_post_visit_api = new MessageSetupPostVisitApi()
    this.message_setup_post_visit_general = new MessageSetupPostVisitGeneralViewModel()
    this.service_category_api = new ServiceCategoryApi()
    this.message_setup_post_visit_master_list = new Map()
    this.shop_id = this.shop_data.shop_id
  },
  methods: {
    ...mapMutations('setup_automatic_messaging', [
      'setSetupAutomaticMessagingInfo',
    ]),
    ...mapActions('message_setup_post_visit_general', [
      'setMessageSetupPostVisitGeneralActionDataAsync'
    ]),
    async onLoadForm(){
      this.message_setup_post_visit_master_list = new Map()
      await this.loadDataTableAsync()
    }, 
    async loadDataTableAsync() { 
      await this.onLoadGeneralSetup()
      await this.onLoadSetup()
    },
    async onLoadGeneralSetup(){
      this.preLoader()
      let data_send = {
        shop_id: this.shop_id
      }
      let result = await this.message_setup_post_visit_api.getMessageSetupPostVisitGeneralAsync(data_send)
      this.preLoader(false)
      if(result.is_ok){
        this.message_setup_post_visit_general = result.data
        if(this.message_setup_post_visit_general.fields.id > 0){
          let temp = this.message_setup_post_visit_general.fields.send_time.split(':')
          this.target_hour = temp[0]
          this.target_minute = temp[1]
        }else{
          this.showAlert([this.$i18n.t('validate_messages.sending-time')])  
        }
      }
      else{
        this.showAlert(result.error_messages)
      }
    },
    async onLoadSetup(){
      this.preLoader()
      let result = await this.message_setup_post_visit_api.getMessageSetupPostVisitMastersAsync(this.shop_id)
      this.preLoader(false)
      let category_ids = []
      if(result.is_ok){
        let all_map = new Map()
        let except_all_map = new Map()

        result.data.items.forEach(e => {
          if(e.fields.category_ids == null){
            if(all_map.has(e.fields.master_id)){
              all_map.get(e.fields.master_id).push(e)
            }else{
              all_map = new Map(this.message_setup_post_visit_master_list.set(e.fields.master_id, [e]))
            }            
          }else{
            category_ids = category_ids.concat(e.fields.category_ids.split(','))
            if(except_all_map.has(e.fields.master_id)){
              except_all_map.get(e.fields.master_id).push(e)
            }else{
              except_all_map = new Map(except_all_map.set(e.fields.master_id, [e]))
            }
          }
        })
        this.message_setup_post_visit_master_list = new Map([...all_map].concat([...except_all_map]))

        // Remove Duplicated CategoryId
        category_ids = category_ids.filter((v,i) => category_ids.indexOf(v) === i)
        
        // Get Category Names
        let category_items = []
        if(category_ids.length > 0){
          this.preLoader()
          let service_category_result = await this.service_category_api.getServiceCategoryNamesAsync(category_ids)
          this.preLoader(false)
          if(service_category_result.is_ok){
            category_items = service_category_result.data.items

            // Set Category Names
            Array.from(this.message_setup_post_visit_master_list.keys()).forEach(async key => {
              if(this.message_setup_post_visit_master_list.get(key)[0].fields.category_ids == null){
                this.message_setup_post_visit_master_list.get(key).forEach(e => {
                  e.fields.category_names = this.$i18n.t('general.all-select')
                })
              }else{
                let category_names= []

                this.message_setup_post_visit_master_list.get(key)[0].fields.category_ids.split(',').forEach(e => {
                  category_names.push(category_items.find(x => x.id == e).name) 
                })

                this.message_setup_post_visit_master_list.get(key).forEach(e => {
                  e.fields.category_names = category_names.join(', ')
                })
              }
            })
          } else this.showAlert(service_category_result.error_messages)
        }
      } else this.showAlert(result.error_messages)
    },
    onActionSetup(id){
      this.setSetupAutomaticMessagingInfo({
        tab : options.messages_enums.setup_automatic_messaging_tab.post_visit,
        id  : id
      })
      this.$router.push('setup-automatic-messaging-post-visit-info')
    },
    async onActionGeneralSetup(action){
      this.message_setup_post_visit_general_action = {
        action: action,
        shop_id: this.shop_id,
      }
      await this.setMessageSetupPostVisitGeneralActionDataAsync(this.message_setup_post_visit_general_action)
      this.showDialogById('action-message-setup-post-visit-general-modal')
    },
    onReloadPage(){
      this.onLoadForm()
    },
    onSetDetailCol(master_id, column){
      let result = ''
      let detail_list = this.message_setup_post_visit_master_list.get(master_id)

      if(column == 'status'){
        detail_list.forEach(e => {
          if(e.fields.status == options.common_status.active) result += '<span class="active-btn"/><br>'
          else result += '<span class="inactive-btn"/><br>'
        })
      } else if(column == 'visit_type'){
        detail_list.forEach(e => {
          if(e.fields.visit_type == options.messages_enums.visit_type.by_sales_category)
            result += this.$i18n.t('message-autos.by-sales-category') + '<br>'
          else result += this.$i18n.t('message-autos.by-sales') + '<br>'
        })
      } else if(column == 'sending_date'){
        detail_list.forEach(e => {
          if(e.fields.send_days_after == 0) {
            if(e.fields.send_time_after == 0) result += this.$i18n.t('messages.send-immediately') + '<br>'
            else if(e.fields.send_time_after == 30) result += this.$i18n.t('message-autos.send-minutes-after').replace('{0}', e.fields.send_time_after) + '<br>'
            else result += this.$i18n.t('message-autos.send-hour-after').replace('{0}', e.fields.send_time_after/60) + '<br>'
          }
          else if(e.fields.send_days_after == 1) result += e.fields.send_days_after + this.$i18n.t('message-autos.day-after') +'<br>'
          else result += e.fields.send_days_after + this.$i18n.t('message-autos.days-after') + '<br>'
        })
      } else if(column == 'apply_to'){
        detail_list.forEach(e => {
          if(e.fields.visit_count_type == options.messages_enums.visit_count_type.first_visit) 
            result += this.$i18n.t('message-autos.first-visit') + '<br>'
          else if(e.fields.visit_count_type == options.messages_enums.visit_count_type.re_visit)
            result += this.$i18n.t('message-autos.re-visit') + '<br>'
          else if(e.fields.visit_count_type == options.messages_enums.visit_count_type.first_re_visit)
            result += this.$i18n.t('message-autos.first-visit') + '/' + this.$i18n.t('message-autos.re-visit') + '<br>'
          else result += this.$i18n.t('message-autos.none-visit') + '<br>'
        })
      }
      
      return result
    },
  }
}
</script>

<style lang="scss">
  .post-visit-tab {
    thead {
      tr {
        td {
          &.category-name {
            width: 30%;
          }
          &.status {
            width: 10%;
          }
          &.visit-type {
            width: 15%;
          }
          &.sending-date {
            width: 20%;
          }
          &.visit-type-count {
            width: 15%;
          }
          &.edit {
            width: 10%;
          }
        }
      }
    }
  }
  .right-check-box {
    text-align: right;
  }
</style>