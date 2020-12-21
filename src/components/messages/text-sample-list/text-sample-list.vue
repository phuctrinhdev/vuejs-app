<template>
  <div>    
    <div :class="checkClassSampleBox()" class="clearfix bdb mt10">
      <template v-for="(row, idx) in table_data.rows">
        <div :key="idx" :class="{'mms': table_filter.message_type == options.messages_enums.message_type.mms, 'lms' : table_filter.message_type == options.messages_enums.message_type.lms, 'sms': table_filter.message_type == options.messages_enums.message_type.sms }"
             class="fll" >
          <div>
            <div class="imgbox">
              <div class="textbox tac" @click="onClick($event, row)">
                <textarea
                  v-if="table_filter.message_type != options.messages_enums.message_type.mms" 
                  v-model="row.contents"
                  :disabled="table_filter.list_type ==options.messages_enums.list_type.sample"
                  class="font-black"
                  @keyup.prevent="onCheckLength($event, row)"
                  @paste="onPaste($event, row)"
                />
                <img v-if="table_filter.message_type == options.messages_enums.message_type.mms && row.image_name != ''" :src="imagePath(row.image_name, row.image_path)">            
              </div>                
              <span v-if="table_filter.message_type != options.messages_enums.message_type.mms" class="fix fz13">{{ row.current_bytes }} / {{ table_filter.max_bytes }} Byte</span>
            </div>
            <div v-if="table_filter.list_type == options.messages_enums.list_type.my_message" class="buttonbox">
              <template v-if="row.id">
                <button class="btn secondary small" @click="onActionMyMessage(row, 'updateTextMyMessageAsync')">{{ $t('general.edit') }}</button>
                <button class="btn secondary small" @click="onActionMyMessage(row, 'deleteTextMyMessageAsync')">{{ $t('general.delete') }}</button>
              </template>
              <template v-else>
                <button class="btn secondary small" @click="onActionMyMessage(row, 'createTextMyMessageAsync')">{{ $t('general.add') }}</button>
                <button class="btn secondary small" @click="onActionMyMessage(idx)">{{ $t('general.delete') }}</button>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="table_data.pagination.total_pages > 1" class="pagination-wrapper">
      <div class="pagination-index">
        <span>{{ $t('general.page') }}</span> <b>{{ table_filter.page_number }}</b> 
        <span>{{ $t('general.of') }}</span> <span>{{ table_data.pagination.total_pages }}</span>
      </div>
      <b-pagination-nav :value="table_filter.page_number" :number-of-pages="table_data.pagination.total_pages" :link-gen="linkGen"
                        :limit="1" first-text="<<"
                        prev-text="<" next-text=">" last-text=">>"
                        @input="onChangePage"/>
                        <!-- Todo Goto -->
    </div>
  </div>
</template>

<script>
import { options }        from '../../../helpers/options'
import component_base     from '../../../components/common/component-base/component-base'
import TextSampleApi              from '../../../api/messages/text-sample-api'
import TextMyMessageApi           from '../../../api/messages/text-my-message-api'
import MessageHelper              from '../../../helpers/message-helper.js'

export default {
  extends: component_base,
  props: {
    data: {
      type: Object,
      default: null,
    },   
    page: {
      type: String,
      default: null
    }
  }, 
  data () {
    return {
      options: options,
      table_data: {
        rows:[],
        pagination:{
          total_pages: 1
        },
      },
      table_filter: {        
        text_sample_group_id : 0,
        message_type : options.messages_enums.message_type.sms, 
        country_code : '', 
        solution_id  : 0,
        page_size    : 1,
        page_number  : 1,
        max_bytes    : 0,
        text_fees    : {},   
        shop_id      : 0,
        list_type    : options.messages_enums.list_type.sample,
        is_create    : false,
        contents     : null,
        mms_type     : options.messages_enums.mms_type.image
      },
      message_helper : null,
    }
  },
  beforeMount() {
    this.table_filter.message_type = this.data.message_type || options.messages_enums.message_type.sms
  },
  methods: {
    async onLoadForm() {
      Object.assign(this.table_filter, this.data)
      let ty = 0

      if(this.table_filter.list_type == options.messages_enums.list_type.sample){
        ty = (this.table_filter.message_type == options.messages_enums.message_type.mms 
                && this.table_filter.mms_type == options.messages_enums.mms_type.text) ? options.messages_enums.message_type.lms : this.table_filter.message_type
      }else{ // My messages
        ty = this.data.message_type == options.messages_enums.message_type.mms ? options.messages_enums.message_type.lms : this.data.message_type
        this.table_filter.shop_id = this.shop_data.shop_id
      }
      this.table_filter.message_type = ty
      this.table_filter.text_fees = this.data.text_fees
      await this.onMessageTypeInput() 
    },
    async onMessageTypeInput() {
      let ty = this.table_filter.message_type
      this.table_filter.page_size = options.messages_enums.message_type_options.find(e => e.value == ty).page_size
      this.table_filter.page_number = 1
      this.table_filter.max_bytes = 0

      if (this.table_filter.text_fees.sms_max_bytes)
      {
        if (ty == options.messages_enums.message_type.sms) this.table_filter.max_bytes = this.data.text_fees.sms_max_bytes
        else if (ty == options.messages_enums.message_type.lms) this.table_filter.max_bytes = this.data.text_fees.lms_max_bytes
        else if (ty == options.messages_enums.message_type.mms) this.table_filter.max_bytes = this.data.text_fees.mms_max_bytes
      }
      this.message_helper = new MessageHelper(ty, this.table_filter.max_bytes) 

      if(this.table_filter.list_type == options.messages_enums.list_type.sample)
        await this.LoadTextSamples()
      else // My messages
        await this.LoadMyMessages()
    },
    async LoadTextSamples(){
      if ( `${this.table_filter.group_code}` =='' && this.table_filter.text_sample_group_id <= 0) {
        this.table_data.rows = {}
        return
      }
      let data_send = { 
        text_sample_group_id : this.table_filter.text_sample_group_id,
        country_code : this.table_filter.country_code,
        solution_id  : this.table_filter.solution_id,
        group_code   : this.table_filter.group_code,
        message_type : this.table_filter.message_type,
        page_size    : this.table_filter.page_size, 
        page_number  : this.table_filter.page_number,
      }    
      await this.getTextSamplesAsync(data_send)
    },
    async getTextSamplesAsync(data_send){
      let api = new TextSampleApi()
      this.preLoader()
      let result = await api.getTextSamplesAsync(data_send)
      this.preLoader(false)
      if(result.is_ok){
        this.table_data.rows = result.data.items
        this.table_data.rows.forEach(e => {
          this.$set(e, 'current_bytes',  this.message_helper.calculate_byte(e.contents))
        })
        this.table_data.pagination = result.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }else {
        this.showAlert(result.error_messages)
      }
    },
    async LoadMyMessages(){
      let data_send = { 
        shop_id      : this.table_filter.shop_id,
        solution_id  : this.table_filter.solution_id,
        country_code : this.table_filter.country_code,
        message_type : this.table_filter.message_type,
        page_size    : this.table_filter.page_size, 
        page_number  : this.table_filter.page_number,
      }    
      await this.getMyMessagesAsync(data_send)
    },
    async getMyMessagesAsync(data_send){
      let api = new TextMyMessageApi()
      this.preLoader()
      let result = await api.getTextMyMessagesAsync(data_send)
      this.preLoader(false)
      if(result.is_ok){
        this.table_data.rows = result.data.items
        if(this.table_filter.is_create)
          this.onAddMyMessage(this.table_filter.contents)
        this.table_data.rows.forEach(e => {
          this.$set(e, 'current_bytes',  this.message_helper.calculate_byte(e.contents))
        })
        this.table_data.pagination = result.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }else {
        this.showAlert(result.error_messages)
      }
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num      
      await this.LoadTextSamples()
    },
    //contents
    onCheckLength(evt, row) {
      const ui= evt.target
      let return_data = this.message_helper.check_len(ui)
      if (return_data != null) {              
        row.contents = return_data.value
        row.current_bytes = return_data.length
      }
    },
    onPaste(evt, row){
      setTimeout(()=> this.onCheckLength(evt, row), 4) 
    },
    async onClick(evt, row){
      let data = null
      if(this.table_filter.message_type == options.messages_enums.message_type.mms) data = row
      else data = row.contents
      this.$emit('addChar', data)
    },
    checkClassSampleBox() {
      let message_type = this.table_filter.message_type
      if (message_type == options.messages_enums.message_type.sms) return 'smsbox'
      else if (message_type == options.messages_enums.message_type.lms) return 'smsbox-lms'
      else if (message_type == options.messages_enums.message_type.mms) return 'smsbox-mms'
    },
    imagePath(image_name, image_path){
      // eslint-disable-next-line no-undef
      return process.env.AZURE_STORAGE_MESSAGE_URL + image_path + '/' + image_name
    },
    onAddMyMessage(contents){
      this.table_data.rows.unshift({
        country_code : this.table_filter.country_code,
        message_type : this.table_filter.message_type,
        shop_id      : this.table_filter.shop_id,
        solution_id  : this.table_filter.solution_id,
        contents     : contents
      })
    },
    linkGen() {
      let hash = ''
      if(this.$router.mode == 'hash') hash = '#'
      return hash + this.link_current
    },
    async onActionMyMessage(row, api_action) {
      if(typeof row == 'number'){
        this.table_data.rows.splice(row, 1)
      }else{
        let data_send = {
          id           : row.id,
          shop_id      : this.table_filter.shop_id,
          contents     : row.contents,
          message_type : this.table_filter.message_type,
          solution_id  : this.table_filter.solution_id,
          country_code : this.table_filter.country_code
        }

        let text_my_message_api = new TextMyMessageApi()
        this.preLoader()
        let result = await text_my_message_api[api_action](data_send)
        this.preLoader(false)
        if(result.is_ok){
          this.showAlert(new Array(this.$i18n.t('general.success')))
          this.table_filter.is_create = false
          this.LoadMyMessages()
        }else {
          this.showAlert(result.error_messages)
        }
      }
    },
  }
}
</script>

<style lang='scss'>
@import './text-sample-list.scss';
</style>