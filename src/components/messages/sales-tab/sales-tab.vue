<template>
  <table class="normal sales-tab">
    <thead>
      <tr>
        <td class="status">{{ $t('general.status') }}</td>
        <td class="type">{{ $t('messages.message-type') }}</td>
        <td class="edit">{{ $t('general.edit') }}</td>
      </tr> 
    </thead>
    <tbody>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.points_add)"/>
        </td>
        <td>{{ $t('message-autos.points-add') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.points_add)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.points_deduction)"/>
        </td>
        <td>{{ $t('message-autos.points-deduction') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.points_deduction)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.balance_add)"/>
        </td>
        <td>{{ $t('message-autos.balance-add') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.balance_add)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.balance_deduction)"/>
        </td>
        <td>{{ $t('message-autos.balance-deduction') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.balance_deduction)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder)"/>
        </td>
        <td>{{ $t('message-autos.prepaid-card-expiry-date-reminder') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_add)"/>
        </td>
        <td>{{ $t('message-autos.prepaid-service-quantity-add') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_add)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_deduction)"/>
        </td>
        <td>{{ $t('message-autos.prepaid-service-quantity-deduction') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_deduction)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
      <tr>
        <td>
          <span :class="onSetStatusClass(options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder)"/>
        </td>
        <td>{{ $t('message-autos.prepaid-service-expiry-date-reminder') }}</td>
        <td>
          <button class="btn secondary" @click="onActionSetup(options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder)">{{ $t('general.edit') }}</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { options }      from '../../../helpers/options'
import { mapMutations } from 'vuex'
import component_base   from '../../common/component-base/component-base'

import MessageSetupSalesApi from '../../../api/message-autos/message-setup-sales-api'

export default {
  extends : component_base,
  data(){
    return {
      options: options,
      message_setup_sales_api: {},
      message_setup_sales_list: null,
      shop_id: 0
    }
  },
  created(){
    this.message_setup_sales_api = new MessageSetupSalesApi()
    this.message_setup_sales_list = new Map()
    this.shop_id = this.shop_data.shop_id
  },
  methods: {
    ...mapMutations('setup_automatic_messaging', [
      'setSetupAutomaticMessagingInfo',
    ]),
    async onLoadForm(){
      await this.loadDataTableAsync()
    }, 
    async loadDataTableAsync() { 
      this.preLoader()
      let result = await this.message_setup_sales_api.getMessageSetupSalesListAsync(this.shop_id)
      this.preLoader(false)
      if(result.is_ok){
        result.data.items.forEach(e => {
          this.message_setup_sales_list.set(e.fields.setup_type, e)
          this.message_setup_sales_list = new Map(this.message_setup_sales_list.set(e.fields.setup_type, e))
        })
      }
      else{
        this.showAlert(result.error_messages)
      }
    },
    onActionSetup(type){
      this.setSetupAutomaticMessagingInfo({
        tab  : options.messages_enums.setup_automatic_messaging_tab.sales,
        type : type,
        // id   : this.message_setup_client.fields.id
      })
      if(type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder
          || type == options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder)
        this.$router.push('setup-automatic-messaging-expiry-date-reminder-info')
      else this.$router.push('setup-automatic-messaging-info')
    },
    onSetStatusClass(type){
      let class_name = ''

      if(type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder){
        let message_setup_first = this.message_setup_sales_list.get(options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder_first)
        let message_setup_second = this.message_setup_sales_list.get(options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder_second)
        let message_setup_third = this.message_setup_sales_list.get(options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder_third)

        if(message_setup_first == null && message_setup_second == null && message_setup_third == null) class_name = 'not-setting-btn'
        else if ((message_setup_first != null && message_setup_first.fields.status == options.common_status.active)
                || (message_setup_second != null && message_setup_second.fields.status == options.common_status.active)
                || (message_setup_third != null && message_setup_third.fields.status == options.common_status.active)) class_name = 'active-btn'
        else class_name = 'inactive-btn'
      }
      else if(type == options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder){
        let message_setup_first = this.message_setup_sales_list.get(options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder_first)
        let message_setup_second = this.message_setup_sales_list.get(options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder_second)
        let message_setup_third = this.message_setup_sales_list.get(options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder_third)

        if(message_setup_first == null && message_setup_second == null && message_setup_third == null) class_name = 'not-setting-btn'
        else if ((message_setup_first != null && message_setup_first.fields.status == options.common_status.active)
                || (message_setup_second != null && message_setup_second.fields.status == options.common_status.active)
                || (message_setup_third != null && message_setup_third.fields.status == options.common_status.active)) class_name = 'active-btn'
        else class_name = 'inactive-btn'
      }
      else{
        let message_setup = this.message_setup_sales_list.get(type)
        
        if(message_setup == null) class_name = 'not-setting-btn'
        else if(message_setup.fields.status == options.common_status.active) class_name = 'active-btn'
        else if(message_setup.fields.status == options.common_status.inactive) class_name = 'inactive-btn'
      }
      return class_name
    }
  }
}
</script>

<style lang="scss">
  .sales-tab {
    thead {
      tr {
        td {
          &.status {
            width: 20%;
          }
          &.type {
            width: 60%;
          }
          &.edit {
            width: 20%;
          }
        }
      }
    }
  }
</style>