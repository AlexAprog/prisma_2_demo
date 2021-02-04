import { initAuth0 } from '@auth0/nextjs-auth0';

import getConfig from 'next/config';
const { serverRunTimeConfig } = getConfig();
const { auth, cookieSecret } = serverRunTimeConfig;

export default initAuth0({
	...auth,
	session: {
		cookieSecret,
		cookieLifetime: 60 * 60 * 8,
		storeIdToken: false,
		storeAccessToken: false,
		storeRefreshToken: false,
	},
	oidcClient: {
		httpTimeout: 2500,
		clockTolerance: 10000,
	},
});
