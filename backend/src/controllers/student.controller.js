const axios = require('axios');
const { formatDate } = require('../utils');

const baseUrl = 'https://sinhvien1.tlu.edu.vn';

//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

// get token tlu
const getTokenTlu = async (username, password) => {
    try {
        const apiUrl = `${baseUrl}/education/oauth/token`;

        // Mẫu body request
        // {
        //     "username": "",
        //     "password": "",
        // }

        // const {username, password} = req.body;
        const requestData = {
            "client_id": "education_client",
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_secret": "password"
        };

        const response = await axios.post(apiUrl, requestData);

        return `Bearer ${response.data['access_token']}`;
    } catch (error) {
        console.log(error);
        return error.message;
    }
};

const getListMarkDetail = async (token) => {
    try {
        const apiUrl = `${baseUrl}/education/api/studentsubjectmark/getListMarkDetailStudent`;

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': token
            },
        });

        const excludedSubjects = ['Chủ nghĩa xã hội khoa học', 'Kinh tế chính trị Mác - Lênin', 'Kỹ năng mềm và tinh thần khởi nghiệp', 'Lịch sử Đảng Cộng sản Việt Nam', 'Pháp luật đại cương', 'Triết học Mác - Lênin', 'Tư tưởng Hồ Chí Minh', 'Tiếng Anh 1', 'Tiếng Anh 2', 'Tiếng Anh chuyên ngành công nghệ thông tin', 'Đại số tuyến tính', 'Giải tích hàm một biến', 'Giải tích hàm nhiều biến', 'Xác suất thống kê'];

        const result = response.data
            .filter(item => !excludedSubjects.includes(item.subject.subjectName))
            .map(item => {
                return {
                    subjectName: item['subject']['subjectName'],
                    mark: item['mark'],
                    mark4: item['mark4'],
                    charmark: item['charMark']
                };
            });

        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getSummaryMark = async (token) => {
    try {
        const apiUrl = `${baseUrl}/education/api/studentsummarymark/getbystudent`;

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': token
            },
        });

        const data = response.data;
        const result = {
            "uid": data['student']['studentCode'],
            "displayName": data['student']['displayName'],
            "username": data['student']['username'],
            "email": data['student']['user']['email'],
            "birthPlace": data['student']['birthPlace'],
            "birthDate": data['student']['birthDateString'],
            "gender": data['student']['gender'],
            "phoneNumber": data['student']['phoneNumber'],
            "idNumber": data['student']['idNumber'],
            "class": data['student']['enrollmentClass']['className'],
            "speciality": data['student']['enrollmentClass']['speciality']['name'],
            "department": data['student']['enrollmentClass']['department']['name'],
            "courseyear": data['student']['enrollmentClass']['courseyear']['name'],
            "gpa4": data['mark4'],
            "gpa10": data['mark']
        };

        return result
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getCourseSubject = async (token) => {
    try {
        const apiUrl = `${baseUrl}/education/api/StudentCourseSubject/studentLoginUser/11`;

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': token
            },
        });

        const data = response.data;
        const filterDate = new Date('2024-11-11');
        let result = data
            .map(item => {

                const startDate = item['courseSubject']['timetables'][0]['startDate'];
                const endDate = item['courseSubject']['timetables'][0]['endDate'];

                if (startDate < filterDate) {
                    return null;
                }

                let timetablesArray = [];
                const timetables = item['courseSubject']['timetables'];

                for (let i = 0; i < timetables.length; i++) {
                    const weekIndex = timetables[i]['weekIndex'];
                    const startHour = timetables[i]['startHour']?.startString; 
                    const endHour = timetables[i]['endHour']?.endString;

                    timetablesArray.push({ weekIndex, startHour, endHour });
                }

                return {
                    subjectName: item['subjectName'],
                    subjectCode: item['subjectCode'],
                    timetables: timetablesArray,
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate)
                };
            })
            .filter(item => item !== null);

        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    getTokenTlu,
    getListMarkDetail,
    getSummaryMark,
    getCourseSubject
};