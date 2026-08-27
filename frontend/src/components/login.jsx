import { useState } from "react";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isRegistering) {
    return (
      <>
        <h2>Login</h2>
        <form action="">
          <input type="text" placeholder="Enter your email" />
          <input type="password" placeholder="Enter your password" />
          <button>submit</button>
        </form>
        <p>
          Dont have an accout?{" "}
          <button
            onClick={() => {
              setIsRegistering(true);
            }}
          >
            Sign up
          </button>
        </p>
      </>
    );
  }
  return (
    <>
      <h2>Register</h2>{" "}
      <form action="">
        <input type="text" placeholder="Enter your name" />

        <input type="text" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <button>submit</button>
      </form>
      <p>
        Already have an account?{" "}
        <button
          onClick={() => {
            setIsRegistering(false);
          }}
        >
          Login
        </button>
      </p>{" "}
    </>
  );
}

export default Login;
