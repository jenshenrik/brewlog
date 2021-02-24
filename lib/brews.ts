import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import { groupBy } from './util'

const brewsDirectory = path.join(process.cwd(), 'brews')

export function getAllBrews() {
	const metaData = getAllBrewMetaData();
	return metaData.map(m => {
		return {
			beer_code: m.beer_code,
			batch: m.batch
		}
	})
}

export function getAllBeerCodes() {
	const metaData = getAllBrewMetaData()
	
	return metaData.map(m => {
		return {beer_code: m.beer_code, beer_name: m.beer_name}
	})
}

export function getBrewsForBeer(beer_code) {
	const metaData = getAllBrewMetaData().filter(m => m.beer_code == beer_code);
	
	return metaData.map(m => {
		return {beer_code: m.beer_code, beer_name: m.beer_name, date: m.date, batch: m.batch}
	})
}

// Used on front page
export function getLatestBrewsData(size: number = 10) {
	// Get file names under /brews
	const fileNames = fs.readdirSync(brewsDirectory)
	const allBrewsData = fileNames.map(fileName => {
		// Remove '.md' from file name to get id
		//const id = fileName.replace(/\.md$/, '')

		// Read markdown file as string
		const fullPath = path.join(brewsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')

		// use gray-matter to parse the brew metadata section
		const matterResult = matter(fileContents)
		const id = matterResult.data.beer_code + '-' + matterResult.data.batch
		// Combine the data with the id
		return {
			id,
			...(matterResult.data as {date: string; beer_name: string; batch: number; beer_code: string })
		}
	})

	// Sort brews by date
	return allBrewsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1
		} else {
			return -1
		}
	}).slice(0, 10);
}

export async function getBrewData(beer, batch) {
	const id = `${beer}-${batch}`;
	const fullPath = path.join(brewsDirectory, `${id}.md`)
	const fileContents = fs.readFileSync(fullPath, 'utf8')

	const matterResult = matter(fileContents)

	const processedContent = await remark()
		.use(html)
		.process(matterResult.content)
	const contentHtml = processedContent.toString()

	return {
		id,
		contentHtml,
		...(matterResult.data as {
			date: string; 
			beer_name: string; 
			batch: number; 
			beer_code: string })
	}
}

/*
export async function getAllBeerCodes() {
	const metaData = getAllBrewMetaData();
	return metaData.map(m => {
		return m as {
			beer_code: string;
			batch: number;
		};
	});
}

export function getAllBrewsGroupedByBeerCode() {
	let metaData = getAllBrewMetaData()
	return groupBy(metaData, x => x.beer_code)
}
*/
// util
function getAllBrewMetaData() {
	const fileNames = fs.readdirSync(brewsDirectory)
	// Read markdown file as string
	return fileNames.map(fileName => {
		const fullPath = path.join(brewsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')

		// use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents)
		return matterResult.data as {
			beer_code: string;
			beer_name: string;
			date: string; 
			title: string; 
			batch: number;
		}
	})
}

