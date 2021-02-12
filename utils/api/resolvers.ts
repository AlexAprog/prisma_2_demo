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
		...createFieldResolver('feed', 'likes'),
	},

	Bundle: {
		...createFieldResolver('bundle', 'author'),
		...createFieldResolver('bundle', 'tags'),
		...createFieldResolver('bundle', 'feeds'),
		...createFieldResolver('bundle', 'likes'),
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
		findFeedTags: async (_, { data }, { prisma }) =>
			await prisma.feedTag.findMany({
				where: {
					name: {
						contains: data.search,
					},
				},
			}),
		findBundleTags: async (_, { data }, { prisma }) =>
			await prisma.bundleTag.findMany({
				where: {
					name: {
						contains: data.search,
					},
				},
			}),
		findFeeds: async (_, { data }, { prisma }) =>
			await prisma.feed.findMany({
				where: {
					name: {
						contains: data.search,
					},
				},
			}),
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
		likeBundle: async (parent, { data }, { prisma, user }) => {
			const { id, likeState } = data;
			const connectState = likeState ? 'connect' : 'disconnect';
			return prisma.bundle.update({
				where: { id: id },
				data: { likes: { [connectState]: { id: user.id } } },
			});
		},
		likeFeed: async (parent, { data }, { prisma, user }) => {
			const { id, likeState } = data;
			const connectState = likeState ? 'connect' : 'disconnect';
			return prisma.feed.update({
				where: { id: id },
				data: { likes: { [connectState]: { id: user.id } } },
			});
		},
	},
};
