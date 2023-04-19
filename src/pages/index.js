import Header from 'src/components/Header'
import Footer from 'src/components/Footer'
import Container from '@/components/Container'
import styles from 'src/styles/Home.module.css'

export default function Home({ posts }) {
	return (
		<div className={styles.container}>
			<Header />
			<Container />
			<Footer />
		</div>
	)
}
