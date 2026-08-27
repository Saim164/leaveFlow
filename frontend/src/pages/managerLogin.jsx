import Login from "../components/login";
import Navbar from "../components/navbar";

function ManagerLogin() {
  return (
    <>
      <Navbar />
      <Login role="manager" />
    </>
  );
}

export default ManagerLogin;
