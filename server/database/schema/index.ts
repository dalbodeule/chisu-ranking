import Users from './users'
import Pages from './pages'
import {relations} from "drizzle-orm";

export default {
    Users,
    Pages
}

export const usersRelations = relations(Users, ({ many }) => ({
    posts: many(Pages)
}))

export const pagesRelations = relations(Pages, ({ one }) => ({
    author: one(Users, {
        fields: [Pages.userId],
        references: [Users.userId]
    })
}))