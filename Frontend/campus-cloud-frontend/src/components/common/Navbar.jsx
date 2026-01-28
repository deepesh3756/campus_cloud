import SiteNavbar from "./SiteNavbar";
import { useAuth } from "../../hooks/useAuth";

// Backwards-compatible wrapper
const Navbar = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    const adminLinks = [
      { label: "Home", to: "/admin" },
      { label: "Assignments", to: "/faculty" },
      { label: "Faculty", to: "/admin/faculty" },
      { label: "Students", to: "/admin/students" },
    ];

    return <SiteNavbar links={adminLinks} brandSuffix="Admin" />;
  }

  return <SiteNavbar />;
};

export default Navbar;
