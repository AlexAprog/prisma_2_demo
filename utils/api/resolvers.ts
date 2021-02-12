const createFieldResolver = (modelName, parName) => ({
	[parName]: async ({ id }, args, { prisma }) => {
		const modelResponse = await prisma[modelName].findUnique({
			where: {
				id,
			},
			include: { [parName]: true },
		});
		return modelResponse[parName];
	},
});

export const resolvers = {
	Feed: {
		...createFieldResolver('feed', 'author'),
		...createFieldResolver('feed', 'tags'),
		...createFieldResolver('feed', 'bundles'),
	},

	Bundle: {
		...createFieldResolver('bundle', 'author'),
		...createFieldResolver('bundle', 'tags'),
		...createFieldResolver('bundle', 'feeds'),
	},

	BundleTag: {
		...createFieldResolver('bundleTag', 'bundles'),
	},
	FeedTag: {
		...createFieldResolver('feedTag', 'feeds'),
	},

	Query: {
		hello: (_, __, ___) => 'hi',
		feed: async (parent, { data: id }, { prisma }) =>
			await prisma.feed.findUnique({
				where: {
					id,
				},
			}),
		feeds: async (_, args, { prisma }) => await prisma.feed.findMany(),
		bundle: async (parent, { data: id }, { prisma }) =>
			await prisma.bundle.findUnique({
				where: {
					id,
				},
			}),
		bundles: async (_, args, { prisma }) => await prisma.bundle.findMany(),
	},
	Mutation: {
		createFeed: async (_, { data }, { prisma, user }) => {
			const author = { author: { connect: { id: user.id } } };
			const result = await prisma.feed.create({
				data: { ...data, ...author },
			});
			return result;
		},
		createBundle: async (_, { data }, { prisma, user }) => {
			const author = { author: { connect: { id: user.id } } };
			const result = await prisma.bundle.create({
				data: { ...data, ...author },
			});
			return result;
		},
	},
};
