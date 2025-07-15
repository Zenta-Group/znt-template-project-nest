import { PartialType } from '@nestjs/swagger';
import { CreateGenericDto } from './create-generic.dto';


export class UpdateGenericDto extends PartialType(CreateGenericDto) {}
