<script setup lang="ts">
import SearchableSelect from "~/components/SearchableSelect.vue";
import ModalElement from "~/components/ModalElement.vue";
import { VueDraggableNext } from "vue-draggable-next";
import {range} from "assets/tools";

export type IFormTypes = "text" | "number" | "select" | "formatText" | "imageSelect";

export interface Row {
  id: number;
  [key: string]: string | number;
}

export interface Column {
  id: number;
  key: string;
  name: string;
  type: IFormTypes;
  default?: string | number;
  options?: string[];
  format?: FormatText[];
  image?: { [key: string]: string };
  gridRow?: number;
  gridColumn?: number;
  gridRowSpan?: number;
  gridColumnSpan?: number;
}

export type IFormatTextType = "index" | "reverseIndex" | "default";

export interface FormatText {
  type: IFormatTextType;
  index: number;
  format: string;
}

const props = defineProps<{
  columns: Column[];
  modelValue: Row[];
  isEditor: boolean;
}>();


const emit = defineEmits<{
  "update:modelValue": [Row[]];
}>();

const rows: Ref<Row[]> = ref([...props.modelValue]);

const editingRowId = ref<number | null>(null);
const editingRowIdx = ref<number | null>(null);
const editRow = ref<Row>({} as Row);

const isEditingRow = (rowId: number) => {
  return editingRowId.value === rowId;
};

const startEditing = async (row: Row, rowIndex: number) => {
  await saveEditing(editingRowId.value!, false);
  await nextTick();

  editingRowId.value = row.id;
  editingRowIdx.value = rowIndex;
  editRow.value = { ...row }; // Clone the row to prevent mutating original
};

const saveEditing = async (rowIndex: number, rowRelease: boolean = true) => {
  if (editRow.value != null) {
    rows.value[rowIndex] = { ...editRow.value }; // Assign clone to ensure reactivity
    emit("update:modelValue", rows.value);

    await nextTick();

    if (rowRelease) {
      editingRowId.value = null;
      editingRowIdx.value = null;
      editRow.value = {} as Row;
    }
  }
};

const cancelEditing = () => {
  editingRowId.value = null;
  editingRowIdx.value = null;
  editRow.value = {} as Row;
};

const addRow = () => {
  const newRow: Row = { id: Date.now() };
  props.columns.forEach((col) => {
    newRow[col.key] = col.default || "";
  });
  rows.value.push(newRow);
  emit("update:modelValue", rows.value);
};

const removeRow = (index: number) => {
  rows.value.splice(index, 1);
  emit("update:modelValue", rows.value);
};

const onDragEnd = () => {
  emit("update:modelValue", rows.value);
};

const gridDimensions = computed(() => {
  let maxRow = 1;
  let maxCol = 1;

  props.columns.forEach((col) => {
    const endRow = (col.gridRow ?? 1) + (col.gridRowSpan ?? 1) - 1;
    const endCol = (col.gridColumn ?? 1) + (col.gridColumnSpan ?? 1) - 1;
    maxRow = Math.max(maxRow, endRow);
    maxCol = Math.max(maxCol, endCol);
  });

  return {maxRow, maxCol};
});

// A helper function to determine if a grid cell at (r, c) is already "covered" by a spanning cell
const isCellCovered = (
    targetRow: number,
    targetCol: number,
    renderedCells: Set<string>
): boolean => {
  return renderedCells.has(`${targetRow}-${targetCol}`);
};

const getColumnsForGridRow = (
    gridRow: number,
    isHeader: boolean = false
): Column[] => {
  const columnsInThisRow: Column[] = [];
  const renderedCells = new Set<string>(); // Keep track of cells already "rendered" by a spanning column

  for (let c = 1; c <= gridDimensions.value.maxCol; c++) {
    if (isCellCovered(gridRow, c, renderedCells)) {
      continue; // Skip if this cell is already covered by a previous spanning column
    }

    const column = props.columns.find((col) => {
      const colGridRow = col.gridRow ?? 1;
      const colGridCol = col.gridColumn ?? 1;
      const colRowSpan = col.gridRowSpan ?? 1;
      const colColSpan = col.gridColumnSpan ?? 1;

      // Check if the current grid cell (gridRow, c) is the starting point of this column
      return (
          colGridRow === gridRow &&
          colGridCol === c
      );
    });

    if (column) {
      columnsInThisRow.push(column);
      // Mark all cells covered by this column's span
      for (let r = gridRow; r < gridRow + (column.gridRowSpan ?? 1); r++) {
        for (let kc = c; kc < c + (column.gridColumnSpan ?? 1); kc++) {
          renderedCells.add(`${r}-${kc}`);
        }
      }
    } else if (isHeader) {
      // If it's a header and no column explicitly starts here,
      // it might be a gap, but we need to ensure the structure
      // for the loop to continue correctly, hence `renderedCells.add`.
      // For headers, empty cells are not explicitly rendered unless it's a gap.
      // We only add to renderedCells if a column is found to prevent
      // double counting for the next iteration.
    }
  }
  return columnsInThisRow;
};

const getDataByPosition = (dataRow: Row, row: number, col: number): string | number => {
  const column = props.columns.find((column) => {
    const columnRow = column.gridRow ?? 1;
    const columnCol = column.gridColumn ?? 1;
    const rowSpan = column.gridRowSpan ?? 1;
    const colSpan = column.gridColumnSpan ?? 1;

    return row >= columnRow &&
        row < columnRow + rowSpan &&
        col >= columnCol &&
        col < columnCol + colSpan;
  });
  return column ? dataRow[column.key] : '';
};


const reOrderModal: Ref<InstanceType<typeof ModalElement> | null> = ref(null);
const reOrderIndex: Ref<number | null> = ref(null);
const openReorderModal = async (rowIndex: number) => {
  const result = await reOrderModal.value?.open();

  if (reOrderIndex.value == null) {
    return;
  }

  if (result) {
    const targetIndex = reOrderIndex.value - 1;

    // `targetIndex`가 배열 범위 내에 있어야 함
    if (targetIndex >= 0 && targetIndex <= rows.value.length) {
      const itemToMove = rows.value.splice(rowIndex, 1)[0];
      rows.value.splice(targetIndex, 0, itemToMove); // `targetIndex` 위치로 삽입
    }
  }
};

const formatText = (text: string, format: FormatText[] | undefined, index: number) => {
  if (!format) return text;

  const forwardIndexFormat = format.find((f) => f.type === "index" && f.index === index);
  if (forwardIndexFormat) return forwardIndexFormat.format.replace("{text}", text);

  const reverseIndexFormat = format.find(
      (f) => f.type === "reverseIndex" && f.index === rows.value.length - index + 1,
  );
  if (reverseIndexFormat) return reverseIndexFormat.format.replace("{text}", text);

  const defaultFormat = format.find((f) => f.type === "default");
  if (defaultFormat) return defaultFormat.format.replace("{text}", text);

  return text;
};

watch(
    rows,
    (newRows: Row[]) => {
      emit("update:modelValue", newRows);
    },
    {deep: true},
);
</script>

<template>
  <div class="overflow-x-auto">
    <!-- 헤더 -->
    <div
        class="grid border border-gray-300"
        :style="`grid-template-columns: repeat(${gridDimensions.maxCol + 2}, minmax(0, 1fr))`"
    >
      <!-- header rows -->
      <template v-for="gridRowIndex in range(gridDimensions.maxRow + 1, 1)" :key="`header-row-${gridRowIndex}`">
        <div
            v-if="gridRowIndex === 1"
            class="border px-2 py-2 text-center font-bold"
            :style="`grid-row-start: ${gridRowIndex}; grid-row-end: span ${gridDimensions.maxRow}; grid-column-start: 1;`"
        >
          순위
        </div>

        <template v-for="column in getColumnsForGridRow(gridRowIndex, true)" :key="`column-header-${column.id}`">
          <div
              class="border px-4 py-2 text-center font-bold"
              :style="`
              grid-row-start: ${gridRowIndex};
              grid-row-end: span ${column.gridRowSpan ?? 1};
              grid-column-end: span ${column.gridColumnSpan ?? 1};
            `"
          >
            {{ column.name }}
          </div>
        </template>

        <div
            v-if="isEditor && gridRowIndex === 1"
            class="border px-2 py-2 text-center font-bold"
            :style="`grid-row-start: ${gridRowIndex}; grid-row-end: span ${gridDimensions.maxRow};`"
        >
          작업
        </div>
      </template>
    </div>
    <!-- 데이터 행 -->
    <VueDraggableNext
        :list="rows"
        tag="div"
        :disabled="!isEditor || editingRowId != null"
        @on-end="onDragEnd"
    >
      <div
          v-for="(element, index) in rows" :key="`row-${element.id}`"
          class="grid border border-gray-300"
          :style="`grid-template-columns: repeat(${gridDimensions.maxCol + 2}, minmax(0, 1fr)); grid-auto-rows: minmax(50px, auto);`"
      >
        <!-- 순위 셀 -->
        <div
            v-if="gridDimensions.maxRow >= 1"
            class="border px-2 py-2 text-center flex flex-col justify-center items-center"
            :style="`grid-row-start: 1; grid-row-end: span ${gridDimensions.maxRow}; grid-column-start: 1;`"
        >
          {{ index + 1 }}
          <button
              v-if="isEditingRow(element.id)"
              type="button"
              class="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
              @click="openReorderModal(index)"
          >
            옮기기
          </button>
        </div>

        <!-- data cells -->
        <template v-for="gridRowIndex in range(gridDimensions.maxRow + 1, 1)" :key="`data-row-${element.id}-gridRow-${gridRowIndex}`">
          <template v-for="column in getColumnsForGridRow(gridRowIndex)" :key="`data-${element.id}-${column.id}`">
            <div
                class="border px-4 py-2 text-center"
                :style="`
                grid-row-start: ${gridRowIndex};
                grid-row-end: span ${column.gridRowSpan ?? 1};
                grid-column-end: span ${column.gridColumnSpan ?? 1};
                grid-column-start: auto;
              `"
            >
              <div v-if="!isEditingRow(element.id)" class="flex flex-col items-center justify-center gap-[10px]">
                <span v-if="column.type === 'formatText'">
                  {{
                    formatText(
                        `${element[column.key]}`,
                        column.format,
                        index + 1
                    )
                  }}
                </span>
                <span v-else>
                  {{ element[column.key] }}
                </span>
                <div class="ml-2">
                  <NuxtImg
                      class="w-[48px]"
                      v-if="column.type === 'imageSelect'"
                      :src="column.image?.[element[column.key]]!!"
                      :alt="`${element[column.key]} image.`"
                      loading="lazy"
                  />
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center gap-[10px]">
                <input
                    v-if="column.type === 'text'"
                    v-model="editRow[column.key]"
                    class="w-full p-2 border rounded"
                />
                <input
                    v-else-if="column.type === 'number'"
                    v-model="editRow[column.key]"
                    class="w-full p-2 border rounded"
                    type="number"
                />
                <input
                    v-else-if="column.type === 'formatText'"
                    v-model="editRow[column.key]"
                    class="w-full p-2 border rounded"
                    type="text"
                />
                <SearchableSelect
                    v-else-if="column.type === 'select' || column.type === 'imageSelect'"
                    v-model="editRow[column.key]"
                    :options="column.options ?? []"
                />
                <NuxtImg
                    class="w-[48px]"
                    :src="column.image?.[editRow[column.key]] ?? ''"
                    v-if="column.type === 'imageSelect'"
                />
              </div>
            </div>
          </template>
        </template>

        <!-- 작업(작업 영역) -->
        <div
            v-if="isEditor"
            class="border px-4 py-2"
            :style="`grid-row-start: 1; grid-row-end: span ${gridDimensions.maxRow};`"
        >
          <div v-if="!isEditingRow(element.id)" class="flex flex-row justify-center items-center align-middle w-[150px]">
            <button
                type="button"
                class="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                @click="startEditing(element, index)"
            >
              편집
            </button>
            <button
                type="button"
                class="px-2 py-1 bg-green-500 text-white rounded mr-2"
                @click="saveEditing(index)"
            >
              저장
            </button>
            <button
                type="button"
                class="px-2 py-1 bg-red-500 text-white rounded"
                @click="removeRow(index)"
            >
              삭제
            </button>
          </div>
          <div v-else class="flex flex-row justify-between w-[150px]">
            <button
                type="button"
                class="px-2 py-1 bg-green-500 text-white rounded mr-2"
                @click="saveEditing(index)"
            >
              저장
            </button>
            <button
                type="button"
                class="px-2 py-1 bg-yellow-400 text-white rounded mr-2"
                @click="cancelEditing()"
            >
              취소
            </button>
            <button
                type="button"
                class="px-2 py-1 bg-red-500 text-white rounded"
                @click="removeRow(index)"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </VueDraggableNext>
    <button
        v-if="isEditor"
        type="button"
        class="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        @click="addRow"
    >
      행 추가
    </button>

    <ModalElement ref="reOrderModal">
      <h2 class="text-lg font-bold mb-4">순서 변경</h2>
      <p class="mb-4">{{ (editingRowIdx ?? 0) + 1 }}번째 요소를 어디로 옮기시겠습니까?</p>

      <input
          v-model="reOrderIndex"
          type="number"
          class="w-full p-2 border rounded mb-4"
      />
    </ModalElement>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
}
</style>