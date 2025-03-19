import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Spinner } from "flowbite-react";

const ProtectedLayout = () => {
  const { user, loading } = useContext(AuthContext);

  console.log(user, 'user from protected layout');
  

  if (loading) return (
    <div className="flex flex-wrap gap-2 justify-center w-full h-svh items-center">
      <div className="text-center">
        <Spinner aria-label="Center-aligned spinner example" size="lg" />
      </div>
    </div>
  )

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedLayout;
