import styles from '../styles/Footer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
	return (
		<div className={styles.Footer}>
			<h3>
				© 2023 made with{' '}
				<FontAwesomeIcon icon={faHeart} style={{ color: '#B2A4D4' }} /> by
				electrocute
			</h3>
		</div>
	)
}
