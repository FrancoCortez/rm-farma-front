import { ProductResourceDto } from '../product/product-resource.dto';
import { MasterOrderResourceDto } from '../master-order/master-order-resource.dto';

export class MasterOrderDetailsResourceDto {
  id?: string;
  productName?: string;
  productCode?: string;
  productLaboratory?: string;
  parting?: string;
  realPart?: string;
  quantity?: number;
  batch?: string;
  observation?: string;
  product?: ProductResourceDto;
  masterOrder?: MasterOrderResourceDto;
}
