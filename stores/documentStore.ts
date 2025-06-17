import type { Section } from "~/components/SectionElement.vue";

export const useDocumentStore = defineStore("document", {
  state: () => ({
    sections: [] as Section[],
    history: [] as Section[][],
    currentHistoryIndex: -1,
  }),
  actions: {
    saveState() {
      this.currentHistoryIndex++;
      this.history = this.history.slice(0, this.currentHistoryIndex);
      this.history.push(useCloneDeep(this.sections));
    },
    addSection(section: Section) {
      this.saveState();
      this.sections.push(section);
    },
    updateSection(index: number, section: Section) {
      this.saveState();
      this.sections[index] = section;
    },
    removeSection(index: number) {
      this.saveState();
      this.sections.splice(index, 1);
    },
    undo() {
      if (this.currentHistoryIndex > 0) {
        this.currentHistoryIndex--;
        this.sections = useCloneDeep(this.history[this.currentHistoryIndex]);
      }
    },
    redo() {
      if (this.currentHistoryIndex < this.history.length - 1) {
        this.currentHistoryIndex++;
        this.sections = useCloneDeep(this.history[this.currentHistoryIndex]);
      }
    },
    saveDocument(): string {
      return JSON.stringify(this.sections, null, 2);
    },
    async loadDocument(data: string) {
      try {
        this.sections = [];
        this.history = [];
        this.currentHistoryIndex = -1;
        await nextTick();
        this.history = [JSON.parse(data)];
        this.currentHistoryIndex = 0;
        this.sections = useCloneDeep(this.history[0]);
      } catch (e) {
        console.error(`Error! ${e}`);
      }
    },
  },
  getters: {
    getSections: (state) => state.sections,
  },
});
