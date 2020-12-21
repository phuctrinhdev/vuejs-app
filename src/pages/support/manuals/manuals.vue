<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('manuals.title') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <ul class="manual-bar clearfix">
            <li :class="{'on' : table_filter.manual_type == options.boards_enum.manual_type.all}" 
                @click="onManualTypeChange(options.boards_enum.manual_type.all)">{{ $t('general.all') }}</li>
            <li :class="{'on' : table_filter.manual_type == options.boards_enum.manual_type.basic}" 
                @click="onManualTypeChange(options.boards_enum.manual_type.basic)">{{ $t('manuals.basic') }}</li>
            <li :class="{'on' : table_filter.manual_type == options.boards_enum.manual_type.application}" 
                @click="onManualTypeChange(options.boards_enum.manual_type.application)">{{ $t('manuals.application') }}</li>
            <li :class="{'on' : table_filter.manual_type == options.boards_enum.manual_type.video}" 
                @click="onManualTypeChange(options.boards_enum.manual_type.video)">{{ $t('manuals.video') }}</li>
          </ul>
        </div>
        <div class="section-part">            
          <div id="System_in" class="manual-list">
            <div v-if="baisc_manuals.length > 0" class="list list1">
              <h3>■ {{ $t('manuals.basic') }}</h3>
              <ul class="clearfix">
                <li v-for="(manual, index) in baisc_manuals" :key="index">
                  <a :href="manual.file_url" target="_blank">
                    <span class="img-box">
                      <img :src="imagePath(manual)" alt="manual-list">
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div v-if="application_manuals.length > 0" class="list list2">
              <h3>■ {{ $t('manuals.application') }}</h3>
              <ul class="cf">
                <li v-for="(manual, index) in application_manuals" :key="index"
                    @click="onShowApplicationManual(manual)">
                  <a href="#">
                    <span class="img-box">
                      <img :src="imagePath(manual)" alt="manual-list">
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div v-if="video_manuals.length > 0" class="list list3">
              <h3>■ {{ $t('manuals.video') }}</h3>
              <ul class="cf">
                <li v-for="(manual, index) in video_manuals" :key="index">
                  <a :href="manual.file_url" target="_blank">
                    <span class="img-box">
                      <img :src="imagePath(manual)" alt="manual-list">
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <vue-gallery-slideshow :images="images" :index="index" @close="onHideApplicationManual()"/>
  </main>
</template>

<script>
import _                     from 'lodash'
import { options }           from '../../../helpers/options'
import component_base        from '../../../components/common/component-base/component-base'
import vue_gallery_slideshow from 'vue-gallery-slideshow'
import ManualManagementApi   from '../../../api/boards/manual-management-api'
import { mapGetters
  , mapActions }             from 'vuex'

export default {
  components: {
    'vue-gallery-slideshow' : vue_gallery_slideshow
  },
  extends: component_base,
  data() {
    return {
      options : options,
      table_filter: {
        page_size          : options.pagination.max,
        page_number        : 1,
        country_code       : null,
        solution_id        : 0,
        business_type_code : null,
        manual_type        : options.boards_enum.manual_type.all
      },
      baisc_manuals: [],
      application_manuals: [],
      video_manuals: [],
      images: [],
      index: null
    }
  },
  computed: {
    ...mapGetters('manual', {
      manual_managements_data: 'getManualManagements',
    })
  },
  mounted() {
    this.table_filter.country_code = this.shop_data.country
    this.table_filter.business_type_code = this.shop_data.business_type_code
    this.table_filter.solution_id = this.shop_data.solution_id

    this.images = []
    this.index = null

    this.loadTableData()
  },
  methods: {
    ...mapActions('manual', [
      'getManualManagementsDataAsync',
      'setMenualManagementActionDataAsync'
    ]),
    async loadTableData() {
      this.preLoader()
      await this.getManualManagementsDataAsync(this.table_filter)
      if(this.manual_managements_data.is_ok) {
        this.baisc_manuals = _.filter(this.manual_managements_data.data.items, ['manual_type', options.boards_enum.manual_type.basic])
        this.application_manuals = _.filter(this.manual_managements_data.data.items, ['manual_type', options.boards_enum.manual_type.application])
        this.video_manuals = _.filter(this.manual_managements_data.data.items, ['manual_type', options.boards_enum.manual_type.video])
      }
      else this.showAlert(this.manual_managements_data.error_messages)
      this.preLoader(false)
    },
    async onShowApplicationManual(manual_management){
      let manual_management_action = {
        manual_management_id : manual_management.id,
        country_code         : this.shop_data.country
      }

      this.preLoader()
      let manual_management_api = new ManualManagementApi()
      let result = await manual_management_api.getManualManagementAsync(manual_management_action)
      if(result.is_ok) {
        result.data.content_images.forEach(image => {
          this.images.push(this.imagePath(image, result.data.solution_id, result.data.country_code))
          this.index = 0
        })
      }
      else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    imagePath(manual, solution_id = 0, country_code = null){
      let link_solution_id = 0
      let link_country_code = null
      if(solution_id > 0) {
        link_solution_id = solution_id
        link_country_code = country_code
      } else {
        link_solution_id = manual.solution_id
        link_country_code = manual.country_code
      }

      // eslint-disable-next-line no-undef
      return process.env.AZURE_STORAGE_BOARD_URL + link_country_code + '/Manual/' + link_solution_id + '/' + manual.storage_file_name
    },
    onManualTypeChange(type){
      this.table_filter.manual_type = type
      this.loadTableData()
    },
    onHideApplicationManual(){
      this.index = null
      this.images = []
    }
  }
}
</script>
<style lang='scss'>
@import './manuals.scss';
</style>