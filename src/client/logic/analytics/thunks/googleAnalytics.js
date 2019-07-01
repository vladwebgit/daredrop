import ReactGA from 'react-ga'
import { developmentGoogleTag, productionGoogleTag } from 'root/src/shared/constants/pageData'

export default () => {
	if (process.env.STAGE === 'production') {
		ReactGA.initialize(productionGoogleTag)
	} else {
		ReactGA.initialize(developmentGoogleTag)
	}
	ReactGA.plugin.require('ecommerce', { debug: true })
	ReactGA.pageview(window.location.pathname + window.location.search)
}

export const googleAnalytics = ReactGA
