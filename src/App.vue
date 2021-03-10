<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import Painter from './components/Painter'

export default defineComponent({
  name: 'App',

  components: {
    Painter
  },

  setup() {
    const cells = ref([]);
    const gridOptions = ref({
      width: 600,
      height: 600,
      dimensions: [20, 20],
      backgroundColor: "#dfe6e9",
      strokeColor: "#2d3436",
      strokeWidth: 2,
    });

    const labelOptions = ref({
      color: "#000000",
      backgroundColor: "#FFFFFF",
      shape: "circle",
      rowLabelType: "numeric",
      columnLabelType: "numeric"
    })

    const options = computed(() => ({
      grid: gridOptions,
      label: labelOptions,
    }))

    const handleUpdate = () => {

    }

    return {
      cells,
      options,
      handleUpdate
    }
  }
});
</script>

<template>
  <div>
    <Painter
      v-model:cells="cells"
      :options="options"
      disable-cell-highlight
      disable-label-highlight
      hide-labels
      hide-cell-context
      @update="handleUpdate"
    >
      <template v-slot:context-menu="{ context }">
        POS: {{ context.row }} - {{ context.column }}
      </template>
    </Painter>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
