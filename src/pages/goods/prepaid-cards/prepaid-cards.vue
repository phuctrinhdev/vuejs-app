<template>
  <main class="app-content">
    <section class="prepaid-cards-page content">
      <div class="inner">
        <article class="row setup-top clearfix">
          <h3 class="col-6">{{ $t('prepaid-cards.prepaid-cards') }}</h3>
          <ul class="col-6 justify-content-end btn-group clearfix">
            <li><goods-btn v-if="show_add_button" :data="{ label: 'prepaid-cards.prepaid-card-add' }" class="btn-large"
                           @click-action="onActionPrepaidCard(options.form_actions.add)"/></li>
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
                <template slot="price" slot-scope="{ row }">
                  {{ $n(row.price) }}
                </template>
                <template slot="bonus" slot-scope="{ row }">
                  <template v-if="row.prepaid_card_type == options.prepaid_card_type.deposit_card">{{ $n(row.charge_amount - row.price) }}</template>
                </template>
                <template slot="charge_amount" slot-scope="{ row }">
                  <template v-if="row.prepaid_card_type == options.prepaid_card_type.deposit_card || row.charge_amount > 0">{{ $n(row.charge_amount) }}</template>
                </template>
                <template slot="validity" slot-scope="{ row }">
                  {{ formatValidity(row) }}
                </template>
                <template slot="salary_sales_value" slot-scope="{ row }">
                  {{ formatSalary(row) }}
                </template>
                <template slot="edit" slot-scope="{ row }">
                  <goods-btn :data="{ label: 'general.edit', item: row }"
                             @click-action="onActionPrepaidCard(options.form_actions.edit, row)"/>
                </template>
              </goods-table>
            </div>
          </div>
        </div>
      </div>
    </section> 

    <!-- modal action -->
    <prepaid-card-action @reload-page="onReloadPage" @update-page="onUpdatePage"/>
  </main>
</template>

<script>
import prepaid_card_action from '../../../components/goods/prepaid-card-action/prepaid-card-action.vue'
import { mapGetters, mapActions } from 'vuex'
import PrepaidCardApi from '../../../api/goods/prepaid-card-api.js'
import { options } from '../../../helpers/options'
import show_inactives from '../../../components/common/show-inactives/show-inactives.vue'
import goods_table from '../../../components/goods/goods-table/goods-table.vue'
import goods_btn from '../../../components/goods/goods-btn/goods-btn.vue'
import component_base    from '../../../components/common/component-base/component-base'
import { checkDragOptionService, showGoodsAddButton, checkShowGoodsSharedCol } from '../../../config/permission'
import { formatMoney } from '../../../helpers/common'


export default {
  components: {
    'prepaid-card-action': prepaid_card_action,
    'show-inactives': show_inactives,
    'goods-table': goods_table,
    'goods-btn': goods_btn
  },
  extends: component_base,
  data() {
    return {
      options,

      // table
      table_data: {
        fields: [
          { field: 'shared',            label: 'services.shared',                width: '5%',  sortable: false,  thClass: this.showShareCol, tdClass: this.showShareCol, formatFn: this.formatTrueFalseCol },
          { field: 'name',              label: 'prepaid-cards.prepaid-card-name',width: '40%', sortable: false },
          { field: 'price',             label: 'prepaid-cards.sales-price',      width: '10%', sortable: false, expand: true },
          { field: 'bonus',             label: 'prepaid-cards.bonus',            width: '10%', sortable: false, expand: true },
          { field: 'charge_amount',     label: 'prepaid-cards.initial-balance',  width: '10%', sortable: false, expand: true },
          { field: 'validity',          label: 'prepaid-cards.validity',         width: '10%', sortable: false, expand: true },
          { field: 'salary_sales_value',label: 'prepaid-cards.salary',           width: '10%', sortable: false, expand: true },
          { field: 'edit',              label: 'general.edit',                   width: '10%', sortable: false, expand: true }
        ],
        rows:[],
        groups: [
          { name: 'prepaid-card-shared', rows: [] },
          { name: 'prepaid-card-unshared', rows: [] }
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
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },

      // drag list
      drag_data: {},

      // modal action
      prepaid_card_action: {},

      show_add_button: true
    }
  },
  computed: {
    ...mapGetters('prepaid_card', {
      prepaid_cards_data: 'getPrepaidCards'
    }),
    state(){
      return this.$store.state
    }
  },
  mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
    this.table_data.options.drag = checkDragOptionService()
    this.loadTableData()
  },
  methods: {
    ...mapActions('prepaid_card', [
      'getPrepaidCardsDataAsync',
      'updatePrepaidCardsData',
      'setPrepaidCardActionData'
    ]),
    showShareCol(){
      let class_name = 'hide'
      if(checkShowGoodsSharedCol(options.sharing_goods_type.service)) class_name = 'show-shared'
      return class_name
    },
    formatTrueFalseCol(shared){
      return shared == true? 'O' : 'X'
    },

    // table
    async loadTableData() {
      this.show_add_button = showGoodsAddButton(options.sharing_goods_type.service)

      this.preLoader()
      await this.getPrepaidCardsDataAsync(this.table_filter)
      
      if(this.prepaid_cards_data.is_ok){
        this.table_data.rows = this.prepaid_cards_data.data.items
        this.table_data.pagination = this.prepaid_cards_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(this.prepaid_cards_data.error_messages)

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
    onShowInactives(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },

    // draggable
    async onDragEnd(drag_data, e){
      let drag_change = {
        shop_id: this.shop_data.shop_id,
        old_position_id: drag_data[e.oldIndex].id,
        new_position_id: drag_data[e.newIndex].id
      }
      this.preLoader()
      let prepaid_card_api = new PrepaidCardApi()
      let result = await prepaid_card_api.updatePrepaidCardOrderNoAsync(drag_change)
      this.preLoader(false)

      if(!result.is_ok) this.showAlert(result.error_messages)
      else this.loadTableData()
    },

    // modal action
    onActionPrepaidCard(action, prepaid_card = {}){
      this.prepaid_card_action = {
        action: action,
        data  : prepaid_card
      }
      this.setPrepaidCardActionData(this.prepaid_card_action)
      this.showDialogById('action-prepaid-card-modal')
    },

    // event success
    onReloadPage(){
      this.loadTableData()
    },
    onUpdatePage(prepaid_card){
      if(this.prepaid_card_action.data.status == prepaid_card.status) this.updatePrepaidCardsData(prepaid_card)
      else this.loadTableData()
    },

    // format template
    formatValidity(prepaid_card){
      let tmp_validaty = prepaid_card.validity
      if(tmp_validaty == -1){
        tmp_validaty = 'No Limit'
      } else {
        if(prepaid_card.validity_type == options.validity_type.months){
          tmp_validaty += ' months'
        }
        if(prepaid_card.validity_type == options.validity_type.days){
          tmp_validaty += ' days'
        }
      }
      return tmp_validaty
    },
    formatSalary(prepaid_card){
      let tmp = ''
      if(prepaid_card.salary_sales_value > 0){
        if(prepaid_card.salary_sales_type == options.salary_type.percent)
          tmp = `${prepaid_card.salary_sales_value}%`
        else
          tmp = formatMoney(prepaid_card.salary_sales_value, 0)
      }
      return tmp
    }
  }
}
</script>

<style lang="scss">
@import './prepaid-cards.scss';
</style>