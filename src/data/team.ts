// เปลี่ยนข้อมูลและรูปของสมาชิกจริงก่อนส่งงาน
export interface TeamMember {
  name: string;
  nickname: string;
  studentId: string;
  photo: string;
  role: string;
  tasks: string[];
}

export const team: TeamMember[] = [
  {
    name: 'วายุกูล ละมัย', nickname: 'อิ๊ป', studentId: '1660701622', photo: '/images/IPPO1.jpg',
    role: '-ออกแบบและพัฒนาเว็บ',
    tasks: ['พัฒนาหน้าร้าน หน้ารายละเอียด และหน้า About', 'จัดการ React Router และ Layout', 'ปรับหน้าจอให้รองรับมือถือ แท็บเล็ต และคอมพิวเตอร์']
  },
  {
    name: 'อีสตันดาร์  เอกโชติภูมินนท์ ', nickname: 'แบงค์', studentId: '1660703834', photo: '/images/Mypic1.jpg',
    role: '-ข้อมูลเกมและ Mock API',
    tasks: ['เตรียมข้อมูลและ JSON Server', 'จัดการ TanStack Query และ Zustand persist', 'พัฒนาหน้า Wishlist และ Compare']
  }
];
