<template>
  <div class="sales-item-packages">
    <ul class="row">
      <li v-for="(pack, i) in packages" :key="i" class="col-6 col-md-4"
          @click="onSelectPack(pack)">
        <a>{{ pack.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { options } from '../../../../helpers/options'
import { sales_options } from '../../../../helpers/options/sales-options'
import package_mixin from '../../../../helpers/mixins/package-mixin'

import component_base from '../../../common/component-base/component-base'
// import { formatMoney } from '../../../../helpers/common'

export default {
  extends: component_base,
  mixins: [package_mixin],
  data() {
    return {
      options,
      sales_options,

      packages: [],

      errors: [],
    }
  },
  async created(){
    await this.loadPackagesAsync()
  },
  methods: {
    async loadPackagesAsync(){
      this.preLoader()
      let result = await this.getPackagesAsyncMixin()
      this.preLoader(false)

      if(result.is_ok){
        this.packages = result.data.items
      } else {
        this.showAlert(result.error_messages)
      }
    },
    async onSelectPack(pack){
      this.preLoader()
      let result = await this.getPackageItemsAsyncMixin(pack.id)
      this.preLoader(false)

      if(result.is_ok){
        this.$emit('selected-package-items', result.data.items)
      } else {
        this.showAlert(result.error_messages)
      }
    }
  }
}
</script>

<style lang='scss'>
@import './sales-item-packages.scss';
</style>