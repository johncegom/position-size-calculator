import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full py-4 mt-8 text-center text-gray-500 bg-white border-t border-gray-200 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-900">
      <span className="cursor-default">
        &copy; {new Date().getFullYear()} {t("footer.title")} &mdash;{" "}
        {t("footer.description")}{" "}
        <a
          href="https://github.com/johncegom"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-800"
        >
          {t("footer.author")}
        </a>
      </span>
    </footer>
  );
};

export default Footer;
