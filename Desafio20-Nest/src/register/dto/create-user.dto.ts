import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    mail: string;
    @ApiProperty()
    tel: string;
    @ApiProperty()
    edad: number;
    @ApiProperty()
    avatar: string
    @ApiProperty()
    password: string;
}