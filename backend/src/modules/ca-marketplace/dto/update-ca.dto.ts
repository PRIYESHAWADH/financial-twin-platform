import { PartialType } from '@nestjs/swagger';
import { CreateCADto } from './create-ca.dto';

export class UpdateCADto extends PartialType(CreateCADto) {}
