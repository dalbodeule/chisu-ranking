CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text,
	`content` text,
	`created_at` integer DEFAULT (STRFTIME('%s')) NOT NULL,
	`updated_at` integer DEFAULT (STRFTIME('%s')) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text(32) NOT NULL,
	`name` text(80) NOT NULL,
	`created_at` integer DEFAULT (STRFTIME('%s')) NOT NULL,
	`updated_at` integer DEFAULT (STRFTIME('%s')) NOT NULL
);
