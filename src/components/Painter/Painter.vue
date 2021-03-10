<script lang="ts">
import {
  ref,
  render,
  watch,
  computed,
  onMounted,
  PropType,
  defineComponent,
  Ref,
  ComputedRef,
  onBeforeUnmount
} from 'vue';
import { useMachine } from '@xstate/vue';
import { Machine } from 'xstate';

import Grid from "../Grid";

type GridOptions = {
  width: number;
  height: number;
  dimensions: [number, number];
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
}

type LabelOptions = {
  color: string;
  backgroundColor: string;
  shape: string;
  rowLabelType: string;
  columnLabelType: string;
}

type Options = {
  grid: GridOptions;
  label: LabelOptions;
}

type Props = {
  options: Options;
}

const optionDefaults = {
  grid: {
    width: 400,
    height: 400,
    dimensions: [20, 20],
    backgroundColor: "#dfe6e9",
    strokeColor: "#2d3436",
    strokeWidth: 2
  },
  label: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    shape: "circle",
    rowLabelType: "numeric",
    columnLabelType: "numeric"
  }
};

export default defineComponent({
  name: 'Painter',

  props: {
    options: {
      type: Object as PropType<Options>,
      default: () => (optionDefaults)
    }
  },

  components: {
    Grid
  },

  setup(props, { emit }) {
    const options: Ref<Props["options"]> = ref(props.options);

    return {
      options
    };
  },
});
</script>

<template>
  <Grid :options="options">
    <template v-slot:context-menu="{ context }">
      <slot name="context-menu" :context="context">
      </slot>
    </template>
  </Grid>
</template>

<style>

</style>
