<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('menu.setup-automatic-messaging') }}</h3>
        </article>
        <div class="setup-auto-mes">
          <b-alert show variant="light">
            {{ $t('message-autos.setup-auto-message-title-info') }}            
          </b-alert>
          <b-alert show variant="warning">
            <span class="mr10">{{ $t('messages.sender-number') }}</span>
            <span class="fw-bold mr10">{{ sender_auto_phone }}</span>
            <button class="setup-btn">
              <router-link :to="{ name: 'message-sender-numbers' }">{{ $t('messages.setup') }}</router-link>
            </button>
          </b-alert>
          <div class="set-info">
            <div v-show="sender_auto_phone >''">
              <b-card no-body>
                <b-tabs v-model="tab_index" pills card
                        @input="onLoadTab">
                  <b-tab :title="$t('message-autos.booking-reminder')">
                    <b-card-text>
                      <booking-reminder-tab ref="booking"/>
                    </b-card-text>
                  </b-tab>
                  <b-tab :title="$t('message-autos.sales-title')">
                    <b-card-text>
                      <sales-tab ref="sales"/>
                    </b-card-text>
                  </b-tab>
                  <b-tab :title="$t('message-autos.post-visit-title')">
                    <b-card-text>
                      <post-visit-tab ref="post_visit"/>
                    </b-card-text>
                  </b-tab>
                  <b-tab :title="$t('messages.birthday-greetings')">
                    <b-card-text>
                      <birthday-greetings-tab ref="client"/>
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
              <div class="status-info bd mt10">
                <ul class="clearfix">
                  <li class="clearfix"><span class="status-show active"/><span class="status-text">{{ $t('general.active') }}</span></li>
                  <li class="clearfix"><span class="status-show"/><span class="status-text">{{ $t('general.inactive') }}</span></li>
                  <li class="clearfix"><span class="status-show no-setting"/><span class="status-text">{{ $t('messages.no-setting') }}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { options }    from '../../../helpers/options'
import { mapGetters } from 'vuex'
import component_base from '../../../components/common/component-base/component-base'

import TextSenderPhoneApi     from '../../../api/messages/text-sender-phone-api'
import booking_reminder_tab   from '../../../components/messages/booking-reminder-tab/booking-reminder-tab'
import birthday_greetings_tab from '../../../components/messages/birthday-greetings-tab/birthday-greetings-tab'
import sales_tab              from '../../../components/messages/sales-tab/sales-tab'
import post_visit_tab         from '../../../components/messages/post-visit-tab/post-visit-tab'

export default {
  components: {
    'booking-reminder-tab'   : booking_reminder_tab,    
    'sales-tab'              : sales_tab,
    'birthday-greetings-tab' : birthday_greetings_tab,
    'post-visit-tab' : post_visit_tab,
  },
  extends: component_base,
  data() {
    return {
      options : options,
      sender_auto_phone: '',
      tab_index: 0
    }
  },
  computed: {
    ...mapGetters('setup_automatic_messaging', {
      action_data: 'getSetupAutomaticMessagingInfo'
    }),
  },
  async mounted(){    
    await this.loadSederAutoPhone()

    if(this.tab_index == this.action_data.tab){ // Change detection
      this.onLoadTab(this.tab_index)
    }
    this.tab_index = this.action_data.tab
  }, 
  methods: {
    async loadSederAutoPhone() {
      this.preLoader()
      let data_send = {
        shop_id : this.shop_data.shop_id
      }
      let result = await (new TextSenderPhoneApi()).getTextSenderAutoPhoneAsync(data_send)
      if(result.is_ok){
        if (result.data != null) {
          this.sender_auto_phone = result.data.sender_phone
        }
      }
      else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    onLoadTab(tab){
      if(this.sender_auto_phone > ''){
        if(tab == options.messages_enums.setup_automatic_messaging_tab.client) this.$refs.client.onLoadForm()
        else if(tab == options.messages_enums.setup_automatic_messaging_tab.sales) this.$refs.sales.onLoadForm()
        else if(tab == options.messages_enums.setup_automatic_messaging_tab.booking) this.$refs.booking.onLoadForm()
        else if(tab == options.messages_enums.setup_automatic_messaging_tab.post_visit) this.$refs.post_visit.onLoadForm()
      }
    }
  }
}
</script>

<style lang="scss">
@import './setup-automatic-messaging.scss';
</style>