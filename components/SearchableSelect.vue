<template>
  <div class="relative w-full">
    <!-- 드롭다운 버튼 및 검색 입력 -->
    <div class="flex items-center justify-between bg-teal-500 p-3 rounded text-white shadow-inner cursor-pointer" @click="toggleDropdown">
      <span>{{ selectedLabel }}</span>
      <FontAwesome :icon="['fas', 'angle-down']" />
    </div>

    <!-- 드롭다운 메뉴 -->
    <transition name="fade">
      <div v-if="opened" class="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
        <!-- 검색 입력 -->
        <div class="p-2">
          <input
              v-model="searchTerm"
              type="text"
              placeholder="검색..."
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown.arrow-down.prevent="highlightNext"
              @keydown.arrow-up.prevent="highlightPrev"
              @keydown.enter.prevent="selectHighlighted"
              @keydown.esc="closeDropdown"
          >
        </div>

        <!-- 옵션 목록 -->
        <ul class="max-h-60 overflow-auto">
          <li
              v-for="(option, idx) in filteredOptions"
              :key="idx"
              :class="[
              'p-2 cursor-pointer flex justify-between items-center',
              highlightedIndex === idx ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            ]"
              @mouseenter="highlightedIndex = idx"
              @mouseleave="highlightedIndex = -1"
              @click="selectOption(option, idx)"
              @mousedown.prevent
          >
            <span>{{ option }}</span>
            <FontAwesome v-if="selectedValue === option" :icon="['fas', 'check']" class="text-green-500" />
          </li>
          <li v-if="filteredOptions.length === 0" class="p-2 text-gray-500">옵션을 찾을 수 없습니다.</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps< {
  options: string[],
  modelValue: string | number
}>()
// 이벤트 정의
const emit = defineEmits<{
  'update:modelValue': [string | number]
}>();

// 상태 관리
const searchTerm = ref('');
const selectedValue = ref(props.modelValue);
const opened = ref(false);
const highlightedIndex = ref(-1);

// 필터링된 옵션 계산
const filteredOptions = computed(() => {
  if (!searchTerm.value) return props.options;
  return props.options.filter(option =>
      option.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// 선택된 라벨 계산
const selectedLabel = computed(() => {
  if (!selectedValue.value) return '옵션 선택';
  const found = props.options.find(option => option === selectedValue.value);
  return found || '옵션 선택';
});

// 드롭다운 열기/닫기 토글
const toggleDropdown = () => {
  opened.value = !opened.value;
};

// 드롭다운 닫기
const closeDropdown = () => {
  opened.value = false;
  highlightedIndex.value = -1;
};

// 옵션 선택
const selectOption = (option: string, _index: number) => {
  selectedValue.value = option;
  emit('update:modelValue', option);
  closeDropdown();
};

// 키보드 네비게이션
const highlightNext = () => {
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value += 1;
  }
};

const highlightPrev = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value -= 1;
  }
};

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
    selectOption(filteredOptions.value[highlightedIndex.value], highlightedIndex.value);
  }
};

// 외부 클릭 처리
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    closeDropdown();
  }
};

// Event listener 등록
onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});

// props.modelValue가 변경될 때 selectedValue 업데이트
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue;
});
</script>
