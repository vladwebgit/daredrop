import React, { memo } from 'react'

import Button from '@material-ui/core/Button'
import {
	primaryColor, secondaryColor,
} from 'root/src/client/web/commonStyles'
import {
	primarySquareButton,
  primaryRoundButton,
	universalForm,
	noBackgroundButton,
	outlinedButton,
} from 'root/src/client/web/componentTypes'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

const styles = {
	button: {
		color: 'white',
		backgroundColor: primaryColor,
		'&:hover': {
			backgroundColor: secondaryColor,
		},
		width: '100%',
		height: 48.1,
		textTransform: 'none',
		fontSize: 18,
	},
	smallButton: {
		width: '20%',
		margin: 'auto 0',
		marginLeft: '5px',
	},
	primarySquareButton: {
		padding: 10,
		fontSize: 18,
		textTransform: 'none',
		boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.16)',
	},
  primaryRoundButton: {
    padding: 10,
    fontSize: 18,
    borderRadius: 20,
    textTransform: 'none',
    boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.16)',
  },
	noBackgroundButton: {
		padding: 10,
		fontSize: 18,
		textTransform: 'none',
		marginBottom: 25,
		color: primaryColor,
		backgroundColor: 'transparent',
		boxShadow: 'none',
		marginTop: 25,
		'&:hover': {
			color: secondaryColor,
			backgroundColor: 'transparent',
		},
	},
	outlinedButton: {
		color: primaryColor,
		border: `1px solid ${primaryColor}`,
		backgroundColor: 'transparent',
		padding: 'auto',
		fontSize: 18,
		textTransform: 'none',
		boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.16)',
		'&:hover': {
			color: secondaryColor,
			backgroundColor: 'transparent',
		},
	},
	unstyled: {
		color: primaryColor,
		backgroundColor: 'transparent',
		boxShadow: 'none',
		'&:hover': {
			color: primaryColor,
			backgroundColor: 'transparent',
		},
	},
}

export const ButtonUnstyled = memo(({
	classes, onClick, disabled, children, style, isSmallButton,
	buttonType, unstyled, additionalClass, formType,
}) => (
	<Button
		className={classNames(
			style,
			classes.button,
			{ [classes.unstyled]: unstyled },
      ({ [classes.primaryRoundButton]: buttonType === primaryRoundButton }),
			({ [classes.noBackgroundButton]: buttonType === noBackgroundButton }),
			({ [classes.primarySquareButton]: buttonType === primarySquareButton || formType === universalForm }),
			({ [classes.smallButton]: isSmallButton }),
			additionalClass,
		)}
		onClick={onClick}
		disabled={disabled}
		disableRipple
	>
		{children}
	</Button>
))

export default withStyles(styles)(ButtonUnstyled)
