import Login from "../components/login";
import Navbar from "../components/navbar";

function EmployeeLogin() {
  return (
    <>
      {" "}
      <Navbar />
      <Login role="employee" />
    </>
  );
}

export default EmployeeLogin;
