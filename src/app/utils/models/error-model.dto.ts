export interface ErrorModelDto {
  error?: string;
  message?: string;
  path?: string;
  status?: number;
  timestamp?: Date;
  errors?: string[];
}
