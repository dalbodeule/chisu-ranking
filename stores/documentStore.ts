import type { Section } from "@/components/Section.vue"

export const useDocumentStore = defineStore('document', {
    state: () => ({
        sections: [] as Section[],
    }),
    actions: {
        addSection(section: Section) {
            this.sections.push(section)
        },
        updateSection(index: number, section: Section) {
            this.sections[index] = section
        },
        removeSection(index: number) {
            this.sections.splice(index, 1)
        },
        saveDocument(): string {
            return JSON.stringify(this.sections, null, 2)
        },
        loadDocument(data: string) {
            try {
                this.sections = JSON.parse(data)
            } catch(e) {
                console.error(`Error! ${e}`)
            }
        }
    },
    getters: {
        getSections: (state) => state.sections
    }
})