import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Date from '../components/date'
import { GetStaticProps } from 'next'

import { getSortedBrewsData, getAllBrewsGroupedByBeerCode } from '../lib/brews'

export default function Home({ 
	allBrewsData 
}: {
	allBrewsData: {
		date: string
		beer_name: string
		beer_code: string
		id: string
		batch: number
	}[]
}) {
  return (
	  <Layout home>
	  	<Head>
	  		<title>{siteTitle}</title>
	  	</Head>
	  	<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
	  		<h2 className={utilStyles.headingLg}>Latest brews</h2>
	  		<ul className={utilStyles.list}>
	  			{allBrewsData.map(({ id, date, beer_name, batch, beer_code }) => (
					<li className={utilStyles.listItem} key={id}>
						<Link href={`/brews/${beer_code}/${batch}`}>
							<a>{beer_name} #{batch}</a>
						</Link>
						<br />
						<small className={utilStyles.lightText}>
							<Date dateString={date} />
						</small>
					</li>
				))}
			</ul>
		</section>
	  </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
	const allBrewsData = getSortedBrewsData();
	
	return {
		props: {
			allBrewsData
		}
	}
}
