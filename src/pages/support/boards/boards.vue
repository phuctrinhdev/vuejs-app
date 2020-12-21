<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ title }}</h3>
          <ul v-if="board_code == options.boards_enum.board_type.sys_board || board_code == options.boards_enum.board_type.chn_board" class="btn-group clearfix flr"> <!-- Todo Change Chain... --> 
            <li><a class="btn secondary" @click="onActionBoard(null, options.form_actions.add)">{{ $t('boards.add') }}</a></li>
          </ul>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part mr15">
              <span class="badge badge-info badge-pill search-part">{{ $t('general.type') }}</span> 
              <select-control v-model="table_filter.search_type" :options="options.boards_enum.search_board_type_select"
                              class="dib" text-field="text" value-field="value"/>
              <input v-model="table_filter.contents" type="text" class="w200"
                     @keyup.enter="onSearch">
            </li>
          </ul>
          <div class="search-btn clearfix">
            <button class="submit-btn pc" @click="onSearch"><span class="search-pc"/><span>{{ $t('general.search') }}</span></button>
            <button class="submit-btn mobile" @click="onSearch"><span class="search-mobile"/></button>              
          </div>
        </div>
        <div class="section-part">            
          <div v-html="$i18n.t('boards.all').replace('{0}', table_data.pagination.total_items)"/>
          <div class="slide-x small">
            <board-table :data="table_data" @click-rows="onActionBoard">
              <template slot="id" slot-scope="{ row }">
                <template v-if="row.post_on_top">
                  {{ $t('boards.notice') }}
                </template>
                <template v-else-if="row.board_code == options.boards_enum.board_code.popup">
                  {{ row.popup_id }}
                </template>
                <template v-else>
                  {{ row.id }}
                </template>
              </template>
              <template slot="title" slot-scope="{ row }">
                <template v-if="board_management_data && board_management_data.board_group_type == options.boards_enum.board_group_type.board">
                  <font v-for="index in row.depth" :key="index">
                    &nbsp;&nbsp;
                  </font>
                  <span v-if="row.depth > 0" class="answer">▷</span>
                </template>
                <template v-if="!row.master_only_reading || x_user.user_role_code == options.user_roles.master">
                  {{ row.title }}
                </template>
                <template v-if="row.master_only_reading && x_user.user_role_code != options.user_roles.master">
                  <font style="color: gray;">{{ $t('boards.hide-only-for-master') }}</font>
                </template>
              </template>
              <template slot="created_by_user_id" slot-scope="{ row }">
                <div v-if="row.created_by_user_role == 'ADMMASTER' || (board_code != options.boards_enum.board_type.chn_notice && row.board_code == options.boards_enum.board_code.popup)">
                  {{ $t('general.ahasoft') }}
                </div>
                <div v-else>
                  <div :id="'shop-tooltip' + row.id" class="text-ellip">{{ row.created_by_user_id }}</div>
                  <b-tooltip :target="'shop-tooltip' + row.id" class="tooltip" placement="bottom">
                    {{ row.shop_name }}
                  </b-tooltip>
                </div>
              </template>
            </board-table>
            
            <div v-if="table_data.pagination.total_pages > 1" class="pagination-wrapper">
              <div class="pagination-index">
                <span>{{ $t('general.page') }}</span> <b>{{ table_filter.page_number }}</b> 
                <span>{{ $t('general.of') }}</span> <span>{{ table_data.pagination.total_pages }}</span>
              </div>
              <b-pagination-nav :value="table_filter.page_number" :number-of-pages="table_data.pagination.total_pages" :link-gen="linkGen"
                                :limit="1" first-text="<<"
                                prev-text="<" next-text=">" last-text=">>"
                                @input="onChangePage"/>
              <div class="goto">
                <label @click="show_goto = !show_goto">{{ $t('general.goto') }}</label>
                <multiselect ref="multiselect" 
                             v-model="page_current" :options="page_options" :class="{ show: show_goto }"
                             :searchable="true" :close-on-select="true" :show-labels="false" 
                             placeholder="" @open="openGoto" @select="onChangePage"
                             @mouseleave.native="onMouseleave"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import _                           from 'lodash'
import { mapGetters, mapActions }  from 'vuex'
import { options }                 from '../../../helpers/options'
import component_base              from '../../../components/common/component-base/component-base'
import BoardManagementApi          from '../../../api/boards/board-management-api'
import ShopInfoApi          from '../../../api/account/shop-info-api'
import board_table                  from '../../../pages/support/board-table/board-table'
import select_control              from '../../../components/common/form/select/select-control/select-control2'
import pagination                  from '../../../components/common/pagination/pagination.vue'
import { formatDate
  , convertDateFromUtcToTimezone } from '../../../helpers/common'
import multiselect from 'vue-multiselect'

export default {
  components: {
    pagination,
    'select-control' : select_control,
    'board-table'   : board_table,
    multiselect
  },
  extends: component_base,
  data() {
    return {
      options : options,
      table_data: {
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: false,
          clickable  : true
        },
        style: 'normal'
      },
      table_filter: {
        page_size    : options.pagination.default,
        page_number  : 1,
        search_type  : options.boards_enum.search_board_type.title,
        contents     : null,
        country_code : null,
        board_code   : null,
      },
      board_management_api: null,
      board_management_data: null,
      title: null,
      board_code: null,
      shop_names:[],
      page_current: 1,
      page_options: [],
      show_goto: false,
      page_update: true
    }
  },
  computed: {
    ...mapGetters('notice', {
      notices_data: 'getNotices',
    }),
    ...mapGetters('board', {
      boards_data: 'getBoards',
      page_filter: 'getPageFilter'
    }),
  },
  watch: {
    async '$route.params.type'(){ // System Notice <--> Q & A
      this.page_current = 1
      this.show_goto= false
      this.board_code = this.$route.params.type
      this.page_update= false
      await this.loadTableFilter()
      await this.loadTableData()
      this.loadTitle()
    }
  },
  async mounted() {
    this.board_code = this.$route.params.type
    this.board_management_api = new BoardManagementApi()
    await this.loadTableFilter()
    await this.loadTableData()
    this.loadTitle()
  },
  methods: {
    ...mapActions('notice', [
      'getNoticesDataAsync',
      'resetStateNotices'
    ]),
    ...mapActions('board', [
      'getBoardsDataAsync',
      'setPageFilterData',
      'setBoardActionData',
    ]),
    async loadTableFilter(){
      let data_send = {
        country_code: this.shop_data.country,
        board_code: this.board_code,
        status: options.common_status.all
      }
      this.preLoader()
      let board_management_result = await this.board_management_api.getBoardManagementAsync(data_send)
      
      if(board_management_result.is_ok){
        this.board_management_data = board_management_result.data

        this.setTableColumn(this.board_management_data)

        this.table_filter = {
          page_size    : options.pagination.default,
          page_number  : this.page_filter.page_number,
          search_type  : this.page_filter.search_type,
          contents     : this.page_filter.contents,
          country_code : this.shop_data.country,
          board_code   : this.board_code,
        }
        // Todo Change - Add Chain Board
        this.table_filter.solution_id = this.shop_data.solution_id
        this.table_filter.business_type_code = this.shop_data.business_type_code
        this.table_filter.shop_id = this.shop_data.shop_id
        this.table_filter.chain_id = this.shop_data.chain_id
        this.table_filter.branch_type = this.shop_data.branch_type

      }
      else 
        this.showAlert(board_management_result.error_messages)
      this.preLoader(false)
    },
    loadTitle(){
      this.title = this.$i18n.t('boards.' + this.shop_data.country + '-' + this.board_code)
    },
    async loadTableData() {
      this.table_data.rows = [] 
      this.preLoader()
      if(this.board_management_data.board_group_type == options.boards_enum.board_group_type.notice){
        await this.getNoticesDataAsync(this.table_filter)
        if(this.notices_data.is_ok){
          //Get Shop Name for chain notice
          if(this.board_code == options.boards_enum.board_type.chn_notice)
          {
            await this.getShopNames(this.notices_data.data.items)
            this.notices_data.data.items.forEach(e=>{
              e.shop_name = this.findShopName(e)
            })
          }
          if(this.notices_data.data.post_on_top_items.length > 0){
            let top_row = _.cloneDeep(this.notices_data.data.post_on_top_items)
            top_row.forEach(item => {
              item.id = String('postontop' + item.id) // Delete duplicated id 
            })
            this.table_data.rows = top_row // If the board is posted at the top, release post on top value
          }
          this.notices_data.data.items.forEach(item => {
            item.post_on_top = 0
            if(item.board_code==options.boards_enum.board_code.popup)
            {
              item.popup_id = item.id
              item.id = String(item.board_code + item.id)
            }
            this.table_data.rows.push(item)
          })
          this.table_data.pagination = this.notices_data.data.pagination
          this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)

          this.$nextTick(() => { // Pagination Keep Page
            this.page_filter.page_number = Object.assign(this.page_filter.page_number)
          })
        }
        else this.showAlert(this.notices_data.error_messages)
      }else{
        await this.getBoardsDataAsync(this.table_filter)
        if(this.boards_data.is_ok){
          await this.getShopNames(this.boards_data.data.items)
          this.boards_data.data.items.forEach(e=>{
            e.shop_name = this.findShopName(e)
          })
          this.table_data.rows = this.boards_data.data.items
          this.table_data.pagination = this.boards_data.data.pagination
          this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)

          this.$nextTick(() => { // Keep Page
            this.page_filter.page_number = Object.assign(this.page_filter.page_number)
          })
        }
        else this.showAlert(this.boards_data.error_messages)
      }
      this.preLoader(false)
      this.page_update = true
    },
    async getShopNames(data_items){
      this.shop_names = []
      let shop_ids =[]
      data_items.forEach(e => {
        shop_ids.push(e.shop_id)            
      })
      let shop_info_api = new ShopInfoApi()
      let result = await shop_info_api.getShopNames(shop_ids)
      this.shop_names = result.data.items
    },
    findShopName(data_items){
      let shop_name =''
      if(this.shop_names.length>0)
      {
        let find_shop = _.find(this.shop_names, x=>x.shop_id == data_items.shop_id)
        if(find_shop!=undefined)
          shop_name = find_shop.shop_name
        data_items.shop_name = shop_name
      }
      return shop_name
    },
    setTableColumn(board_management){
      // Basic Field
      this.table_data.fields = 
      [
        { field: 'id',                   label: 'boards.id',               sortable: false, width: '5%',  expand: true },
        { field: 'title',                label: 'boards.title',            sortable: false, expand: true, left: true },
        { field: 'created_by_user_id', label: 'boards.writer',           sortable: false,  expand: true, tdClass: ' width-sm' },
        { field: 'registration_date',    label: 'general.registered-date', sortable: false, formatFn: this.formatDateCol, tdClass: ' width-sm' },
      ]

      // BoardManagement Field (Todo.. If change Add ShopId??)
      if(board_management.allow_file_attachment)
        this.table_data.fields.push({ field: 'file_attachment_count', label: 'boards.attached-files', sortable: false, formatFn: this.formatFileAttachmentCol, tdClass: ' extra-col' })
      if(board_management.display_read_count)
        this.table_data.fields.push({ field: 'read_count', label: 'boards.read-count', sortable: false, tdClass: ' extra-col' })
    },
    //paging
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      if(this.page_update)
        await this.loadTableData()
    },
    openGoto(){
      this.page_options = []
      for(let i = 1; i <= this.table_data.pagination.total_pages; i++){
        this.page_options.push(i)
      }
    },
    onMouseleave(){
      if(this.$refs.multiselect.isOpen) 
        this.$refs.multiselect.toggle()
    },
    onSearch(){
      this.onChangePage(1)
    },
    onActionBoard(data, action = null){
      this.setPageFilterData({
        search_type : this.table_filter.search_type,
        contents    : this.table_filter.contents,
        page_number : this.table_filter.page_number
      })
      let route_name = ''
      let board_action = {}
      if(action == options.form_actions.add){
        board_action = {
          id: null, 
          action: action
        }
        route_name = 'board-action'
      }
      else {
        let id = 0
        if(data.row.post_on_top) id = String(data.row.id).substring(9) // Delete duplicated id ('postontop' + id)
        else {
          if(data.row.board_code == options.boards_enum.board_code.popup){
            id = String(data.row.id).substring(5) // Delete duplicated id ('popup' + id)
          } 
          else id = data.row.id
        } 
        board_action = {
          id: id, 
          shop_name: data.row.shop_name,
          action: options.form_actions.view,
          board_type: data.row.board_code //1: notice, 2: popup
        }
        route_name = 'board-view'
      }
      this.setBoardActionData(board_action)
      this.$router.push({ name: route_name, params: { board_code: this.board_code }})
    },
    formatDateCol(date){
      return formatDate(convertDateFromUtcToTimezone(date, this.shop_data.timezone), this.shop_data.format_date)
    },
    formatFileAttachmentCol(files){
      return files > 0? 'O' : 'X'
    },
    linkGen() {
      let hash = ''
      if(this.$router.mode == 'hash') hash = '#'
      return hash + this.link_current
    }
  }
}
</script>
<style lang="scss">
@import './boards.scss';
</style>