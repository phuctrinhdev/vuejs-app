<template>
  <div class="common-style preview-message">
    <b-modal id="preview-message-modal" 
             :title="$t('messages.preview')"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             @show="onLoadForm()">
      <div>{{ exmaple_info }}</div>
      <div class="contents">
        <div :class="{'image-mms': message_data.message_type == options.messages_enums.message_type.mms }" class="phone-message-box box content-image">
          <div class="inner">
            <div v-if="message_data.message_type == options.messages_enums.message_type.mms" class="mms-img-box">
              <img v-if="!emptyValue(image)" :src="image">
              <font v-else>{{ $t('messages.image-area') }}</font>
            </div>
            <textarea ref="txArea" v-model="message_data.contents" :disabled="true" 
                      class="textbox noresize ft-b" cols="30" rows="10"/>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="hideModal">{{ $t('general.close') }}</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { options }    from '../../../helpers/options'
import component_base from '../../../components/common/component-base/component-base'
import { emptyValue } from '../../../helpers/common'

export default {
  extends: component_base,
  props: {
    data: {
      type: Object,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    tab: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    },
  },
  data(){
    return {
      options: options,
      message_data: {
        message_type : options.messages_enums.message_type.sms,
        contents     : '',
      },
      exmaple_info: null,
    }
  },
  methods: {
    emptyValue,
    async onLoadForm(){
      Object.assign(this.message_data, this.data.fields)
      if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.client-name-var')) > -1){
        const reg_exp = new RegExp(this.$i18n.t('variable-data.client-name-reg'), 'g')
        this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.client-name-example'))
      }
      //post-visit
      if(this.tab == options.messages_enums.setup_automatic_messaging_tab.post_visit){
        this.exmaple_info = this.$i18n.t('variable-data.post-visit-example-info')
        if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.staff-name-var')) > -1){
          const reg_exp = new RegExp(this.$i18n.t('variable-data.staff-name-reg'), 'g')
          this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.staff-name-example'))
        }
      }
      //booking
      else if(this.tab == options.messages_enums.setup_automatic_messaging_tab.booking){
        if(this.type == options.messages_enums.setup_automatic_messaging_type.booking.the_day_before
          || this.type == options.messages_enums.setup_automatic_messaging_type.booking.on_the_day
          || this.type == options.messages_enums.setup_automatic_messaging_type.booking.hours_before
          || this.type == options.messages_enums.setup_automatic_messaging_type.booking.registered
          || this.type == options.messages_enums.setup_automatic_messaging_type.booking.online_confirm
        ){
          this.exmaple_info = this.$i18n.t('variable-data.booking-reminder-example-info')
        } else {
          this.exmaple_info = this.$i18n.t('variable-data.booking-cancel-example-info')
        }

        if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.booking-date-var')) > -1){
          const reg_exp = new RegExp(this.$i18n.t('variable-data.booking-date-reg'), 'g')
          this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.booking-date-example'))
        }
        if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.booking-mmdd-var')) > -1){
          const reg_exp = new RegExp(this.$i18n.t('variable-data.booking-mmdd-reg'), 'g')
          this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.booking-mmdd-example'))
        }
        if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.booking-time-var')) > -1){
          const reg_exp = new RegExp(this.$i18n.t('variable-data.booking-time-reg'), 'g')
          this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.booking-time-example'))
        }
      }
      //sales
      else if(this.tab == options.messages_enums.setup_automatic_messaging_tab.sales){
        if(this.type == options.messages_enums.setup_automatic_messaging_type.points_add){
          this.exmaple_info = this.$i18n.t('variable-data.points-add-example-info')
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.earned-points-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.earned-points-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.earned-points-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.client-have-points-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.client-have-points-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.client-have-points-example'))
          }
        } else if(this.type == options.messages_enums.setup_automatic_messaging_type.points_deduction){
          this.exmaple_info = this.$i18n.t('variable-data.points-deduction-example-info')
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.used-points-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.used-points-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.used-points-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.client-have-points-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.client-have-points-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.client-have-points-example'))
          }
        } else if(this.type == options.messages_enums.setup_automatic_messaging_type.balance_add){
          this.exmaple_info = this.$i18n.t('variable-data.balance-add-example-info')
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.prepaid-card-name-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.prepaid-card-name-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.prepaid-card-name-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.earn-balance-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.earn-balance-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.earn-balance-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.remain-balance-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.remain-balance-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.remain-balance-example'))
          }
        } else if(this.type == options.messages_enums.setup_automatic_messaging_type.balance_deduction){
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.prepaid-card-name-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.prepaid-card-name-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.prepaid-card-name-example'))
          }
          this.exmaple_info = this.$i18n.t('variable-data.balance-deduction-example-info')
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.deduction-balance-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.deduction-balance-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.deduction-balance-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.remain-balance-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.remain-balance-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.remain-balance-example2'))
          }
        } else if(this.type == options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder){
          this.exmaple_info = this.$i18n.t('variable-data.prepaid-card-expiry-date-reminder-example-info')
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.prepaid-card-name-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.prepaid-card-name-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.prepaid-card-name-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.remain-balance-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.remain-balance-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.remain-balance-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.expiry-date-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.expiry-date-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.expiry-date-example'))
          }
        } else if(this.type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_add){
          this.exmaple_info = this.$i18n.t('variable-data.prepaid-service-quantity-add-example-info')
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.prepaid-service-name-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.prepaid-service-name-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.prepaid-service-name-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.remain-quantity-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.remain-quantity-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.remain-quantity-example'))
          }
        } else if(this.type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_deduction){
          this.exmaple_info = this.$i18n.t('variable-data.prepaid-service-quantity-deduction-example-info')
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.service-name-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.service-name-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.service-name-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.remain-quantity-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.remain-quantity-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.remain-quantity-example'))
          }
        } else if(this.type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder){
          this.exmaple_info = this.$i18n.t('variable-data.prepaid-service-expiry-date-reminder-example-info')
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.prepaid-service-name-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.prepaid-service-name-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.prepaid-service-name-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.service-name-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.service-name-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.service-name-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.remain-quantity-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.remain-quantity-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.remain-quantity-example'))
          }
          if(this.message_data.contents.indexOf(this.$i18n.t('variable-data.expiry-date-var')) > -1){
            const reg_exp = new RegExp(this.$i18n.t('variable-data.expiry-date-reg'), 'g')
            this.message_data.contents = this.message_data.contents.replace(reg_exp, this.$i18n.t('variable-data.expiry-date-example'))
          }
        }
      }
    },
    hideModal(){
      this.hideDialogById('preview-message-modal')
    }
  }
}
</script>

<style lang="scss">
@import './preview-message.scss';
</style>