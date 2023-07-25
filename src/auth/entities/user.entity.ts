import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'user' })
@Unique('email_unique', ['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'character varying', length: 60 })
    email: string;

    @Column({ type: 'character varying' })
    password: string;

    @Column({ type: 'character varying' })
    salt: string;

    @Column({ type: 'character varying', nullable: true })
    hashedRefreshToken: string | null;
}
