import { ConversationDrawer } from "./conversationDrawer";

export function CustomerSection({ organization }: { organization?: any }) {

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-md">Vos clients</h4>
      </div>
      <hr />
      <ul className="mt-2">
        {organization.members.filter((m:any) => m.role === "customer").map((member:any, index:number) => (
          <li key={index} className="flex justify-between items-center">
            <p>{member.user.name} - {member.user.email}</p>
            <ConversationDrawer receipt={member.user} />
          </li>
        ))}
      </ul>
    </div>
  )
}