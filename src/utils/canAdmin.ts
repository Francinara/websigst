import React, { useEffect, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
interface CanAdminProps {
  children: ReactNode;
}

const CanAdmin: React.FC<CanAdminProps> = ({ children }) => {
  const navigate = useNavigate();

  const { isAdmin, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/home");
    } else if (loading && !isAdmin) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [navigate, isAdmin, loading]);

  if (loading || isLoading) {
    return null;
  }

  return children;
};

export default CanAdmin;
