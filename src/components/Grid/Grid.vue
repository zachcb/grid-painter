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

import { throttle } from "../../utils";
import GridLabels from "./Labels";
import GridContextMenu from "./ContextMenu";

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

type Cell = {
  width: number;
  height: number;
  column: number;
  row: number;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
  position: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  }
}

type Cells = Array<Cell>;

type Props = {
  cells: Cells;
  options: Options;
}

type MousePosition = {
  x: number;
  y: number;
}

type CreateCellProps = {
  width: number;
  height: number;
  row: number;
  column: number;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
  position: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  }
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

  components: {
    GridLabels,
    GridContextMenu,
  },

  setup(props, { emit }) {
    const grid = ref<HTMLCanvasElement | null>(null);
    const options = { ...optionDefaults, ...props.options };
    const cells: Ref<Props['cells']> = ref(props.cells);
    const width: Ref<Props['options']['grid']['width']> = ref(props.options.grid.width);
    const height: Ref<Props['options']['grid']['height']> = ref(props.options.grid.height);
    const dimensions: Ref<Props['options']['grid']['dimensions']> = ref(props.options.grid.dimensions);
    const position: Ref<MousePosition> = ref({ x: 0, y: 0 });
    const activeCellKey: Ref<string | null> = ref(null);


    const cellIndexes: ComputedRef<Record<string, number>> = computed(() =>
      cells.value.reduce((total, current, index) =>
        ({ ...total, [`${current.row}-${current.column}`]: index }
      ), []))

    const activeCell = computed(() => {
      const index = cellIndexes.value[activeCellKey.value];

      if (!index) {
        return {}
      }

      return cells.value[index];
    })

    onMounted(() => {
      const element: HTMLCanvasElement = grid.value || new HTMLCanvasElement;
      const context = element.getContext('2d') as CanvasRenderingContext2D;

      context.rect(0, 0, options.grid.width, options.grid.height);
      context.fillStyle = '#dfe6e9';
      context.fill();

      const [rows, columns] = options.grid.dimensions;
      const [cellWidth, cellHeight] = [
        (width.value / rows),
        (height.value / columns)
      ];
      const cellCount = rows * columns;
      const cellDefaults = {
        width: cellWidth,
        height: cellHeight,
        backgroundColor: options.grid.backgroundColor,
        strokeColor: options.grid.strokeColor,
        strokeWidth: options.grid.strokeWidth,
      }

      for (let row = 0; rows > row; row++) {
        for (let column = 0; columns > column; column++) {
          if (!cellIndexes.value[`${row}-${column}`]) {
            const [x, y] = [
              row * cellDefaults.width,
              column * cellDefaults.height
            ];

            cells.value.push({
              ...cellDefaults,
              row,
              column,
              position: {
                top: x,
                left: y,
                right: y + cellDefaults.width,
                bottom: x + cellDefaults.height,
              }
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

        context.fillStyle = backgroundColor;
        context.strokeStyle = strokeColor;
        context.lineWidth = strokeWidth;
        context.fillRect(x, y, width, height)
        context.strokeRect(x, y, width, height);
      }

      function initialRender() {
        let column = 0;
        let row = 0;

         while (rows > row) {
          while (columns > column) {
            const index = cellIndexes.value[`${row}-${column}`];
            const cell = cells.value[index];


            createCell({
              ...cellDefaults,
              ...cell,
            });

            column += 1;
          }

          column = 0;
          row += 1;
        }

      }

      function getMousePosition(event: MouseEvent): MousePosition {
        const { left, top } = element.getBoundingClientRect();

        return {
          x: event.clientX - left,
          y: event.clientY - top,
        }
      }

      function getActiveCell(event: MousePosition): Cell {
        const { x, y } = event;
        let activeCell: Cell = {};

        cells.value.forEach((cell) => {
          const { top, left, right, bottom } = cell.position;

          if (
            top <= y &&
            left <= x &&
            right > x &&
            bottom > y
          ) {
            activeCell = cell;
          }
        })

        return activeCell;
      }

      // function getCellRect(cell) {
      //   const { height, width } = cell;

      //   return {
      //     top: ,
      //     left: ,
      //     right: ,
      //     bottom: ,
      //   }
      // }

      function handleMouseMoveEvent(event: MouseEvent): void {
        const { x, y }: MousePosition = getMousePosition(event);
        position.value = { x, y };

        const activeCell = getActiveCell(position.value);
        const key = `${activeCell.row}-${activeCell.column}`;

        if (key !== activeCellKey.value) {
          createCell({
            ...activeCell,
            backgroundColor: "#74b9ff",
            strokeColor: "#6c5ce7"
          })

          if (activeCellKey.value) {
            const index = cellIndexes.value[activeCellKey.value];
            const cell = cells.value[index];

              createCell({
              ...cell,
              backgroundColor: cellDefaults.backgroundColor,
              strokeColor: cellDefaults.strokeColor
            })
          }
        }

        activeCellKey.value = key;
      }

      element.addEventListener("mousemove", (event) =>
        throttle(handleMouseMoveEvent(event), 200)
      )

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
      activeCell,
      position,
      dimensions,
    };
  },
});
</script>

<template>
  <div :class="[$style.container]">
    <GridContextMenu :position="position">
      <slot name="context-menu" :context="activeCell"></slot>
    </GridContextMenu>

    <GridLabels :dimensions="[20, 20]">
      <canvas
        ref="grid"
        :width="width"
        :height="height"
      />
    </GridLabels>
  </div>
</template>

<style lang="postcss" module>
.container {
  display: inline-block;
  position: relative;
}
</style>
