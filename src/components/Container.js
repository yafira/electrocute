import Logo from '../assets/cute-tech.png'
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
				<Link
					href='https://cute-technologies.vercel.app'
					className={styles.projectCard1}
				>
					<Image className={styles.logo} src={Logo} alt='project 1' />
					<h3>cute technologies</h3>
					<p>
						A collection of cybertwee functional tools and resources to make
						your computing .env cuter.
					</p>
				</Link>
			</div>
		</div>
	)
}
