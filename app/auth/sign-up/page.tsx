"use client";

import { Button } from "@/components/ui/button";
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { updateUser } from "@/actions/user/actions/update";
import { UserType } from '@prisma/client'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignUp() {
	const searchParams = useSearchParams()
	const userType = searchParams.get("type")
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState<UserType>(userType ? userType as UserType : "CUSTOMER");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	return (
		<>
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">S'enregistrer</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Entrez vos informations
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<RadioGroup 
						className="mb-2" 
						defaultValue={userType ? userType : "CUSTOMER"} 
						onValueChange={(e) => setType(e as UserType)}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="CUSTOMER" id="customer" />
							<Label className="font-bold" htmlFor="customer">Je suis un acheteur pro</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="SUPPLIER" id="supplier" />
							<Label className="font-bold" htmlFor="supplier">Je suis un fournisseur</Label>
						</div>
					</RadioGroup>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first-name">Prénom</Label>
							<Input
								id="first-name"
								placeholder="Max"
								required
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last-name">Nom</Label>
							<Input
								id="last-name"
								placeholder="Robinson"
								required
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								value={lastName}
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Mot de passe</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="Password"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Confirmer le mot de passe</Label>
						<Input
							id="password_confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder="Confirm Password"
						/>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={loading}
						onClick={async () => {
							await signUp.email({
								email,
								password,
								name: `${firstName} ${lastName}`,
								callbackURL: "/dashboard",
								fetchOptions: {
									onResponse: () => {
										setLoading(false);
									},
									onRequest: () => {
										setLoading(true);
									},
									onError: (ctx) => {
										toast.error(ctx.error.message);
									},
									onSuccess: async () => {
										await updateUser({type: type})
										router.push(type === "CUSTOMER" ? "/suppliers" : "/dashboard");
									},
								},
							});
						}}
					>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							"Create an account"
						)}
					</Button>
				</div>
				<CardFooter>
					<div className="flex justify-center w-full border-t py-4">
						<p className="text-center text-xs text-neutral-500">
							Already have an account ? <Link href={"/auth/sign-in"} className="text-orange-400">sign in here</Link>
						</p>
					</div>
				</CardFooter>
			</CardContent>
		</>
	);
}