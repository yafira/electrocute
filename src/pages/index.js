import Head from 'next/head'
import Icons from '@/components/Icons'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import styles from '@/styles/Home.module.css'

export default function Home({ posts }) {
	return (
		<div className={styles.container}>
			<Head>
				<link rel='icon' href='/public/favicon.ico'></link>
				<title>electrocute</title>
			</Head>
			<Header />
			<Container />
			<Icons />
			<Footer />
		</div>
	)
}
