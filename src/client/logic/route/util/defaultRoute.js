import isAuthenticated from 'root/src/client/logic/auth/selectors/isAuthenticated'
import {
	ACTIVE_PROJECTS_ROUTE_ID, SIGN_UP_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export default state => (
	isAuthenticated(state)
		? { routeId: ACTIVE_PROJECTS_ROUTE_ID, routeParams: {} }
		: { routeId: SIGN_UP_ROUTE_ID, routeParams: {} }
)
