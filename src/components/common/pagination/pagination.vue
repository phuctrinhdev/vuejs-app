<template>
  <div v-if="pagination.total_pages > 1" class="pagination-wrapper">
    <div class="pagination-index">
      <span>{{ $t('general.page') }}</span> <b>{{ pagination.page_number }}</b> 
      <span>{{ $t('general.of') }}</span> <span>{{ pagination.total_pages }}</span>
    </div>
    <b-pagination-nav id="pagination"
                      :value="pagination.page_number" :number-of-pages="pagination.total_pages" :link-gen="linkGen"
                      :limit="1" 
                      first-text="<<" prev-text="<" 
                      next-text=">" last-text=">>"
                      @input="onChangePage"/>
    <div class="goto">
      <label @click="show_goto = !show_goto">{{ $t('general.goto') }}</label>
      <multiselect ref="multiselect" 
                   v-model="page_current" :options="page_options" :class="{ show: show_goto }"
                   :searchable="true" :close-on-select="true" :show-labels="false" 
                   :hide-selected="true"
                   placeholder="" @open="openGoto" @select="onChangePage"
                   @mouseleave.native="onMouseleave"/>
    </div>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'

export default {
  components: {
    multiselect
  },
  props: {
    pagination: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      link_current:'',

      // goto
      show_goto: false,
      page_options: [],
      page_current: 1
    }
  },
  mounted() {
    this.link_current = this.$route.path
  },
  methods: {
    openGoto(){
      this.page_options = []
      for(let i = 1; i <= this.pagination.total_pages; i++){
        this.page_options.push(i)
      }
    },
    onChangePage(page_num){
      this.page_current = page_num
      this.$emit('change-page', page_num)
    },
    linkGen() {
      let hash = ''
      if(this.$router.mode == 'hash') hash = '#'
      return hash + this.link_current
    },
    onMouseleave(){
      if(this.$refs.multiselect.isOpen) 
        this.$refs.multiselect.toggle()
    }
  }
}
</script>

<style lang='scss'>
@import './pagination.scss';
</style>