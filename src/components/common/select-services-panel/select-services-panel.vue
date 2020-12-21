<template>
  <div class="select-services-panel-wrapper">
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
                    @click="onSelectService(service)">
                  <a v-if="is_show_service_price" class="is-show-price">
                    <span class="service-name">{{ service.name }}</span>
                    <span class="service-price">{{ formatMoney(service.price, 0) }}</span>
                  </a>
                  <a v-else>{{ service.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div :class="{ 'have-more': show_load_more }" class="load-more">
          <button class="btn" @click="onLoadMoreServices">{{ $t('general.load-more') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { options }           from '../../../helpers/options'

import component_base        from '../../common/component-base/component-base'
import service_mixin         from '../../../helpers/mixins/service-mixin'
import { formatMoney }       from '../../../helpers/common'

export default {
  extends: component_base,
  mixins: [service_mixin],
  props: {
    is_show_service_price: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      options,

      service_categorys: [],
      service_categorys_filtered: [],

      show_load_more: false,
      services_pagination: {
        page_number: 1
      },

      selected_services: [],
    }
  },
  created(){
    this.loadPanelData()
  },
  methods: {
    formatMoney,

    async loadPanelData(){
      this.errors = []
      
      this.preLoader()
      await this.loadServiceCategorysData()
      this.service_categorys.map(c => c.selected = false)

      let first_category = [{ id: 0, name: 'All', selected: true }]
      this.service_categorys = first_category.concat(this.service_categorys)
      this.service_categorys_filtered = Object.assign({}, this.service_categorys)

      await this.loadServicesData(first_category.id, this.services_pagination.page_number)
      this.preLoader(false)

      if(this.errors.length > 0) 
        this.showAlert(this.errors)
    },
    async loadServiceCategorysData(){
      let result_categorys = await this.loadServiceCategorysAsync()
      if(result_categorys.is_ok) {
        this.service_categorys = result_categorys.data.items
      }
      else {
        this.errors.push(result_categorys.error_messages)
      }
    },
    async loadServicesData(category_id, page_number){
      this.preLoader()
      let result_services = await this.loadServicesAsync(category_id, page_number)
      this.preLoader(false)

      if(result_services.is_ok){
        for(let i in this.service_categorys){
          let category = this.service_categorys[i]
          if(!category.services) category.services = []
          
          for(let j in result_services.data.items){
            let service = result_services.data.items[j]
            if(category.id == service.category){
              service.category_name = category.name
              category.services.push(service)
            }
          }
        }
        this.services_pagination = result_services.data.pagination
        if(this.services_pagination.page_number < this.services_pagination.total_pages) 
          this.show_load_more = true
        else 
          this.show_load_more = false

        this.$forceUpdate()
      }
      else {
        this.error.push(result_services.error_messages)
      }
    },
    onSelectServiceCategory(category_id){
      this.setCategorySelected(category_id)
      this.setCategorysFilteredById(category_id)

      this.service_categorys.map(c => c.services = [])
      this.services_pagination.page_number = 0
      this.onLoadMoreServices()
    },
    setCategorySelected(category_id){
      for(let i in this.service_categorys){
        if(this.service_categorys[i].id == category_id)
          this.$set(this.service_categorys[i], 'selected', true)
        else 
          this.$set(this.service_categorys[i], 'selected', false)
      }
    },
    setCategorysFilteredById(category_id){
      if(category_id == 0)
        this.service_categorys_filtered = this.service_categorys.filter(c => c.id != 0)
      else 
        this.service_categorys_filtered = this.service_categorys.filter(c => c.id == category_id)
    },
    onSelectService(service){
      this.selected_services.push(_.cloneDeep(service))
      this.emitSelectedServices()
    },
    onRemoveService(service_key){
      this.selected_services = this.selected_services.filter(item => item.key != service_key)
      this.emitSelectedServices()
    },
    resetSelectedServices(){
      this.selected_services = []
      this.emitSelectedServices()
    },
    emitSelectedServices(){
      this.updateSelectedServicesKey()
      this.$emit('get-selected-services', this.selected_services)
    },
    updateSelectedServicesKey(){
      for(let i in this.selected_services){
        this.selected_services[i].key = i
      }
    },
    async onLoadMoreServices(){
      let category_selected = this.service_categorys.filter(c => c.selected)[0]
      await this.loadServicesData(category_selected.id, ++this.services_pagination.page_number)
    },
  }
}
</script>

<style lang="scss">
@import './select-services-panel.scss';
</style>