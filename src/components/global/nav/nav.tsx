"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LoaderCircle, UserCircle2 } from "lucide-react"
import SignOutButton from "../buttons/signOutButton";

const customerMenu: { title: string; href: string; description: string }[] = [
  {
    title: "Mes fournisseurs",
    href: "/suppliers",
    description:
      "Gérer mes fournisseurs et passer commande.",
  },
  {
    title: "Mes commandes",
    href: "/orders",
    description:
      "Toutes mes commandes passées.",
  }
]

const supplierMenu: { title: string; href: string; description: string }[] = [
  {
    title: "Mon entreprise",
    href: "/dashboard",
    description:
      "Mon tableau de bord.",
  },
  {
    title: "Mes ventes",
    href: "/dashboard/orders",
    description:
      "Tout l'historique de mes ventes.",
  }
]

export function Navigation(props: {
  user?: any
}) {
  const [pending, setPending] = React.useState(true)

  if (!props.user) {
    setTimeout(() => {
      setPending(false)
    }, 400)
  }

  if (pending) {
    return <LoaderCircle className="animate-spin mt-2" />
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {props.user ?
          <>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex flex-col gap-2 w-60">
                  {props.user.type === "CUSTOMER" ? customerMenu.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))
                  :
                  supplierMenu.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger><UserCircle2 /></NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex flex-col gap-2 w-60">
                  {props.user.type === "SUPPLIER" && <ListItem
                    title="Mon entreprise"
                    href="/dashboard"
                  />}
                  <ListItem
                    title="Mon compte"
                    href="/profil"
                  >
                    {props.user.email}
                  </ListItem>
                  <SignOutButton className="w-full" variant="destructive" />
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        :
          <NavigationMenuItem className="flex gap-2">
            <NavigationMenuItem>
              <Link href="/auth/sign-up" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  S'inscrire
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/auth/sign-in" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Se connecter
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuItem>
        }

      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary-300 focus:bg-secondary-500",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
