<script lang="ts">
import { ref, computed, watch, onMounted, defineComponent } from 'vue'

export default defineComponent({
  name: 'GridContextMenu',

  props: {
    position: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const contextMenu = ref(null);
    // const style = computed(() => {
    //   const { x, y } = props.position;

    //   return {
    //     top: `${Math.round(y) - 50}px`,
    //     left: `${Math.round(x) + 50}px`
    //   }
    // })

    onMounted(() => {

      console.log(contextMenu.value)
      watch(() => props.position, ({ x, y }) => {
        contextMenu.value.style.top = `${Math.round(y) - 50}px`;
        contextMenu.value.style.left = `${Math.round(x) + 50}px`;
        console.log(contextMenu.value.style.top)
      })


    })

    return {
      contextMenu,
      // style
    }
  }
})
</script>


<template>
  <div ref="contextMenu" :class="[$style.container]">
    <slot></slot>
  </div>
</template>

<style lang="postcss" module>
.container {
  position: absolute;
  overflow: hidden;

  pointer-events: none;
  background-color: rgba(245, 246, 250,1.0);
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);

  padding: 1rem;
  min-width: 200px;

  text-align: left;
}
</style>
