"use client"

import { getOrganizationById } from "@/actions/organization/actions";
import MemberForm from "@/components/global/forms/memberForm";
import OrganizationForm from "@/components/global/forms/organizationForm";
import { DrawerDialog } from "@/components/global/modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { memberTypeFull } from "@/actions/members/model";
import { Button } from "@/components/ui/button";
import { deleteMemberToOrganization } from "@/actions/members/actions";
import { toast } from "sonner";

export default function OrganizationCard(props: { organizationId?: string }) {
  const [organization, setOrganization] = useState<any>(null);
  
  const deleteMember = async (member: memberTypeFull) => {
    const result = await deleteMemberToOrganization({
      userId: member.userId,
      organizationId: props.organizationId as string,
    })
    if (result?.data?.success) {
      toast.success("Membre supprimé")
    }
  }

  useEffect(() => {
    const fetchOrganization = async () => {
      if (props.organizationId) {
        const org = await getOrganizationById({organizationId: props.organizationId})
        setOrganization(org?.data?.organization);
      }
    };
    fetchOrganization();
  }, [props.organizationId, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3>
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
          {organization ? organization.name : "Enregistrer votre entreprise"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {organization ? 
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm">Membres</h3>
              <DrawerDialog 
                title="Ajouter un membre" 
                buttonTitle={<Plus/>}
                buttonSize="icon"
                description="Choisissez le nouveau membre"
              >
                {(props) => <MemberForm organizationId={organization.id} setOpen={props.setOpen} />}
              </DrawerDialog>
            </div>
            <ul>
              {organization.members.map((member: memberTypeFull, index: number) => (
                <li 
                  key={index} 
                  className="relative left-0 after::lest-0 flex justify-between border-b overflow-hidden hover:bg-gray-100 hover:[&>.toolBox]:right-0"
                >
                  <div>
                    <p className="text-sm">{member.user.name}</p>
                    <p className="text-xs text-gray-400 italic font-bold">{member.user.email}</p>
                  </div>
                  <p className="text-sm text-gray-400">{member.role.toLowerCase()}</p>
                  <div className="toolBox absolute right-[-100px] bg-gray-100 transition-all delay-75">
                    <DrawerDialog 
                      title="Ajouter un membre" 
                      buttonTitle={<Edit/>}
                      buttonSize="icon"
                      description="Mettre à jour le membre"
                    >
                      {(props) => <MemberForm organizationId={organization.id} setOpen={props.setOpen} member={member} />}
                    </DrawerDialog>
                    <Button variant="destructive" size="icon" className="ml-2" onClick={() => deleteMember(member)}>
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        : 
          <DrawerDialog 
            title="Nouvelle entreprise" 
            buttonTitle="Enregistrer votre entreprise"
            description="Renseignez vos informations"
          >
            {(props) => <OrganizationForm setOpen={props.setOpen} />}
          </DrawerDialog>
        }
      </CardContent>
    </Card>
  )
}