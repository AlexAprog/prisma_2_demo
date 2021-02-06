import { rule, shield } from 'graphql-shield';
import * as _ from 'lodash';

const rules = {
	isAuthenticated: rule()(async (_parent, _args, context, info) => {
		return _.isEmpty(context.user) ? false : true;
	}),
};

export const permissions = shield({
	Query: {
		// hello: rules.isAuthenticated,
	},
	Mutation: {
		createFeed: rules.isAuthenticated,
	},
});
