import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1700000000000 implements MigrationInterface {
  name = "InitialMigration1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`name\` varchar(255) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)
            ) ENGINE=InnoDB
        `);

    // Create posts table
    await queryRunner.query(`
            CREATE TABLE \`posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`content\` text NOT NULL,
                \`postId\` text NOT NULL,
                \`platform\` enum('linkedin', 'twitter', 'facebook', 'instagram') NOT NULL,
                \`scheduledAt\` datetime NOT NULL,
                \`status\` enum('draft', 'scheduled', 'published', 'failed') NOT NULL DEFAULT 'draft',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`posts\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
