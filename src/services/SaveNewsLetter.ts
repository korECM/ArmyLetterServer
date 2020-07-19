import { News, NewsCategory } from '../module/GetNews';
import ArmySoldier from '../models/ArmySoldier';
import AirForceSoldier from '../models/AirForceSoldier';
import db from '../DB';
import Letter from '../models/Letter';

let newsName = {
  all: '종합',
  entertain: '연예',
  sports: '스포츠',
  society: '사회',
  politics: '정치',
  economic: '경제',
  foreign: '국제',
  culture: '문화생활',
  digital: 'IT과학',
};

export async function saveNewsLetter() {
  console.log('News 저장 시작');

  try {
    await saveNewsLetterWithCategory('all');
    await saveNewsLetterWithCategory('culture');
    await saveNewsLetterWithCategory('digital');
    await saveNewsLetterWithCategory('economic');
    await saveNewsLetterWithCategory('entertain');
    await saveNewsLetterWithCategory('foreign');
    await saveNewsLetterWithCategory('politics');
    await saveNewsLetterWithCategory('society');
    await saveNewsLetterWithCategory('sports');
  } catch (error) {
    console.error(error);
  }
  console.log('News 저장 끝');
}

async function saveNewsLetterWithCategory(category: NewsCategory) {
  let news = await getNewsContentWithCategory(category);
  await saveNewsWithSoldier(category, news);
}

async function getNewsContentWithCategory(category: NewsCategory) {
  const news = (await News(category)).gets(['title', 'content']);

  let newsItems: NewsItem[] = [];

  news.forEach(async (newsElement) => {
    newsItems.push({
      title: newsElement.title,
      body: newsElement.content,
    });
  });

  return newsItems;
}

interface NewsItem {
  title: string;
  body: string;
}

async function saveNewsWithSoldier(category: NewsCategory, newsContents: NewsItem[]) {
  let date = new Date();
  let armySoldiers = await ArmySoldier.find({ news: category });
  let airForceSoldiers = await AirForceSoldier.find({ news: category });

  for (const news of newsContents) {
    let letter = new Letter({
      title: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${newsName[category]} 뉴스 : ${news.title}`,
      body: news.body,
    });
    await letter.save();

    await Promise.all(
      armySoldiers.map(async (soldier) => {
        if (!soldier.letters) soldier.letters = [];
        soldier.letters.push(letter._id);
        await soldier.save();
      }),
    );

    await Promise.all(
      airForceSoldiers.map(async (soldier) => {
        if (!soldier.letters) soldier.letters = [];
        soldier.letters.push(letter._id);
        await soldier.save();
      }),
    );
  }
}
