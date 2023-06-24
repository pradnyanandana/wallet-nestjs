import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1687601393483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE user (
            id INT PRIMARY KEY AUTO_INCREMENT,
            firstName VARCHAR(20) NOT NULL,
            lastName VARCHAR(20) NOT NULL,
            dateOfBirth DATE NOT NULL,
            streetAddress VARCHAR(40) NOT NULL,
            city VARCHAR(20) NOT NULL,
            province VARCHAR(20) NOT NULL,
            telephoneNumber VARCHAR(15) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            registrationDate TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6)
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user`);
  }
}
