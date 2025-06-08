<script setup lang="ts">
import type {
  Column,
  FormatText,
  IFormTypes,
  IFormatTextType,
} from "~/components/TableEditor.vue";
import { VueDraggableNext } from "vue-draggable-next";

export interface Field {
  id: number;
  columnKey: string;
  label: string;
  type: IFormTypes;
  value?: string | number;
  options?: string[];
  format?: FormatText[];
  image?: { [key: string]: string };
  gridRow?: number;
  gridColumn?: number;
  gridRowSpan?: number;
  gridColumnSpan?: number;
}

const props = defineProps<{
  columns: Column[];
  fields: Field[];
}>();

const emit = defineEmits<{
  "update:fields": [Field[]];
}>();

const fields: Ref<Field[]> = ref([...props.fields]);
const selectedField: Ref<string[]> = ref([]);
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

const removeOptions = (fieldIdx: number) => {
  if (fields.value[fieldIdx].options != null) {
    const field = fields.value[fieldIdx].options?.find(
      (option) => option == selectedField.value[fieldIdx],
    );
    if (!field) return;

    const propIdx = fields.value[fieldIdx].options!.indexOf(field);
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
    case "imageSelect":
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

const removeFormats = (fieldIdx: number) => {
  if (fields.value[fieldIdx].format != null) {
    const field = fields.value[fieldIdx].format?.find(
      (format) => format.format == requireAdd.value[fieldIdx],
    );
    if (!field) return;
    const propIdx = fields.value[fieldIdx].format!.indexOf(field);
    fields.value.splice(propIdx, 1);

    emit("update:fields", fields.value);
  }
};

const onDragEnd = () => {
  if (isUpdating.value) return;
  emit("update:fields", fields.value);
};

const handleImageUpload = async (event: Event, fieldIdx: number) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  try {
    const formData = new FormData();
    formData.append('file', input.files[0]);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const {url} = await response.json();

    if (!selectedField.value[fieldIdx]) return;
    if (!fields.value[fieldIdx].image) {
      fields.value[fieldIdx].image = {};
    }
    fields.value[fieldIdx].image![selectedField.value[fieldIdx]] = url;
    emit("update:fields", fields.value);

  } catch (error) {
    console.error('Error uploading image:', error);
  }
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
    <div class="grid-preview mb-4 p-4 border rounded">
      <h3 class="font-bold mb-2">그리드 미리보기</h3>
      <div class="grid-container" :style="{ 'grid-template-columns': 'repeat(12, 1fr)', 'gap': '4px' }">
        <div v-for="field in fields" :key="field.id"
             class="grid-item p-2 bg-blue-100 rounded"
             :style="{
            'grid-row': `${field.gridRow || 1} / span ${field.gridRowSpan || 1}`,
            'grid-column': `${field.gridColumn || 1} / span ${field.gridColumnSpan || 1}`
          }">
          {{ field.label || '미지정' }}
        </div>
      </div>
    </div>
    <VueDraggableNext v-model="fields" :delay="1000" @on-end="onDragEnd">
      <div
        v-for="(field, fieldIdx) in fields"
        :key="field.id"
        class="mb-4 p-4 border rounded"
      >
        <div class="flex items-center space-x-2">
          <select v-model="field.type" class="p-2 border rounded">
            <option value="text">텍스트</option>
            <option value="number">숫자</option>
            <option value="select">선택</option>
            <option value="formatText">양식이 있는 텍스트</option>
            <option value="imageSelect">이미지와 함께 있는 선택지</option>
          </select>
          <input
            v-model="field.label"
            placeholder="필드 라벨"
            class="flex-1 p-2 border rounded"
            @input="updateFields"
          />
          <div class="flex items-center space-x-2">
            <input
                v-model="field.gridRow"
                type="number"
                min="1"
                placeholder="행"
                class="w-16 p-2 border rounded"
                @input="updateFields"
            />
            <input
                v-model="field.gridColumn"
                type="number"
                min="1"
                placeholder="열"
                class="w-16 p-2 border rounded"
                @input="updateFields"
            />
            <input
                v-model="field.gridRowSpan"
                type="number"
                min="1"
                placeholder="행 병합"
                class="w-20 p-2 border rounded"
                @input="updateFields"
            />
            <input
                v-model="field.gridColumnSpan"
                type="number"
                min="1"
                placeholder="열 병합"
                class="w-20 p-2 border rounded"
                @input="updateFields"
            />
          </div>
          <button
            type="button"
            class="px-2 py-1 bg-red-500 text-white rounded"
            @click="removeField(fieldIdx, )"
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
          <div v-else-if="field.type == 'select' || field.type == 'imageSelect'" class="flex flex-row gap-[20px] w-full">
            <select
              v-model="selectedField[fieldIdx]"
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
              @click="removeOptions(fieldIdx)"
            >
              옵션 삭제
            </button>

            <div v-if="field.type === 'imageSelect'" class="flex items-center gap-2">
              <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleImageUpload(e, fieldIdx)"
                  class="border rounded p-2"
                  :disabled="!selectedField[fieldIdx]"
              />
              <img
                  v-if="selectedField[fieldIdx] && field.image?.[selectedField[fieldIdx]]"
                  :src="field.image[selectedField[fieldIdx]]"
                  class="w-16 h-16 object-cover rounded"
                  alt="Selected image"
              />
            </div>

            <form
              class="flex flex-row gap-[20px]"
              @submit.prevent="addOptions(fieldIdx, requireAdd[fieldIdx])"
            >
              <input
                v-model="requireAdd[fieldIdx]"
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
              v-model="selectedField[fieldIdx]"
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
              @click="removeFormats(fieldIdx)"
            >
              옵션 삭제
            </button>
            <form
              class="flex flex-row gap-[20px]"
              @submit.prevent="
                addFormats(
                  fieldIdx,
                  requireAdd[fieldIdx],
                  indexs,
                  selectType as IFormatTextType,
                )
              "
            >
              <input
                v-model="requireAdd[fieldIdx]"
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
    </VueDraggableNext>



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

input[type="number"] {
  min-width: 60px;
}

.grid-container {
  display: grid;
  min-height: 200px;
  background: #f0f0f0;
  padding: 8px;
}

.grid-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
