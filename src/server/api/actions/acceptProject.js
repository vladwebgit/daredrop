import { prop, unnest, equals, not, length, gt, last, split, omit, map, compose } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import { projectAcceptedKey, streamerAcceptedKey } from 'root/src/server/api/lenses'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import randomNumber from 'root/src/shared/util/randomNumber'
import getAcceptedAssignees from 'root/src/server/api/actionUtil/getAcceptedAssignees'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import dynamoQueryAllProjectAssignees from 'root/src/server/api/actionUtil/dynamoQueryAllProjectAssignees'
import getAssigneeObject from 'root/src/server/api/actionUtil/getAssigneeObject'


const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId, viewAmountRequested } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const amountRequested = viewAmountRequested(payload)
	const userTokens = await dynamoQueryOAuth(userId)

	const [projectToAcceptDdb, assigneesDdb] = await dynamoQueryProject(
		null,
		projectId,
	)

	const projectToAccept = projectSerializer([
		...projectToAcceptDdb,
		...assigneesDdb,
	])

	const userTokensInProject = userTokensInProjectSelector(userTokens, projectToAccept)

	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	if (!projectToAccept) {
		throw generalError('Project or assignee doesn\'t exist')
	}

	const userTokensStr = map(compose(last, split('-')), userTokensInProject)

	const userAssigneeArrNested = await Promise.all(map(
		token => dynamoQueryProjectAssignee(projectId, token),
		userTokensStr,
	))

	const userAssigneeArr = unnest(unnest(userAssigneeArrNested))

	const assigneesToWrite = unnest(map((assignee) => {
		const updateProjectParam = {
			TableName: TABLE_NAME,
			Key: {
				[PARTITION_KEY]: assignee[PARTITION_KEY],
				[SORT_KEY]: assignee[SORT_KEY],
			},
			UpdateExpression: 'SET amountRequested = :amountRequested, accepted = :newAccepted, modified = :newModified',
			ExpressionAttributeValues: {
				':amountRequested': amountRequested,
				':newAccepted': streamerAcceptedKey,
				':newModified': getTimestamp(),
			},
		}
		return documentClient.update(updateProjectParam).promise()
	}, userAssigneeArr))


	const assigneesInProject = await dynamoQueryAllProjectAssignees(projectId)

	let projectAcceptedRecord = []

	const acceptedAssigneesInProject = getAcceptedAssignees(assigneesDdb)

	Promise.all(assigneesToWrite)

	if (equals(length(acceptedAssigneesInProject), 0)) {
		projectAcceptedRecord = [{
			PutRequest: {
				Item: {
					[PARTITION_KEY]: prop('id', projectToAccept),
					[SORT_KEY]: `project|${projectAcceptedKey}|${randomNumber(1, 10)}`,
					created: getTimestamp(),
				},
			},
		}]
	}

	const assignee = await dynamoQueryAllProjectAssignees(projectId)

	const acceptationParams = {
		RequestItems: {
			[TABLE_NAME]: [
				...projectAcceptedRecord,
			],
		},
	}

	await documentClient.batchWrite(acceptationParams).promise()
	const updateProjectParam = {
		TableName: TABLE_NAME,
		Key: {
			[PARTITION_KEY]: projectToAccept[PARTITION_KEY],
			[SORT_KEY]: projectToAccept[SORT_KEY],
		},
		UpdateExpression: 'SET assignees = :newAssignees',
		ExpressionAttributeValues: {
			':newAssignees': getAssigneeObject(assignee),
		},
	}

	await documentClient.update(updateProjectParam).promise()

	return omit([PARTITION_KEY, SORT_KEY],
		{
			projectId: projectToAccept[PARTITION_KEY],
			...projectToAccept,
		})
}
