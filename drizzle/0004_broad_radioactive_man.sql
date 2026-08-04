CREATE TABLE `project_units` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brochureId` int NOT NULL,
	`unitKey` varchar(64) NOT NULL,
	`unitNumber` varchar(64),
	`floor` varchar(32),
	`area` varchar(32),
	`unitType` varchar(64),
	`description` text,
	`features` text,
	`pricePerMeter` varchar(32),
	`monthlyRent` varchar(32),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_units_id` PRIMARY KEY(`id`)
);
