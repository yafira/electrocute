import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Contributions from "../components/Contributions";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import PunchCard from "@/components/PunchCard";
import SoftPot from "@/components/SoftPot";
import SoftCircuit from "@/components/SoftCircuit";
import { playFeltTone } from "@/lib/feltTone";
import styles from "@/styles/Home.module.css";

const CIRCUIT_KEY = "electrocute:circuit";

export default function Home() {
  // the circuit's on/off state.
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOn(localStorage.getItem(CIRCUIT_KEY) === "on");
    setReady(true);
  }, []);

  const toggle = () => {
    setOn((current) => {
      const next = !current;
      localStorage.setItem(CIRCUIT_KEY, next ? "on" : "off");
      playFeltTone(next ? 640 : 320);
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>electrocute</title>
      </Head>
      <Header />
      <SoftCircuit on={on} ready={ready} onToggle={toggle} />
      <Container />
      <PunchCard />
      <Contributions />
      <Footer />
      <SoftPot />
    </div>
  );
}
