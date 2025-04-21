import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, memberAc } from "better-auth/plugins/organization/access";
 
const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({ 
  ...memberAc.statements,
}); 

const admin = ac.newRole({ 
  ...adminAc.statements
}); 

const owner = ac.newRole({ 
  ...adminAc.statements
}); 

const customer = ac.newRole({ 
  project: ["create", "update", "delete"], 
  organization: [], 
}); 

export { ac, member, admin, owner, customer }
 