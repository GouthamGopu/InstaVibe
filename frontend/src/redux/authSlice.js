import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        updateFollowing: (state, action) => {
            const { userId, isFollowing } = action.payload;

            // Update the following status of the logged-in user
            if (state.user) {
                if (isFollowing) {
                    state.user.following.push(userId);
                } else {
                    state.user.following = state.user.following.filter(id => id !== userId);
                }
            }

            // Update the followers of the user being followed
            if (state.userProfile) {
                if (isFollowing) {
                    state.userProfile.followers.push(state.user._id);
                } else {
                    state.userProfile.followers = state.userProfile.followers.filter(id => id !== state.user._id);
                }
            }
        },
        // Add a new action for updating bookmarks
        updateBookmarks: (state, action) => {
            const { postId, isBookmarked } = action.payload;
            if (state.user) {
                if (isBookmarked) {
                    state.user.bookmarks.push(postId);
                } else {
                    state.user.bookmarks = state.user.bookmarks.filter(id => id !== postId);
                }
            }
        },
    }
});

export const {
    setAuthUser,
    setSuggestedUsers,
    setUserProfile,
    setSelectedUser,
    updateFollowing,
    updateBookmarks,  // Export the new action
} = authSlice.actions;

export default authSlice.reducer;
