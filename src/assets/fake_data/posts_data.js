import img1 from '../images/article1.jpg';
import img2 from '../images/article2.jpg';
import img3 from '../images/article3.jpg';
import img4 from '../images/article4.jpg';

const postsData = [
  {
    id: 1,
    img: img2,
    type: 'Maqola',
    date: 'July 10, 2024',
    title: "Sun'iy intellekt nima va u dunyo bo’ylab qanday joriy etilmoqda?",
    description: `
    Sun'iy intellekt (AI) - bu mashinalarning tilni tushunish, tasvirlarni tanib olish, qaror qabul qilish va muammolarni hal qilish kabi odatda inson aql-zakovati talab qilinadigan vazifalarni bajarish qobiliyatini tavsiflovchi atama. AI yagona texnologiya emas, balki turli sohalar va ilovalarga qo'llanilishi mumkin bo'lgan usullar va vositalar to'plamidir.
    
    \br Sun'iy intellekt o'nlab yillar davomida mavjud bo'lib kelgan, ammo so'nggi yillarda hisoblash quvvati, ma'lumotlar mavjudligi va algoritmik texnikadagi yutuqlar tufayli u ko'proq e'tibor va mashhurlikka erishdi. AI endilikda shaxmat o‘ynash, kasalliklarni tashxislash, mashina haydash va musiqa bastalash kabi mashinalar uchun imkonsiz yoki o‘ta murakkab deb hisoblangan vazifalarni bajara oladi.
    
    \br AI bizning hayotimiz, jamiyatimiz va iqtisodiyotimizning ko'p qirralarini o'zgartirish imkoniyatiga ega. Bu bizning mahsuldorligimiz, samaradorligimiz, ijodkorligimiz va farovonligimizni yaxshilashga yordam beradi. Shuningdek, u iqlim o'zgarishi, qashshoqlik, sog'liqni saqlash va ta'lim kabi insoniyat oldida turgan eng katta muammolarni hal qilishda yordam berishi mumkin. Shu bilan birga, AI axloqiy, ijtimoiy, huquqiy va xavfsizlik masalalari kabi ba'zi xavf va qiyinchiliklarni ham keltirib chiqaradi. Shu sababli, sun'iy intellekt asoslarini, uning afzalliklari va cheklovlarini hamda undan qanday qilib mas'uliyatli va axloqiy foydalanishimiz mumkinligini tushunish muhimdir.
    `,
  },
  {
    id: 2,
    img: img3,
    type: 'Maqola',
    date: 'July 8, 2024',
    title: "Sun'iy Intellekt qanday qilib o'rganiladi?",
    description: `
    AI ishlashini ta'minlaydigan uchta asosiy komponent mavjud:

    \br Ma'lumotlar; AI tizimlari katta hajmdagi ma'lumotlarga o'rgatiladi, bu ularga modellarni o'rganish va aniqlash imkonini beradi. Bu ma'lumotlar matn va tasvirlardan tortib sensor ko'rsatkichlari va moliyaviy operatsiyalargacha bo'lgan har qanday narsa bo'lishi mumkin.
    
    \br 〽️ Algoritmlar; Algoritmlar AI tizimiga ma'lumotlarni qanday qayta ishlash va tahlil qilish kerakligini aytadigan ko'rsatmalar to'plamidir. Mashinani o'rganish, tabiiy tilni qayta ishlash va kompyuterni ko'rish kabi turli xil vazifalar uchun har xil turdagi algoritmlar qo'llaniladi.
    
    \br ➗ Hisoblash kuchi; AI hisob-kitoblari juda ko'p ishlov berish quvvatini talab qiladi. Shuning uchun AI tizimlari ko'pincha kuchli kompyuterlar yoki bulutli platformalarda ishlaydi.
    
    \br AI tizimlarini o'rganishning ikkita asosiy usuli mavjud:
    
    \br 🤖 Machine Learning; Bu AI tizimini etiketli misollarning katta ma'lumotlar to'plamida o'qitishni o'z ichiga oladi. Keyin tizim ma'lumotlardagi modellarni aniqlashni va bu modellar asosida bashorat qilishni o'rganadi.
    
    \br 🧠 Deep Learning; Bu inson miyasining tuzilishidan ilhomlangan sun'iy neyron tarmoqlardan foydalanadigan mashinani o'rganishning bir turi. Chuqur o'rganish tarmoqlari an'anaviy mashina o'rganish algoritmlarini aniqlash qiyin bo'lgan ma'lumotlardagi murakkab modellarni o'rganishi mumkin.
    `,
  },
  {
    id: 3,
    img: img4,
    type: 'Maqola',
    date: 'July 8, 2024',
    title:
      "Sun'iy Intellekt yaqin kelajakda odamlar ish o'rnini olib qo'ymaydimi?",
    description: `
    Sun'iy intellektning turli sohalarga ta'siri bir muncha vaqtdan beri muhokama qilinadigan mavzu. Garchi sun'iy intellekt korxonalarning ishlash uslubini o'zgartirayotganini inkor etib bo’lmasa ham, robot-mashinalar inson o'rnini to'liq almashtira olmasligini tushunish juda muhimdir.
    
    \br 🤖Buning o'rniga, sun'iy intellektga asoslangan robotlar inson aql-zakovatini to'ldiradi va samaradorlik va mahsuldorlikni oshirish uchun tandemda ishlaydi. Inson va mashina aqlining integratsiyasi bir qator vazifalarda samaradorlik va aniqlikni oshirishga olib keladi. Ushbu hamkorlik inson xatolarini minimallashtirish va aniqlikni oshirishga yordam beradi va natijada natijalar tezligini oshiradi. Shuni tan olish kerakki, avtomatlashtirish ma'lum ish o'rinlarini yo'qotishga olib kelishi bilan birga, yangi ish o'rinlarini ham yaratadi.
    
    \br 〽️Forrester hisobotiga ko'ra, avtomatlashtirish 2032 yilga borib AQShda 11 million (7%) ish o'rinlarini egallashiga qaramay, ular oddiy yo'qotishlar hisoblanadi, chunki ular asosan professional xizmatlar, qayta tiklanadigan energiya va aqlli infratuzilma kabi sohalarda yangi ish imkoniyatlari bilan muvozanatlanadi. Bundan tashqari, o‘n yil ichida yaratilgan 9,6 milliondan ortiq ish o‘rinlari ish o‘rinlarini yo‘qotishlar sonini 11 milliondan 1,5 milliongacha kamaytiradi. (Manba)
    
    \br 📃1500 ta kompaniya ishtirok etgan tadqiqotda tadqiqotchilar ish unumdorligining eng sezilarli yaxshilanishi odamlar va mashinalar birgalikda ishlaganda sodir bo'lganligini aniqladilar.
    
    \br Tadqiqot Manbasi: https://hbr.org/2018/07/collaborative-intelligence-humans-and-ai-are-joining-forces
    `,
  },
  {
    id: 4,
    img: img1,
    type: 'Maqola',
    date: 'July 5, 2024',
    title: 'Zamon AI Nima?',
    description: `
🔎  ZamonAI loyhasi o'zi nima? Loyiha nomidan bilishingiz mumkinki bu loyiha asosan sun'iy intellekt haqida. Bilamizki hozirda ko'pchilik insonlar sun'iy intellekt degandan faqatgina ChatGPT  yoki Robotlarni  tushinishadi, lekin bu aslida nima va hayotda uning qanday joriy etish yo'llari bor?   Biz ushbu loyiha orqali bu savolga javob topishingiz mumkin!
   
    \br 🎯 Ko'plab maktablarda katta sinf va hattoki universitet yillarigacha bu bilimlar berilmaydi va bizning maqsadimiz shuki O'zbekistondagi dasturlashga qiziqqan lekin ingliz tili yoki rus tilini bilmasligi tufayli o'zbek tilida dasturlashga va Sun'iy Intellektga oid kerak ma'lumotlarni topolmasdan yurgan yoshlarga saviyali bilimlarni ulashishdir. Ushbu loyiha nafaqat sun'iy intellekt, balki dasturlashga oid bilimlarni ham o'z ichiga qamrab oladi.
   
    \br 🌐 Siz ushbu loyiha orqali dasturlash haqidagi maqolalarni tarjimasi va  kuchli dasturchilar bilan Telegram yoki Zoom orqali bo'lib o'tadigan jonli suhbatimizga qo'shilish imkoniyatiga ega bo'lingiz mumkin.
    `,
  },
];

export default postsData;
