<template>
  <b-modal id="booked-item-action-modal"
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           class="booked-item-action-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="row add-booked-item-box">
      <div class="col-12 col-md-9 col-xl-10 select-services-wrapper">
        <div class="row">
          <div class="col-12 col-md-4 col-xl-6">
            <div class="block service-categorys">
              <h3>{{ $t('products.category') }}</h3>
              <div class="inner">
                <ul class="row">
                  <li v-for="category in service_categorys" :key="category.index" :class="{ selected: category.selected }"
                      class="col-6 col-md-12 col-xl-6" @click.prevent="onSelectServiceCategory(category.id)"><a href="#">{{ category.name }}</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="col-12 col-md-8 col-xl-6">
            <div v-for="category in service_categorys_filtered" :key="category.index" class="block services">
              <div v-show="category.id != 0">
                <h3>{{ category.name }}</h3>
                <div class="inner">
                  <ul class="row">
                    <li v-for="service in category.services" :key="service.index" class="col-6"
                        @click="onSelectService(service)"><a>{{ service.name }}</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div :class="{ 'have-more': booking_items_setup.use_service_code && show_load_more }" class="load-more">
              <button class="btn" @click="onLoadMoreServices">{{ $t('general.load-more') }}</button>
            </div>
          </div>
        </div>
      </div>
      
      <div :class="{ 'empty': selected_services.length == 0 }" class="col-12 col-md-3 col-xl-2 selected-items">
        <footer :class="{ 'has-selected-items': selected_services.length > 0 }" class="modal-footer">
          <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
        </footer>
        
        <div v-show="selected_services.length > 0" class="inner">
          <table>
            <thead>
              <tr>
                <th>{{ $t('bookings.selected-items') }}</th>
                <th>{{ $t('general.del') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(service, index) in selected_services" :key="index">
                <td>{{ service.name }}</td>
                <td><a class="btn" @click="onRemoveService(service)">x</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-10">
        <error-box :errors="errors"/>
      </div>
    </div>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import { options }           from '../../../../helpers/options'
import { cache_session }     from '../../../../helpers/common'
import ServiceCategoryApi    from '../../../../api/goods/service-category-api'
import ServiceApi            from '../../../../api/goods/service-api'

import error_box             from '../../../common/form/error-box/error-box' 
import btn_action_group      from '../../../common/button/btn-action-group/btn-action-group'
import component_base        from '../../../common/component-base/component-base'
import select_services_panel from '../../../common/select-services-panel/select-services-panel'

export default {
  components: {
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'select-services-panel': select_services_panel
  },
  extends: component_base,
  data(){
    return {
      options,

      form_title: '',
      form_options: {
        delete: false
      },

      service_categorys: [],
      service_categorys_filtered: [],
      
      show_load_more: true,
      services_pagination: {
        page_number: 1
      },

      selected_services: [],

      booking_setup: {},
      booking_items_setup: {},
      booking_items_setup_active_booking_items: [],
    }
  },
  methods: {
    hideModal(){
      this.hideDialogById('booked-item-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
      }
      else{
        this.booking_items_setup = this.booking_setup.booking_items_setup
        if(this.booking_items_setup.items){
          this.loadBookingItemsSetupActive()
        }
        this.form_title = this.$i18n.t('bookings.add-booking-item')
        this.service_categorys = []
        this.services_pagination.page_number = 1
        this.show_load_more = true

        if(this.booking_items_setup.use_service_code){
          this.preLoader()
          await this.loadBookingServiceCategorys()
          this.service_categorys.map(category => category.selected = false)

          let first_category = [{ id: 0, name: 'All', selected: true }]
          this.service_categorys = first_category.concat(this.service_categorys)
          this.service_categorys_filtered = Object.assign({}, this.service_categorys)

          await this.loadBookingServices(first_category.id, this.services_pagination.page_number)
          this.preLoader(false)
        }
        else {
          for(let i in this.booking_items_setup_active_booking_items){
            let item = this.booking_items_setup_active_booking_items[i]
            item.name = item.booking_item_name
            item.processing_time = 0
            item.finishing_time = 0
          }
        
          this.service_categorys = []
          this.service_categorys_filtered = [{
            name: 'Services',
            services: this.booking_items_setup_active_booking_items
          }]
        }
      
        this.selected_services = []
      }
    },
    onConfirm(){
      this.$emit('add-booked-item', this.selected_services)
      this.hideModal()
    },
    loadBookingItemsSetupActive(){
      this.booking_items_setup_active_booking_items = this.booking_items_setup.items.filter(item => item.status == options.good_status.active)
    },
    async loadBookingServiceCategorys(){
      let service_category_filter = {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }

      let service_category_api = new ServiceCategoryApi() 
      let service_categorys_result = await service_category_api.getServiceCategoryAsync(service_category_filter)
      if(service_categorys_result.is_ok) {
        this.service_categorys = service_categorys_result.data.items
      }
      else this.errors = service_categorys_result.error_messages
    },
    async loadBookingServices(category_id, page_number){
      let service_filter = {
        category: category_id,
        page_size: options.pagination.max,
        page_number: page_number,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }
      let service_api = new ServiceApi() 
      let services_result = await service_api.getServicesAsync(service_filter)

      if(services_result.is_ok) {
        for(let i in this.service_categorys){
          let category = this.service_categorys[i]
          if(!category.services) category.services = []

          for(let ii in services_result.data.items){
            let service = services_result.data.items[ii]
            if(category.id == service.category){
              category.services.push(service)
            }
          }
        }

        if(services_result.data.pagination.page_number >= services_result.data.pagination.total_pages 
        || services_result.data.items == 0) 
          this.show_load_more = false

        this.$forceUpdate()
      }
      else this.errors = services_result.error_messages
      
      this.services_pagination = services_result.data.pagination
    },
    onSelectServiceCategory(category_id){
      if(category_id == 0) {
        this.service_categorys_filtered = this.service_categorys.filter(c => c.id != 0)
      }
      else this.service_categorys_filtered = this.service_categorys.filter(c => c.id == category_id)
      
      for(let i in this.service_categorys){
        if(this.service_categorys[i].id == category_id) this.service_categorys[i].selected = true
        else this.service_categorys[i].selected = false
      }

      this.service_categorys.map(c => c.services = [])
      this.services_pagination.page_number = 0
      this.onLoadMoreServices()
      this.show_load_more = true
    },
    onSelectService(service){
      this.selected_services.push(_.cloneDeep(service))
      for(let i in this.selected_services){
        this.selected_services[i].key = i
      }
    },
    onRemoveService(service){
      this.selected_services = this.selected_services.filter(item => item.key != service.key)
    },
    async onLoadMoreServices(){
      let category_selected = this.service_categorys.filter(c => c.selected)[0]
      await this.loadBookingServices(category_selected.id, ++this.services_pagination.page_number)
    }
  }
}
</script>

<style lang="scss">
@import './booked-item-action.scss';
</style>