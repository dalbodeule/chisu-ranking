<script setup lang="ts">
import type {
  Column,
  FormatText,
  IFormTypes,
  IFormatTextType,
} from "~/components/TableEditor.vue";
import { VueDraggable } from "vue-draggable-plus";

export interface Field {
  id: number;
  columnKey: string;
  label: string;
  type: IFormTypes;
  value?: string | number;
  options?: string[];
  format?: FormatText[];
}

const props = defineProps<{
  columns: Column[];
  fields: Field[];
}>();

const emit = defineEmits<{
  "update:fields": [Field[]];
}>();

const fields: Ref<Field[]> = ref([...props.fields]);
const selectedField: Ref<string> = ref("");
const requireAdd: Ref<string[]> = ref([]);
const selectType: Ref<string> = ref("");
const indexs: Ref<number> = ref(1);
const isUpdating: Ref<boolean> = ref(false);

const addField = () => {
  if (props.columns.length >= 10) {
    return;
  }
  fields.value.push({
    id: Date.now() + Math.random(),
    columnKey: `${fields.value.length + 1}`,
    label: "",
    type: "text",
  });
  emit("update:fields", fields.value);
};

const addOptions = (index: number, content: string) => {
  if (fields.value[index].options) {
    fields.value[index].options!.push(content);
  } else {
    fields.value[index].options = [content];
  }
  emit("update:fields", fields.value);
};

const removeOptions = (index: number) => {
  if (fields.value[index].options != null) {
    const field = fields.value[index].options?.find(
      (option) => option == selectedField.value,
    );
    if (!field) return;

    const propIdx = fields.value[index].options!.indexOf(field);
    fields.value.splice(propIdx, 1);
  }
  emit("update:fields", fields.value);
};

const removeField = (index: number) => {
  fields.value.splice(index, 1);
  emit("update:fields", fields.value);
};

const getComponent = (type: IFormTypes) => {
  switch (type) {
    case "text":
      return "input";
    case "number":
      return "input";
    case "select":
      return "select";
    case "formatText":
      return "select";
    default:
      return "input";
  }
};

const updateFields = () => {
  if (isUpdating.value) return;
  emit("update:fields", fields.value);
};

const addFormats = (
  index: number,
  content: string,
  indexs: number,
  type: IFormatTextType,
) => {
  if (fields.value[index].format) {
    fields.value[index].format?.push({
      format: content,
      index: indexs,
      type: type,
    });
  } else {
    fields.value[index].format = [
      {
        format: content,
        index: indexs,
        type: type,
      },
    ];
  }
  emit("update:fields", fields.value);
};

const removeFormats = (index: number) => {
  if (fields.value[index].format != null) {
    const field = fields.value[index].format?.find(
      (format) => format.format == requireAdd.value[index],
    );
    if (!field) return;
    const propIdx = fields.value[index].format!.indexOf(field);
    fields.value.splice(propIdx, 1);

    emit("update:fields", fields.value);
  }
};

const onDragEnd = () => {
  if (isUpdating.value) return;
  emit("update:fields", fields.value);
};

watch(
  () => props.fields,
  (newFields) => {
    isUpdating.value = true;
    fields.value = [...newFields];
    isUpdating.value = false;
  },
  { deep: true },
);
</script>

<template>
  <div class="mt-4">
    <VueDraggable v-model="fields" :delay="1000" @on-end="onDragEnd">
      <div
        v-for="(field, index) in fields"
        :key="field.id"
        class="mb-4 p-4 border rounded"
      >
        <div class="flex items-center space-x-2">
          <select v-model="field.type" class="p-2 border rounded">
            <option value="text">텍스트</option>
            <option value="number">숫자</option>
            <option value="select">선택</option>
            <option value="formatText">양식이 있는 텍스트</option>
          </select>
          <input
            v-model="field.label"
            placeholder="필드 라벨"
            class="flex-1 p-2 border rounded"
            @input="updateFields"
          />
          <button
            type="button"
            class="px-2 py-1 bg-red-500 text-white rounded"
            @click="removeField(index)"
          >
            삭제
          </button>
        </div>
        <div class="mt-2">
          <component
            :is="getComponent(field.type)"
            v-if="getComponent(field.type) !== 'select'"
            v-model="field.value"
            class="w-full p-2 border rounded"
            placeholder="기본값을 입력하세요."
          />
          <div v-else-if="field.type == 'select'" class="flex flex-row gap-[20px] w-full">
            <select
              v-model="selectedField"
              class="p-2 px-4 py-2 border rounded w-[1/3]"
              @change="updateFields"
            >
              <option v-for="option in field.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <button
              type="button"
              class="mb-4 px-4 py-2 bg-red-500 text-white rounded"
              @click="removeOptions(index)"
            >
              옵션 삭제
            </button>
            <form
              class="flex flex-row gap-[20px]"
              @submit.prevent="addOptions(index, requireAdd[index])"
            >
              <input
                v-model="requireAdd[index]"
                type="text"
                class="border rounded"
                placeholder="옵션을 입력하세요."
              />
              <button
                type="submit"
                class="mb-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                추가
              </button>
            </form>
          </div>
          <div
            v-else-if="field.type == 'formatText'"
            class="flex flex-row gap-[20px] w-full"
          >
            <select
              v-model="selectedField"
              class="p-2 px-4 py-2 border rounded w-[1/3]"
              @change="updateFields"
            >
              <option
                v-for="(option, index2) in field.format"
                :key="index2"
                :value="index2"
              >
                {{ index2 + 1 }} - {{ option.format }}
              </option>
            </select>
            <button
              type="button"
              class="mb-4 px-4 py-2 bg-red-500 text-white rounded"
              @click="removeFormats(index)"
            >
              옵션 삭제
            </button>
            <form
              class="flex flex-row gap-[20px]"
              @submit.prevent="
                addFormats(
                  index,
                  requireAdd[index],
                  indexs,
                  selectType as IFormatTextType,
                )
              "
            >
              <input
                v-model="requireAdd[index]"
                type="text"
                class="border rounded"
                placeholder="포멧을 입력하세요."
              />
              <input
                v-model="indexs"
                type="number"
                min="1"
                class="border rounded"
                placeholder="순위를 입력하세요."
              />
              <select v-model="selectType" class="p-2 px-4 py-2 border rounded w-[1/3]">
                <option value="index">앞에서 {{ indexs }}등</option>
                <option value="reverseIndex">뒤에서 {{ indexs }}등</option>
                <option value="default">기본</option>
              </select>
              <button
                type="submit"
                class="mb-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                추가
              </button>
            </form>
          </div>
        </div>
      </div>
    </VueDraggable>
    <div class="flex items-center space-x-2">
      <button
        type="button"
        class="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        @click="addField"
      >
        필드 추가
      </button>
    </div>
  </div>
</template>

<style scoped>
select,
input {
  min-width: 100px;
}
</style>
