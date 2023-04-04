
import { ApiProperty } from '@nestjs/swagger';


export class ProfessorDto{

    @ApiProperty()
    name: string;

    @ApiProperty()
    login: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    period: number;
}