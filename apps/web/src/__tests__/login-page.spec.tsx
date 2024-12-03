import { expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "../pages";

vi.mock("next/navigation", () => ({
  useRouter() {
    return { prefetch: () => null, push: () => null };
  },
}));

test("LoginPage", async () => {
  const renderResult = render(<Page />);
  expect(renderResult).toMatchSnapshot();

  const username = screen.getByTestId(
    "username-input__testid"
  ) as HTMLInputElement;
  const password = screen.getByTestId(
    "password-input__testid"
  ) as HTMLInputElement;
  fireEvent.change(username, { target: { value: "admin" } });
  fireEvent.change(password, { target: { value: "12345678" } });
  expect(username.value).toEqual("admin");
  expect(password.value).toEqual("12345678");

  // Failed Login

  vi.spyOn(global, "fetch").mockImplementation(
    () =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 200,
            accessToken: "token",
          }),
      }) as any
  );

  const onsubmit = screen.getByTestId(
    "button-login__testid"
  ) as HTMLButtonElement;
  vi.spyOn(onsubmit, "click");
  fireEvent.click(onsubmit, new MouseEvent("click", { bubbles: true }));

  const navigateToRegister = screen.getByTestId(
    "navigate-register__testid"
  ) as HTMLButtonElement;
  fireEvent.click(
    navigateToRegister,
    new MouseEvent("click", { bubbles: true })
  );
});
