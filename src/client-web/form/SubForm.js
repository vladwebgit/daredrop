import React, { memo } from 'react'
import { map, range } from 'ramda'

import Button from '@material-ui/core/Button'

import SubFormFields from 'sls-aws/src/client-web/form/SubFormFields'

import subFormConnector from 'sls-aws/src/client-logic/form/connectors/subFormConnector'
import withModuleContext from 'sls-aws/src/util/withModuleContext'

import addAnotherHandler from 'sls-aws/src/client-logic/form/handers/addAnotherHandler'


export const SubForm = memo(({
	moduleKey, moduleId, fieldLabel, addSubForm, subFormCount, fieldId,
	fieldDescPath, fieldPath,
}) => (
	<div>
		<div>{fieldLabel}</div>
		{map(
			subFormIndex => (
				<SubFormFields
					subFormIndex={subFormIndex}
					moduleKey={moduleKey}
					moduleId={moduleId}
					fieldId={fieldId}
					fieldPath={fieldPath}
					fieldDescPath={fieldDescPath}
				/>
			),
			range(0, subFormCount),
		)}
		<Button
			onClick={addAnotherHandler(moduleKey, fieldId, addSubForm)}
		>
			Add Another
		</Button>
	</div>
))

export default withModuleContext(
	subFormConnector(SubForm),
)
