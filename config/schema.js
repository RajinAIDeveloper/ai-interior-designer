import { integer, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const Users_schema = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    imageUrl: varchar('imageUrl').notNull(),
    credits: integer('credits').default(0)
});

export const AiGeneratedImage = pgTable('ai_generated_images', {
    id: serial('id').primaryKey(),
    roomType: varchar('roomType').notNull(),
    designType: varchar('designType').notNull(),
    orgImage: varchar('orgImage').notNull(),
    aiImage: varchar('aiImage').notNull(),
    userEmail: varchar('userEmail').notNull(),
    createdAt: timestamp('createdAt').defaultNow()
});