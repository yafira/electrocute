import Header from 'src/components/Header'
import Footer from 'src/components/Footer'
import Container from '@/components/Container'
import styles from 'src/styles/Home.module.css'
import Head from 'next/head'

export default function Home({ posts }) {
	return (
		<div className={styles.container}>
			<Head>
				<title>electrocute</title>
			</Head>
			<Header />
			<Container />
			<Footer />
		</div>
	)
}
