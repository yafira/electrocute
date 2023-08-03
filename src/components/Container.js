import Logo from '../assets/cutetech.png'
import Logo2 from '../assets/snax.png'
import Logo3 from '../assets/calc.png'
import Logo4 from '../assets/cutefolder.png'
import Logo5 from '../assets/bag.png'
import Logo6 from '../assets/chub.png'
import Logo7 from '../assets/dhub.png'
import Logo8 from '../assets/led.png'
import Logo9 from '../assets/write.png'
import Logo10 from '../assets/iclay.png'
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
				<Link href='https://cutetech.tools' className={styles.projectCard1}>
					<Image className={styles.logo} src={Logo} alt='project 1' />
					<h3>cute technologies</h3>
					<p>
						A digital catalog featuring a collection of cybertwee functional
						tools and resources to make your computing .env cuter.
					</p>
				</Link>

				<Link href='https://snax.blog' className={styles.projectCard2}>
					<Image className={styles.logo} src={Logo2} alt='project 2' />
					<h3>snax</h3>
					<p>
						A pokedex-like blog for sharing my own reviews and ratings on
						vegan/plant-based snacks and bevs. Also a peanut-free zone.
					</p>
				</Link>

				<Link
					href='https://sailor-moon-calculator.glitch.me/'
					className={styles.projectCard3}
				>
					<Image className={styles.logo} src={Logo3} alt='project 3' />
					<h3>sailor moon calculator</h3>
					<p>
						A basic on-screen calculator inspired by one of the communicators
						used in Sailor Moon.{' '}
					</p>
				</Link>

				<Link
					href='https://electrocute.gumroad.com/l/cute-folder-pack'
					className={styles.projectCard4}
				>
					<Image className={styles.logo} src={Logo4} alt='project 4' />
					<h3>cute folder icon pack</h3>
					<p>
						A simple but cute folder icon pack that comes in pastel colors, as
						well as neutral and monochrome shades. Named after potential macaron
						flavors and other delicacies.
					</p>
				</Link>

				<Link
					href='https://www.craft.do/s/n728rE3K9pjrQx'
					className={styles.projectCard5}
				>
					<Image className={styles.logo} src={Logo5} alt='project 5' />
					<h3>electrojute</h3>
					<p>
						A custom DIY jute tote bag with felt flowers and sewable Sakura
						lilac LEDs sown with conductive thread.
					</p>
				</Link>

				<Link
					href='https://electrocute.gumroad.com/l/coding-hub'
					className={styles.projectCard6}
				>
					<Image className={styles.logo} src={Logo6} alt='project 6' />
					<h3>coding hub</h3>
					<p>
						A Notion template to keep track of your programming progress and all
						around coding journey.
					</p>
				</Link>

				<Link
					href='https://electrocute.gumroad.com/l/design-hub'
					className={styles.projectCard7}
				>
					<Image className={styles.logo} src={Logo7} alt='project 7' />
					<h3>design hub</h3>
					<p>
						A Notion template to keep track of your progress on design learnings
						and all around journey.
					</p>
				</Link>

				<Link
					href='https://www.craft.me/s/UPIseOWDQQ2AAx'
					className={styles.projectCard8}
				>
					<Image className={styles.logo} src={Logo8} alt='project 8' />
					<h3>custom light LEDs</h3>
					<p>A tutorial on how to create custom LED lights with UV resin.</p>
				</Link>

				<Link
					href='https://mind-write.vercel.app/'
					className={styles.projectCard9}
				>
					<Image className={styles.logo} src={Logo9} alt='project 9' />
					<h3>mind write</h3>
					<p>A space to free-write what's on your mind, no commitments.</p>
				</Link>

				<Link href='/' className={styles.projectCard10}>
					<Image className={styles.logo} src={Logo10} alt='project 10' />
					<h3>*****</h3>
					<p>coming soon ・₊✧</p>
				</Link>
			</div>
		</div>
	)
}
