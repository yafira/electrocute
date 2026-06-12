import styles from "../styles/Icons.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import pen from "../assets/pen.png";
import substack from "../assets/substack.png";
import github from "../assets/github.png";
import ig from "../assets/instagram.png";
import fig from "../assets/figma.png";
import pinterest from "../assets/pin.png";
import email from "../assets/email.png";
import online from "../assets/globe.png";

export default function Icons({ size = 25 }) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const s = mobile ? Math.round(size * 0.7) : size;
  const large = Math.round(s * 1.2);

  return (
    <div className={styles.Icons}>
      <Link href="http://blog.electrocute.io/" title="blog" aria-label="blog">
        <Image src={pen} alt="" width={s} height={s} aria-hidden="true" />
      </Link>
      <Link
        href="https://electrocute.substack.com/"
        title="substack"
        aria-label="substack"
      >
        <Image src={substack} alt="" width={s} height={s} aria-hidden="true" />
      </Link>
      <Link href="https://github.com/Yafira" title="github" aria-label="github">
        <Image src={github} alt="" width={s} height={s} aria-hidden="true" />
      </Link>
      <Link
        href="https://www.instagram.com/electrocutelab/"
        title="instagram"
        aria-label="instagram"
      >
        <Image src={ig} alt="" width={s} height={s} aria-hidden="true" />
      </Link>
      <Link
        href="https://yafira.xyz/"
        title="electrocute-online"
        aria-label="personal website"
      >
        <Image src={online} alt="" width={s} height={s} aria-hidden="true" />
      </Link>
      <Link
        href="https://www.figma.com/@electrocute"
        title="figma"
        aria-label="figma"
      >
        <Image src={fig} alt="" width={s} height={s} aria-hidden="true" />
      </Link>
      <Link href="https://www.are.na/yafira/" title="arena" aria-label="are.na">
        <Image
          src="https://goligorsky.neocities.org/logo-arena.svg"
          alt=""
          width={large}
          height={large}
          aria-hidden="true"
        />
      </Link>
      <Link
        href="https://www.pinterest.com/electr0cute"
        title="pinterest"
        aria-label="pinterest"
      >
        <Image src={pinterest} alt="" width={s} height={s} aria-hidden="true" />
      </Link>
      <Link
        href="mailto:electrocutelab@protonmail.com"
        title="email"
        aria-label="email"
      >
        <Image
          src={email}
          alt=""
          width={large}
          height={large}
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
