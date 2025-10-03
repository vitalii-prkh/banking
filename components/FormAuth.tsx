"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {standardSchemaResolver} from "@hookform/resolvers/standard-schema";
import {Loader2} from "lucide-react";
import {ROUTES} from "@/constants/routes";
import {schemaAuthForm, FormAuthValues} from "@/lib/utils";
import {signIn, signUp} from "@/lib/actions/user.actions";
import {Form} from "@/components/ui/form";
import {CustomInput} from "@/components/CustomInput";
import {Button} from "@/components/ui/button";

type FormAuthProps = {
  type: "sign-up" | "sign-in";
};

export function FormAuth(props: FormAuthProps) {
  const router = useRouter();
  const [user, setUser] = React.useState<FormAuthValues | null>(null);
  const schema = React.useMemo(() => schemaAuthForm(props.type), [props.type]);
  const form = useForm<FormAuthValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
      email: "",
      password: "",
    },
    resolver: standardSchemaResolver(schema),
  });
  const handleSubmit = async (values: FormAuthValues) => {
    try {
      if (props.type === "sign-up") {
        const userData = {
          firstName: values.firstName!,
          lastName: values.lastName!,
          address1: values.address1!,
          city: values.city!,
          state: values.state!,
          postalCode: values.postalCode!,
          dateOfBirth: values.dateOfBirth!,
          ssn: values.ssn!,
          email: values.email,
          password: values.password,
        };

        const newUser = await signUp(userData);

        if (newUser) {
          setUser(newUser);
        }
      }

      if (props.type === "sign-in") {
        const response = await signIn({
          email: values.email,
          password: values.password,
        });

        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          href={ROUTES.HOME}
          className="flex cursor-pointer items-center gap-1"
        >
          <Image
            src="/icons/logo.svg"
            alt="Horizon Logo"
            width={34}
            height={34}
          />
          <h1 className="text-26 font-ibm-plex-serif text-black-1 font-bold">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 text-gray-9000 font-semibold">
            {user
              ? "Link Account"
              : props.type === "sign-in"
                ? "Sign In"
                : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user && (
        <div className="flex flex-col gap-4">{/* Plaid link component */}</div>
      )}
      {!user && (
        <React.Fragment>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-8"
            >
              {props.type === "sign-up" && (
                <React.Fragment>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Example: NY"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="Example: 1234"
                    />
                  </div>
                </React.Fragment>
              )}
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="form-btn"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />{" "}
                      &nbsp; Loading...
                    </>
                  ) : props.type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {props.type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={props.type === "sign-in" ? ROUTES.SIGN_UP : ROUTES.SIGN_IN}
              className="form-link"
            >
              {props.type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </React.Fragment>
      )}
    </section>
  );
}
