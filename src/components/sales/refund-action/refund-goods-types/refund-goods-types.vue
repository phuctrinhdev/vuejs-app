<template>
  <div class="refund-goods-types-wrapper">
    <ul :class="{ 'no-client': !has_client }" class="group-btn view-pc">
      <li :class="{ active: x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.service }"
          @click="onClickRefundGoodsType(sales_options.sales_goods_type.service)">{{ $t('services.services') }}</li>
      <li :class="{ active: x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.product }"
          @click="onClickRefundGoodsType(sales_options.sales_goods_type.product)">{{ $t('products.products') }}</li>

      <template v-if="has_client">
        <li :class="{ active: x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_card }"
            @click="onClickRefundGoodsType(sales_options.sales_goods_type.prepaid_card)">{{ $t('prepaid-cards.prepaid-cards') }}</li>
        <li :class="{ active: x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_service}"
            @click="onClickRefundGoodsType(sales_options.sales_goods_type.prepaid_service)">{{ $t('services.prepaid-services') }}</li>
      </template>
      <template v-else>
        <li :class="{ active: x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_card }">{{ $t('prepaid-cards.prepaid-cards') }}</li>
        <li :class="{ active: x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_service}">{{ $t('services.prepaid-services') }}</li>
      </template>
    </ul>

    <!-- mobile -->
    <b-form-select v-model="sales_goods_type_selected" class="view-mobile" @input="onClickRefundGoodsType">
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
    ...mapGetters('refund', {
      x_refund_action: 'getRefundAction',
    }),
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    sales_goods_type_options(){
      let tmp_options = []
      let basic_options = [
        { value: sales_options.sales_goods_type.service       , text: 'services.services'},
        { value: sales_options.sales_goods_type.product       , text: 'products.products'}
      ]
      let advance_options = [
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
    onClickRefundGoodsType(sales_goods_type){
      this.$emit('clicked-goods-type', sales_goods_type)
    },
  }
}
</script>

<style lang='scss'>
.refund-goods-types-wrapper {
  margin-bottom: 15px;
  ul.group-btn {
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
}
@media (max-width: 767.98px) { // sm
  .refund-goods-types-wrapper {
    .view-mobile {
      display: block;
      height: 32px;
    }
  }
}
</style>