import styles from '../styles/Icons.module.css'
import Link from 'next/link'
import Image from 'next/image'
import pen from '../assets/pen.png'
import github from '../assets/github.png'
import ig from '../assets/instagram.png'
import cloud from '../assets/cloud.png'
import pinterest from '../assets/pin.png'
import email from '../assets/email.png'

export default function Icons() {
	return (
		<div className={styles.Icons}>
			<Link href='http://blog.electrocute.io/' title='blog'>
				<Image src={pen} alt='pen' width={30} height={30} aria-hidden='true' />
			</Link>
			<Link href='https://github.com/Yafira' title='github'>
				<Image
					src={github}
					alt='github'
					width={30}
					height={30}
					aria-hidden='true'
				/>
			</Link>
			<Link href='https://www.instagram.com/electrocutelab/' title='instagram'>
				<Image
					src={ig}
					alt='instagram'
					width={30}
					height={30}
					aria-hidden='true'
				/>
			</Link>
			<Link
				href='https://bsky.app/profile/electrocute.bsky.social'
				title='bluesky'
			>
				<Image
					src={cloud}
					alt='cloud'
					width={30}
					height={30}
					aria-hidden='true'
				/>
			</Link>
			<Link href='https://www.pinterest.com/electr0cute' title='pinterest'>
				<Image
					src={pinterest}
					alt='pinterest'
					width={30}
					height={30}
					aria-hidden='true'
				/>
			</Link>
			<Link href='https://www.are.na/yafira/electr0cute' title='arena'>
				<Image
					src='https://goligorsky.neocities.org/logo-arena.svg'
					alt='are.na logo'
					width={30}
					height={30}
					aria-hidden='true'
				/>
			</Link>
			<Link href='mailto:electrocutelab@gmail.com' title='email'>
				<Image
					src={email}
					alt='envelope'
					width={38}
					height={38}
					aria-hidden='true'
				/>
			</Link>
		</div>
	)
}
