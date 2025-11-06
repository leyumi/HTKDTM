const bcrypt = require('bcrypt');
const { findUserByUid, isExistedUser, createUser, updateUser, updateRoleUser } = require('../models/repositories/user.repo');
const { generateToken } = require('../services/token.service');
const { getTokenTlu, getSummaryMark, getListMarkDetail, getCourseSubject } = require('./student.controller');
const { parseDate, formatDate } = require('../utils');
const Invoice = require('../models/invoice.model');

const signup = async (req, res) => {
    try {
        // Mẫu body request
        // {
        //     "username": "",
        //     "password": "",
        // }
        const { username, password } = req.body;

        // Kiểm tra dữ liệu yêu cầu
        if (!username || !password) {
            return res.status(400).json({
                message: 'Required fields: username, password',
            });
        }

        // kiểm tra ng dùng có tồn tại hay chưa
        const existingUser = await isExistedUser(username);
        if (existingUser) {
            return res.status(409).json({
                message: 'Username already exists',
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, hashedPassword);
        return res.status(201).json({
            message: 'Create new user success',
            data: newUser,
        });
    }
    catch (error) {
        console.log("LỖI CHI TIẾT TẠI syncDataStudent:", error);
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
}

// login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userFound = await findUserByUid(username);
        if (!userFound) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isValid = bcrypt.compareSync(password, userFound.password);
        if (!isValid) {
            return res.status(400).json({
                message: "Password not correct",
            });
        }

        const token = await generateToken(userFound);

        return res.status(200).json({
            message: 'Get token success',
            data: 'Bearer ' + token,
        });

    } catch (error) {
        console.log("LỖI CHI TIẾT TẠI syncDataStudent:", error);
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userFound = await findUserByUid(req.user.username);
        if (!userFound) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const fields = ['uid', 'role', 'class', 'date_of_birth', 'department', 'email', 'full_name', 'gender', 'gpa', 'major', 'list_mark', 'study_schedule'];

        // const data = pickFieldObject(fields, userFound);
        return res.status(200).json({
            message: 'Get current user success',
            data: userFound,
        });
    }
    catch (error) {
        console.log("LỖI CHI TIẾT TẠI syncDataStudent:", error);
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
}

const syncDataStudent = async (req, res) => {
    try {

        // const userFound = await findUserByUid(req.user.username);

        // if(!userFound.isSynced){
        //     return res.status(400).json({
        //         message: 'This user had sync data'
        //     });
        // }

        const { username, password } = req.body;

        const tokenTlu = await getTokenTlu(username, password);
        const summaryMark = await getSummaryMark(tokenTlu);
        const listMarkDetail = await getListMarkDetail(tokenTlu);
        const courseSubject = await getCourseSubject(tokenTlu);

        if(summaryMark === null || listMarkDetail === null || courseSubject === null){
            return res.status(503).json({
                message: 'Error get info student from TLU'
            });
        }

        const translatedGender = summaryMark.gender === 'F' ? 'FM' : summaryMark.gender;
        const updateData = {
            "uid": summaryMark.uid,
            "email": summaryMark.email,
            "full_name": summaryMark.displayName,
            "gender": translatedGender,
            "date_of_birth": summaryMark.birthDate,
            "department": summaryMark.department,
            "major": summaryMark.speciality,
            "class": summaryMark.class,
            "gpa": summaryMark.gpa4,
            "study_schedule": courseSubject,
            "list_mark": listMarkDetail
        }

        const userUpdated = await updateUser(req.user.username, updateData);

        if (!userUpdated) {
            return res.status(400).json({
                message: 'Error sync info user'
            });
        }

        return res.status(200).json({
            message: 'Sync data success',
            data: userUpdated,
        });
    }
    catch (error) {
        console.log("LỖI CHI TIẾT TẠI syncDataStudent:", error);

        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
};

const updateRole = async (req, res) => {
    try {
        const userUpdated = await updateRoleUser(req.user.username);

        if (!userUpdated) {
            return res.status(400).json({
                message: 'Error update role'
            });
        }

        const userFound = await findUserByUid(req.user.username);
        const token = await generateToken(userFound);

        return res.status(200).json({
            message: 'Update role success',
            data: `Bearer ${token}`,
        });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
}

const changePassword = async(req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const username = req.user.username;

        const userFound = await findUserByUid(username);
        if (!userFound) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isValid = bcrypt.compareSync(oldPassword, userFound.password);
        if (!isValid) {
            return res.status(400).json({
                message: "Old password not correct",
            });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        const userUpdated = await updateUser(req.user.username, {'password': newPasswordHash});

        if (!userUpdated) {
            return res.status(400).json({
                message: 'Error change password user'
            });
        }

        return res.status(200).json({
            message: 'Update password user success',
            data: [],
        });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
}

const checkMembershipStatus = async (req, res) => {
    const userId = req.user._id;

    try {
        const latestInvoice = await Invoice.findOne({ userId, status: 'paid' })
            .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian tạo
            .exec();

        if (!latestInvoice) {
            return res.status(200).json({
                isPaidMember: false,
                daysRemaining: 0,
                message: 'User is not a paid member',
            });
        }

        // Lấy thông tin từ hóa đơn
        const { plan, createdAt } = latestInvoice;
        const now = new Date();

        // Tính thời gian hết hạn
        const expiryDate = new Date(createdAt);
        if (plan === 'month') {
            expiryDate.setMonth(expiryDate.getMonth() + 1); // Thêm 1 tháng
        } else if (plan === 'year') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Thêm 1 năm
        }

        // Tính số ngày còn lại
        const timeDiff = expiryDate - now;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Chuyển đổi ms sang ngày

        if (timeDiff <= 0) {
            return res.status(200).json({
                isPaidMember: false,
                daysRemaining: 0,
                message: 'Membership has expired',
            });
        }

        return res.status(200).json({
            isPaidMember: true,
            daysRemaining,
            message: 'User is a paid member',
        });
    } catch (error) {
        console.log("LỖI CHI TIẾT TẠI syncDataStudent:", error);
        return res.status(500).json({
            message: `Error checking membership status: ${error.message}`,
        });
    }
};


module.exports = {
    signup,
    login,
    getCurrentUser,
    syncDataStudent,
    updateRole,
    changePassword,
    checkMembershipStatus
}