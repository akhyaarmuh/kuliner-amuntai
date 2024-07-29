/*
  Warnings:

  - A unique constraint covering the columns `[shop_id,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `description` VARCHAR(150) NULL,
    `shop_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `name_unique`(`shop_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- CreateIndex
CREATE UNIQUE INDEX `name_unique` ON `categories`(`shop_id`, `name`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `product_to_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `product_to_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
