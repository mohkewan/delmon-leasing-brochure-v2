CREATE TABLE `brochures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectName` varchar(255) NOT NULL,
	`projectType` varchar(100),
	`city` varchar(100),
	`data` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brochures_id` PRIMARY KEY(`id`)
);
