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
  ComputedRef
} from 'vue';
import { useMachine } from '@xstate/vue';
import { Machine } from 'xstate';

type Options = {
  width: number
  height: number;
  dimensions: [number, number];
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
}

type Cell = {
  column: number;
  row: number;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
}

type Cells = Array<Cell>;

type Props = {
  cells: Cells;
  options: Options;
}

type CreateCellProps = {
  width: number;
  height: number;
  row: number;
  column: number;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
}

const optionDefaults = {
  width: 400,
  height: 400,
  dimensions: [20, 20],
  backgroundColor: "#dfe6e9",
  strokeColor: "#2d3436",
  strokeWidth: 2
};

function debounce(callback: Function, wait: number, immediate: boolean) {
  let timeout = 0;

  return () => {
    const context = this;
    const willExecute = immediate && !timeout;
    
    const later = () => {
      timeout = 0;

      if (!immediate) {
        callback.apply(context, arguments);
      }
    }

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (willExecute) {
      callback.apply(context, arguments);
    }
  }
}

function throttle(callback: Function, limit: number) {
  let sleeping = false;     

  return () => {                      
    if (!sleeping) {                       
      callback.apply(this, arguments); 

      sleeping = true;  

      setTimeout(function () {          
        sleeping = false;             
      }, limit);
    }
  }
}

export default defineComponent({
  name: 'Grid',

  props: {
    cells: {
      type: Array as PropType<Cells>,
      default: () => [],
    },
    options: {
      type: Object as PropType<Options>,
      default: () => (optionDefaults)
    }
  },

  setup(props, { emit }) {
    const grid = ref<HTMLCanvasElement | null>(null);
    const options = { ...optionDefaults, ...props.options };
    const cells: Ref<Props['cells']> = ref(props.cells);
    const width: Ref<Props['options']['width']> = ref(props.options.width);
    const height: Ref<Props['options']['height']> = ref(props.options.height);

    const cellIndexes: ComputedRef<Record<string, number>> = computed(() =>
      cells.value.reduce((total, current, index) =>
        ({ ...total, [`${current.row}-${current.column}`]: index }
      ), []))

    onMounted(() => {
      const element: HTMLCanvasElement = grid.value || new HTMLCanvasElement;
      const context = element.getContext('2d') as CanvasRenderingContext2D;

      context.rect(0, 0, options.width, options.height);
      context.fillStyle = '#dfe6e9';
      context.fill();
      
      const [rows, columns] = options.dimensions;
      const [cellWidth, cellHeight] = [
        (width.value / rows),
        (height.value / columns)
      ];
      const cellCount = rows * columns;
      const cellDefaults = {
        width: cellWidth,
        height: cellHeight,
        backgroundColor: options.backgroundColor,
        strokeColor: options.strokeColor,
        strokeWidth: options.strokeWidth,
      }
      
      for (let row = 0; rows > row; row++) {
        for (let column = 0; columns > column; column++) {
          if (!cellIndexes.value[`${row}-${column}`]) {
            cells.value.push({
              ...cellDefaults,
              row,
              column,
            })
          }
        }
      }
       
      function createCell({
        width,
        height,
        row,
        column,
        backgroundColor,
        strokeColor,
        strokeWidth
      }: CreateCellProps) {
        const x = width * column
        const y = height * row;
        
        context.rect(x, y, width, height);
        context.fillStyle = backgroundColor;
        context.fill();
        context.strokeStyle = strokeColor;
        context.lineWidth = strokeWidth;
        context.stroke();
      }

      function initialRender() {
        let column = 0;
        let row = 0;

         while (rows > row) {
          while (columns > column) {
            const index = cellIndexes.value[`${row}-${column}`];
            const cell = cells.value[index];

            createCell({ ...cellDefaults, ...cell });

            column += 1;
          }

          column = 0;
          row += 1;
        }

      }

      watch(width, () => {
        element.width = width.value;

        throttle(initialRender, 500);
      })

      watch(height, () => {
        element.height = height.value;

        throttle(initialRender, 500);
      })

      initialRender();
    });

    return {
      grid,
      width,
      height,
      cells,
      cellIndexes,
    };
  },
});
</script>

<template>
  <canvas
    ref="grid"
    :width="width"
    :height="height"
  />
</template>

<style>

</style>
