<template>
  <main class="app-content">
    <section class="content booking-item">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('bookings.setup-booking') }}</h3>
        </article>
        <booking-links/>
        <div class="booking-item-part">
          <div class="part-title clearfix">
            <div class="title">{{ $t('booking-item.booking-items') }}</div>
            <ul class="btn-group clearfix">
              <li v-if="!use_service_code">
                <a class="btn" @click="onActionBookingitem(options.form_actions.add)">{{ $t('booking-item.add-item') }}</a>
              </li>
            </ul>
          </div> 
          <div class="row booking-item-more clearfix"> 
            <div class="col-6 form-group same-as-service-codes">
              {{ $t('booking-item.same-as-service-codes') }}
              <radio-group v-model="use_service_code" :options="options.option_yes_no" :buttons="true" 
                           @change="onChangeUseServiceCode"/>
            </div>
            <div v-if="!use_service_code" class="col-6">
              <show-inactives v-model="is_show_status" @input="onShowInactives"/>
            </div>
          </div>
          
          <div v-if="!use_service_code" class="table-data form-wrapper booking-table"> 
            <goods-table :data="table_data" @drag-end="onDragEnd">
              <template slot="edit" slot-scope="{ row }">
                <a class="btn btn-edit" 
                   @click="onActionBookingitem(options.form_actions.edit, row)">{{ $t('general.edit') }}</a>
              </template>
              <template slot="specific_off_days" slot-scope="{ row }">
                <a class="btn btn-edit"
                   @click="onActionSpecificOffDays(row)">{{ $t('general.edit') }}</a>
              </template>
            </goods-table>
          </div>
        </div> 
      </div> 
    </section>

    <booking-item-action @update-item="onUpdateItem" @delete-item="onDeleteItem"/>
    <alert-confirm :id="alert_id" :data_alerts="[really_want_to_change]" 
                   @confirm="onConfirmChangeUseServiceCode" @cancel="onCancelChangeUseServiceCode"/>
  </main>
</template>
<script>
import { options } from '../../../helpers/options'
import booking_links from '../../../components/bookings/booking-links/booking-links'  
import radio_group from '../../../components/common/form/radio/radio-group/radio-group' 
import booking_item_action from '../../../components/bookings/booking-item-action/booking-item-action.vue' 
import { mapGetters, mapActions } from 'vuex'
import goods_table from '../../../components/goods/goods-table/goods-table.vue'
import { cache_session } from '../../../helpers/common'
import show_inactives from '../../../components/common/show-inactives/show-inactives.vue'
import BookingItemApi from '../../../api/bookings/booking-item-api'
import alert_confirm from '../../../components/common/alert/alert-confirm'
import component_base    from '../../../components/common/component-base/component-base'

export default {
  components: {
    'booking-links': booking_links, 
    'radio-group':radio_group,
    'goods-table': goods_table , 
    'booking-item-action': booking_item_action, 
    'show-inactives': show_inactives,
    'alert-confirm': alert_confirm
  },
  extends: component_base,
  data() {
    return {
      options, 

      table_data: {
        fields: [
          { field: 'booking_item_name',       label: 'booking-item.item-name',                           width: '40%', sortable: false  },
          { field: 'estimated_time',          label: 'booking-item.duration',                            width: '40%', sortable: false }, 
          { field: 'edit',                    label: 'general.edit',                                     width: '10%', sortable: false, expand: true }, 
        ],
        rows:[],
        groups: [
          { name: 'booking-item-draggable', rows: [] }
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: options.good_table_drag.all,
          pagination: true
        },
      },
      table_filter: {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0
      },
      booking_item_action:{},

      use_service_code:true,
      is_show_status: options.good_status.active,

      alert_id: 'alert-confirm-use-service-code-modal'
    }
  }, 
  computed: {
    ...mapGetters('booking_item', {
      x_booking_item: 'getBookingItems'
    }),
    really_want_to_change(){return this.$i18n.t('general.really-want-to-change')}
  },
  mounted() { 
    this.loadTableData()
  }, 
  methods: {
    ...mapActions('booking_item', [
      'getBookingItemsDataAsync',
      'setBookingitemActionData'
    ]), 
    // table
    async loadTableData() {
      this.table_filter = Object.assign(this.table_filter, this.shop_data) 

      this.preLoader()
      await this.getBookingItemsDataAsync(this.table_filter)  
      this.preLoader(false)

      if(this.x_booking_item.is_ok){
        this.use_service_code = this.x_booking_item.data.use_service_code

        let tmp_booking_items = []
        if(this.is_show_status == options.good_status.all)
          tmp_booking_items = this.x_booking_item.data.items
        else
          tmp_booking_items = this.x_booking_item.data.items.filter(i => i.status == options.good_status.active)
        this.table_data.groups[0].rows = tmp_booking_items
      }
      else this.showAlert(this.x_booking_item.error_messages)
    },
    async onChangeUseServiceCode(){ 
      this.showDialogById(this.alert_id)
    },
    async onConfirmChangeUseServiceCode(){
      let send_data = {
        shop_id: this.shop_data.shop_id,
        use_service_code: this.use_service_code
      }
      this.preLoader()
      let booking_item_api = new BookingItemApi()
      let booking_item_result = await booking_item_api.updateBookingItemsSetupAsync(send_data)
      this.preLoader(false)
      
      if(booking_item_result.is_ok) cache_session.clearSessionBookingSetup()
      else this.showAlert(booking_item_result.error_messages)
    },
    onCancelChangeUseServiceCode(){
      this.use_service_code = !this.use_service_code
    },
    onShowInactives(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },

    // modal action
    onActionBookingitem(action, booking_item = {}){ 
      booking_item.use_service_code = this.use_service_code
      this.booking_item_action = {
        action: action,
        data: booking_item,
        options: {
          booking_items: this.table_data.rows
        }
      }
      this.setBookingitemActionData(this.booking_item_action)
      this.showDialogById('action-booking-item-modal')
    }, 
    async onDragEnd(drag_data, e){
      let drag_change = {
        shop_id: this.shop_data.shop_id,
        old_position_id: drag_data[e.oldIndex].id,
        new_position_id: drag_data[e.newIndex].id
      }
      this.preLoader()
      let booking_item_api = new BookingItemApi() 
      let result = await booking_item_api.updateBookingItemOrderNoAsync(drag_change)
      this.preLoader(false)
      
      if(!result.is_ok) this.showAlert(result.error_messages)
      else {
        this.loadTableData()
        cache_session.clearSessionBookingSetup()
      }
    },

    // event success
    onUpdateItem(){
      this.loadTableData()
      cache_session.clearSessionBookingSetup()
    },
    onDeleteItem(){
      this.loadTableData()
      cache_session.clearSessionBookingSetup()
    }, 
  }
}
</script>

<style lang='scss'>
@import './booking-items.scss';
</style>