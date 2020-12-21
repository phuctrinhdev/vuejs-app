<template>
  <div v-if="!isNullObject(group) && !isNullObject(group.ref_blocked_time)">
    <vue-draggable-resizable v-if="group.ref_blocked_time.blocked_time_id > 0"
                             :id="group.getKey()"
                             :draggable="false"
                             :h="group.height"
                             :min-height="2"
                             :grid="[calendar_head_col_width, group.min_height]" 
                             :handles="['bm']"
                             :style="generateInlineStyleForBlockedTime(group)"
                             :class="{'show-menu': is_show_menu}"
                             class="group-blocked-time resizable-block calendar-cell-view-block"
                             class-name-dragging="dragging-block"
                             class-name-resizing="resizing-block"
                             @click.native="onClick"
                             @resizing="onResizingBlockedTime(group)"
                             @resizestop="onResizeBlockedTimeStop">
      <div :class="{ 'small-group': group.small }" class="blocked-time-notes">{{ group.ref_blocked_time.notes }}</div>
      <div v-if="is_show_menu"
           :id="'menu-' + group.getKey()"
           :style="generateInlineStyleForMenuBlockedTime(group)"
           class="blocked-time-wrapper">
        <b-dropdown class="blocked-time-actions" @mouseleave.native="onCloseMenu($event)">
          <b-dropdown-item @click="onDeleteBlockedTime(group.ref_blocked_time)">
            {{ $t('bookings.cancel-blocked-time') }}</b-dropdown-item>
          <b-dropdown-item @click="openBlockedTimeActionDialog(options.form_actions.edit, group.ref_blocked_time, col, row)">
            {{ $t('bookings.edit-blocked-time') }}</b-dropdown-item>
          <b-dropdown-item class="close-menu" @click="onCloseMenu($event)"><i>x</i> <span>{{ $t('general.close') }}</span></b-dropdown-item>
        </b-dropdown>
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script>
import { mapGetters, mapActions }       from 'vuex'
import { 
  calculateMenuViewGroupPosition 
}                                       from '../../../../../helpers/common'
import { options }                      from '../../../../../helpers/options'
import component_base                   from '../../../../common/component-base/component-base'
import blocked_time_mixin               from '../../../../../helpers/mixins/blocked-time-mixin'
import vue_draggable_resizable          from 'vue-draggable-resizable'
import CalendarCellBlockedTimeViewGroup from '../../calendar-view/calendar-cell-blocked-time-view-group'

export default {
  components: {
    'vue-draggable-resizable': vue_draggable_resizable,
  },
  extends: component_base,
  mixins: [blocked_time_mixin],
  props: {
    group: {
      type: CalendarCellBlockedTimeViewGroup,
      default: null
    },
    col: {
      type: Object,
      default: () => []
    },
    row: {
      type: Object,
      default: () => []
    },
    calendar_head_col_width: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      options,
      is_show_menu: false,
      is_resizing: false,
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts'
    }),
  },
  methods:{
    ...mapActions('alert', [
      'setAlertsData',
    ]),
    ...mapActions('blocked_time', [
      'deleteBlockedTimeDataAsync'
    ]),
    onClick(e){
      this.is_show_menu = !this.is_show_menu
      if(this.is_resizing) {
        this.is_resizing = false
        this.is_show_menu = false
      }
      if(this.is_show_menu){
        this.$nextTick(() => {
          calculateMenuViewGroupPosition(this.group, e)
        })
      }
    },
    generateInlineStyleForBlockedTime(group){
      return {
        'margin-left': group.margin_left + '%', 
        'width': group.width + '%'
      }
    },
    generateInlineStyleForMenuBlockedTime(group){
      return { 
        top: group.menu_top + 'px', 
        left: group.menu_left + 'px'
      }
    },
    async onDeleteBlockedTime(){
      // clear alerts state in alert vuex store
      this.setAlertsData([])

      this.preLoader()
      await this.deleteBlockedTimeDataAsync(this.group.ref_blocked_time)
      this.preLoader(false) 
      if(this.x_alerts.length > 0) this.showAlert(this.x_alerts)
    },
    onResizingBlockedTime(group){
      this.is_show_menu = false
      this.is_resizing = true
      if(!this.isNullObject(group))
        this.$emit('on-resizing', group)
    },
    async onResizeBlockedTimeStop(x, y, width, height){
      this.$emit('on-resize-stop', x, y, width, height)
    },
    async openBlockedTimeActionDialog(form_action, blocked_time, col, row){
      this.preLoader()
      await this.onActionBlockedTime(form_action, blocked_time, col.resource_setup_id, col.booking_date,
        col.booking_date_ts_miliseconds, row.cross_date, row.time)
      this.preLoader(false)
    },
    onCloseMenu(e){
      e.stopPropagation()
      this.is_show_menu = false
    }
  }
}
</script>