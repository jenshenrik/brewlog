import { getAllBeerCodes, getBrewData, getSortedBrewsData } from '../../../lib/brews'
import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from '../../../components/layout'
import Head from 'next/head'
import Date from '../../../components/date'
import utilStyles from '../../../styles/utils.module.css'

export default function Brew({ 
	brewData 
}: {
	brewData: {
		beer_name: string
		date: string
		contentHtml: string
		batch: number
	}
}) {
	return (
		<Layout>
			<Head>
				<title>{brewData.beer_name} #{brewData.batch}</title>
			</Head>
			<article>
				<h1 className={utilStyles.headingXl}>{brewData.beer_name} #{brewData.batch}</h1>
				<div className={utilStyles.lightText}>
					<Date dateString={brewData.date} />
				</div>
				<div dangerouslySetInnerHTML={{ __html: brewData.contentHtml }} />
			</article>
		</Layout>
	)
}

export async function getStaticPaths() {
    const brews = getSortedBrewsData()
    
    return {
      fallback: false,
      paths: brews.map(b => ({
        params: {
          beer: b.beer_code,
          batch: b.batch.toString()
        }
      }))
    }
  }

  export async function getStaticProps({params}) {
    const brewData = await getBrewData(params.beer, params.batch)
    
    return {
      props: {
        brewData
      }
    }
  }