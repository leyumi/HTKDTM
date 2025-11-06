'use strict'

const { unGetSelectData } = require("../../utils");
const User = require("../user.model");

const isExistedUser = async (uid) => {
    try {
        const user = await User.findOne({ username: uid })
        return !!user;
    } catch (error) {
        throw error;
    }
};

const findUserByUid = async (username) => {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        // Ném lỗi để xử lý bên ngoài
        throw new Error(`Error finding user: ${error.message}`);
    }
};

const createUser = async (username, password) => {
    try {
        const newUser = new User({ username, password });

        await newUser.save();
        return newUser;
    } catch (error) {
        throw error;
    }
}

const updateUser = async (username, updateData) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { $set: updateData },
            { new: true, runValidators: true }
        ).select(unGetSelectData(['__v', 'password', 'created_at', 'updated_at']));

        if (!updatedUser) {
            return null;
        }

        if(updatedUser['gpa']){
            updatedUser.isSynced = true;
        }
        updatedUser.save();

        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateRoleUser = async (username) => {
    const userUpdated = await User.findOneAndUpdate(
        { username: username},
        { role: 'paid_user', updated_at: Date.now() },
        { new: true, runValidators: true }
    ).select(unGetSelectData(['__v', 'password', 'created_at', 'updated_at']));

    if(!userUpdated){
        return null;
    }

    return userUpdated;
}

module.exports = {
    isExistedUser,
    findUserByUid,
    createUser,
    updateUser,
    updateRoleUser
}