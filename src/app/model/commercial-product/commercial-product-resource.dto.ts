import { CommercialFactorResourceDto } from './commercial-factor-resource.dto';
import { ProductResourceDto } from '../product/product-resource.dto';

export class CommercialProductResourceDto {
  id?: string;
  code?: string;
  description?: string;
  laboratory?: string;
  createdDate?: Date;
  lastModifiedDate?: Date;
  factors?: Array<CommercialFactorResourceDto>;
  product?: ProductResourceDto;
}
