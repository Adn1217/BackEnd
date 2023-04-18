import {PartialType} from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from "@nestjs/swagger/dist";

export class updateProductDto extends PartialType (CreateProductDto) {
    @ApiProperty()
    id: string;
}