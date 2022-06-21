import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseInformation } from '../dtos/BaseInformation';

@Entity()
export class Bookmark extends BaseEntity {
  constructor(obj: Partial<Bookmark>) {
    super();
    Object.assign(this, obj);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({ type: 'simple-json', name: 'information' })
  information: BaseInformation;

  @Column({ type: 'varchar' })
  link: string;
}
