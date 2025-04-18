import { createAccessControl } from "better-auth/plugins/access";
import { defaultRoles } from "better-auth/plugins";
 
const statement = {
    project: ["create", "share", "update", "delete"],
} as const;
 
const ac = createAccessControl(statement);
 
const customer = ac.newRole({ 
  project: ["create", "update", "delete"],
}); 

export const roles = {
  ...defaultRoles,
  customer,
}

export { ac }