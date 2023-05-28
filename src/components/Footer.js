import styles from '../styles/Footer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function Footer() {
	return (
		<div className={styles.Footer}>
			<h3>
				© 2023 made with{' '}
				<FontAwesomeIcon icon={faHeart} style={{ color: '#B2A4D4' }} /> by
				<Link href='https://bento.me/electrocute'> Yafira (electrocute) </Link>
			</h3>
		</div>
	)
}
