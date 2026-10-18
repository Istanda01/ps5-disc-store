import { ArrowUpRight, Code2, Database, Disc3 } from 'lucide-react';
import { team } from '../data/team';
import { sources } from '../data/sources';

const technologies = [
  ['React 19', 'สร้างหน้าจอและส่วนประกอบที่ใช้ซ้ำ เช่น การ์ดเกม ปุ่ม และเมนู', 'ใช้สร้างทั้ง 5 หน้า ได้แก่ หน้าร้าน Detail Wishlist Compare และ About เมื่อข้อมูลหรือสิ่งที่ผู้ใช้เลือกเปลี่ยน React จะปรับหน้าจอให้ตรงกับสถานะนั้น'],
  ['TypeScript', 'เพิ่มการกำหนดชนิดข้อมูลให้ JavaScript เพื่อช่วยตรวจข้อผิดพลาดระหว่างพัฒนา', 'กำหนด interface Game เช่น title เป็นข้อความ price เป็นตัวเลข และ screenshots เป็นรายการข้อความ รวมถึงกำหนดชนิด State และ Actions ของ Zustand'],
  ['Vite', 'รันเว็บระหว่างพัฒนาและ build โค้ดเป็นไฟล์สำหรับนำไปใช้งาน', 'เปิดเว็บ React ระหว่างแก้โค้ด และตั้ง proxy ให้คำขอ /api ส่งต่อไป JSON Server การ build เว็บเพียงอย่างเดียวไม่ได้เปิด JSON Server ให้ทำงาน'],
  ['React Router v7', 'จัดการ URL และการเปลี่ยนหน้าภายในเว็บแบบ SPA โดยไม่ต้องโหลดเอกสาร HTML ใหม่ทั้งหน้าทุกครั้ง', 'ใช้ createBrowserRouter กำหนดเส้นทาง, Outlet แสดงหน้าภายใน Layout, NavLink ทำเมนูและระบุหน้าปัจจุบัน และ useParams อ่าน ID ใน /games/:id เพื่อเปิดเกมที่เลือก'],
  ['Tailwind CSS', 'จัดรูปแบบด้วยคลาสสำหรับสี ขนาด ระยะห่าง และการวางองค์ประกอบ ร่วมกับ CSS ที่เขียนเพิ่มเติม', 'จัดหน้าร้าน การ์ด ตาราง และระยะห่าง โดยมี CSS responsive ปรับจำนวนคอลัมน์ ขนาดตัวอักษร และ Layout ให้เหมาะกับมือถือ แท็บเล็ต และคอมพิวเตอร์'],
  ['DaisyUI', 'เป็นชุดรูปแบบ UI ที่ใช้ร่วมกับ Tailwind CSS เพื่อให้ส่วนประกอบต่าง ๆ มีรูปแบบสอดคล้องกัน', 'ใช้คลาส btn สำหรับปุ่ม, card สำหรับการ์ด, select สำหรับช่องเลือก, badge สำหรับป้าย และ skeleton สำหรับสถานะกำลังโหลด พร้อมกำหนดธีมสีเข้มของร้าน'],
  ['JSON Server', 'อ่าน db.json แล้วเปิดเป็น Mock REST API ให้เว็บขอข้อมูลผ่าน HTTP', 'GET /games ส่งรายการเกม และ GET /games/:id ส่งรายละเอียดตาม ID โดยเปิดแบบอ่านอย่างเดียว ข้อมูล Wishlist และ Compare ไม่ถูกเขียนกลับลง db.json'],
  ['TanStack Query v5', 'ดูแล Server State ได้แก่ข้อมูลเกมจาก API การแคช สถานะกำลังโหลด และข้อผิดพลาด', 'หน้าร้าน Wishlist และ Compare ใช้แคชรายการเกมร่วมกัน ส่วน Detail แยกแคชตาม ID กำหนด staleTime 5 นาที หมายถึงข้อมูลยังถือว่าสดในช่วงนั้น ไม่ใช่ดึงใหม่อัตโนมัติทุก 5 นาที และมี Retry ให้ลองโหลดใหม่เมื่อผิดพลาด'],
  ['Zustand', 'ดูแล Client State หรือสถานะที่เกิดจากการเลือกและการใช้งานของผู้ใช้', 'เก็บคำค้น ประเภทเกม วิธีเรียง ข้อความแจ้งเตือน และ ID เกมใน Wishlist กับ Compare โดย Compare เลือกได้สูงสุด 2 เกม ไม่เก็บชื่อเกม ราคา รูป หรือข้อมูลเกมทั้งหมดจาก API ซ้ำใน Store'],
  ['persist middleware และ LocalStorage', 'persist เป็นตัวช่วยของ Zustand ที่บันทึกสถานะที่เลือกลง LocalStorage ซึ่งเป็นพื้นที่เก็บข้อมูลในเบราว์เซอร์', 'บันทึกเฉพาะ wishlistIds และ compareIds เพื่อให้รีเฟรชหรือปิดเปิดเว็บใหม่ยังพบรายการเดิมในเบราว์เซอร์และที่อยู่เว็บเดิม ไม่ซิงก์ข้ามเครื่อง และอาจหายเมื่อผู้ใช้ล้างข้อมูลเว็บไซต์']
];

export function AboutPage() {
  return <div className="container inner-page about-page">
    <div className="page-heading"><div><span className="section-kicker">BEHIND THE COLLECTION</span><h1>รู้จัก Discs for Sale</h1><p>โปรเจกต์ร้านแผ่นเกม PS5 ที่เริ่มจากความสนุกในการเลือกเกม</p></div><Disc3 size={54} className="about-disc" /></div>
    
    <div className="section-heading"><div><span className="section-kicker">THE TEAM</span><h2>ทีมผู้พัฒนา</h2></div></div>
    <div className="team-grid">{team.map((member, i) => <article className="team-card card bg-base-100" key={i}>
      <div className="member-top"><img src={member.photo} alt={`รูปสมาชิก ${member.name}`} /><span className="member-number">0{i + 1}</span></div>
      <span className="role-label">{member.role}</span><h3>{member.name}</h3><p>ชื่อเล่น: {member.nickname}</p><p>รหัสนักศึกษา: {member.studentId}</p>
      <ul>{member.tasks.map(task => <li key={task}>{task}</li>)}</ul>
    </article>)}</div>
    <section className="sources-section system-explanation" aria-labelledby="data-heading">
      <div className="section-heading">
        <div><span className="section-kicker">DATA & API</span><h2 id="data-heading">ที่มาข้อมูลและการทำงานของ API</h2></div>
        <Database size={28} />
      </div>
      <div className="system-info-grid">
        <div>
          <h3>ข้อมูลเกมมาจากไหน</h3>
          <p>ทีมเตรียมข้อมูลเกมในไฟล์ <code>db.json</code> โดยเรียบเรียงรายละเอียดจากแหล่งอ้างอิงของเกม ส่วนราคาเป็นข้อมูลจำลอง ปัจจุบันเก็บไว้ 50 เกมเพื่อสำรองใช้ภายหลัง และนำ 20 เกมแรกมาใช้งานในรายการของเว็บ</p>
        </div>
        <div>
          <h3>ใน db.json เก็บอะไร</h3>
          <p>เก็บ ID ชื่อเกม ราคา ตำแหน่งรูปปก ประเภท จำนวนผู้เล่น แพลตฟอร์ม รูปแบบสินค้า วันวางจำหน่าย ผู้จัดจำหน่าย สถานะเกมแนะนำ และเรื่องย่อ บางเกมมี <code>banner</code> และ <code>screenshots</code> สำหรับภาพเพิ่มเติมในหน้า Detail</p>
        </div>
        <div>
          <h3>รูปภาพถูกเก็บอย่างไร</h3>
          <p>รูปที่แนบกับโปรเจกต์อยู่ใน <code>public/images/</code> ส่วนข้อมูลเกมเก็บเพียงตำแหน่งรูป เช่น <code>/images/game-01.jpg</code> ภาพสไลด์บางส่วนใช้ URL ภายนอกตามที่ระบุในข้อมูลเกม ภาพประกอบอาจไม่ใช่ภาพกล่องแผ่น PS5 จริง</p>
        </div>
        <div>
          <h3>JSON Server ทำหน้าที่อะไร</h3>
          <p>เปิดข้อมูลให้เป็น Mock REST API โดย <code>GET /games</code> ส่งรายการเกมในไฟล์ และ <code>GET /games/:id</code> ส่งรายละเอียดตาม ID จากนั้นโค้ดรายการของเว็บเลือกใช้ 20 เกมแรก ไม่ได้ดึงข้อมูลจากเว็บไซต์ PlayStation โดยตรงขณะใช้งาน</p>
        </div>
      </div>
      <div className="system-flow">
        <h3>ตัวอย่างเมื่อเปิดเว็บและบันทึกเกม</h3>
        <ol>
          <li><strong>เปิดหน้าร้าน:</strong> TanStack Query เรียก API ของ JSON Server เพื่อรับข้อมูลจาก db.json</li>
          <li><strong>แสดงเกม:</strong> React สร้างการ์ดจากข้อมูล โดย Tailwind CSS, DaisyUI และ CSS ของโปรเจกต์จัดหน้าตา</li>
          <li><strong>ดูรายละเอียด:</strong> React Router เปิด /games/:id และ TanStack Query เรียกข้อมูลเกมตาม ID นั้น</li>
          <li><strong>กดหัวใจ:</strong> Zustand บันทึกเฉพาะ ID เข้า Wishlist แล้ว persist เก็บ ID ลง LocalStorage เพื่อให้เปิดเว็บใหม่แล้วยังอยู่</li>
          <li><strong>เปิด Wishlist หรือ Compare:</strong> ใช้ ID ที่เลือกจับคู่กับรายการเกมในแคชของ TanStack Query หากต้องโหลดข้อมูลใหม่จะเรียกผ่าน API</li>
        </ol>
      </div>
      <div className="source-links">
        <a href="https://github.com/typicode/json-server/tree/v0.17.4" target="_blank" rel="noreferrer">คู่มือ JSON Server ที่ใช้เปิด Mock API <ArrowUpRight size={16} /></a>
      </div>
      <details className="source-details">
        <summary>ดูแหล่งอ้างอิงของเกม 20 รายการที่ใช้งาน</summary>
        <ul>
          {sources.map(s => <li key={s.title}><a href={s.url} target="_blank" rel="noreferrer">{s.title} <ArrowUpRight size={13} /></a></li>)}
          <li><a href="https://store.steampowered.com/app/2651280/" target="_blank" rel="noreferrer">ภาพสไลด์ Marvel’s Spider-Man 2 จาก Steam <ArrowUpRight size={13} /></a></li>
        </ul>
      </details>
    </section>
    <section className="sources-section system-explanation" aria-labelledby="technology-heading">
      <div className="section-heading">
        <div><span className="section-kicker">ARCHITECTURE & TECHNOLOGY</span><h2 id="technology-heading">เครื่องมือแต่ละตัวใช้ทำอะไร</h2></div>
        <Code2 size={28} />
      </div>
      <p className="architecture-intro">ใช้สถาปัตยกรรม Modern Decoupled SPA โดยแยกหน้าจอ React ออกจาก Mock API และแยกข้อมูลเป็น <strong>Server State</strong> หรือข้อมูลเกมจาก API ที่ TanStack Query ดูแล กับ <strong>Client State</strong> หรือสถานะผู้ใช้ที่ Zustand ดูแล</p>
      <div className="technology-list">
        {technologies.map(([name, purpose, usage], index) => (
          <article className="technology-item" key={name}>
            <div className="technology-title"><span>{String(index + 1).padStart(2, '0')}</span><h3>{name}</h3></div>
            <div className="technology-description">
              <p><strong>หน้าที่:</strong> {purpose}</p>
              <p><strong>ใช้ในเว็บนี้:</strong> {usage}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>;
}
