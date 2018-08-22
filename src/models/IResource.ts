// Модель данных
export interface Resource {
  id: number;
  fileUid: string;
  name: string;
  path: string;
  size: number;
  created: any;
  updated: any;
  extension: string;
  type: string;
  folder: boolean;
}

