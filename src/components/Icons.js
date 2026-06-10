import styles from "../styles/Icons.module.css";
import Link from "next/link";
import Image from "next/image";
import pen from "../assets/pen.png";
import substack from "../assets/substack.png";
import github from "../assets/github.png";
import ig from "../assets/instagram.png";
import fig from "../assets/figma.png";
import pinterest from "../assets/pin.png";
import email from "../assets/email.png";
import online from "../assets/globe.png";

export default function Icons() {
  return (
    <div className={styles.Icons}>
      <Link href="http://blog.electrocute.io/" title="blog" aria-label="blog">
        <Image src={pen} alt="" width={25} height={25} aria-hidden="true" />
      </Link>
      <Link
        href="https://electrocute.substack.com/"
        title="substack"
        aria-label="substack"
      >
        <Image
          src={substack}
          alt=""
          width={25}
          height={25}
          aria-hidden="true"
        />
      </Link>
      <Link href="https://github.com/Yafira" title="github" aria-label="github">
        <Image src={github} alt="" width={25} height={25} aria-hidden="true" />
      </Link>
      <Link
        href="https://www.instagram.com/electrocutelab/"
        title="instagram"
        aria-label="instagram"
      >
        <Image src={ig} alt="" width={25} height={25} aria-hidden="true" />
      </Link>
      <Link
        href="https://yafira.xyz/"
        title="electrocute-online"
        aria-label="personal website"
      >
        <Image src={online} alt="" width={25} height={25} aria-hidden="true" />
      </Link>
      <Link
        href="https://www.figma.com/@electrocute"
        title="figma"
        aria-label="figma"
      >
        <Image src={fig} alt="" width={25} height={25} aria-hidden="true" />
      </Link>
      <Link href="https://www.are.na/yafira/" title="arena" aria-label="are.na">
        <Image
          src="https://goligorsky.neocities.org/logo-arena.svg"
          alt=""
          width={30}
          height={30}
          aria-hidden="true"
        />
      </Link>
      <Link
        href="https://www.pinterest.com/electr0cute"
        title="pinterest"
        aria-label="pinterest"
      >
        <Image
          src={pinterest}
          alt=""
          width={25}
          height={25}
          aria-hidden="true"
        />
      </Link>
      <Link
        href="mailto:electrocutelab@gmail.com"
        title="email"
        aria-label="email"
      >
        <Image src={email} alt="" width={30} height={30} aria-hidden="true" />
      </Link>
    </div>
  );
}
