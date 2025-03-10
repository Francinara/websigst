import React, { useEffect, useState, ReactNode } from "react";
import { parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";

interface CanGuestProps {
  children: ReactNode;
}

const CanGuest: React.FC<CanGuestProps> = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const cookies = parseCookies();

  useEffect(() => {
    if (cookies["@websig.token"]) {
      navigate("/home");
    } else {
      setLoading(false);
    }
  }, [cookies, navigate]);

  if (loading) {
    return null;
  }

  return children;
};

export default CanGuest;
