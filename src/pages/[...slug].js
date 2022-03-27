export async function getStaticPaths() {
	const { default: glob } = await import('fast-glob')

	const markdownFiles = await glob(`./examples/**/README.md`)

	const paths = markdownFiles.map((fileName) => ({
		params: {
			slug: [
				...fileName
					.replace('README.md', '')
					.replace('./', '')
					.split('/'),
			],
		},
	}))

	// console.log( 'paths', paths.map( path => path.params ) )

	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps({ params }) {
	const fs = await import('fs')
	const { default: matter } = await import('gray-matter')

	const fileName = fs.readFileSync(
		`./${params.slug.join('/')}/README.md`,
		'utf-8'
	)

	console.log('fileName', fileName)
	
	const { data: frontmatter, content } = matter(fileName)

	return {
		props: {
			// slug: ['test'],
			frontmatter,
			content,
		},
	}
}

export default function DocsPage({ frontmatter, content }) {
	// const router = useRouter()
	// const slug = router.query.slug || []

	return (
		// <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
			<div className="prose mx-auto">
				<h1>{frontmatter.originalUrl}</h1>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		// </Main>
	)
}