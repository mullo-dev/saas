import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, memberAc, ownerAc } from "better-auth/plugins/organization/access";
 
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
  ...ownerAc.statements
}); 

const customer = ac.newRole({ 
  project: ["create", "update", "delete"], 
  organization: [], 
});

const customerOfInternSupplier = ac.newRole({
  project: ["create", "update", "delete"], 
  organization: ["update", "delete"], 
})

export { ac, member, admin, owner, customer, customerOfInternSupplier }
 