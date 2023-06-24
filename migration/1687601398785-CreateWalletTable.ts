import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWalletTable1687601398785 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE wallet (
            id INT PRIMARY KEY AUTO_INCREMENT,
            address VARCHAR(255) NOT NULL UNIQUE,
            user_id INT NOT NULL,
            balance INT NOT NULL DEFAULT 0,
            CONSTRAINT FK_wallet_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE wallet`);
  }
}
