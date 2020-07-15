function checkDate(date: string, withDash: Boolean = true): boolean {
  let pattern = /^(19[7-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (withDash === false) {
    pattern = /^(19[7-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
  }
  if (pattern.test(date)) {
    return true;
  }
  return false;
}
function checkEmail(email: string): boolean {
  const exp: RegExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  if (exp.test(email) == false) {
    //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우
    return false;
  }
  return true;
}
export { checkDate, checkEmail };
