import Logo from '../assets/cutetech.png'
import Logo2 from '../assets/snax.png'
import Logo3 from '../assets/calc.png'
import Logo4 from '../assets/cutefolder.png'
import Logo5 from '../assets/bag.png'
import Logo6 from '../assets/chub.png'
import Logo7 from '../assets/dhub.png'
import Logo8 from '../assets/led.png'
import Logo9 from '../assets/write.png'
import Logo10 from '../assets/ecuteui.png'
import Logo11 from '../assets/kml.png'
import Logo12 from '../assets/journal.png'
import Logo13 from '../assets/bsod.png'
import Logo14 from '../assets/flower.png'
import Logo15 from '../assets/glowmotion.png'
import Logo16 from '../assets/scribble.png'
import Logo17 from '../assets/moonpocket.png'
import Logo20 from '../assets/iclay.png'
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
				<Link href='/' className={styles.projectCard20}>
					<Image className={styles.logo} src={Logo20} alt='project 20' />
					<h3>*****</h3>
					<p>coming soon ・₊✧</p>
				</Link>

				<Link
					href='https://months-tap-da9.craft.me/moonpocket'
					className={styles.projectCard17}
				>
					<Image className={styles.logo} src={Logo17} alt='project 17' />
					<h3>moon pocket</h3>
					<p>
						A poetic connected device for tracking lunar and tidal cycles in
						real time.
					</p>
				</Link>

				<Link
					href='https://scribble-pop.netlify.app/'
					className={styles.projectCard16}
				>
					<Image className={styles.logo} src={Logo16} alt='project 16' />
					<h3>scribble pop</h3>
					<p>A hand held drawing tool for mobile and the web.</p>
				</Link>

				<Link
					href='https://months-tap-da9.craft.me/glowmotion'
					className={styles.projectCard15}
				>
					<Image className={styles.logo} src={Logo15} alt='project 15' />
					<h3>glowmotion</h3>
					<p>A gesture-controlled light sculpture in motion.</p>
				</Link>

				<Link
					href='https://synthwave-chimes.glitch.me/'
					className={styles.projectCard14}
				>
					<Image className={styles.logo} src={Logo14} alt='project 14' />
					<h3>synthwave chimes</h3>
					<p>
						A digital synth chime that blends shapes with interactive sound.
					</p>
				</Link>

				<Link
					href='https://www.figma.com/design/nqnNJpEGPfSWT6xAJEZOcH/BSOD-error-but-cute?node-id=0-1&t=AI1pm6CX26AQYtCb-1'
					className={styles.projectCard13}
				>
					<Image className={styles.logo} src={Logo13} alt='project 13' />
					<h3>BSOD but cute</h3>
					<p>A blue screen of death but more positive and charming.</p>
				</Link>

				<Link
					href='https://le-petit-journal.vercel.app/'
					className={styles.projectCard12}
				>
					<Image className={styles.logo} src={Logo12} alt='project 12' />
					<h3>le petit journal</h3>
					<p>
						A petit weekly journal to jot down, keep track or plan anything.
					</p>
				</Link>

				<Link
					href='https://www.figma.com/community/file/1282166884816539041/Kawaii-ML-Deck'
					className={styles.projectCard11}
				>
					<Image className={styles.logo} src={Logo11} alt='project 11' />
					<h3>kawaii ML</h3>
					<p>A card deck referencing the top 10 machine learning algorithms.</p>
				</Link>

				<Link
					href='https://www.figma.com/community/file/1277066355478459322/Electrocute-Design-System'
					className={styles.projectCard10}
				>
					<Image className={styles.logo} src={Logo10} alt='project 10' />
					<h3>electrocute UI</h3>
					<p>
						A mini design system in the making. <i>ongoing</i>
					</p>
				</Link>

				<Link
					href='https://the-write-mind.vercel.app/'
					className={styles.projectCard9}
				>
					<Image className={styles.logo} src={Logo9} alt='project 9' />
					<h3>write mind</h3>
					<p>A space to free-write what&apos;s on your mind, no commitments.</p>
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
					href='https://electrocute.gumroad.com/l/cute-folder-pack'
					className={styles.projectCard4}
				>
					<Image className={styles.logo} src={Logo4} alt='project 4' />
					<h3>cute folder icon pack</h3>
					<p>
						A cute folder icon pack in pastel, neutral, and monochrome shades,
						named after macaron flavors and other delicacies.
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
						used in Sailor Moon.
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

				<Link href='https://cutetech.tools' className={styles.projectCard1}>
					<Image className={styles.logo} src={Logo} alt='project 1' />
					<h3>cute technologies</h3>
					<p>
						A digital catalog featuring a collection of cybertwee functional
						tools and resources to make your computing .env cuter.
					</p>
				</Link>
			</div>
		</div>
	)
}
