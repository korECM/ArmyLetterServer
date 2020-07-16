import request from 'request-promise';
import cheerio from 'cheerio';
import { AirForceSoldier } from '../../Models';
async function getSoldierList(soldier: AirForceSoldier): Promise<AirForceSoldier[]> {
  let AFSoldierList: AirForceSoldier[] = [];
  return new Promise((resolve, reject) => {
    request(
      encodeURI(`http://www.airforce.mil.kr:8081/user/emailPicViewSameMembers.action?siteId=last2&searchName=${soldier.name}&searchBirth=${soldier.birthDate}`),
      (err, response, body) => {
        if (err) reject(err);
        let $ = cheerio.load(body);
        //       let $ = cheerio.load(
        //         `
        // <html lang="ko" xmlns="http://www.w3.org/1999/xhtml">
        // <head>
        // </head>
        // <body>
        // 	<div id="emailPic-container" class="popup">
        // 		<ul class="SameResultList">
        // 			<li>
        // 				<div class="photo png">
        // 					<img src="/user/last2/images/emailPic/222834448/1224.jpg" alt="박종욱 교육생 사진" /></div>
        // 					<strong>박종욱</strong>
        // 					<div class="info">
        // 						<dl class="first">
        // 							<dt>소속 </dt>
        // 							<dd> :
        // 								신병 2대대
        // 								1중대
        // 								2소대
        // 								122호실
        // 								24번
        // 							</dd>
        // 						</dl>
        // 						<dl>
        // 							<dt>입대날짜</dt>
        // 							<dd>: 2020-04-06</dd>
        // 						</dl>
        // 						<dl>
        // 							<dt>수료예정날짜</dt>
        // 							<dd>: 2020-05-08</dd>
        // 						</dl>
        // 					</div>
        // 					<input type="button" class="choice" value="선택하기" onclick="resultSelect('222834497')" />
        //           </li>
        //           <li>
        //           <div class="photo png">
        //             <img src="/user/last2/images/emailPic/222834448/1224.jpg" alt="박종욱 교육생 사진" /></div>
        //             <strong>박종욱2</strong>
        //             <div class="info">
        //               <dl class="first">
        //                 <dt>소속 </dt>
        //                 <dd> :
        //                   신병 2대대
        //                   100중대
        //                   2000소대
        //                   120002호실
        //                   200004번
        //                 </dd>
        //               </dl>
        //               <dl>
        //                 <dt>입대날짜</dt>
        //                 <dd>: 5020-04-06</dd>
        //               </dl>
        //               <dl>
        //                 <dt>수료예정날짜</dt>
        //                 <dd>: 5020-05-08</dd>
        //               </dl>
        //             </div>
        //             <input type="button" class="choice" value="선택하기" onclick="resultSelect('123456')" />
        //             </li>
        // 		</ul>
        // 	</div>
        // </body>
        // </html>
        //       `
        //       );
        let soldierList = $('#emailPic-container > ul > li');
        if (soldierList.text().includes('교육생이 없습니다.')) {
          resolve(AFSoldierList);
          return;
        }
        soldierList.each(function (this: CheerioElement, index, elem) {
          let name = $(this).children('strong').text();
          let info = $(this)
            .children('.info')
            .children()
            .eq(0)
            .children()
            .eq(1)
            .text()
            .replace(':', '')
            .trim()
            .replace(/ /gi, '')
            .replace(/\t/gi, '')
            .replace(/\n/gi, ' ');
          let enterDate = $(this).children('.info').children().eq(1).children('dd').text().replace(':', '').trim();
          let endDate = $(this).children('.info').children().eq(2).children('dd').text().replace(':', '').trim();
          let imageURL = 'http://www.airforce.mil.kr:8081/' + $(this).children('.photo.png').children().eq(0).attr('src');

          let traineeNum = $(this)
            .children('input')
            .attr('onclick')
            ?.replace(/[^0-9]/g, '');
          let newSoldier = new AirForceSoldier({ name, birthDate: soldier.birthDate, enterDate, endDate, traineeNum, soldierInfo: info, imageURL });
          AFSoldierList.push(newSoldier);
        });
        resolve(AFSoldierList);
      },
    );
  });
}

export { getSoldierList };
