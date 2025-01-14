<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'

export type IFormTypes = 'text' | 'number' | 'select'

export interface Row {
  id: number
  [key: string]: string | number
}

export interface Column {
  id: number
  key: string
  name: string
  type: IFormTypes
  default?: string | number
  options?: string[]
}

const props = defineProps<{
  columns: Column[]
  modelValue: Row[]
  isEditor: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [Row[]]
}>()

const rows: Ref<Row[]> = ref([...props.modelValue])

const editingRowId = ref<number | null>(null)
const editRow = ref<Row>({} as Row)

const isEditingRow = (rowId: number) => {
  return editingRowId.value === rowId
}

const startEditing = (row: Row) => {
  editingRowId.value = row.id
  editRow.value = { ...row } // Clone the row to prevent mutating original
}

const saveEditing = (rowIndex: number) => {
  if (editRow.value != null) {
    rows.value[rowIndex] = { ...editRow.value } // Assign clone to ensure reactivity
    editingRowId.value = null
    editRow.value = { id: 0 }
    emit('update:modelValue', rows.value)
  }
}

const addRow = () => {
  const newRow: Row = { id: Date.now() }
  props.columns.forEach(col => {
    newRow[col.key] = col.default || ''
  })
  rows.value.push(newRow)
  emit('update:modelValue', rows.value)
}

const removeRow = (index: number) => {
  rows.value.splice(index, 1)
  emit('update:modelValue', rows.value)
}

const onDragEnd = () => {
  emit('update:modelValue', rows.value)
}

// Watch for changes in rows and emit updates
watch(rows, (newRows: Row[]) => {
  emit('update:modelValue', newRows)
}, { deep: true })
</script>

<template>
  <div>
    <table class="min-w-full border">
      <thead>
      <tr>
        <th class="px-2 py-2 border">순위</th>
        <th v-for="col in columns" :key="col.id" class="px-4 py-2 border">{{ col.name }}</th>
        <th class="px-4 py-2 border" v-if="isEditor">작업</th>
      </tr>
      </thead>
      <Draggable tag="tbody" v-model="rows" @end="onDragEnd" :move="() => isEditor">
        <tr v-for="(row, rowIndex) in rows" :key="row.id" class="border text-center">
          <td class="px-2 py-2 border">{{ rowIndex + 1 }}</td>
          <td v-for="col in columns" :key="col.id" class="px-4 py-2 border">
            <span v-if="!isEditingRow(row.id)">
              {{ row[col.key] }}
            </span>
            <div v-else>
              <!-- `select` 타입과 다른 타입을 구분 -->
              <input v-if="col.type == 'text'"
                  v-model="editRow[col.key]"
                  class="w-full p-2 border rounded"
              />
              <input v-else-if="col.type == 'number'"
                     v-model="editRow[col.key]"
                     class="w-full p-2 border rounded"
                     type="number"
              />
              <select
                  v-else
                  class="w-full p-2 border rounded"
                  v-model="editRow[col.key]"
              >
                <option v-for="(option, idx) in col.options" :key="idx" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </td>
          <td class="px-4 py-2 border" v-if="isEditor">
            <button
                v-if="!isEditingRow(row.id)"
                @click="startEditing(row)"
                type="button"
                class="px-2 py-1 bg-blue-500 text-white rounded mr-2"
            >
              편집
            </button>
            <button
                v-else
                @click="saveEditing(rowIndex)"
                type="button"
                class="px-2 py-1 bg-green-500 text-white rounded mr-2"
            >
              저장
            </button>
            <button
                @click="removeRow(rowIndex)"
                type="button"
                class="px-2 py-1 bg-red-500 text-white rounded"
            >
              삭제
            </button>
          </td>
        </tr>
      </Draggable>
    </table>
    <button v-if="isEditor"
        @click="addRow"
        type="button"
        class="mt-4 px-4 py-2 bg-green-500 text-white rounded"
    >
      행 추가
    </button>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
}
</style>