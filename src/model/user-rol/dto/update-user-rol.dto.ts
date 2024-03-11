import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserRolDto {
    @IsOptional()
    @IsString()
    code: string;
    @IsOptional()
    @IsString()
    description: string;
    @IsOptional()
    @IsBoolean()
    byDefault: boolean;
    @IsOptional()
    @IsArray()
    permissions: string[];
}
