import Layout from '../../../components/layout'
import Head from 'next/head'
import Link from 'next/link'
import utilStyles from '../../../styles/utils.module.css'
import Date from '../../../components/date' 
import { getAllBeerCodes, getBrewsForBeer } from '../../../lib/brews'

export default function Beer({ 
	brews 
}: {
	brews: {
		beer_name: string
		beer_code: string
    batch: string
    date: string
	}[]
}) {
	return (
		<Layout>
			<Head>
				<title>Brew logs for {brews[0].beer_name}</title>
			</Head>
			<article>
				<h1 className={utilStyles.headingXl}>{brews[0].beer_name}</h1>
        <ul className={utilStyles.list}>
	  			{brews.map(({ date, beer_name, batch, beer_code }) => (
					<li className={utilStyles.listItem} key={`${beer_code}-${batch}`}>
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
			</article>
		</Layout>
	)
}

export async function getStaticPaths(beer) {
    const beers = getAllBeerCodes()
    
    return {
      fallback: false,
      paths: beers.map(b => ({
        params: {
          beer: b.beer_code
        }
      }))
    }
  }

  export async function getStaticProps({params}) {
    const brews = await getBrewsForBeer(params.beer)
    
    return {
      props: {
        brews
      }
    }
  }