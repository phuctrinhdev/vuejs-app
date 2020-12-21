import { options }                   from '../../helpers/options'
export default {
  async created() {
    // set drag options base user role
    this.table_data.options.drag = options.good_table_drag.all

    await this.loadDataTable()
  },
  methods: {
    setFilterWithShopData(){
      this.table_filter.shop_id = this.shop_data.shop_id
    },
    onShowInactives(){
      this.table_filter.page_number = 1 
      this.loadDataTable()
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadDataTable()
    },
  }
}