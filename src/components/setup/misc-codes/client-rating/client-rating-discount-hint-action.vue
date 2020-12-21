<template>
  <div class="common-style add-item-modal">
    <b-modal id="client-rating-discount-hint-action-modal"
             ref="formModal"
             :title="this.$i18n.t('misc-codes.client-rating-discount-hint-05')"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm">             
      <form class="form-wrapper clearfix">
        <table class="normal">
          <thead>
            <tr>
              <td colspan="2">{{ this.$i18n.t('misc-codes.client-rating-discount-hint-05') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{{ this.$i18n.t('misc-codes.client-rating-discount-hint-10') }}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>{{ this.$i18n.t('misc-codes.client-rating-discount-hint-20') }}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>{{ this.$i18n.t('misc-codes.client-rating-discount-hint-30') }}</td>
            </tr>
          </tbody>
        </table>
      </form> 
      <div class="modal-footer">        
        <button type="button" class="btn btn-secondary" @click="onCancel()">{{ $t('general.close') }}</button>
      </div>
    </b-modal>
  </div>  
</template>

<script>
import component_base    from '../../../common/component-base/component-base'
export default {  
  extends: component_base,
  methods: {     
    onCancel(){
      this.hideModal()
    },    
    hideModal(){
      this.hideDialogById('client-rating-discount-hint-action-modal')
    },
  }
}
</script>

<style lang="scss">
@import '../add-item.scss';
</style>