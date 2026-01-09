import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password<DataModel>()],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      // Only create profile for new users (not updates)
      if (existingUserId) {
        return;
      }

      // Use an internal mutation to create the profile
      await ctx.scheduler.runAfter(
        0,
        internal.mutations.userProfiles.createForNewUser,
        {
          userId,
        },
      );
    },
  },
});
