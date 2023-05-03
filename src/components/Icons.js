import styles from '../styles/Icons.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faWordpress,
	faInstagram,
	faGithub,
	faPinterest,
} from '@fortawesome/free-brands-svg-icons'

export default function Icons() {
	return (
		<div className={styles.Icons}>
			<Link href='http://blog.electrocute.io/' title='wordpress'>
				<FontAwesomeIcon icon={faWordpress} aria-hidden='true' />
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
		</div>
	)
}
