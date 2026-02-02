import type { Metadata } from "next";
import { Inter, Handlee } from "next/font/google"; // 引入 Handlee
import "./globals.css";
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const handlee = Handlee({ // 配置 Handlee 字体
  subsets: ["latin"],
  weight: "400", // Handlee 只有 400 磅粗细
  variable: '--font-handlee' // 定义 CSS 变量名
});

export const metadata: Metadata = {
  title: "Quiet Moment",
  description: "A space for peace and reflection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${handlee.variable}`}> {/* 应用字体变量 */}
        {children}
      </body>
    </html>
  );
}