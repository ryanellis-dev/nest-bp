export enum EnumOrgRole {
  Admin = 'Admin',
  Member = 'Member',
}

export type OrgRole = keyof typeof EnumOrgRole;
