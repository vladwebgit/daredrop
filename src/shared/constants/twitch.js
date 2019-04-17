export const clientId = 'bywvja4ootazhbae0qcpwpsnu8glaa'
export const baseUrlNewApi = 'https://api.twitch.tv/helix/'
export const baseUrlV5 = 'https://api.twitch.tv/kraken/'
export const twitchOauthUrl = () => {
	switch (window.location.host) {
		case 'localhost:8585':
			return 'https://id.twitch.tv/oauth2/authorize?client_id=jl2c2hlcyimcmg466n0jscmlmpcb8j&response_type=token&redirect_uri=http://localhost:8585/twitch-oauth'
		case 'dev.watt.tv':
			return 'https://id.twitch.tv/oauth2/authorize?client_id=ts0c9c61bm0jm3nkdg36xh19ui8vk7&response_type=token&redirect_uri=http://dev.watt.tv/twitch-oauth'
		default:
			return 'about:blank'
	}
}
