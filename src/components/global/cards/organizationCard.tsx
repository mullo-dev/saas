"use client"

import MemberForm from "@/components/global/forms/memberForm";
import OrganizationForm from "@/components/global/forms/organizationForm";
import { DrawerDialog } from "@/components/global/modal";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Plus, Trash2 } from "lucide-react";
import { memberTypeFull } from "@/actions/members/model";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { removeMember } from "@/actions/members/actions/delete";
import { Badge } from "@/components/ui/badge";

export default function OrganizationCard({ organization }: { organization?: any }) {
  
  const deleteMember = async (memberId: string) => {
    const result = await removeMember({
      memberId: memberId,
      organizationId: organization.id,
    })
    if (result?.data?.success) {
      toast.success("Membre supprimé.")
    } else {
      toast.error("Le membre n'a pas pu être supprimé.")
    }
  }

  return (
    <Card className="sticky top-5 rounded-none shadow-none min-h-[85vh] p-0 border-l-0 border-t-0 border-b-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3 className="text-xl">
            {organization ? organization.name : "Votre entreprise"}
          </h3>
          <DrawerDialog 
            title="Modifier l'entreprise" 
            buttonTitle={<Edit/>}
            buttonSize="icon"
            description="Changez vos informations"
          >
            {(props) => <OrganizationForm setOpen={props.setOpen} organization={organization} />}
          </DrawerDialog>
        </CardTitle>
        <CardDescription>
          {!organization && "Enregistrer votre entreprise"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full">
      {/* add content here (address) */}
      </CardContent>
      {organization &&
          <div className="px-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-md">Membres</h3>
              <DrawerDialog 
                title="Ajouter un membre" 
                buttonTitle={<Plus/>}
                buttonSize="icon"
                description="Choisissez le nouveau membre"
              >
                {(props) => <MemberForm organizationId={organization.id} setOpen={props.setOpen} />}
              </DrawerDialog>
            </div>
            <hr />
            {organization.members.filter((r:any) => r.role !== "customer").map((member: memberTypeFull, index: number) => (
              <div 
                key={index} 
                className="flex justify-between overflow-hidden py-2 my-1"
              >
                <div>
                  <p className="text-sm">
                    {member.user.name}
                    <Badge className="ml-1">{member.role.toLowerCase()}</Badge>
                  </p>
                  <p className="text-xs text-gray-400 italic font-bold">{member.user.email}</p>
                </div>
                <div className="flex gap-1">
                  <DrawerDialog 
                    title={member.user.name}
                    buttonTitle={<Edit/>}
                    buttonSize="icon"
                    description="Mettre à jour le membre"
                  >
                    {(props) => <MemberForm organizationId={organization.id} setOpen={props.setOpen} member={member} />}
                  </DrawerDialog>
                  <Button variant="ghost" size="icon" onClick={() => deleteMember(member.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        }
    </Card>
  )
}