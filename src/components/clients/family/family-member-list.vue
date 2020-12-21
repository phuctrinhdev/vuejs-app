<template>
  <div class="family-member-box">
    <div class="topbox mb5">
      <p v-if="family_info.family_id != null && family_info.family_id != 0" class="fw-bold">
        {{ $t('family.family-code') }} : {{ family_info.family_id }} &nbsp;&nbsp; {{ $t('family.family-points') }} : {{ formatMoney(family_info.family_point, 0) }}
      </p>
      <a v-if="is_client_of_current_shop" class="btn secondary poa" @click="onFamilyMemberSearch">{{ $t('family.add-member') }}</a>
    </div>
    <div class="tabbox-table slide-x big">
      <family-member-table :data="table_data" @change-page="onChangePage">
        <template slot="mobile_number" slot-scope="{ row }">
          {{ formatHideInfoCol(row.mobile_number, row.registration_date) }}
        </template>
        <template slot="phone_number" slot-scope="{ row }">
          {{ formatHideInfoCol(row.phone_number, row.registration_date) }}
        </template>
        <template slot="management" slot-scope="{ row }">
          <a v-if="is_client_of_current_shop" class="btn secondary" @click="onFamilyMemberAction(row, options.form_actions.edit)">{{ $t('general.edit') }}</a>
          <a v-if="is_client_of_current_shop" class="btn secondary" @click="onFamilyMemberAction(row, options.form_actions.delete)">{{ $t('family.delete') }}</a>
        </template>
      </family-member-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { options } from '../../../helpers/options'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'
import family_member_table from '../../../components/common/view-table/view-table.vue'
import { CLIENTS_ENUMS } from '../../../config/constant'
import { addDateZero, formatMoney, hideMobilePhone, getHideClientInfoPermission } from '../../../helpers/common'

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

      // table
      table_data: {
        fields: [
          { field: 'family_member_id', label: 'family.no',            width: '13%', sortable: false },
          { field: 'client_name',      label: 'family.name',          width: '25%', sortable: false },
          { field: 'mobile_number',    label: 'family.mobile-phone',  width: '15%', sortable: false, expand: true },
          { field: 'phone_number',     label: 'family.telephone',     width: '15%', sortable: false, expand: true },
          { field: 'relationship',     label: 'family.relationship',  width: '15%', sortable: false },
          { field: 'management',       label: 'family.management',    width: '17%', sortable: false, expand: true, tdClass: 'management' },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: true
        },
        total_count: 0,
        style: 'normal'
      },
      
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0
      },
      family_info: {
        family_id: 0,
        family_point: 0
      },
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('client_family', {
      family_members: 'getFamilyMembers'
    }),
    is_client_of_current_shop(){
      return this.shop_data.shop_id == this.x_client.data.shop_id
    },
  },
  mounted(){
    this.table_filter.shop_id = this.x_client.data.shop_id
  },
  methods: {
    ...mapActions('client_family', [
      'setFamilyMembersDataAsync',
    ]),
    ...mapMutations('client_family', [
      'setFamilyMemberAction',
    ]),
    addDateZero,
    formatMoney,

    async loadTableData(){
      if(this.x_client.data.family_id > 0){
        this.table_filter.family_id = this.x_client.data.family_id

        this.preLoader()
        let response = await this.setFamilyMembersDataAsync(this.table_filter)
        this.preLoader(false)
        
        if(response.is_ok){
          this.table_data.rows = this.family_members.data.items
          this.table_data.pagination = this.family_members.data.pagination
          this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)

          this.family_info = this.family_members.data.family_info
        }
        else {
          this.showAlert(response.error_messages)
        }
      }
      else{
        this.table_data.rows = []
        this.family_info.family_id = 0
        this.family_info.family_point = 0
      }
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
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
    onFamilyMemberSearch() {
      this.$emit('change-component', CLIENTS_ENUMS.PAGE.FAMILY_MEMBER_SEARCH)
    }, 
    //family-member-action
    async onFamilyMemberAction(target_client, action) {
      let family_member_action = {
        action: action, // edit & delete
        data: {
          client_id         : this.x_client.data.id,
          client_name       : this.x_client.data.client_name,
          family_id         : target_client.family_id,
          family_member_id  : target_client.family_member_id,
          target_client_id  : target_client.client_id,
          target_client_name: target_client.client_name
        },
      }

      this.setFamilyMemberAction(family_member_action)
      this.showDialogById('family-member-action')
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