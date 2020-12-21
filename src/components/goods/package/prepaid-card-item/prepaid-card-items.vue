<template>
  <div class="box-item-prepaid-card">
    <div class="box-item "> 
      <div class="box-i"> 
        <div class="box-i-body"> 
          <h3>{{ $t('packages.prepaid-cards') }}</h3>
          <b-list-group @scroll="onHandleScrollPrepaidCard"> 
            <b-list-group-item v-for="(item, index) in prepaid_cards_data.items" :key="item.id" :variant="item.warning"
                               class="item-two" @click="onChoosePrepaidCard(item)">
              <span class="no"><div>{{ (index+1) }}</div></span>
              <span class="name"><div>{{ item.name }}</div></span>
            </b-list-group-item> 
          </b-list-group>
          <p class="lb-total-items">{{ $t('packages.total-items') }}: {{ prepaid_cards_data.pagination.total_items }}</p>
        </div>  
      </div> 
    </div>  
  </div>
</template>  
<script>   
import { mapGetters, mapActions } from 'vuex'
import { options } from '../../../../helpers/options'
import { GOODS_TYPE } from '../../../../config/constant'
import component_base    from '../../../common/component-base/component-base'

export default {
  extends: component_base,
  data() {
    return {   
      prepaid_cards_data: {
        items:[],
        is_loading_scroll:false,
        pagination: {
          total_pages: 1,
          total_items: 0,
        } 
      }, 
      table_filter: { 
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },  
      alerts: []
    }
  },
  computed: {
    ...mapGetters('prepaid_card', {
      x_prepaid_cards_data: 'getPrepaidCards'
    }),
  }, 
  created: function() {
    this.$root.$on('loadPrepaidCardItem', this.loadPrepaidCard)
  },
  methods: {  
    ...mapActions('prepaid_card', [
      'getPrepaidCardsDataAsync',
    ]),
    loadPrepaidCard( ){ 
      this.loadPrepaidCards()
    }, 
    async loadPrepaidCards(is_load_scroll = false) {  
      if(!is_load_scroll){  
        this.table_filter.page_number =1
      }
      this.table_filter = Object.assign(this.table_filter, this.shop_data)   
      this.preLoader() 
      await this.getPrepaidCardsDataAsync(this.table_filter) 
      if(this.x_prepaid_cards_data.is_ok){ 
        Object.assign(this.prepaid_cards_data.pagination, this.x_prepaid_cards_data.data.pagination)  
        this.table_filter.page_number = this.table_filter.page_number + 1 
        if(is_load_scroll){ 
          this.prepaid_cards_data.items = this.prepaid_cards_data.items.concat(this.x_prepaid_cards_data.data.items)
          this.prepaid_cards_data.is_loading_scroll = false
        }else{
          this.prepaid_cards_data.items = this.x_prepaid_cards_data.data.items
        }
      }
      else this.showAlert(this.x_prepaid_cards_data.error_messages) 
      this.preLoader(false)  
    }, 
    onChoosePrepaidCard(prepaid_card){  
      for(let row in this.prepaid_cards_data.items){
        if(this.prepaid_cards_data.items[row].id == prepaid_card.id) {
          this.$set(this.prepaid_cards_data.items[row], 'warning', 'warning')
        }
        else this.$set(this.prepaid_cards_data.items[row], 'warning', '')
      }  
      this.$emit('choose-item', { type: GOODS_TYPE.PREPAID_CARD, item: prepaid_card} ) 
    },  
    async onHandleScrollPrepaidCard(e){
      let sh = e.target.scrollHeight
      let st =  e.target.scrollTop
      let oh =  e.target.offsetHeight
      if((sh-st-oh+1) < 3){ 
        if(this.prepaid_cards_data.is_loading_scroll == false 
        && this.table_filter.page_number <= this.prepaid_cards_data.pagination.total_pages ){
          this.prepaid_cards_data.is_loading_scroll = true
          this.loadPrepaidCards( true)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import './prepaid-card-items.scss';
</style>