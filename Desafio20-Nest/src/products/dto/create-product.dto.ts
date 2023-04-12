export class CreateProductDto {
    code: string;
    title: string;
    description: string;
    price: GLfloat;
    stock: number;
    thumbnail: string
}