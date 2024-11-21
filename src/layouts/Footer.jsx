// import styles from "./Footer.module.css";

// function Footer() {
//   return (
//     <footer className={styles.footer}>
//       <p>Developed by Milad with </p>
//     </footer>
//   );
// }

// export default Footer;
import React from "react";
import styles from "./Footer.module.css";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}> درباره سایت</h3>
          <p className={styles.footerText}>
            سلام! این سایت یک پروژه ای است که به‌عنوان یک پلتفرم تبلیغاتی آنلاین
            طراحی شده است. هدف از این پروژه ارائه فضایی برای کسب‌وکارها است تا
            بتوانند خدمات و محصولات خود را به راحتی معرفی کنند.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>راه ارتباطی</h3>
          <p className={styles.footerText}>
            ایمیل: melika8204.it.v@gmail.com <br />
            شماره: 123-456-7890
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Follow Me</h3>
          <div className={styles.socialLinks}>
            <a
              href="https://www.linkedin.com/in/melika-vafaei-49609627b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              className={styles.socialLink}
                     target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />

              Linkedin
            </a>
            <a
              href="https://github.com/Melika8204"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaGithub />

              github
            </a>
            {/* <a href="#" className={styles.socialLink}>
              Instagram
            </a> */}
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2024 Advertisement Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
