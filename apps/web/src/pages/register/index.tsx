import React from "react";
import Image from "next/image";
import Wallpaper from "../../assets/Wallpaper.svg";
import accountIcon from "../../assets/account.svg";
import lockIcon from "../../assets/lock.svg";
import Input from "@maybank/shared/input";
import { Button } from "@maybank/shared/button";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [state, setState] = React.useState({
    name: "",
    email: "",
    pic: "",
    role: 0,
    password: "",
    confirmation: "",
  });
  const [invalidEmail, setInvalidEmail] = React.useState(false);
  const [passwordDontMatch, setPasswordDontMatch] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));

    if (event.target.name === "email") {
      if (
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          event.target.value
        )
      ) {
        setInvalidEmail(() => false);
      } else setInvalidEmail(() => true);
    }
  }

  async function onSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDisabled(() => true);
    setLoading(() => true);
    setError(() => null);
    setSuccess(() => null);
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    }).then(async (res) => {
      const data = await res.json();
      if (data.status <= 201) {
        setSuccess(() => data.message);
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
      if (data.status > 201) {
        setError(() => data.message);
        setLoading(() => false);
        setDisabled(() => false);
      }
    });
  }

  React.useEffect(() => {
    let disabled = true;
    if (state.name && state.email && state.password && state.confirmation) {
      disabled = false;
    }

    if (state.password && state.confirmation) {
      if (state.password !== state.confirmation) {
        setPasswordDontMatch(() => true);
        disabled = true;
      } else setPasswordDontMatch(() => false);
    }
    setDisabled(() => disabled);
  }, [state]);

  return (
    <div className="flex items-center justify-center h-[100vh]">
      {error || success ? (
        <div
          className={`fixed top-0 left-0 w-full p-4 text-white font-poppins text-center ${success ? "bg-green-500" : ""} ${error ? "bg-red-500" : ""}`}
        >
          {error || success}
        </div>
      ) : null}
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div>
          <div className="w-full text-center leading-[60px]">
            <div className="text-[120px] font-bold text-black font-smooch">
              Join Us
            </div>
            <span className="text-[14px] font-poppins">
              We are glad you want to join us.
            </span>
          </div>
          <div className="mt-2">
            <Input
              id="name-input__testid"
              type="text"
              name="name"
              placeholder="Username"
              value={state.name}
              onChange={onChange}
              icon={
                <Image
                  src={accountIcon}
                  alt={accountIcon}
                  className="w-[24px] h-[24px] mr-2"
                />
              }
            />
          </div>
          <div className="mt-6">
            <Input
              id="email-input__testid"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={state.email}
              onChange={onChange}
              icon={
                <Image
                  src={accountIcon}
                  alt={accountIcon}
                  className="w-[24px] h-[24px] mr-2"
                />
              }
            />
            {invalidEmail ? (
              <span
                id="message-invalid-email__testid"
                data-testid="message-invalid-email__testid"
                className="text-xs text-red-500 ml-2 mt-1"
              >
                Invalid email address
              </span>
            ) : null}
          </div>
          <div className={invalidEmail ? "mt-4" : "mt-6"}>
            <Input
              type="password"
              id="password-input__testid"
              name="password"
              placeholder="Password"
              value={state.password}
              onChange={onChange}
              icon={
                <Image
                  src={lockIcon}
                  alt={lockIcon}
                  className="w-[24px] h-[24px] mr-2"
                />
              }
            />
          </div>
          <div className="mt-6">
            <Input
              type="password"
              id="confirmation-input__testid"
              name="confirmation"
              placeholder="Confirmation"
              value={state.confirmation}
              onChange={onChange}
              icon={
                <Image
                  src={lockIcon}
                  alt={lockIcon}
                  className="w-[24px] h-[24px] mr-2"
                />
              }
            />
            {passwordDontMatch ? (
              <span
                id="message-password-dont-match__testid"
                data-testid="message-password-dont-match__testid"
                className="text-xs text-red-500 ml-2 mt-1"
              >
                Password don't match, please check again
              </span>
            ) : null}
          </div>
          <div
            className={`flex items-center justify-center mt-${passwordDontMatch ? "4" : "6"}`}
          >
            <Button
              id="button-register__testid"
              type="button"
              disabled={disabled}
              loading={loading}
              onClick={onSubmit}
            >
              <span>Next</span>
            </Button>
          </div>
          <div className="text-center mt-7 font-poppins">
            You Don't have an account ?{" "}
            <span
              className="cursor-pointer hover:text-blue-500 hover:underline"
              onClick={() => router.push("/")}
            >
              Log in
            </span>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Image src={Wallpaper} alt={Wallpaper} />
      </div>
    </div>
  );
}
