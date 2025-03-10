import React, { useEffect, useState, ReactNode } from "react";
import { parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";

interface CanAuthProps {
  children: ReactNode;
}

const CanAuth: React.FC<CanAuthProps> = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const cookies = parseCookies();
  const token = cookies["@websig.token"];

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      setLoading(false);
    }
  }, [token, navigate]);

  if (loading) {
    return null;
  }

  return children;
};

export default CanAuth;
