import { ApiProperty } from "@nestjs/swagger/dist";
export class CreateProductDto {
    @ApiProperty()
    code: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    price: GLfloat;
    @ApiProperty()
    stock: number;
    @ApiProperty()
    thumbnail: string
}