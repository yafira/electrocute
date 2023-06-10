import styles from '../styles/Icons.module.css'
import Link from 'next/link'
import Image from 'next/image'
import pen from '../assets/pen.png'
import github from '../assets/github.png'
import ig from '../assets/instagram.png'
import fig from '../assets/figma.png'
import pinterest from '../assets/pin.png'
import email from '../assets/email.png'

export default function Icons() {
	return (
		<div className={styles.Icons}>
			<Link href='http://blog.electrocute.io/' title='blog'>
				<Image src={pen} alt='pen' width={25} height={25} aria-hidden='true' />
			</Link>
			<Link href='https://github.com/Yafira' title='github'>
				<Image
					src={github}
					alt='github'
					width={25}
					height={25}
					aria-hidden='true'
				/>
			</Link>
			<Link href='https://www.instagram.com/electrocutelab/' title='instagram'>
				<Image
					src={ig}
					alt='instagram'
					width={25}
					height={25}
					aria-hidden='true'
				/>
			</Link>
			<Link href='https://www.figma.com/@electrocute' title='figma'>
				<Image
					src={fig}
					alt='figma'
					width={25}
					height={25}
					aria-hidden='true'
				/>
			</Link>
			<Link href='https://www.pinterest.com/electr0cute' title='pinterest'>
				<Image
					src={pinterest}
					alt='pinterest'
					width={25}
					height={25}
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
					width={30}
					height={30}
					aria-hidden='true'
				/>
			</Link>
		</div>
	)
}
