export enum EnumPostRole {
  Owner = 'Owner',
  Editor = 'Editor',
  Reader = 'Reader',
}

export type PostRole = keyof typeof EnumPostRole;
