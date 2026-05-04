import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import ForRetailers from "@/components/ForRetailers";
import ForCustomers from "@/components/ForCustomers";
import ApnaScore from "@/components/ApnaScore";
import Cities from "@/components/Cities";
import Partner from "@/components/Partner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <ForRetailers />
      <ForCustomers />
      <ApnaScore />
      <Cities />
      <Partner />
      <Footer />
    </main>
  );
}
