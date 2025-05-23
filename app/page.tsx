import { UserTypeEnum } from "@/actions/user/model";
import LittleCard from "@/components/global/cards/littleCard";
import { Header } from "@/components/global/header/header";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth-session";
import { Boxes, Files, Group, Link2, UserPlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const CustomersInfos = [
  {
    title: "Regroupez vos fournisseurs",
    subTitle: "Tous le monde sur une même plateforme.",
    ico: <Group />
  },
  {
    title: "Triez et commandez",
    subTitle: "Tous les produits disponibles dans un même tableau.",
    ico: <Files />
  },
  {
    title: "Facilitez votre quotidien",
    subTitle: "Connectez Mullo à vos outils préférés.",
    ico: <Link2 />
  }
]

const SuppliersInfos = [
  {
    title: "Regroupez vos fournisseurs",
    subTitle: "Tous le monde sur une même plateforme.",
    ico: <Boxes />
  },
  {
    title: "Invitez vos clients",
    subTitle: "Donnez l'accès à vos catalogues et gérez vos tarifs.",
    ico: <UserPlus />
  },
  {
    title: "Facilitez votre quotidien",
    subTitle: "Connectez Mullo à vos outils préférés.",
    ico: <Link2 />
  }
]


export default async function Home() {
  const user = await getUser()

  if (user?.user) {
    if (user.user?.type === UserTypeEnum.CUSTOMER) {
      return redirect("/suppliers")
    } else {
      return redirect("/dashboard")
    }
  }

  return (
    <div className="">
      <Header />
      <div className="container mx-auto px-5 sm:px-0">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-10">
          <SignUpCard
            link="/auth/sign-up?type=CUSTOMER"
            title="Rassemblez vos fournisseurs"
            subTitle="Importez les catalogues de vos fournisseurs ou connectez-vous à leur compte et faites vos commandes d'un seul outil."
            buttonVariant="secondary"
            className="bg-primary text-white"
            src="/maquette-customers.png"
          />
          <SignUpCard
            link="/auth/sign-up?type=SUPPLIER"
            title="Connectez vous à vos clients"
            subTitle="Importez vos mercuriales et invité vos clients à les consulter. Personnalisez vos prix et gérez vos bons de commande."
            buttonVariant="default"
            className="bg-secondary-800 text-primary"
            src="/maquette-suppliers.png"
          />
        </div>

        <div className="mt-28">
          <div className="col-span-2 text-primary text-center">
            <h1 className="text-4xl font-bold mb-2">
              Pourquoi utiliser l'outil de commande Mullo ?
            </h1>
            <h5 className="text-lg">Toutes vos commandes au même endroit !</h5>
          </div>

          {/* FOR CUSTOMER */}
          <div className="md:flex justify-center items-center mt-14">
            <div className="mb-5 md:mb-0">
              <img
                src="/maquette-suppliers.png"
                className="w-3/4 mx-auto"
              />
            </div>
            <div className="w-3/4 md:w-auto mx-auto">
              <h5 className="font-bold text-lg mb-3">Pour les acheteurs</h5>
              {CustomersInfos.map((item:any, index:number) => (
                <LittleCard 
                  key={index}
                  title={item.title}
                  subTitle={item.subTitle}
                  ico={item.ico}
                  color="primary"
                />
              ))}
            </div>
          </div>

          {/* FOR SUPPLIER */}
          <div className="flex flex-col-reverse md:flex-row justify-center items-center mt-20">
            <div className="w-3/4 md:w-auto mx-auto">
              <h5 className="font-bold text-lg mb-3">Pour les fournisseurs</h5>
              {SuppliersInfos.map((item:any, index:number) => (
                <LittleCard 
                  key={index}
                  title={item.title}
                  subTitle={item.subTitle}
                  ico={item.ico}
                  color="secondary"
                />
              ))}
            </div>
            <div className="mb-5 md:mb-0">
              <img
                src="/maquette-suppliers.png"
                className="w-3/4 mx-auto"
              />
            </div>
          </div>
        </div>

        <div className="mt-36 bg-primary-800 rounded-xl p-10 flex gap-5">
          <div>
            <h3 className="font-bold text-5xl w-80 text-white mb-5">Nos tarifs</h3>
            <Link href="/auth/sign-up">
              <Button variant="secondary" size="lg">
                J'en profite
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div className="bg-secondary-500 p-5 flex-1 rounded-lg text-primary">
              <h3 className="font-bold text-3xl mb-2">Offre gratuite</h3>
              <p className="text-lg">Notre logiciel est en phase de lancement aussi vous pouvez en bénéficier gratuitement pendant 6 mois.</p>
            </div>
          </div>
        </div>

        <div className="mt-20"></div>

      </div>
    </div>
  );
}


function SignUpCard(props: {
  link: string
  title: string
  subTitle: string
  buttonVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "ghostMuted" | null | undefined
  className: string
  src: string
}) {

  return (
    <div className={`text-center rounded-lg px-5 py-10 ${props.className}`}>
      <img 
        src={props.src} 
        alt="fournisseurs" 
        className="w-full sm:w-2/3 md:w-1/2 mx-auto mb-10"
      />
      <h3 className="text-center text-3xl font-bold mb-3">
        {props.title}
      </h3>
      <h4 className="text-center font-bold text-md">
        {props.subTitle}
      </h4>
      <Link href="/auth/sign-up?type=CUSTOMER">
        <Button variant={props.buttonVariant} size="lg" className="w-1/2 mt-10 text-white">
          Je m'inscris
        </Button>
      </Link>
    </div>
  )
}
