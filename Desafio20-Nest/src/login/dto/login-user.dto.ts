import { ApiProperty } from "@nestjs/swagger/dist/decorators";
export class LoginUserDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}