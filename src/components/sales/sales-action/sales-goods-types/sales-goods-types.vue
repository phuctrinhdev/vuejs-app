<template>
  <div class="sales-goods-types-wrapper">
    <ul :class="{ 'no-client': !has_client }" class="group-btn">
      <li :class="{ active: x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.service }"
          @click="onClickSalesGoodsType(sales_options.sales_goods_type.service)">{{ $t('services.services') }}</li>
      <li :class="{ active: x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.product }"
          @click="onClickSalesGoodsType(sales_options.sales_goods_type.product)">{{ $t('products.products') }}</li>

      <template v-if="has_client">
        <li :class="{ active: x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.package }"
            @click="onClickSalesGoodsType(sales_options.sales_goods_type.package)">{{ $t('packages.packages') }}</li>
        <li :class="{ active: x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_card }"
            @click="onClickSalesGoodsType(sales_options.sales_goods_type.prepaid_card)">{{ $t('prepaid-cards.prepaid-cards') }}</li>
        <li :class="{ active: x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_service}"
            @click="onClickSalesGoodsType(sales_options.sales_goods_type.prepaid_service)">{{ $t('services.prepaid-services') }}</li>
      </template>
      <template v-else>
        <li :class="{ active: x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.package }">{{ $t('packages.packages') }}</li>
        <li :class="{ active: x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_card }">{{ $t('prepaid-cards.prepaid-cards') }}</li>
        <li :class="{ active: x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_service}">{{ $t('services.prepaid-services') }}</li>
      </template>
    </ul>

    <!-- mobile -->
    <b-form-select v-model="sales_goods_type_selected" class="mobile" @input="onClickSalesGoodsType">
      <option v-for="link in sales_goods_type_options" :key="link.index" :value="link.value">{{ $t(link.text) }}</option>
    </b-form-select>
  </div>
</template>

<script>
import { mapGetters }    from 'vuex'
import { options }       from '../../../../helpers/options'
import { sales_options } from '../../../../helpers/options/sales-options'
import component_base    from '../../../common/component-base/component-base'

export default {
  extends: component_base,
  props: {
    is_show_modal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options,
      sales_options,

      sales_goods_type_selected: sales_options.sales_goods_type.service,
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('sales', {
      x_sales_action: 'getSalesAction',
    }),
    has_client(){
      let has_client_in_store = this.x_client && this.x_client.data && this.x_client.data.id > 0
      let has_client_in_sales = this.x_sales_action.data.client_id > 0
      return has_client_in_store || has_client_in_sales
    },
    sales_goods_type_options(){
      let tmp_options = []
      let basic_options = [
        { value: sales_options.sales_goods_type.service       , text: 'services.services'},
        { value: sales_options.sales_goods_type.product       , text: 'products.products'}
      ]
      let advance_options = [
        { value: sales_options.sales_goods_type.package        , text: 'packages.packages'},
        { value: sales_options.sales_goods_type.prepaid_card   , text: 'prepaid-cards.prepaid-cards'},
        { value: sales_options.sales_goods_type.prepaid_service, text: 'services.prepaid-services'},
      ]

      if(this.has_client)
        tmp_options = [...basic_options, ...advance_options]
      else 
        tmp_options = [...basic_options]

      return tmp_options
    },
  },
  methods: {
    onClickSalesGoodsType(sales_goods_type){
      this.$emit('clicked-goods-type', sales_goods_type)
    },
  }
}
</script>

<style lang='scss'>
.sales-goods-types-wrapper {
  display: inline-block;
  margin-bottom: 15px;
  ul.group-btn {
    display: inline-block;
    &.no-client {
      li {
        &:nth-child(3), &:nth-child(4), &:nth-child(5) {
          background: $gray-light;
          color: $gray;
        }
      }
    }
    li {
      display: inline-block;
      padding: 10px 20px;
      border: 1px solid $gray;
      transition: 0.3s;
      &:last-child {
        margin: 0;
      }
      &:hover, &.active {
        background: $purple;
        color: $white;
        cursor: pointer;
      }
    }
  }
  .mobile {
    display: none;
  }
}
@media (max-width: 767.98px) { // sm
  .sales-goods-types-wrapper {
    ul.group-btn{
    display: none;
    }
    .mobile {
      display: block;
      height: 32px;
    }
  }
}
</style>