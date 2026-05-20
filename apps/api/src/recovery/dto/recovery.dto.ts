import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, IsUUID, IsUrl, Max, Min, MinLength } from 'class-validator';

export class AssignRecoveryDto {
  @ApiProperty()
  @IsUUID()
  studentId!: string;

  @ApiProperty({ example: 'Volunteer 5 hours at the university open day' })
  @IsString()
  @MinLength(5)
  assignedTask!: string;

  /** Optional URL to a material / brief / form (Cloudinary upload, doc, etc.). */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  materialUrl?: string;
}

export class BulkAssignRecoveryDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  studentIds!: string[];

  @ApiProperty()
  @IsString()
  @MinLength(5)
  assignedTask!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  materialUrl?: string;
}

export class CompleteRecoveryDto {
  @ApiProperty({ required: false, minimum: 0, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  recoveredPoints?: number;
}

export class RejectRecoveryDto {
  @ApiProperty()
  @IsString()
  reason!: string;
}
