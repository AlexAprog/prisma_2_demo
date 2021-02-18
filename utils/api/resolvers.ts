import { verifyOwnership } from './verifyOwnership';

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
	SavedArticle: {
		...createFieldResolver('savedArticle', 'feeds'),
		...createFieldResolver('savedArticle', 'author'),
	},
	User: {
		...createFieldResolver('user', 'bundles'),
		...createFieldResolver('user', 'feeds'),
		...createFieldResolver('user', 'feedLikes'),
		...createFieldResolver('user', 'bundleLikes'),
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
		savedArticle: async (_, { data: { url } }, { prisma, user: { id: authorId } }) => {
			const savedArticles = await prisma.savedArticle.findMany({
				where: {
					url,
					authorId,
				},
			});
			return savedArticles[0];
		},
		savedArticles: async (_, args, { prisma, user: { id: authorId } }) => {
			const savedArticles = await prisma.savedArticle.findMany({
				where: {
					authorId: authorId ? authorId : null,
				},
			});
			return savedArticles;
		},
		me: async (parent, args, { prisma, user: { id } }) => prisma.user.findUnique({ where: { id } }),
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
		createSavedArticle: async (_, { data }, { prisma, user }) => {
			const author = { author: { connect: { id: user.id } } };
			return await prisma.savedArticle.create({
				data: { ...data, ...author },
			});
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
		updateFeed: async (parent, { data: { id, ...feedUpdate } }, { prisma, user }) => {
			const feed = await prisma.feed.findUnique({
				where: {
					id,
				},
				include: {
					author: true,
				},
			});
			await verifyOwnership(feed, user);
			return prisma.feed.update({
				where: {
					id,
				},
				data: { ...feedUpdate },
			});
		},
		updateBundle: async (parent, { data: { id, ...bundleFeed } }, { prisma, user }) => {
			const bundle = await prisma.bundle.findUnique({
				where: {
					id,
				},
				include: {
					author: true,
				},
			});
			await verifyOwnership(bundle, user);
			return prisma.bundle.update({
				where: {
					id,
				},
				data: { ...bundleFeed },
			});
		},
		deleteBundle: async (_, { data: { id } }, { prisma, user }) => {
			const bundle = await prisma.bundle.findUnique({
				where: {
					id,
				},
				include: {
					author: true,
				},
			});
			await verifyOwnership(bundle, user);
			return await prisma.bundle.delete({
				where: {
					id,
				},
			});
		},
		deleteFeed: async (_, { data: { id } }, { prisma, user }) => {
			const feed = await prisma.feed.findUnique({
				where: {
					id,
				},
				include: {
					author: true,
				},
			});
			await verifyOwnership(feed, user);
			return await prisma.feed.delete({
				where: {
					id,
				},
			});
		},
		deleteSavedArticle: async (_, { data: { id } }, { prisma, user }) => {
			const savedArticle = await prisma.savedArticle.findUnique({
				where: {
					id,
				},
				include: {
					author: true,
				},
			});
			await verifyOwnership(savedArticle, user);
			return await prisma.savedArticle.delete({
				where: {
					id,
				},
			});
		},
	},
};
