import { IsString, MaxLength, MinLength } from "class-validator";

export type Category = {
	id: number;
	name: string;
};

export class CreateCategoryInput {
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	name!: string;
}

export class UpdateCategoryInput {
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	name?: string;
}
