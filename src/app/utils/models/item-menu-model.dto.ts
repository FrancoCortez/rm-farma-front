export interface ItemMenuModelDto {
  label?: string;
  items?: ItemMenuModelDto[];
  icon?: string;
  url?: string[];
  badge?: string;
  target?: string;
  routerLink?: string[];
  visible?: boolean;
  separator?: any;
  position?: number;
  routerLinkActiveOptions?: {
    paths: 'subset';
    queryParams: 'ignored';
    matrixParams: 'ignored';
    fragment: 'ignored';
  };
}
