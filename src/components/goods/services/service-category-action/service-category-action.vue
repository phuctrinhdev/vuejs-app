<template>
  <b-modal id="service-category-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           no-stacking
           class="service-category-action-modal" 
           @show="onLoadForm()">
    <form class="form-wrapper">
      <div class="row form-group">
        <div class="col-12 col-sm-4">  
          <label class="require">{{ $t('services.service-category-name') }}</label>
        </div> 
        <div class="col-12 col-sm-8">
          <b-form-input v-model="service_category.fields.name" :disabled="!allow_edit" type="text"/>
        </div> 
      </div>   
      <div v-if="service_category.fields.id > 0" class="row form-group" >
        <div class="col-12 col-sm-4">
          <label>{{ $t('services.status') }}</label>
        </div> 
        <div class="col-12 col-sm-8">
          <radio-group v-model="service_category.fields.status" :options="options.option_goods_status" :buttons="true" 
                       :disabled="!allow_edit"/>
        </div> 
      </div> 
    </form>

    <error-box :errors="service_category_errors"/>
    <div class="modal-footer">
      <btn-action-group :data="form_options" 
                        @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { options } from '../../../../helpers/options'
import ServiceCategoryViewModel from '../../../../view-model/goods/service-category-view-model.js'
import ServiceCategoryApi from '../../../../api/goods/service-category-api.js'
import radio_group from '../../../../components/common/form/radio/radio-group/radio-group' 
import error_box from '../../../common/form/error-box/error-box' 
import btn_action_group from '../../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../../common/component-base/component-base'

export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      options:options, 
      
      service_category: {},
      service_category_errors: [], 
      
      form_title: '',
      form_options: {
        delete: false,
        confirm: true
      },
      allow_edit: true
    }
  },
  computed: {
    ...mapGetters('service_category', {
      action_data: 'getServiceCategoryAction'
    }),
  },
  beforeMount(){
    this.service_category = new ServiceCategoryViewModel()
  },
  mounted(){
    //
  },
  methods: { 
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addServiceCategoryAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateServiceCategoryAsync', 'update-page')
      }
    },
    onCancel(){
      this.hideModal()
    },
    onDelete(){
      this.submitActionAsync('deleteServiceCategoryAsync', 'reload-page')
    },
    hideModal(){
      this.hideDialogById('service-category-action-modal')
    },
    onLoadForm(){
      this.allow_edit = true
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('services.service-category-add')
        this.form_options.confirm = true
        this.form_options.delete = false

        this.service_category = new ServiceCategoryViewModel()
      }
      if(this.action_data.action == options.form_actions.edit){
        this.form_title = this.$i18n.t('services.service-category-edit')
        if(this.action_data.data.shared)
        {
          this.allow_edit = false
          this.form_options.confirm = false
          this.form_options.delete = false
        }    
        else
        {
          this.form_options.confirm = true
          this.form_options.delete = true
        } 
        this.service_category.fields = Object.assign({}, this.action_data.data)
      } 
      this.service_category_errors = []
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){
      this.service_category.fields = Object.assign(this.service_category.fields, this.shop_data)

      // validate
      this.service_category_errors = this.service_category.isValid() 
      if(this.service_category_errors.length == 0) {
        this.preLoader()
        let service_category_api = new ServiceCategoryApi() 
        let result = await service_category_api[api_action](this.service_category.fields)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result, success_action)
        else this.service_category_errors = result.error_messages
      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else {
        this.service_category_errors = result.error_messages
      } 
    }
  }
}
</script>

<style lang="scss">
@import './service-category-action.scss';
</style>