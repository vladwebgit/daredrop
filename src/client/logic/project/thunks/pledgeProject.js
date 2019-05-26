import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { PLEDGE_PROJECT, ADD_PAYMENT_METHOD } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { stripeCard } from 'root/src/shared/constants/paymentTypes'
import { omit } from 'ramda'

export default formData => async (dispatch, getState) => {
	const state = getState()
	const projectId = currentRouteParamsRecordId(state)
	let { stripeCardId } = formData
	if (typeof stripeCardId === 'object') {
		const stripeRes = await stripeCardId.createSource({
			type: 'card', usage: 'reusable', currency: 'usd',
		})
		const addPaymentPayload = {
			stripeCardId: stripeRes.source.id,
			brand: stripeRes.source.card.brand,
			lastFour: stripeRes.source.card.last4,
			expMonth: stripeRes.source.card.exp_month,
			expYear: stripeRes.source.card.exp_year,
		}
		dispatch(apiRequest(ADD_PAYMENT_METHOD, addPaymentPayload))
		stripeCardId = stripeRes.source.id
	}
	const apiPayload = omit(['stripeCardId'], {
		...formData,
		projectId,
		paymentInfo: {
			paymentType: stripeCard,
			paymentId: stripeCardId,
		},
	})
	return dispatch(apiRequest(PLEDGE_PROJECT, apiPayload))
}
