import { IsOptional } from 'class-validator';

export class CreateTagDto {
    @IsOptional()
    name: string;
    @IsOptional()
    color: string;
}