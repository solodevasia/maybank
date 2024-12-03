import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Page from "../pages/register";

vi.mock("next/router", () => ({
  useRouter() {
    return { prefetch: () => null, push: () => null };
  },
  push: () => null,
}));

test("RegisterPage", async () => {
  const renderResult = render(<Page />);

  expect(renderResult).toMatchSnapshot();

  const name = screen.getByTestId("name-input__testid") as HTMLInputElement;
  const email = screen.getByTestId("email-input__testid") as HTMLInputElement;
  const password = screen.getByTestId(
    "password-input__testid"
  ) as HTMLInputElement;
  const confirmation = screen.getByTestId(
    "confirmation-input__testid"
  ) as HTMLInputElement;
  fireEvent.change(name, { target: { value: "admin" } });
  fireEvent.change(email, { target: { value: "admin@admin.com" } });
  fireEvent.change(password, { target: { value: "12345678" } });
  fireEvent.change(confirmation, { target: { value: "12345678" } });

  expect(name.value).toEqual("admin");
  expect(email.value).toEqual("admin@admin.com");
  expect(password.value).toEqual("12345678");
  expect(confirmation.value).toEqual("12345678");

  vi.spyOn(global, "fetch").mockImplementation(
    () =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 201,
            message: "Account has been created",
          }),
      }) as any
  );

  const submit = screen.getByTestId(
    "button-register__testid"
  ) as HTMLButtonElement;
  fireEvent.click(submit, new MouseEvent("click", { bubbles: true }));

  // Invalid Email

  fireEvent.change(email, { target: { value: "admindqwdqw" } });
  expect(email.value).toEqual("admindqwdqw");

  const invalidEmail = screen.getByTestId(
    "message-invalid-email__testid"
  ) as HTMLSpanElement;
  expect(invalidEmail.textContent).toContain("Invalid email address");

  fireEvent.change(confirmation, { target: { value: "12321mkmdqw" } });
  const passwordDontMatch = screen.getByTestId(
    "message-password-dont-match__testid"
  ) as HTMLSpanElement;
  expect(passwordDontMatch.textContent).toContain(
    "Password don't match, please check again"
  );
});
