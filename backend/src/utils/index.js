'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongodb = (id) => {
  try {
    return new Types.ObjectId(id);
  } catch (error) {
    return null;
  }
};

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const pickFieldObject = (fields = [], object = {}) => {
  return Object.fromEntries(
    Object.entries(object._doc || object)
      .filter(([key]) => fields.includes(key))
  );
}

// ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedNullObject = (obj) => {
  const result = {};

  Object.keys(obj).forEach((k) => {
    const current = obj[k];

    if ([null, undefined].includes(current)) return;
    if (Array.isArray(current)) return;

    if (typeof current === "object") {
      result[k] = removeUndefinedNullObject(current);
      return;
    }

    result[k] = current;
  });

  return result;
};

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/');

  return new Date(`${year}-${month}-${day}`);
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  // Chuyển đổi sang múi giờ Việt Nam (GMT+7)
  const vietnamOffset = 7 * 60; // Phút
  const localTime = new Date(date.getTime() + vietnamOffset * 60 * 1000);

  // Lấy ngày, tháng, năm
  const day = localTime.getUTCDate().toString().padStart(2, '0');
  const month = (localTime.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = localTime.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

module.exports = {
  pickFieldObject,
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedNullObject,
  convertToObjectIdMongodb,
  parseDate,
  formatDate
}