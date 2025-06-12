<script setup lang="ts">
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";

import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import type { Section } from "~/components/SectionElement.vue";

const props = defineProps<{
  section: Section;
  id: string;
}>();
const emit = defineEmits<{
  "update:section": [Section];
}>();

const content = ref<string | undefined>(props.section?.content)

const editor = ref(`${props.id}`);

const changeHandler = () => {
  const copiedSection = useCloneDeep(props.section)
  copiedSection.content = content.value

  emit("update:section", copiedSection)
}

onMounted(() => {
  const e = new Editor({
    el: editor.value,
    height: "500px",
    initialEditType: "wysiwyg",
    initialValue: content.value,
    previewStyle: "tab",
    language: "ko-KR",
    events: {
      change: changeHandler,
    },
    hooks: {
      addImageBlobHook: async (
          blob: Blob,
          callback: (url: string, text: string) => void,
      ) => {
        try {
          const formData = new FormData();
          formData.append('file', blob);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const data: { url: string, filename: string } = await response.json();
          callback(data.url, data.filename);
          return true;
        } catch (error) {
          console.error('Image upload error:', error);
          alert('이미지 업로드에 실패했습니다.');
          return false;
        }
      },
    },
    plugins: [colorSyntax],
  });
});
</script>

<template>
  <div ref="editor" class="editor ranking" />
</template>

<style lang="scss">
.editor.ranking {
  p,
  span,
  strike,
  strong,
  em,
  u,
  del,
  a,
  ul,
  ol,
  li,
  blockquote {
    font-size: 16px;
  }

  h1 > span {
    font-size: 24px;
  }

  h2 > span {
    font-size: 22px;
  }

  h3 > span {
    font-size: 20px;
  }

  h4 > span {
    font-size: 18px;
  }

  h5 > span {
    font-size: 16px;
  }

  h6 > span {
    font-size: 14px;
  }
}
</style>
