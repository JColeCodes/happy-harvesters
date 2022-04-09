// require apollo server
const { AuthenticationError } = require('apollo-server-express');
const { coerceInputValue } = require('graphql');
const { Schema } = require('mongoose');
// require necessary models
const { User } = require('../models');
// require auth
const { signToken } = require('../utils/auth');

// define resolvers
const resolvers = {
  Query: {
    users: async () => {
      return User.find().select('-__v -password');
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      // create new user in db w/ args passed in
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    addJuicer: async (parent, args, context) => {
      if (context.user) {
        console.log(args);
        // const juicer = await Juicer.create({ duration: args.duration});

        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { juicers: { duration: args.duration } } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    addMasher: async (parent, args, context) => {
      if (context.user) {
        console.log(args);

        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { mashers: { _id: args.id, duration: args.duration } } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    addOven: async (parent, args, context) => {
      if (context.user) {
        console.log(args);

        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { ovens: { _id: args.id, duration: args.duration } } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    addTree: async (parent, args, context) => {
      if (context.user) {
        console.log(args);

        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { trees: { _id: args.id, duration: args.duration } } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError('You need to be logged in!');
    },


    // updateJuicer
    // need user ID and juicer ID
    // update startedAtTime
    // update duration with upgrades
    updateJuicer: async (parent, args, context) => {
        if (context.user) {

            const user = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $set: { juicers: { juicerId: args.juicerId, startedAtTime: args.startedAtTime, duration: args.duration } } },
                { new: true }
            )

            return user;
        }

        throw new AuthenticationError('You need to be logged in!');
    },

    updateMasher: async (parent, args, context) => {
        if (context.user) {

            const user = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $set: { mashers: { masherId: args.masherId, startedAtTime: args.startedAtTime, duration: args.duration } } },
                { new: true }
            )

            return user;
        }

        throw new AuthenticationError('You need to be logged in!');
    },

    updateOven: async (parent, args, context) => {
        if (context.user) {

            const user = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $set: { ovens: { ovenId: args.ovenId, startedAtTime: args.startedAtTime, duration: args.duration } } },
                { new: true }
            )

            return user;
        }

        throw new AuthenticationError('You need to be logged in!');
    },

    updateTree: async (parent, args, context) => {
        if (context.user) {

            const user = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $set: { trees: { treeId: args.treeId, startedAtTime: args.startedAtTime, duration: args.duration } } },
                { new: true }
            )

            return user;
        }

        throw new AuthenticationError('You need to be logged in!');
    },

    // updateUser
    // find user by id
    // update either gemCount, appleCount, money OR user info like username or email

    // updateUser: async (parent, args, context) => {
    //     if (context.user) {

    //         const user = await User.findByIdAndUpdate(
    //             { _id: context.user._id },
    //             { $set: {} },
    //             { new: true }
    //         )

    //         return user;
    //     }

    //     throw new AuthenticationError('You need to be logged in!');
    // }
  },
};

// modularize resolvers
module.exports = resolvers;
