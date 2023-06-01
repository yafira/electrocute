import Logo from '../assets/cutetech.png'
import Logo2 from '../assets/snax.png'
import Logo3 from '../assets/bag.png'
import Logo4 from '../assets/iclay.png'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Container() {
	return (
		<div className={styles.container}>
			<div className={styles.titleContainer}>
				<h1 className={styles.title}></h1>
			</div>

			<div className={styles.projectGrid}>
				<Link href='https://cutetech.tools' className={styles.projectCard1}>
					<Image className={styles.logo} src={Logo} alt='project 1' />
					<h3>cute technologies</h3>
					<p>
						A collection of cybertwee functional tools and resources to make
						your computing .env cuter while amplifying productivity.
					</p>
				</Link>

				<Link href='https://snax.blog' className={styles.projectCard2}>
					<Image className={styles.logo} src={Logo2} alt='project 2' />
					<h3>snax</h3>
					<p>
						A blog for sharing my own reviews/ratings on vegan and plant-based
						snacks and bevs. Also a peanut-free zone.
					</p>
				</Link>

				<Link href='/' className={styles.projectCard3}>
					<Image className={styles.logo} src={Logo3} alt='project 3' />
					<h3>*****</h3>
					<p>work in progress ・₊✧</p>
				</Link>

				<Link href='/' className={styles.projectCard4}>
					<Image className={styles.logo} src={Logo4} alt='project 4' />
					<h3>*****</h3>
					<p>coming soon ・₊✧</p>
				</Link>
			</div>
		</div>
	)
}
