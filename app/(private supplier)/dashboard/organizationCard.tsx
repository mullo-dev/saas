"use client"

import { getOrganizationById } from "@/actions/organization/actions";
import MemberForm from "@/components/global/forms/memberForm";
import OrganizationForm from "@/components/global/forms/organizationForm";
import { DrawerDialog } from "@/components/global/modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrganizationCard(props: { organizationId?: string }) {
  const [organization, setOrganization] = useState<any>(null);
  
  useEffect(() => {
    const fetchOrganization = async () => {
      if (props.organizationId) {
        const org = await getOrganizationById({organizationId: props.organizationId})
        console.log(org)
        setOrganization(org?.data?.organization);
      }
    };
    fetchOrganization();
  }, [props.organizationId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {organization ? organization.name : "Votre entreprise"}
        </CardTitle>
        <CardDescription>
          {organization ? organization.name : "Enregistrer votre entreprise"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {organization ? 
          <div>
            <div className="flex justify-between">
              <h3 className="font-bold text-sm mb-2">Membres</h3>
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
              {organization.members.map((member: { user: { name: string; email: string; }; role: string; }, index: number) => (
                <li key={index} className="flex justify-between border-b pb-1">
                  <div>
                    <p className="text-sm">{member.user.name}</p>
                    <p className="text-xs text-gray-400 italic font-bold">{member.user.email}</p>
                  </div>
                  <p className="text-sm text-gray-400">{member.role.toLowerCase()}</p>
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