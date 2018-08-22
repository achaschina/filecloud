// Модель данных
export interface Resource {
  id: number;
  fileUid: string;
  name: string;
  path: string;
  size: number;
  created: Date;
  updated: Date;
  extension: string;
  type: string;
  folder: boolean;
}

