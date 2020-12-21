<template>
  <div v-if="popup_data">
    <a v-if="popup_data.link_url != null" :href="popup_data.link_url" 
       :target="popup_data.link_target == options.boards_enum.link_target.new">
      <img :src="image_path" class="w100p">
    </a>
    <img v-else :src="image_path" class="w100p">
    <pre>{{ popup_data.contents }}</pre>
    <b-checkbox v-if="popup_data.never_see_period != options.boards_enum.never_see_period.no" v-model="never_see">
      <font v-if="popup_data.never_see_period == options.boards_enum.never_see_period.day">
        {{ $t('popups.never-see-period-day') }}
      </font>
      <font v-else-if="popup_data.never_see_period == options.boards_enum.never_see_period.week">
        {{ $t('popups.never-see-period-week') }}
      </font>
    </b-checkbox>
  </div>
</template>

<script>
import POPUpApi         from '../../../api/boards/popup-api'
import component_base   from '../../../components/common/component-base/component-base'
import { options }      from '../../../helpers/options'
import { cookieAction } from '../../../helpers/common'

export default {
  extends: component_base,
  data(){
    return {
      options: options,
      image_path: null,
      popup_data: {},
      never_see: false
    }
  },
  created(){
    document.title = this.$route.query.title
    window.addEventListener('beforeunload', () => {
      if(this.never_see){
        let never_see_period = null
        if(this.popup_data.never_see_period == this.options.boards_enum.never_see_period.day)
          never_see_period = '1d'
        else
          never_see_period = '7d'
        cookieAction(this, this.options.cookie_action.set, 'popup_' + this.popup_data.id, never_see_period, this.popup_data.id)
      }
    })
  },
  async mounted(){
    await this.onLoadPopup()
    this.image_path = this.onImagePath()
  },
  methods: {
    async onLoadPopup(){
      let data_send = {
        popup_id     : this.$route.query.id,
        country_code : this.$route.query.country,
      }
      this.preLoader()
      let popup_api = new POPUpApi()
      let result = await popup_api.getPOPUpAsync(data_send)
      if(result.is_ok){
        this.popup_data = result.data
      }
      else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    onImagePath(){
      if(this.popup_data.file != null)
      // eslint-disable-next-line no-undef
        return process.env.AZURE_STORAGE_BOARD_URL + this.popup_data.country_code + '/POPUp/' + this.popup_data.shop_id + '/' + this.popup_data.file.storage_file_name
      else return null
    }
  }
}
</script>
<style lang="scss">
@import './popup-view.scss';
</style>