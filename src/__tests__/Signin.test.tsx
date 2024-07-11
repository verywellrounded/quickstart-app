import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import SignIn from "../components/Signin";

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it("CheckboxWithLabel changes the text after click", () => {
  render(<SignIn />);

  const authPageTitle = screen.getByText("Authentication Page");
  const signInButton = screen.getByLabelText("Sign Up with Google");

  fireEvent.click(signInButton);

  expect(
    screen.getByLabelText("to continue to new-tritionist.firebaseapp.com")
  ).toBeTruthy();
});
