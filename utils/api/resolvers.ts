export const resolvers = {
	Query: {
		hello: (_, __, ___) => 'hi',
		feed: async (parent, { data: id }, { prisma }) =>
			await prisma.feed.findUnique({
				where: {
					id,
				},
			}),
		feeds: async (_, args, { prisma }) => await prisma.feed.findMany(),
	},
	Mutation: {
		createFeed: async (_, { data }, { prisma }) =>
			await prisma.feed.create({
				data,
			}),
	},
};
