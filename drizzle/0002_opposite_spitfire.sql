CREATE TABLE `brochure_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectName` varchar(255) NOT NULL,
	`status` enum('pending','processing','done','error') NOT NULL DEFAULT 'pending',
	`projectData` json NOT NULL,
	`projectImageUrl` text,
	`pdfUrls` json,
	`pageUrls` json,
	`errorMessage` text,
	`completedPages` int NOT NULL DEFAULT 0,
	`totalPages` int NOT NULL DEFAULT 21,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brochure_jobs_id` PRIMARY KEY(`id`)
);
