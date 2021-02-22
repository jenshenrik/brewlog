import Layout from '../../components/layout'
import { getAllBrewIds, getBrewData } from '../../lib/brews'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticProps, GetStaticPaths } from 'next'

export default function Post({ 
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

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = getAllBrewIds()
	return {
		paths,
		fallback: false
	}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const brewData = await getBrewData(params.id as string)
	return {
		props: {
			brewData
		}
	}
}


