import { head, unnest, not, length, gt, last, split, omit, map, compose } from 'ramda'

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

const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId, viewAmountRequested } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const userTokens = await dynamoQueryOAuth(userId)
	const amountRequested = viewAmountRequested(payload)

	const [projectToAccept] = head(await dynamoQueryProject(
		null,
		projectId,
	))

	const userTokensInProject = userTokensInProjectSelector(userTokens, projectToAccept)
	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	if (!projectToAccept) {
		throw generalError('Project or assignee doesn\'t exist')
	}

	const userTokensStr = map(compose(last, split('-')), userTokensInProject)

	const assigneeArrNested = await Promise.all(map(
		token => dynamoQueryProjectAssignee(projectId, token),
		userTokensStr,
	))

	const assigneeArr = unnest(unnest(assigneeArrNested))

	const project = {
		[PARTITION_KEY]: projectToAccept[PARTITION_KEY],
		[SORT_KEY]: `project|${projectAcceptedKey}|${randomNumber(1, 10)}`,
		created: getTimestamp(),
	}

	const assigneesToWrite = map(assignee => ({
		PutRequest: {
			Item: {
				...assignee,
				amountRequested,
				accepted: streamerAcceptedKey,
				modified: getTimestamp(),
			},
		},
	}), assigneeArr)

	const acceptationParams = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: project,
					},
				},
				...assigneesToWrite,
			],
		},
	}

	await documentClient.batchWrite(acceptationParams).promise()

	return omit([PARTITION_KEY, SORT_KEY],
		{
			projectId: projectToAccept[PARTITION_KEY],
			...projectToAccept,
		})
}
