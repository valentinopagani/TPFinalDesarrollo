import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export type Category = {
	id: number;
	name: string;
};

export class CreateCategoryInput {
	@IsString()
	@MinLength(1)
	@MaxLength(128)
	name!: string;
}

export class UpdateCategoryInput {
	@IsString()
	@MinLength(1)
	@MaxLength(128)
	@IsOptional()
	name?: string;
}
