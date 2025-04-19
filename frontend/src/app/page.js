import MarketplaceHome from "@/components/MarketPlaceHome";
import Image from "next/image";
import { AuthProvider } from "@/contexts/AuthContext";
export default function Home() {
  return (
    <AuthProvider>
      <MarketplaceHome />
    </AuthProvider>
  );
}
