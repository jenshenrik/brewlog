import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import { groupBy } from './util'

const brewsDirectory = path.join(process.cwd(), 'brews')

export function getSortedBrewsData() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(brewsDirectory)
	const allPostsData = fileNames.map(fileName => {
		// Remove '.md' from file name to get id
		//const id = fileName.replace(/\.md$/, '')

		// Read markdown file as string
		const fullPath = path.join(brewsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')

		// use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents)
		const id = matterResult.data.beer_code + '-' + matterResult.data.batch
		// Combine the data with the id
		return {
			id,
			...(matterResult.data as {date: string; beer_name: string; batch: number; beer_code: string })
		}
	})

	// Sort posts by date
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1
		} else {
			return -1
		}
	})
}

export function getAllBrewIds() {
	const fileNames = fs.readdirSync(brewsDirectory)

	return fileNames.map(fileName => {
		return {
			params: {
				id: fileName.replace(/\.md$/, '')
			}
		}
	})
}

export async function getBrewData(id) {
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
		...(matterResult.data as {date: string; title: string; batch: number; beer_code: string })
	}
}

export async function getAllBeerCodes() {
	const metaData = getAllBrewMetaData();
	return metaData.map(m => {
		return m.beer_code;
	});
}

export function getAllBrewsGroupedByBeerCode() {
	let metaData = getAllBrewMetaData()
	return groupBy(metaData, x => x.beer_code)
}

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
			date: string; 
			title: string; 
			batch: number;
		}
	})
}

