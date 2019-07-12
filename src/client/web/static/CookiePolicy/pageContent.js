import React, { memo } from 'react'
import Link from 'root/src/client/web/base/Link'
import { TERMS_OF_SERVICE_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'
import { EMAIL } from 'root/src/shared/constants/pageData'

const pageContent = classes => [
	{
		title: 'Why we use cookies',
		text: (
			<p>
				Dare Drop uses cookies and other technologies to help recognize you as a repeat visitor
				and, to improve the quality of our Services.
			</p>
		),
	},
	{
		title: 'How we use cookies',
		text: (
			<React.Fragment>
				<p>
					When you visit Dare Drop, our web server sends a cookie to your device, which allows us
					to recognize your device (but not the specific person using it). By associating the
					identification numbers in the cookies with other account information when, for example,
					you log in to our Services, we know that the cookie information relates to your user
					account. Similarly, pixel tags on Dare Drop and in email communications help us identify
					how your device is being used to interact with Dare Drop content. Some of the tags and
					cookies used by our Services are served by us, and some are served by trusted partners who
					are delivering services on our behalf.
				</p>
				<p>Some examples of the types of cookies and other technologies Dare Drop uses:</p>
				<div className={classes.wrapper}>
					<p>
						<strong>Authentication</strong>
						<span>
							Dare Drop uses authentication cookies and similar technologies to tell us when you’re
							logged in to Dare Drop. This lets us show you personalized views related to your
							interests and connect you with Dares like those you may already have backed.
						</span>
						<strong>Security</strong>
						<span>
							Cookies also help keep Dare Drop secure by facilitating security features and
              allowing us to detect activity that might violate our rules and{' '}
							<Link routeId={TERMS_OF_SERVICE_ROUTE_ID}>Terms of Service</Link>. These cookies help
              protect your account from being accessed by anyone other than you, alert you and us
              when your account is accessed, and provide capabilities that allow us to disable any
              active sessions you have (for example, when you log out or change your password).
						</span>
						<strong>Localization</strong>
						<span>
							Some cookies help us provide localized experiences — for example, by making sure you
							see Dare Drop in your preferred language.
						</span>
						<strong>Site features and services</strong>
						<span>
							Dare Drop uses cookies that provide functionality and help us deliver our products
							and services — for instance, by storing your preferences or by pre-filling the
							username field when you log in.
						</span>
						<strong>Performance</strong>
						<span>
							Performance cookies help us route traffic between servers and understand how Dare
							Drop is performing, so we can provide you with the best experience possible. We may use
							third party software development kits (SDK) in our mobile apps to collect information
							about activity in the app, the type of device and operating system it is running on
							and how the app is functioning. For example an SDK may send us a report if the app
							crashes, and reports on which features of the app are used more than others.
						</span>
						<strong>Analytics and research</strong>
						<span>
							Cookies and other technologies also help us to understand, improve, and research
							features and content on the Dare Drop site. For example, we may use cookies to
							understand how you are discovering Dares or to determine which types of browsers or
							devices are accessing Dare Drop. You can opt-out of being included in Google
              Analytics <Link href="https://tools.google.com/dlpage/gaoptout">here</Link>.
						</span>
						<strong>Social Media Platforms</strong>
						<span>
							Cookies and other technologies make interacting with social media platforms more
							seamless. For example, when you’re signed into social media accounts while you use our
							Services, these technologies enable you to share content with your social network or,
							in some cases, log in using your social media credentials. These features are usually
							controlled by the social media platform you are using and are governed by its separate
							privacy policies and the preferences you set with that service.
						</span>
						<strong>Marketing</strong>
						<span>
							Cookies help us deliver targeted advertisements on social media platforms, based on
							your activity on Dare Drop, including the Dares you’ve backed or creators you’ve
							followed on Dare Drop, and to track the performance of those ads. This is sometimes
							referred to as online behavioral advertising. In some cases, our partners may use
							cookies to provide us with information about your interactions with their services.
							Those third-party cookies would be subject to the third party service’s policies. You
							can opt-out of online behavioral advertising. The Self-Regulatory Program for Online
							Behavioral Advertising program provides consumers with the ability to opt-out of
							having their online behavior recorded and used for advertising purposes. To opt out of
              having your online behavior collected for advertising purposes, click{' '}
							<Link href="http://optout.aboutads.info/?c=2#!/">here</Link>. Certain
							choices you make are both browser- and device-specific.
						</span>
					</p>
				</div>
			</React.Fragment>
		),
	},
	{
		title: 'You can control certain cookies',
		text: (
			<p>
				Your browser may give you the ability to control cookies. How you do so depends on the type
				of cookie. Certain browsers can be set to reject browser cookies. Blocking or deleting
				cookies may prevent you from using most of our Services. To find out more about how to
        enable, disable, or delete cookies from your web browser, please visit{' '}
				<Link href="http://www.allaboutcookies.org/">here</Link>. To control flash cookies, which
		may be used on certain websites from time to time, you can go{' '}
				<Link href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html">
					here
				</Link>. Why? Because flash cookies cannot be controlled through your browser settings.
			</p>
		),
	},
	{
		title: 'Our Do Not Track Policy',
		text: (
			<React.Fragment>
				<p>
					Some browsers have “do not track” features that allow you to tell a website not to track
					you. These features are not all uniform. We do not currently respond to those signals. If
					you block cookies, certain features on our sites may not work. If you block or reject
					cookies, not all of the tracking described here will stop.
				</p>
				<p>Certain options you select are browser- and device-specific.</p>
			</React.Fragment>
		),
	},
	{
		title: 'Questions?',
		text: (
			<React.Fragment>
				<p>
					If you have questions or suggestions, please contact us at{' '}
					<a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
				</p>
				<p>This updated policy will go into effect on January 31, 2019.</p>
			</React.Fragment>
		),
	},
]

export default pageContent
