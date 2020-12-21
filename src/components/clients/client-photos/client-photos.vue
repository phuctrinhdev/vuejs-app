<template>
  <div class="client-photos-wrapper">
    <div class="client-photo-intro">
      <div class="photo-intro">
        <ul>
          <li>All 2 image</li>
          <li v-if="is_select_mode">
            <b-form-checkbox v-model="is_check_all" :value="true" @input="onInputCheckAll">Check all</b-form-checkbox>
          </li>
        </ul>
      </div>
      <div class="group-btns">
        <ul>
          <li v-if="!is_select_mode" class="btn-select"><div class="btn" @click="onClickSelectMode(true)">Select</div></li>
          <li v-if="is_select_mode" class="btn-unselect"><div class="btn" @click="onClickSelectMode(false)">Unselect</div></li>
          <li v-if="is_select_mode" class="btn-delete"><div class="btn" @click="onClickDeleteImage">Delete Image</div></li>
        </ul>
      </div>
    </div>

    <div class="client-photos">
      <ul>
        <li v-for="(client_photo, i) in x_client_photos" :key="i">
          <div class="img-wrapper">
            <img :src="client_photo.url">
          </div>
          <div class="img-content">
            <b-form-checkbox v-if="is_select_mode" 
                             v-model="client_photo.is_checked" :value="true"/>
            <p class="date">{{ client_photo.registration_date }}</p>
            <p class="notes">{{ client_photo.notes }}</p>
          </div>
        </li>
      </ul>
    </div>
      
    <!-- <button class="btn secondary">{{ $t('general.more...') }}</button> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import component_base    from '../../../components/common/component-base/component-base'
import ClientPhotoApi from '../../../api/clients/client-photo-api'
import {
  
} from '../../../helpers/common'

export default {
  components: {
    // 
  },
  extends: component_base,
  data(){
    return {
      is_mobile: this.isMobile(),
      is_select_mode: false,
      is_check_all: false,

      client_photo_api: new ClientPhotoApi(),
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('client_photo',{
      x_client_photos : 'getClientPhotos'
    }),
  },
  async created(){
    await this.loadClientPhotos()
  },
  methods: {
    ...mapMutations('client_photo',[
      'setClientPhotos',
      'deleteClientPhotos'
    ]),
    isMobile(){
      return window.innerWidth <= 767.98 ? true : false
    },
    
    // load client photos
    async loadClientPhotos(){
      let query = {
        client_id : this.x_client.data.id,
        shop_id   : this.x_client.data.shop_id
      }
      this.preLoader()
      let response = await this.client_photo_api.getClientPhotosAsync(query)
      this.preLoader(false)

      if(response.is_ok) {
        this.setClientPhotos(response.data)
      }
      else this.showAlert(response.error_messages)
    },

    // select mode
    onClickSelectMode(is_select_mode){
      this.is_select_mode = is_select_mode
    },
    onClickDeleteImage(){
      let tmp_delete_photos = this.x_client_photos.filter(p => p.is_checked)
      this.deleteClientPhotos(tmp_delete_photos)

      // connect api
    },
    onInputCheckAll(is_check_all){
      if(is_check_all){
        for(let client_photo of this.x_client_photos){
          client_photo.is_checked = true
        }
      }
    }
  }
}
</script>

<style lang='scss'>
@import './client-photos.scss';
</style>