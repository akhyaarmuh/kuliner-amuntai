-- CreateTable
CREATE TABLE `addresses` (
    `shop_id` INTEGER NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `street` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(5) NOT NULL,

    PRIMARY KEY (`shop_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `address_to_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
