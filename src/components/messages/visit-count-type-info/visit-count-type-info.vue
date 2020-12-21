<template>
  <b-modal id="visit-count-type-info-modal" 
           :title="$t('message-autos.recent-visit-type') + $t('message-autos.date-selection')"
           :no-close-on-backdrop="true"
           hide-footer 
           class="visit-count-type-info-modal">
    {{ $t('message-autos.visit-count-type-info') }}
    <br><br>
    <table class="visit-count-type">
      <tbody>
        <tr>
          <th>{{ $t('message-autos.by-sales-category') }}</th>
          <td>{{ $t('message-autos.by-sales-category-info') }}</td>
        </tr>
        <tr>
          <th>{{ $t('message-autos.by-sales') }}</th>
          <td>{{ $t('message-autos.by-sales-info') }}</td>
        </tr>
      </tbody>
    </table>
    <div class="modal-footer">
      <button class="btn btn-secondary" @click="hideModal()">{{ $t('general.close') }}</button>
    </div>
  </b-modal>
</template>

<script>
import component_base from '../../common/component-base/component-base'

export default {
  extends: component_base,
  data(){
    return {
    }
  },
  methods: {
    hideModal(){
      this.hideDialogById('visit-count-type-info-modal')
    }
  }
}
</script>

<style lang="scss">
@import './visit-count-type-info.scss';
</style>