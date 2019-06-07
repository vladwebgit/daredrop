/* eslint-disable no-console */
import { head, not, gt, length, filter, propEq, prop } from 'ramda'
import { extension, lookup } from 'mime-types'
import uuid from 'uuid/v4'

import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { DELIVERY_DARE_INIT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import s3 from 'root/src/server/api/s3Client'
import { videoBucket } from 'root/cfOutput'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { projectDeliveryPendingKey } from 'root/src/server/api/lenses'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import { s3BaseURL } from 'root/src/shared/constants/s3Constants'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import { authorizationError, actionForbiddenError } from 'root/src/server/api/errors'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import dynamoQueryProjectDeliveries from 'root/src/server/api/actionUtil/dynamoQueryProjectDeliveries'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import { videoSubmittedTitle } from 'root/src/server/email/util/emailTitles'
import videoSubmittedEmail from 'root/src/server/email/templates/videoSubmitted'
import sendEmail from 'root/src/server/email/actions/sendEmail'

const payloadLenses = getPayloadLenses(DELIVERY_DARE_INIT)

const { viewVideoURL, viewTimeStamp, viewVideoName, viewProjectId } = payloadLenses

export default async ({ payload, userId }) => {
	const userTokens = await dynamoQueryOAuth(userId)
	const videoName = viewVideoName(payload)
	const videoURL = viewVideoURL(payload)
	const projectId = viewProjectId(payload)
	const timeStamp = viewTimeStamp(payload)

	const projectDeliveries = await dynamoQueryProjectDeliveries(projectId)
	const approvedProjectDeliveries = await dynamoQueryProjectDeliveries(projectId, true)
	const filterUploaded = filter(propEq('s3Uploaded', true))
	let deliverySortKey

	if (gt(length(approvedProjectDeliveries), 0)) {
		throw actionForbiddenError('This project have already dare approved')
	}

	if (gt(length(projectDeliveries), 0)) {
		const uploadedProjectDeliveries = filterUploaded(projectDeliveries)

		if (gt(length(uploadedProjectDeliveries), 0)) {
			throw actionForbiddenError('This project have already dare submitted')
		}
		const filterByUploader = filter(propEq('uploader', userId))
		const userDeliveries = filterByUploader(projectDeliveries)
		deliverySortKey = prop('sk', head(userDeliveries))
	}

	const [projectDdb, assigneesDdb] = await dynamoQueryProject(null, projectId)

	const project = projectSerializer([
		...projectDdb,
		...assigneesDdb,
	])

	const userTokensInProject = userTokensInProjectSelector(userTokens, project)

	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	const fileName = `${uuid()}.${extension(lookup(videoName))}`

	const params = {
		Bucket: videoBucket,
		Key: fileName,
		Expires: 3600,
	}
	const url = s3.getSignedUrl('putObject', params)

	if (!deliverySortKey) {
		deliverySortKey = await generateUniqueSortKey(projectId, `project|${projectDeliveryPendingKey}`, 1, 10)
	}

	const dareDeliveryObject = {
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: deliverySortKey,
		videoURL,
		timeStamp,
		fileName,
		created: getTimestamp(),
		s3ObjectURL: `${s3BaseURL}${videoBucket}/${fileName}`,
		s3Uploaded: false,
		uploader: userId,
	}

	const deliveryParams = {
		TableName: TABLE_NAME,
		Item: dareDeliveryObject,
	}

	await documentClient.put(deliveryParams).promise()

	try {
		const email = await getUserEmail(userId)
		const emailData = {
			title: videoSubmittedTitle,
			dareTitle: prop('title', project),
			recipients: [email],
		}
		sendEmail(emailData, videoSubmittedEmail)
	} catch (err) {
		console.log('ses error')
	}
	return { url, deliverySortKey }
}
