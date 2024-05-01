import type { MarkdownInstance } from 'astro'

type ExamplePage = MarkdownInstance<Record<string, string>>

export async function mapExamplesToPages ( allExamples: ExamplePage[] ) {
    const allExamplePages = await Promise.all( allExamples.map( async ( exampleEntry ) => {
        // console.log( 'exampleEntry', exampleEntry )
        // console.log( 'headers', await exampleEntry.getHeaders() )

        const examplePath = exampleEntry.file.split( 'examples' )[ 1 ]

        return {
            params: {
                // Get slug from file path
                slug: exampleEntry.file.split( '/' ).at( -2 ),
            },
            props: {
                // Use first header as title
                title: ( await exampleEntry.getHeadings() )[ 0 ].text,

                entry: exampleEntry,

                repoPath: `/examples${ examplePath }`,

                gitHubEditUrl: `https://github.com/ThatGuySam/vumbnail/edit/main/examples${ examplePath }`,

                nav: null,
            },
        }
    } ) )

    const nav = allExamplePages.map( ( examplePage ) => {
        return {
            label: examplePage.props.title,
            href: `/examples/${ examplePage.params.slug }`,
            slug: examplePage.params.slug,
        }
    } )

    return allExamplePages
        // Add nav to each page
        .map( ( page ) => {
            return {
                ...page,
                props: {
                    ...page.props,
                    nav,
                },
            }
        } )
}
