import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  clientName: string;

  @Column()
  productName: string;

  @Column("decimal", { precision: 10, scale: 2 })
  value: number;

  @Column({ default: "Pendente" })
  status: string;

  @CreateDateColumn({ type: "timestamptz" })
  creationDate: Date;
}
