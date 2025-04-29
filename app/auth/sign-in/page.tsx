import SignInForm from "../../../src/components/global/forms/signInForm";

export default function SignIn() {

  return (
    <SignInForm redirectPath={"/dashboard"} />
  );
}