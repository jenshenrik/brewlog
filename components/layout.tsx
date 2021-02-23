import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import React from 'react'
import { setMilliseconds } from 'date-fns'

const name = 'Brewlog'
export const siteTitle = 'Brewlog'

export default function Layout({ 
	children, 
	home 
}: {
	children: React.ReactNode
	home?: boolean
}) {
	return (
		<div>
		<Head>
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<header className={styles.header}>
			<div className={styles.container}>
			{home ? (
				<>
						<Image
							priority
							src="/brewlog-logo.svg"
							height={144}
							width={144}
							alt={name}
						/>
						<h1 className={utilStyles.heading2Xl}>{name}</h1>

				</>
			) : (
				<>
					<Link href="/">
						<a>
							<Image
								priority
								src="/brewlog-logo.svg"
								height={88}
								width={88}
								alt={name}
							/>
						</a>
					</Link>
				</>
			)}
			</div>
		</header>
		<main className={styles.container}>{children}</main>
		{!home && (
			<div className={styles.backToHome}>
				<Link href="/">
					<a>← Back to home</a>
				</Link>
			</div>
		)}
	</div>
)
}
