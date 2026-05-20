import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, ArrayMinSize, MinLength } from 'class-validator';

/**
 * Bulk-assign a task to multiple students at once.
 *
 * Each student gets a fresh Assignment row with the given title/subject and
 * scores all set to 0 (i.e. "pending evaluation"). The mentor later scores
 * each individually via the per-row PATCH or POST endpoints. This is the
 * "create assignment / task / homework" workflow for mentors.
 */
export class BulkAssignmentDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  studentIds!: string[];

  @ApiProperty({ example: 'Web Development' })
  @IsString()
  subject!: string;

  @ApiProperty({ example: 'Build a personal portfolio site' })
  @IsString()
  @MinLength(2)
  title!: string;
}
