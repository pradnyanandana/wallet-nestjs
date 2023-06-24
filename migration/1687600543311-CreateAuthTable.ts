import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTable1687600543311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth (
        id int NOT NULL AUTO_INCREMENT,
        token varchar(255) NOT NULL,
        user_id int NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY UK_auth_token (token),
        CONSTRAINT FK_auth_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE auth
    `);
  }
}
