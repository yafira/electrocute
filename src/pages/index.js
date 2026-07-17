import Head from "next/head";
import Header from "@/components/Header";
import Contributions from "../components/Contributions";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import PunchCard from "@/components/PunchCard";
import SoftPot from "@/components/SoftPot";
import SoftCircuit from "@/components/SoftCircuit";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>electrocute</title>
      </Head>
      <Header />
      <SoftCircuit />
      <Container />
      <PunchCard />
      <Contributions />
      <Footer />
      <SoftPot />
    </div>
  );
}
