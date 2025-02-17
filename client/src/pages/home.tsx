import GooglePlayBadge from "../components/ui/GooglePlayBadge";
import LoginButton from "../components/ui/LoginButton";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center text-lg font-semibold text-black dark:text-white">
        <p>
          ברוכים הבאים ל-Buylist, אפליקציה ליצירה וניהול של רשימות שיתופיות!
          <br />
          ניתן ליצור רשימות, להזמין משתתפים ולעדכן מוצרים בזמן אמת.
        </p>
        <p className="mt-4">
          כדי להתחיל להשתמש באפליקציה, יש צורך בהתחברות לחשבון. החשבון משמש
          לצורך זיהוי ושיתוף הרשימות.
        </p>
      </div>
      <LoginButton className="bg-primary-500 hover:bg-primary-600 dark:bg-dark-main-800 dark:hover:bg-dark-main-700 px-4 py-2 rounded-lg" />
      <a className="text-blue-400 hover:underline" href="/privacy-policy" target="blank">
        מדיניות פרטיות
      </a>
      <div className="mt-8 text-center">
        <p>הורדה למכשירי Android:</p>
        <GooglePlayBadge className="m-3" />
      </div>
    </div>
  );
};

export default HomePage;
