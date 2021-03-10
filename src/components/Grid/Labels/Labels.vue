<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useMachine } from '@xstate/vue';
import { Machine } from 'xstate';

type Dimensions = [number, number];

export default defineComponent({
  name: 'GridLabels',

  props: {
    dimensions: {
      type: Array as PropType<Dimensions>,
      required: true,
    }
  },

  setup(props) {
    const [rows, columns] = props.dimensions;

    return {
      rows,
      columns,
    }
  }
})
</script>


<template>
  <div class="container">
    <div class="labels__column">
      <div class="labels__column-item__spacer"></div>
      <div v-for="column of columns" :key="column" class="labels__column-item labels__item">
        {{ column }}
      </div>
    </div>

    <div class="row">
      <div class="labels__row">
        <div v-for="row of rows" :key="row" class="labels__row-item labels__item">
          {{ row }}
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  overflow: hidden;
  display: inline-grid;
  grid-template-columns: auto 1fr;
}

.row {
  display: grid;
  grid-template-rows: auto 1fr;
}

.labels__row {
  display: grid;
  grid-template-columns: repeat(auto, minmax(0, 1fr));
  grid-auto-columns: auto;
  grid-auto-flow: column;

  grid-row-start: 1;
}

.labels__column {
  display: grid;
  grid-template-rows: repeat(auto, minmax(0, 1fr));
  grid-auto-rows: auto;
  grid-auto-flow: row;

  grid-column-start: 1;
}

.labels__row-item {
  grid-column: span 1;
}

.labels__column-item {
  grid-row: span 1;
}

.labels__item {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  line-height: auto;
}
</style>