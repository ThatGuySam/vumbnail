


export function getVercelUrl () {
    return process.env?.VERCEL_BETA_URL || `https://${process.env.VERCEL_URL}`
}

// https://stackoverflow.com/a/66011585/1397641
export const vercelUrl = getVercelUrl()
