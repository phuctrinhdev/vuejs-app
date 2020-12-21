<template>
  <div> 
    <b-modal id="add-mobile-number-modal" 
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer  
             class="add-mobile-number-modal"
             @show="onLoadForm()">
      <form class="form-wrapper"> 
        <div class="row form-group">
          <div class="col-sm-4 col-12" >  
            <label class="">{{ $t('booking-online-booking-settings.mobile-number') }}</label>
          </div> 
          <div class="col-sm-8 col-12" >  
            <b-form-input v-model="phone" :placeholder="number_phone" type="text"/>
          </div> 
        </div>
      </form>

      <error-box :errors="errors"/>
      <div class="modal-footer"> 
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
    </b-modal> 
  </div>
</template>

<script> 
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'

export default {
  components: {
    'error-box': error_box,
    'btn-action-group': btn_action_group,
  },
  extends: component_base,
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data(){
    return { 
      form_title: '',  
      form_options: {
        delete: false
      },
      phone: this.data,  
    } 
  },
  computed: {
    number_phone(){  
      this.loadPhone(this.data)
      return ''
    }
  },
  methods: { 
    loadPhone(data){
      this.phone = data
    },
    hideModal(){
      this.hideDialogById('add-mobile-number-modal')
    },
    onCancel(){
      this.phone = this.data
      this.hideModal()
    }, 
    onLoadForm(){   
      this.form_title = this.$i18n.t('booking-online-booking-settings.add-mobile-number') 
    },
    onConfirm(){ 
      this.errors=[]
      if(isNaN(this.phone)){
        this.errors.push( 
          this.$i18n.t('validate_messages.phone')
            .replace('{field}', this.$i18n.t('booking-online-booking-settings.mobile-number')) 
        )
      }
      if(this.phone.length > 12){
        this.errors.push(
          this.$i18n.t('validate_messages.maxLength')
            .replace('{field}', this.$i18n.t('booking-online-booking-settings.mobile-number'))
            .replace('{max_value}', 12)
        ) 
      }
      if(this.errors.length <= 0){ 
        this.$emit('update-success', this.phone)
        this.hideModal()
      }
    } 
  }
}
</script>

<style lang="scss">
@import './add-mobile-number.scss';
</style>