import Users from "./users";
import Pages from "./pages";
import { relations } from "drizzle-orm";

// Users와 Pages 모델의 관계 정의
export const usersRelations = relations(Users, ({ many }) => ({
  posts: many(Pages), // Users가 여러 Posts와 관련
}));

export const pagesRelations = relations(Pages, ({ one }) => ({
  author: one(Users, {
    fields: [Pages.userId],
    references: [Users.userId],
  }), // Pages가 하나의 User와 관련
}));

export default {
  Users,
  Pages,
  usersRelations,
  pagesRelations,
};
