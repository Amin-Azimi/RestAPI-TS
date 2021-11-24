import { IsString } from "class-validator";

class CraetePostDto{
    @IsString()
    public author:string;

    @IsString()
    public content:string;

    @IsString()
    public title:string;
}

export default CraetePostDto;