import { IsNumber, IsString, ValidateNested } from 'class-validator';

class CategoryInPostDto {
  @IsString()
  public id: string;
}

class CreatePostDto {
  @IsString()
  public content: string;

  @IsString()
  public title: string;

  @ValidateNested()
  public categories: CategoryInPostDto[];
}

export default CreatePostDto;
