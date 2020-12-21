<template>
  <b-modal id="message-variable-modal" 
           :title="$t('messages.variables-add-title')"
           :no-close-on-backdrop="true"
           hide-footer
           size="sm"
           @show="onLoadForm()">
    <div style="background-color: white;">
      <view-table :data="table_data">
        <template slot="variable" slot-scope="{ row }">
          <span style="cursor:pointer;" @click="addChar(row.variable)"> {{ row.variable }}</span> 
        </template>
      </view-table>
    </div>
    <div class="modal-footer">
      <button class="btn btn-default" @click="hideModal">{{ $t('general.close') }}</button>
    </div>
  </b-modal>
</template>

<script>
import { options }    from '../../../helpers/options'
import component_base from '../../../components/common/component-base/component-base'
import view_table     from '../../common/view-table/view-table'

export default {
  components: {  
    'view-table' : view_table,
  },
  extends: component_base,
  props: { 
    tab: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      table_data: {
        fields: [
          { field: 'item_name', label: 'messages.item-name', width: '30%', sortable: false },
          { field: 'variable',  label: 'messages.variables', width: '70%', sortable: false, expand: true },
        ],
        rows:[],
        options: {
          pagination: false
        },
        style: 'normal'
      },
    }
  },
  methods: {
    onLoadForm(){
      this.table_data.rows = []
      this.table_data.rows.push({
        item_name : this.$i18n.t('variable-data.client-name'),
        variable  : this.$i18n.t('variable-data.client-name-var')
      })
      //post-visit
      if(this.tab == options.messages_enums.setup_automatic_messaging_tab.post_visit){        
        this.table_data.rows.push({
          item_name : this.$i18n.t('variable-data.staff-name'),
          variable  : this.$i18n.t('variable-data.staff-name-var')
        })
      }
      //booking
      else if(this.tab == options.messages_enums.setup_automatic_messaging_tab.booking){        
        this.table_data.rows.push({
          item_name : this.$i18n.t('variable-data.booking-date'),
          variable  : this.$i18n.t('variable-data.booking-date-var')
        })  
        this.table_data.rows.push({
          item_name : this.$i18n.t('variable-data.booking-mmdd'),
          variable  : this.$i18n.t('variable-data.booking-mmdd-var')
        })
        this.table_data.rows.push({
          item_name : this.$i18n.t('variable-data.booking-time'),
          variable  : this.$i18n.t('variable-data.booking-time-var')
        })
      }
      //sales
      else if(this.tab == options.messages_enums.setup_automatic_messaging_tab.sales){
        if(this.type == options.messages_enums.setup_automatic_messaging_type.points_add){
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.earned-points'),
            variable  : this.$i18n.t('variable-data.earned-points-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.client-have-points'),
            variable  : this.$i18n.t('variable-data.client-have-points-var')
          })  
        }
        else if(this.type == options.messages_enums.setup_automatic_messaging_type.points_deduction){
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.used-points'),
            variable  : this.$i18n.t('variable-data.used-points-var')
          })
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.client-have-points'),
            variable  : this.$i18n.t('variable-data.client-have-points-var')
          })  
        }
        else if(this.type == options.messages_enums.setup_automatic_messaging_type.balance_add){
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.prepaid-card-name'),
            variable  : this.$i18n.t('variable-data.prepaid-card-name-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.earn-balance'),
            variable  : this.$i18n.t('variable-data.earn-balance-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.remain-balance'),
            variable  : this.$i18n.t('variable-data.remain-balance-var')
          })
        }
        else if(this.type == options.messages_enums.setup_automatic_messaging_type.balance_deduction){
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.prepaid-card-name'),
            variable  : this.$i18n.t('variable-data.prepaid-card-name-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.deduction-balance'),
            variable  : this.$i18n.t('variable-data.deduction-balance-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.remain-balance'),
            variable  : this.$i18n.t('variable-data.remain-balance-var')
          })
        }
        else if(this.type == options.messages_enums.setup_automatic_messaging_type.prepaid_card_expiry_date_reminder){
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.prepaid-card-name'),
            variable  : this.$i18n.t('variable-data.prepaid-card-name-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.remain-balance'),
            variable  : this.$i18n.t('variable-data.remain-balance-var')
          })
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.expiry-date'),
            variable  : this.$i18n.t('variable-data.expiry-date-var')
          })  
        }
        else if(this.type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_add){
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.prepaid-service-name'),
            variable  : this.$i18n.t('variable-data.prepaid-service-name-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.remain-quantity'),
            variable  : this.$i18n.t('variable-data.remain-quantity-var')
          })
        }
        else if(this.type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_quantity_deduction){
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.service-name'),
            variable  : this.$i18n.t('variable-data.service-name-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.remain-quantity'),
            variable  : this.$i18n.t('variable-data.remain-quantity-var')
          })
        }
        else if(this.type == options.messages_enums.setup_automatic_messaging_type.prepaid_service_expiry_date_reminder){
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.prepaid-service-name'),
            variable  : this.$i18n.t('variable-data.prepaid-service-name-var')
          })  
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.remain-quantity'),
            variable  : this.$i18n.t('variable-data.remain-quantity-var')
          })
          this.table_data.rows.push({
            item_name : this.$i18n.t('variable-data.expiry-date'),
            variable  : this.$i18n.t('variable-data.expiry-date-var')
          }) 
        }
      }
    },
    addChar(ch) {
      this.$emit('addChar', ch)
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('message-variable-modal')
    },
  }
}
</script>