import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class HistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  donatorId: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar' })
  text: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;

  constructor(partialHistory?: Partial<HistoryEntity>) {
    partialHistory && Object.assign(this, partialHistory);
  }
}
