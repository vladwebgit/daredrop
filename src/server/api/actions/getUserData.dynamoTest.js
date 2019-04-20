import { apiFn } from 'root/src/server/api'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

import wait from 'root/src/testUtil/wait'

import createProject from 'root/src/server/api/actions/createProject'
import createProjectPayload from 'root/src/server/api/mocks/createProjectPayload'
import { mockUserId } from 'root/src/server/api/mocks/contextMock'

describe('getUserData', () => {
	test('gets user data', async () => {
		const newProjectPayload = createProjectPayload()
		const newProject = await createProject({
			userId: mockUserId,
			payload: newProjectPayload,
		})
		const event = {
			endpointId: GET_PROJECT,
			payload: { projectId: newProject.id },
			authentication: mockUserId,
		}
		await wait(750)
		const res = await apiFn(event)
		expect(res).toEqual({
			statusCode: 200,
			body: {
				...newProject,
				myPledge: newProjectPayload.pledgeAmount,
			},
		})
	})
})
