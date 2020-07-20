import Letter from '../models/Letter';

export async function deleteOldLetters() {
  let date = new Date();

  date.setDate(date.getMonth() - 1);

  try {
    console.log('오래된 편지 삭제 시작');
    const letters = await Letter.find().where('registerDate').lt(date);
    console.log('편지 개수 총 ', letters.length, '개');
    for (let letter of letters) {
      await letter.remove();
    }
    console.log('편지 삭제 완료');
  } catch (error) {
    console.error(error);
  }
}
