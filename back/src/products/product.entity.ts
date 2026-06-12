import { CategoryEntity } from "src/categories/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class ProductEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column({ type: 'float', default: 0 })
	price!: number;

	@Column({ default: 0 })
	stock!: number;

	@ManyToOne(() => CategoryEntity, { nullable: true })
	@JoinColumn({ name: 'categoryId' })
	category!: CategoryEntity;

	@Column({ nullable: true })
	categoryId!: number;
}
