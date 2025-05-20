<script setup lang="ts">
import SearchableSelect from "~/components/SearchableSelect.vue";
import ModalElement from "~/components/ModalElement.vue";
import { VueDraggable } from "vue-draggable-plus";

export type IFormTypes = "text" | "number" | "select" | "formatText";

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

// Watch for changes in rows and emit updates
watch(
  rows,
  (newRows: Row[]) => {
    emit("update:modelValue", newRows);
  },
  { deep: true },
);
</script>

<template>
  <div class="max-md:w-[1200px]">
    <table class="table table-fixed w-full">
      <thead>
        <tr>
          <th class="px-2 py-2 border">순위</th>
          <th v-for="col in columns" :key="col.id" class="px-4 py-2 border">
            {{ col.name }}
          </th>
          <th v-if="isEditor" class="px-4 py-2 border">작업</th>
        </tr>
      </thead>
      <VueDraggable
        v-model="rows"
        tag="tbody"
        :disabled="!isEditor || editingRowId != null"
        @on-end="onDragEnd"
      >
        <tr v-for="(row, rowIndex) in rows" :key="row.id" class="border text-center">
          <td class="px-2 py-2 border">
            {{ rowIndex + 1 }}

            <button
              v-if="isEditingRow(row.id)"
              type="button"
              class="px-4 py-1 bg-blue-600 text-white rounded"
              @click="openReorderModal(rowIndex)"
            >
              옮기기
            </button>
          </td>
          <td v-for="col in columns" :key="col.id" class="px-4 py-2 border">
            <div v-if="!isEditingRow(row.id)">
              <span v-if="col.type == 'formatText'">
                {{ formatText(`${row[col.key]}`, col.format, rowIndex + 1) }}
              </span>
              <span v-else>
                {{ row[col.key] }}
              </span>
            </div>
            <div v-else>
              <!-- `select` 타입과 다른 타입을 구분 -->
              <input
                v-if="col.type == 'text'"
                v-model="editRow[col.key]"
                class="w-full p-2 border rounded"
              />
              <input
                v-else-if="col.type == 'number'"
                v-model="editRow[col.key]"
                class="w-full p-2 border rounded"
                type="number"
              />
              <input
                v-else-if="col.type == 'formatText'"
                v-model="editRow[col.key]"
                class="w-full p-2 border rounded"
                type="text"
              />
              <SearchableSelect
                v-else-if="col.type == 'select'"
                v-model="editRow[col.key]"
                :options="col.options ?? []"
              />
            </div>
          </td>
          <td v-if="isEditor" class="px-4 py-2 border">
            <div
              v-if="!isEditingRow(row.id)"
              class="flex flex-row w-[150px] justify-between"
            >
              <button
                type="button"
                class="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                @click="startEditing(row, rowIndex)"
              >
                편집
              </button>
              <button
                type="button"
                class="px-2 py-1 bg-green-500 text-white rounded mr-2"
                @click="saveEditing(rowIndex)"
              >
                저장
              </button>
              <button
                type="button"
                class="px-2 py-1 bg-red-500 text-white rounded"
                @click="removeRow(rowIndex)"
              >
                삭제
              </button>
            </div>
            <div v-else class="flex flex-row w-[150px] justify-between">
              <button
                type="button"
                class="px-2 py-1 bg-green-500 text-white rounded mr-2"
                @click="saveEditing(rowIndex)"
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
                @click="removeRow(rowIndex)"
              >
                삭제
              </button>
            </div>
          </td>
        </tr>
      </VueDraggable>
    </table>
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
