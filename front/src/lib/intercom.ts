declare global {
	interface Window {
		Intercom: any
	}
}

window.Intercom = window.Intercom || {}

export const IntercomHandler = {
	trackEvent: (user: any, eventType: string) => {
		const { initialHarvestComplete, lastUpdate }: any = user
		window.Intercom('trackEvent', eventType, {
			name: user.displayName || 'N/A', // Full name
			email: user.email || 'N/A', // Email address
			user_id: user.uid,
			avatar: {
				type: 'avatar',
				image_url: user.photoURL
			} // current_user_id
		})
	},
	boot: (user: any, eventType: string) => {
		const { initialHarvestComplete, lastUpdate }: any = user
		window.Intercom(eventType, {
			name: user.displayName || 'N/A', // Full name
			email: user.email || 'N/A', // Email address
			user_id: user.uid,
			avatar: {
				type: 'avatar',
				image_url: user.photoURL
			}
		})
	}
}
