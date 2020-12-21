<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ title }}</h3>
        </article>
        <div class="section-part">            
          <div class="slide-x small">
            <div id="System_in">
              <div class="inner show clearfix">
                <table style=":hover { border: 0 }">
                  <tbody>
                    <tr>
                      <td>{{ $t('boards.title') }}</td>
                      <td colspan="3" class="hover-none">
                        <input v-model="board.fields.title" type="text" class="w100p">
                      </td>
                    </tr>
                    <tr>
                      <td>{{ $t('boards.writer') }}</td>
                      <td class="hover-none">{{ x_user.user_name }}</td>
                      <template v-if="setting_form && setting_form.allow_master_only_reading && x_user.user_role_code == options.user_roles.master">
                        <td>{{ $t('boards.master-only') }}</td>
                        <td class="hover-none">
                          <b-form-checkbox
                            v-model="board.fields.master_only_reading"
                            :value="true"
                            :unchecked-value="false"
                            class="check-custom check-secondary"
                          >{{ $t('boards.master-only') }}</b-form-checkbox>
                        </td>
                      </template>
                    </tr>
                    <tr>
                      <td colspan="4" class="txt hover-none">
                        <textarea v-model="board.fields.contents"
                                  class="note noresize w100p fll mr10 note-height" cols="30" rows="30"/>
                      </td>
                    </tr>
                    <tr v-if="setting_form && setting_form.allow_file_attachment">
                      <td>{{ $t('boards.attached-files') }}</td>
                      <td colspan="3" class="hover-none">
                        <table class="type-top mb5">
                          <thead>
                            <tr>
                              <td class="bg-deepgreen" style="width:60%">{{ $t('boards.file-name') }}</td>
                              <td class="bg-deepgreen tac" style="width:25%">{{ $t('boards.file-size') }}</td>
                              <td class="bg-deepgreen" style="width:15%">{{ $t('general.delete') }}</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colspan="3">
                                <div class="bd slide-y sssm padding-sm">
                                  <ul v-for="(file, index) in board.fields.files" :key="index" class="cf hover">
                                    <li class="fll lh-button" style="width:60%">{{ file.name }}</li>
                                    <li class="fll lh-button" style="width:25%">{{ formatSize(file.size) }}</li>
                                    <li class="fll" style="width:15%">
                                      <button class="btn secondary small" @click="onRemoveFile(file)">{{ $t('boards.delete-file') }}</button>
                                    </li>
                                  </ul>
                                </div>
                                <div class="bottombox cf">
                                  <span class="fll mt3" style="color:#777">
                                    {{ $t('boards.file-info') }}
                                  </span>
                                  <div class="buttonbox flr">
                                    <file-upload
                                      ref="upload"
                                      v-model="board.fields.files"
                                      :multiple="true"
                                      accept="gif,png,jpeg,jpg,pdf,zip,xls,xlsx,docx,txt,csv"
                                      @input-filter="inputFilter">
                                      <button class="btn secondary small">{{ $t('boards.search-file') }}</button>
                                    </file-upload>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>	
                <div class="flr mt0">
                  <btn-action-group :data="form_options" @confirm="submitActionAsync()" @cancel="onListPage()"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import { mapActions
  , mapGetters }          from 'vuex'
import { options }        from '../../../helpers/options'
import component_base     from '../../../components/common/component-base/component-base'
import BoardManagementApi from '../../../api/boards/board-management-api'
import BoardViewModel     from '../../../view-model/boards/board-view-model'
import NoticeApi          from '../../../api/boards/notice-api'
import BoardApi           from '../../../api/boards/board-api'
import btn_action_group   from '../../../components/common/button/btn-action-group/btn-action-group'
import file_upload        from 'vue-upload-component'
import { formatSize }     from '../../../helpers/common'

export default {
  components: {
    'btn-action-group': btn_action_group,
    'file-upload': file_upload
  },
  extends: component_base,
  data() {
    return {
      options: options,
      title: null,
      board_code: null,
      setting_form: null,
      board: {},
      board_errors: [],
      form_options: {
        delete: false
      },
      files: [],
      total_file_count: 0
    }
  },
  computed: {
    ...mapGetters('board', {
      action_data: 'getBoardAction',
    }),
  },
  watch: {
    'board.fields.files'() {
      this.total_file_count = 0
    },
  },
  beforeMount(){
    this.board = new BoardViewModel()
  },
  async mounted() {
    // Refresh...
    if(this.action_data.action == null){
      this.setPageFilterData({
        search_type : options.boards_enum.search_board_type.title,
        contents    : null,
        page_number : 1
      })
      this.$router.push({ name: 'boards', params: { type: this.$route.params.board_code }})
      return 
    }
    this.board.fields.country_code = this.shop_data.country
    this.board.fields.shop_id = this.shop_data.shop_id
    this.board.fields.solution_id = this.shop_data.solution_id
    this.board.fields.board_code = this.$route.params.board_code
    this.board.fields.chain_id  = this.shop_data.chain_id
    this.title = this.$i18n.t('boards.' + this.shop_data.country + '-' + this.board.fields.board_code)

    // Form format
    await this.setForm()

    // Edit 
    if(this.action_data.action == options.form_actions.edit)
      await this.setFormData()
  },
  methods: {
    formatSize,
    ...mapActions('board', [
      'setPageFilterData'
    ]),
    async setForm() {
      let data_send = {
        country_code: this.shop_data.country,
        board_code: this.board.fields.board_code,
        status: this.options.common_status.all
      }

      this.preLoader()
      let board_management_api = new BoardManagementApi()
      let board_management_result = await board_management_api.getBoardManagementAsync(data_send)

      if(board_management_result.is_ok){
        this.setting_form = board_management_result.data
      } else this.showAlert(board_management_result.error_messages)
      this.preLoader(false)
    },
    async setFormData(){
      let result = null
      let api = null
      let data_send = {}

      this.preLoader()
      if(this.setting_form.board_group_type == options.boards_enum.board_group_type.notice){
        api = new NoticeApi()
        data_send = {
          notice_id    : this.action_data.id,
          country_code : this.shop_data.country
        }
        result = await api.getNoticeAsync(data_send)
      }else{
        api = new BoardApi()
        data_send = {
          board_id     : this.action_data.id,
          country_code : this.shop_data.country
        }
        result = await api.getBoardAsync(data_send)
      }
      this.preLoader()
      if(result.is_ok) 
        this.board.fields = result.data
      else 
        this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    async submitActionAsync(){
      // validate
      this.board_errors = this.board.isValid()
      if(this.board_errors.length == 0) {
        this.preLoader(true)
        let result = {}
        if(this.setting_form.board_group_type == options.boards_enum.board_group_type.notice){ // Notice
          let notice_api = new NoticeApi()  
          
          if(this.action_data.action == options.form_actions.add){
            this.setPageFilterData(1)
            result = await notice_api.createNoticeAsync(this.board.fields)
          }else
            result = await notice_api.updateNoticeAsync(this.board.fields)
        }else{ // Board
          let board_api = new BoardApi()  
          if(this.action_data.action == options.form_actions.add){
            if(this.action_data.id) // Create Board Reply
              this.board.fields.parent_id = this.action_data.id
            this.setPageFilterData(1)
            result = await board_api.createBoardAsync(this.board.fields)
          }else
            result = await board_api.updateBoardAsync(this.board.fields)
        }
        if(result.is_ok) 
          this.onListPage()
        else
          this.showAlert(result.error_messages)
      }else
        this.showAlert(this.board_errors)
      this.preLoader(false)
    },
    onListPage(){
      this.$router.push({ name: 'boards', params: { type: this.board.fields.board_code }})
    },
    inputFilter(new_file, old_file, prevent) {
      if (new_file && !old_file) {
        // File extension
        if (!(/\.(gif?|png?|jpeg?|jpg?|pdf?|zip?|xls?|xlsx?|docx?|txt?|csv?)$/i.test(new_file.name.toLowerCase()))) {
          this.showAlert([ this.$i18n.t('boards.upload-error-extension')])
          return prevent()
        }        
        // File size 
        if (/\.(gif?|png?|jpeg?|jpg?)$/i.test(new_file.name.toLowerCase())) { // Image
          if(new_file.size >= 1048576){
            this.showAlert([ this.$i18n.t('boards.upload-error-image-size')])
            return prevent()
          }
        } else if (/\.(pdf?|zip?|xls?|xlsx?|docx?|txt?|csv?)$/i.test(new_file.name.toLowerCase())) { // Document
          if(new_file.size >= 3145728){
            this.showAlert([ this.$i18n.t('boards.upload-error-document-size')])
            return prevent()
          }
        }
        
        let existCount = 0
        if(this.board.fields.files!=undefined) existCount = this.board.fields.files.length
        this.total_file_count++

        // File count
        if(this.board.fields.files != undefined && this.total_file_count + existCount > 3){
          this.showAlert([ this.$i18n.t('boards.upload-error-file-count')])
          return prevent()
        }
      }
    },
    onRemoveFile(file){
      this.board.fields.files.splice(this.board.fields.files.indexOf(file), 1)
    }
  }
}

</script>
<style lang='scss'>
@import './board-action.scss';
</style>