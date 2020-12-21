<template>
  <div class="family-member-box">
    <p class="color-gray mb10">
      {{ $t('family.add-family-member-guide') }}
    </p>
    <div class="topbox mb5 bdb">
      <span>{{ $t('family.search-member') }}</span>
      <span>
        {{ $t('family.no-name') }} &nbsp;
        <input v-model="table_filter.search_value" type="text" @keyup.enter="onSearch">
      </span>
      <span>
        {{ $t('family.tel-mp') }} &nbsp;
        <input v-model="table_filter.search_value2" type="text" @keyup.enter="onSearch">
      </span>
      <a class="btn secondary poa add-member-btn" @click="onSearch">{{ $t('family.search-member') }}</a>
    </div>
    <div class="topbox mb5">
      <p v-html="$t('family.all').replace('{0}', table_data.pagination.total_items)"/>
      <a class="btn secondary poa" @click="onFamilyMemberList">{{ $t('family.family-member') }}</a>
    </div>
    <div class="tabbox-table slide-x big">
      <family-member-table :data="table_data" @change-page="onChangePage">
        <template slot="phone_number" slot-scope="{ row }">
          {{ formatHideInfoCol(row.phone_number, row.registration_date) }}
        </template>
        <template slot="mobile_number" slot-scope="{ row }">
          {{ formatHideInfoCol(row.mobile_number, row.registration_date) }}
        </template>
        <template slot="add_family" slot-scope="{ row }">
          <template v-if="row.client_id != x_client.data.id">
            <a v-if="canAddFamily(row)" class="btn secondary" @click="onFamilyMemberAction(row)">{{ $t('family.select') }}</a>
            <font v-else-if="x_client.data.family_id == row.family_id">{{ $t('family.my-family') }}</font>
          </template>
        </template>
      </family-member-table>
    </div>
  </div>
</template>
<script>
import { options } from '../../../helpers/options'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'
import ClientFamilyApi from '../../../api/clients/client-family-api'
import family_member_table from '../../../components/common/view-table/view-table.vue'
import { CLIENTS_ENUMS } from '../../../config/constant'
import _ from 'lodash'
import { hideMobilePhone, getHideClientInfoPermission } from '../../../helpers/common'

export default {
  components: {
    'btn-action-group': btn_action_group,
    'family-member-table': family_member_table,
  },
  extends: component_base,
  props: {
    clients_setup: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      options,

      table_data: {
        fields: [
          { field: 'client_id',     label: 'family.no',           width: '10%', sortable: false },
          { field: 'client_name',   label: 'family.name',         width: '20%', sortable: false },
          { field: 'phone_number',  label: 'family.telephone',    width: '20%', sortable: false, expand: true },
          { field: 'mobile_number', label: 'family.mobile-phone', width: '20%', sortable: false, expand: true },
          { field: 'relationship',  label: 'family.relationship', width: '15%', sortable: false },
          { field: 'add_family',    label: 'family.add-family',   width: '15%', sortable: false, expand: true }
        ],
        rows:[],
        pagination:{},
        options: {
          drag: false,
          pagination: true
        },
        style: 'normal'
      },
      table_filter: {
        page_size: 10,
        page_number: 1,
        shop_id: 0,
        search_value: '',
        search_value2: ''
      },
    }
  },
  computed: {
    ...mapGetters('client_family', {
      family_members: 'getFamilyMembers'
    }),
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    })
  },
  mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableData()
  },
  methods: {
    ...mapMutations('client_family', [
      'setFamilyMemberAction',
    ]),
    ...mapActions('client_family', [
      'setFamilyMemberActionDataAsync'
    ]),
    async loadTableData(){
      this.preLoader(true)
      let client_family_api = new ClientFamilyApi()
      let result = await client_family_api.getFamilyMemberSearchAsync(this.table_filter)
      this.preLoader(false)
      
      if(result.is_ok){
        if(result.data.items.find(x => x.client_id == this.x_client.data.id)){
          let relationship = result.data.items[(result.data.items.map(x => x.client_id).indexOf(this.x_client.data.id))]
          if(relationship.relationship != null)
            relationship.relationship += this.$i18n.t('recommender.me')
          else
            relationship.relationship = this.$i18n.t('recommender.me')
        }
        this.table_data.rows = result.data.items
        this.table_data.pagination = result.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
      }
      else this.showAlert(result.error_messages)
    },
    onConfirm(){
      this.hideModal()
    },
    onCancel(){
      this.hideModal()
    },
    onDelete(){
      this.hideModal()
    },
    hideModal(){
      this.$refs['my-modal'].hide()
    },

    //add-member
    onAddMember() { this.showDialogById('add-member')}, 

    //add-family-action
    onAddFamilyAction() { this.showDialogById('add-family-action')},

    //add-member
    onFamilyMemberList() {
      this.$emit('change-component', CLIENTS_ENUMS.PAGE.FAMILY_MEMBER_LIST)
    }, 
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },
    canAddFamily(row){
      let addable = true
      if(this.x_client.data.family_id > 0 && row.family_id > 0)
        addable = false
      return addable
    },
    async onFamilyMemberAction(target_client) {
      let family_member_action = {
        action: options.form_actions.add,
        data: {
          client_id         : this.x_client.data.id,
          client_name       : this.x_client.data.client_name,
          family_id         : 0,
          family_member_id  : 0,
          target_client_id  : target_client.client_id,
          target_client_name: target_client.client_name
        }
      }
      
      // 0 + 0: create
      // client no family, target no family
      if(!this.x_client.data.family_id > 0 && !target_client.family_id > 0){
        family_member_action.data.family_id           = null
        family_member_action.action                   = options.form_actions.create
      }
      
      // 0 + f: add
      // client no family, target has family
      if(!this.x_client.data.family_id > 0 && target_client.family_id > 0){
        family_member_action.data.family_id           = target_client.family_id
      }

      // f + 0: add
      // client has family, target no family
      if(this.x_client.data.family_id > 0 && !target_client.family_id > 0){
        family_member_action.data.family_id           = this.x_client.data.family_id
        family_member_action.data.client_id           = target_client.client_id
        family_member_action.data.client_name         = target_client.client_name
      }

      // f + f: not happen
      // client has family, target has family

      this.setFamilyMemberAction(family_member_action)
      this.showDialogById('family-member-action')
    },
    onSearch(){
      this.onChangePage(1)
    },
    formatHideInfoCol(mobile, registration_date){
      if(!_.isEmpty(this.clients_setup))
      {
        let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, registration_date)
        if(isHideClientInfo) mobile= hideMobilePhone(mobile)
      }
      return mobile
    }
  }
}
</script>
<style lang="scss">
@import './family.scss';
</style>