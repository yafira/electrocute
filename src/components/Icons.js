import styles from '../styles/Icons.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import {
	faInstagram,
	faGithub,
	faPinterest,
} from '@fortawesome/free-brands-svg-icons'

export default function Icons() {
	return (
		<div className={styles.Icons}>
			<Link href='http://blog.electrocute.io/' title='blog'>
				<FontAwesomeIcon
					icon={faPen}
					style={{ color: '#000000' }}
					aria-hidden='true'
				/>
			</Link>
			<Link href='https://www.instagram.com/electrocutelab/' title='instagram'>
				<FontAwesomeIcon icon={faInstagram} aria-hidden='true' />
			</Link>
			<Link href='https://github.com/Yafira' title='github'>
				<FontAwesomeIcon icon={faGithub} aria-hidden='true' />
			</Link>
			<Link href='https://www.pinterest.com/electr0cute/' title='pinterest'>
				<FontAwesomeIcon icon={faPinterest} aria-hidden='true' />
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
		</div>
	)
}
