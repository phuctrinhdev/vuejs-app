<template>
  <main class="app-content">
    <section class="content product-categories-page">
      <div class="inner">
        <article class="row setup-top clearfix">
          <h3 class="col-7 col-sm-6">{{ $t('product-category.product-category-list') }}</h3>
          <ul class="col-5 col-sm-6 justify-content-end btn-group clearfix">
            <li><goods-btn v-if="show_add_button" :data="{ label: 'product-category.product-category-add' }" class="btn-large"
                           @click-action="onActionProductCategory(options.form_actions.add)"/></li>
          </ul>
        </article>
        <div class="row table-custom">
          <div class="col-12">
            <!-- table data -->
            <div class="table-data form-wrapper">
              <goods-table :data="table_data" @change-page="onChangePage" @drag-end="onDragEnd">
                <!-- action at top table -->
                <template slot="table-actions">
                  <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
                </template>
                <!-- table rows -->
                <template slot="edit" slot-scope="{ row }">
                  <goods-btn :data="{ label: 'general.edit', item: row }"
                             @click-action="onActionProductCategory(options.form_actions.edit, row)"/>
                </template>
              </goods-table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- modal action -->
    <product-category-action @reload-page="onReloadPage" @update-page="onUpdatePage"/>
  </main>
</template>

<script>
import show_inactives from '../../../components/common/show-inactives/show-inactives.vue'
import product_category_action from '../../../components/goods/product-category-action/product-category-action.vue'
import { mapGetters, mapActions } from 'vuex'
import component_base    from '../../../components/common/component-base/component-base'
import ProductCategoryApi from '../../../api/goods/product-category-api.js'
import { options } from '../../../helpers/options'
import goods_table from '../../../components/goods/goods-table/goods-table.vue'
import goods_btn from '../../../components/goods/goods-btn/goods-btn.vue'
import { checkDragOptionProduct, showGoodsAddButton, checkShowGoodsSharedCol } from '../../../config/permission'


export default {
  components: {
    'show-inactives': show_inactives,
    'goods-table': goods_table,
    'goods-btn': goods_btn,
    'product-category-action': product_category_action
  },
  extends: component_base,
  data() {
    return {
      options,

      // table
      table_data: {
        fields: [
          { field: 'shared', label: 'services.shared',  width: '10%', sortable: false,  thClass: this.showShareCol, tdClass: this.showShareCol, formatFn: this.formatTrueFalseCol  },
          { field: 'name', label: 'product-category.items', width: '90%', sortable: false },
          { field: 'edit', label: 'general.edit',           width: '10%', sortable: false, expand: true }
        ],
        rows:[],
        groups: [
          { name: 'product-category-shared', rows: [] },
          { name: 'product-category-unshared', rows: [] }
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: options.good_table_drag.off,
          pagination: true
        },
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },
      show_add_button: true
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getShop'
    }),
    ...mapGetters('product_category', {
      product_categories_data: 'getProductCategories'
    }),
  },
  mounted() {
    // set drag option base shop sharing setting
    this.table_data.options.drag = checkDragOptionProduct()

    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableData()
  },
  methods: {
    ...mapActions('product_category', [
      'getProductCategoriesDataAsync',
      'setProductCategoryActionData',
      'updateProductCategoriesData',
    ]),
    showShareCol(){
      let class_name = 'hide'
      if(checkShowGoodsSharedCol(options.sharing_goods_type.product)) class_name = 'show-shared'
      return class_name
    },
    formatTrueFalseCol(shared){
      return shared == true? 'O' : 'X'
    },
    // table
    async loadTableData() {
      this.show_add_button = showGoodsAddButton(options.sharing_goods_type.product)
      
      this.preLoader()
      await this.getProductCategoriesDataAsync(this.table_filter)
      
      if(this.product_categories_data.is_ok){
        this.table_data.rows = this.product_categories_data.data.items
        this.table_data.pagination = this.product_categories_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(this.product_categories_data.error_messages)
      
      // group data for table UI
      for(let group in this.table_data.groups){
        this.table_data.groups[group].rows = []
      }
      for(let key in this.table_data.rows){
        if(this.table_data.rows[key].shared) this.table_data.groups[0].rows.push(this.table_data.rows[key])
        if(!this.table_data.rows[key].shared) this.table_data.groups[1].rows.push(this.table_data.rows[key])
      }
      this.preLoader(false)
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },

    // table UI
    onShowInactives(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },

    // drag
    async onDragEnd(drag_data, e){
      let drag_change = {
        shop_id: this.shop_data.shop_id,
        old_position_id: drag_data[e.oldIndex].id,
        new_position_id: drag_data[e.newIndex].id
      }
      this.preLoader()
      let product_category_api = new ProductCategoryApi()
      let result = await product_category_api.updateProductCategoryOrderNoAsync(drag_change)
      this.preLoader(false)
      
      if(!result.is_ok) this.showAlert(result.error_messages)
      else this.loadTableData()
    },

    // modal action
    onActionProductCategory(action, product_category = {}){
      this.product_category_action = {
        action: action,
        data: product_category
      }
      this.setProductCategoryActionData(this.product_category_action)
      this.showDialogById('action-product-category-modal')
    },

    // event success
    onReloadPage(){
      this.loadTableData()
    },
    onUpdatePage(product_category){
      product_category.shared = this.product_category_action.data.shared
      if(this.product_category_action.data.status != product_category.status) this.loadTableData()
      else this.updateProductCategoriesData(product_category)
    },
  }
}
</script>

<style lang="scss">
@import './product-categories.scss';
</style>