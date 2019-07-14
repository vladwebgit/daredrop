import { CognitoIdentityServiceProvider } from 'aws-sdk'
import outputs from 'root/cfOutput'
import { split, join, tail, filter, propEq, compose, prop, head } from 'ramda'

const { userPoolId } = outputs

export default async (userId) => {
	const provider = new CognitoIdentityServiceProvider()
	const id = compose(join('-'), tail, split('-'))(userId)
	const userData = await provider.adminGetUser({ Username: id, UserPoolId: userPoolId }).promise()
	const email = compose(prop('Value'), head, filter(propEq('Name', 'email')))(userData.UserAttributes)
	return email || 'not found'
}
