import ClientAvatarViewModel from '../../view-model/clients/client-photo/client-avatar-view-model'
import ClientPhotoViewModel from '../../view-model/clients/client-photo/client-photo-view-model'

const state_default = {
  client_avatar_action : {
    action: 0,
    data  : new ClientAvatarViewModel(),
  },
  client_photos: [],
  client_photo_action : {
    action: 0,
    data  : new ClientPhotoViewModel(),
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getClientAvatarAction(state){ 
    return state.client_avatar_action
  },
  getClientPhotos(state) {
    return state.client_photos
  },
  getClientPhotoAction(state) {
    return state.client_photo_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setClientAvatarAction(state, client_avatar_action){ 
    state.client_avatar_action = client_avatar_action
  },
  setClientPhotos(state, client_photos) {
    state.client_photos = client_photos
  },
  setClientPhotoAction(state, client_photo_action) {
    state.client_photo_action = client_photo_action
  },
  deleteClientPhotos(state, delete_photos){
    let mp_delete_photo_ids = delete_photos.map(p => p.file_id)
    let tmp_photos = []
    for(let client_photo of state.client_photos){
      if(!mp_delete_photo_ids.includes(client_photo.file_id)){
        tmp_photos.push(client_photo)
      }
    }
    state.client_photos = tmp_photos
  }
}

// actions
const actions = {
  // 
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
