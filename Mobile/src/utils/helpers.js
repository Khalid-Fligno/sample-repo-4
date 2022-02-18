import moment from "moment";

export const isDateSameorAfterCurrent = (date) => {
  const currentDate = moment().format("YYYY-MM-DD");
  return moment(currentDate).isSameOrAfter(date);
};
