import styles from "../styles/Icons.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

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
        <Image
          src="/assets/pen.png"
          alt=""
          width={s}
          height={s}
          aria-hidden="true"
        />
      </Link>
      <Link
        href="https://electrocute.substack.com/"
        title="substack"
        aria-label="substack"
      >
        <Image
          src="/assets/substack.png"
          alt=""
          width={s}
          height={s}
          aria-hidden="true"
        />
      </Link>
      <Link href="https://github.com/Yafira" title="github" aria-label="github">
        <Image
          src="/assets/github.png"
          alt=""
          width={s}
          height={s}
          aria-hidden="true"
        />
      </Link>
      <Link
        href="https://www.instagram.com/electrocutelab/"
        title="instagram"
        aria-label="instagram"
      >
        <Image
          src="/assets/instagram.png"
          alt=""
          width={s}
          height={s}
          aria-hidden="true"
        />
      </Link>
      <Link
        href="https://yafira.xyz/"
        title="electrocute-online"
        aria-label="personal website"
      >
        <Image
          src="/assets/globe.png"
          alt=""
          width={s}
          height={s}
          aria-hidden="true"
        />
      </Link>
      <Link
        href="https://www.figma.com/@electrocute"
        title="figma"
        aria-label="figma"
      >
        <Image
          src="/assets/figma.png"
          alt=""
          width={s}
          height={s}
          aria-hidden="true"
        />
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
        <Image
          src="/assets/pin.png"
          alt=""
          width={s}
          height={s}
          aria-hidden="true"
        />
      </Link>
      <Link
        href="mailto:electrocutelab@protonmail.com"
        title="email"
        aria-label="email"
      >
        <Image
          src="/assets/email.png"
          alt=""
          width={large}
          height={large}
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
