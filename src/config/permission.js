import store from '../store/store.js'
import { options } from '../helpers/options.js'

let shop = []

function isChainShop(){
  shop = store.getters['user/getShop']
  return shop.chain_id > 0
}
function isSingleShop(){
  shop = store.getters['user/getShop']
  return shop.chain_id === 0
}

export function showGoodsAddButton(goods_type)
{
  let show_add_button = true
  if(isChainShop())
  {
    if(goods_type==options.sharing_goods_type.product 
      && !shop.chain_sharing_settings.allow_shop_product) show_add_button=false
    if(goods_type==options.sharing_goods_type.service
      && !shop.chain_sharing_settings.allow_shop_service) show_add_button=false
  } 
  return show_add_button
}

export function checkDragOptionProduct(){
  let drag_option = options.good_table_drag.off
  if(isChainShop() && !shop.chain_sharing_settings.allow_shop_product) drag_option = options.good_table_drag.off
  else drag_option = options.good_table_drag.unshared

  return drag_option
}

export function checkDragOptionService(){
  let drag_option = options.good_table_drag.off
  if(isChainShop() && !shop.chain_sharing_settings.allow_shop_service) drag_option = options.good_table_drag.off
  else drag_option = options.good_table_drag.unshared

  return drag_option
}

export function checkShowGoodsSharedCol(goods_type){
  let show = false
  if(isChainShop())
  {
    if(goods_type == options.sharing_goods_type.service
      && shop.chain_sharing_settings.share_service && shop.chain_sharing_settings.allow_shop_service) show = true
    if(goods_type == options.sharing_goods_type.product
        && shop.chain_sharing_settings.share_product && shop.chain_sharing_settings.allow_shop_product) show = true
    if(goods_type == options.sharing_goods_type.service_or_product
          && ((shop.chain_sharing_settings.share_service || shop.chain_sharing_settings.share_product) && shop.chain_sharing_settings.allow_shop_service || shop.chain_sharing_settings.allow_shop_product)) show = true
  }
  return show
}

export function checkCalendarViewAllDates(){
  let view_all = false
  if(isChainShop() || isSingleShop()) view_all = true

  return view_all
}