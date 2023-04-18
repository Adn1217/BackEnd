import { ApiProperty } from "@nestjs/swagger/dist";
export class CreateMessageDto {
    // fecha: string;
    @ApiProperty()
    mensaje: string;
    @ApiProperty()
    usuario: string;
}