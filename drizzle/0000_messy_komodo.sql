CREATE TABLE `appointements` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'test',
	`date` text NOT NULL,
	`startTime` text NOT NULL,
	`endTime` text NOT NULL,
	`servive` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
