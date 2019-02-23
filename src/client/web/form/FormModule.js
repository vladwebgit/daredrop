import React, { memo } from 'react'

import { orNull } from 'sls-aws/src/shared/util/ramdaPlus'
import { secondaryColor } from 'sls-aws/src/client/web/commonStyles'

import Fields from 'sls-aws/src/client/web/form/Fields'
import Submits from 'sls-aws/src/client/web/form/Submits'
import Header from 'sls-aws/src/client/web/typography/Header'
import Link from 'sls-aws/src/client/web/base/Link'
import Body from 'sls-aws/src/client/web/typography/Body'
import TertiaryBody from 'sls-aws/src/client/web/typography/TertiaryBody'
import formModuleConnector from 'sls-aws/src/client/logic/form/connectors/formModuleConnector'

import submitFormHandler from 'sls-aws/src/client/logic/form/handlers/submitFormHandler'

import withModuleContext from 'sls-aws/src/client/util/withModuleContext'

import classNames from 'classnames'

const styles = {
	space: {
		marginTop: 25,
		marginBottom: 25,
	},
	paymentTitle: {
		fontSize: 32,
	},
	formContainer: {
		width: 360,

		'@media (max-width: 600px)': {
			width: 340,
		},
	},
	backButton: {
		textAlign: 'center',
		marginBottom: 35,

		'& span': {
			color: secondaryColor,
			backgroundColor: 'transparent',
			textTransform: 'none',
			fontSize: 18,
		},
	},
}

export const FormModuleUnconnected = memo(({
	formFieldTypes, formTitle, formSubmits, moduleId, moduleKey, submitForm,
	preSubmitText, postSubmitText, preSubmitCaption, postSubmitCaption,
	classes, subTitle, formType, backButton,
}) => (
	<div className="flex layout-row layout-align-center">
		<div className={classes.formContainer}>
			{orNull(
				formTitle,
				<div
					className={classNames(
						classes.space,
						'layout-row layout-align-center',
					)}
				>
					<Header additionalClass={classNames({ [classes.paymentTitle]: (formType === 'paymentMethod') })}>{formTitle}</Header>
				</div>,
			)}
			{orNull(
				subTitle,
				<div
					className={classNames(
						classes.space,
						'layout-row layout-align-center',
					)}
				>
					<Body>{subTitle}</Body>
				</div>,
			)}
			<form
				onSubmit={submitFormHandler(submitForm, moduleKey)}
				className={classNames({ 'layout-column layout-align-center-stretch': (formType !== 'paymentMethod') })}
			>
				<Fields
					moduleKey={moduleKey}
					moduleId={moduleId}
					formFieldTypes={formFieldTypes}
					formType={formType}
				/>
				{orNull(
					preSubmitText,
					<div
						className={classNames(
							classes.space,
							'layout-row layout-align-center',
						)}
					>
						<Body>{preSubmitText}</Body>
					</div>,
				)}
				{orNull(
					preSubmitCaption,
					<div
						className={classNames(
							classes.space,
							'layout-row layout-align-center',
						)}
					>
						<TertiaryBody>{preSubmitCaption}</TertiaryBody>
					</div>,
				)}
				<div className={classes.space}>
					<Submits
						moduleKey={moduleKey}
						formSubmits={formSubmits}
						submitFormFn={submitForm}
					/>
				</div>
				{orNull(
					postSubmitText,
					<div className="flex layout-row layout-align-center">
						<Body>{postSubmitText}</Body>
					</div>,
				)}
				{orNull(
					postSubmitCaption,
					<div className="flex layout-row layout-align-center">
						<TertiaryBody>{postSubmitCaption}</TertiaryBody>
					</div>,
				)}
				{backButton && (
					<div className={classes.backButton}>
						<Link routeId={backButton.routeId}>
							<span>{backButton.label}</span>
						</Link>
					</div>
				)}
				<input type="submit" className="hide" />
			</form>
		</div>
	</div>
))

export default withModuleContext(
	formModuleConnector(FormModuleUnconnected, styles),
)
