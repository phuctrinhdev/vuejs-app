import { options } from '../../helpers/options'
import PackageApi from '../../api/goods/package-api'
import PackageItemApi from '../../api/goods/package-item-api'

export default {
  data() {
    return {
      package_api: new PackageApi(),
      package_item_api: new PackageItemApi()
    }
  },
  methods: {
    async getPackagesAsyncMixin(){
      let package_filter = {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }

      let result = await this.package_api.getPackagesAsync(package_filter)

      return result
    },
    async getPackageItemsAsyncMixin(package_id){
      let package_item_filter = {
        id: package_id,
        shop_id: this.shop_data.shop_id
      }

      let result = await this.package_item_api.getPackageItemsAsync(package_item_filter)

      return result
    }
  }
}