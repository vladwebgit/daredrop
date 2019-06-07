import { map, and, gte, lt } from 'ramda'
import { stripeCard, paypalAuthorize } from 'root/src/shared/constants/paymentTypes'
import capturePaypalAuthorize from 'root/src/server/api/actionUtil/capturePaypalAuthorize'
import captureStripeAuthorize from 'root/src/server/api/actionUtil/captureStripeAuthorize'

export default paymentsArr => Promise.all(map(async (payment) => {
	const { paymentType, paymentId, captured } = payment
	if (and(gte(captured, 200), lt(captured, 300))) {
		return payment
	}
	console.log(paymentsArr)
	console.log(paymentType)
	console.log(stripeCard)
	try {
		let captureFn
		switch (paymentType) {
			case stripeCard:
				captureFn = captureStripeAuthorize
				break
			case paypalAuthorize:
				captureFn = capturePaypalAuthorize
				break
			default:
		}
		console.log(captureFn)
		const authorization = await captureFn(paymentId)
		return { ...payment, captured: authorization.statusCode }
	} catch (err) {
		return { ...payment, captured: err.statusCode, message: err.message }
	}
}, paymentsArr))
