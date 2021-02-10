import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
	type Feed {
		id: String
		name: String
		url: String
	}

	input FeedInput {
		id: String
	}

	input FeedCreateInput {
		id: String
		name: String
		url: String
	}

	type Query {
		hello: String
		feed(data: FeedInput): Feed
		feeds: [Feed]
	}

	type Mutation {
		createFeed(data: FeedCreateInput): Feed
	}
`;
